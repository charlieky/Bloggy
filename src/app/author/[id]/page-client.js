"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function AuthorPageClient({ id }) {
  const [author, setAuthor] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAuthorData() {
      try {
        // Fetch author profile
        const { data: profileData, error: profileError } = await supabase
          .from("profile")
          .select("*")
          .eq("id", id)
          .single()

        if (profileError) throw profileError

        // Fetch author's articles
        const { data: articlesData, error: articlesError } = await supabase
          .from("article")
          .select("*")
          .eq("author_id", id)
          .order("created_at", { ascending: false })

        if (articlesError) throw articlesError

        setAuthor(profileData)
        setArticles(articlesData || [])
      } catch (error) {
        console.error("Error fetching author data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAuthorData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Author not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm mb-8 p-6">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted flex items-center justify-center">
            {author.avatar_url ? (
              <img
                src={author.avatar_url || "/placeholder.svg"}
                alt={author.full_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold">{author.full_name?.[0] || "A"}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{author.full_name}</h1>
            {author.bio && <p className="text-muted-foreground mt-2">{author.bio}</p>}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Articles by {author.full_name}</h2>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">No articles yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/${article.slug}`}>
              <div className="bg-card text-card-foreground rounded-lg border shadow-sm h-full hover:shadow-lg transition-shadow overflow-hidden">
                {article.image_url && (
                  <img
                    src={article.image_url || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold line-clamp-2 mb-2">{article.title}</h3>
                  <p className="text-muted-foreground line-clamp-3 mb-4">{article.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    {article.views && <span>{article.views} views</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
