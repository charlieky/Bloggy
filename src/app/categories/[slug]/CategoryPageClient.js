"use client"
import { useState, useEffect, useCallback } from "react"
import { Header, Footer } from "@/app/components"
import { defaultArticle } from "@/app/components/images"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"

export default function CasinoAffiliate() {
  const router = useRouter()
  const params = useParams()
  const [categoryPosts, setCategoryPosts] = useState([])
  const [currentCategory, setCurrentCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const itemsPerPage = 8

  const fetchCategoryData = useCallback(
    async (pageNum = 1) => {
      try {
        setLoading(true)
        console.log("Fetching category data for slug:", params.slug)

        if (!params.slug || typeof params.slug !== "string") {
          throw new Error("Invalid category slug parameter")
        }

        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from("category")
          .select("id, title, slug, thumbnail")
          .eq("slug", params.slug)
          .single()

        if (categoryError) {
          console.error("Error fetching category:", categoryError)
          if (categoryError.code === "PGRST116") {
            return router.push("/404")
          }
          throw new Error(`Category load failed: ${categoryError.message}`)
        }

        console.log("Fetched category data:", categoryData)
        setCurrentCategory(categoryData)

        // Fetch articles for the specific category ID
        const { data: articlesData, error: articlesError } = await supabase
          .from("article")
          .select(`id, title, content, thumbnail, date_created, views, read_time, slug, category:category_id (slug)`)
          .eq("category_id", categoryData.id) // Use the category ID to filter articles
          .order("date_created", { ascending: false })

        if (articlesError) throw articlesError

        setCategoryPosts((prev) => (pageNum === 1 ? articlesData : [...prev, ...articlesData]))
        setHasMore(articlesData.length === itemsPerPage)
      } catch (error) {
        toast.error(error.message || "Failed to load data")
        console.error("Fetch error:", error)
      } finally {
        setLoading(false)
      }
    },
    [params.slug, router],
  )

  useEffect(() => {
    fetchCategoryData(page)
  }, [fetchCategoryData, page])

  return (
    <div>
      <Header />
      <section className="lg:px-33 px-5 lg:my-30 my-1">
        {currentCategory && (
          <div className="relative mb-5">
            <h1 className="lg:text-4xl text-2xl font-bold">{currentCategory.title}</h1>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[500px] bg-[#171717] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {categoryPosts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-bold mb-4">No articles found</h3>
                <p className="text-gray-400">This category currently has no published articles. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
                {categoryPosts.map((article) => (
                  <div
                    key={article.id}
                    className="border-2 border-[#131619] bg-[#171717] rounded-xl p-2 shadow-lg h-full"
                  >
                    <Image
                      width={400}
                      height={500}
                      src={article.thumbnail || defaultArticle}
                      className="w-full h-[20rem] object-cover rounded-xl"
                      alt={article.title}
                      priority
                    />

                    <div className="space-y-3 pt-5">
                      <div className="inline-flex items-center gap-2 bg-[#131619] p-1 w-auto text-xs me-2 rounded-full">
                        <i className="fas fa-umbrella"></i>
                        <Link
                          href={`/categories/${article.category?.slug}`}
                          className="hover:text-primary-500 transition-colors"
                        >
                          {currentCategory?.title || "Uncategorized"}
                        </Link>
                      </div>

                      <h1 className="text-2xl font-bold drop-shadow-lg">{article?.title}</h1>

                      <div className="flex items-center gap-5 text-xs text-gray-300 font-light">
                        <div className="flex gap-1 items-center">
                          <i className="fas fa-eye"></i>
                          <p className="font-bold mb-0">{article?.views} Views</p>
                        </div>
                        <div className="flex gap-1 items-center">
                          <i className="fas fa-clock"></i>
                          <p className="font-bold mb-0">{article?.read_time} Mins Read</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 font-semibold bg-[#0b1011cc] p-2 rounded-xl mt-6">
                      <Link
                        href={`/${article?.slug}`}
                        className="bg-dark-400 text-[12px] font-bold px-4 py-2 rounded-xl border border-bg-white hover:bg-dark-500 transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {hasMore && !loading && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="bg-dark-400 px-6 py-3 rounded-lg hover:bg-dark-500 transition-colors"
              aria-label="Load more articles"
            >
              Load More Articles
            </button>
          </div>
        )}
      </section>
      <Footer />
    </div>
  )
}
