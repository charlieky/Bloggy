"use client"
import { useState, useEffect } from "react"
import { Header, Footer, Category } from "../components"
import { defaultArticle, defaultAvatar } from "../components/images"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function PageClient() {
  const router = useRouter()
  const params = useParams()
  const { user, profile } = useAuth()
  const slug = params.slug
  const [article, setArticle] = useState(null)
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [liking, setLiking] = useState(false)
  const [bookmarking, setBookmarking] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    fetchArticleData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const fetchArticleData = async () => {
    setLoading(true)

    const { data: articleData, error: articleError } = await supabase
      .from("article")
      .select(
        `
                id, title, content, thumbnail, date_created, views, read_time, slug,
                category: category_id(title),
                author: profile_id(id, full_name, image, job_title),
                comment(id, comment, date_created, profile: profile_id(full_name, image)),    
                like(id, profile_id, date_created)     
            `,
      )
      .eq("slug", slug)
      .single()

    if (articleError) {
      toast.error("Failed to fetch article")
      console.log("Failed to fetch article:", articleError)
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from("article")
      .update({ views: (articleData?.views || 0) + 1 })
      .eq("id", articleData?.id)

    if (updateError) {
      console.error("Failed to update views: ", updateError)
    }

    setArticle({ ...articleData, views: (articleData?.views || 0) + 1 })
    setComments(articleData?.comment || [])
    setLikes(articleData?.like || [])

    if (user && articleData?.id) {
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from("bookmark")
        .select("id")
        .eq("profile_id", profile?.id)
        .eq("article_id", articleData?.id)
        .maybeSingle()
      if (bookmarkError) {
        console.error("Bookmark fetch error: ", bookmarkError)
      }
      setBookmarked(Boolean(bookmarkData))
    }
    setLoading(false)
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment is required")
      return
    }

    if (!user) {
      toast.error("Please login to comment")
      return
    }

    setSubmitting(true)

    const commentData = {
      article_id: article.id,
      profile_id: user.id,
      comment: newComment,
      date_created: new Date().toISOString(),
    }

    try {
      const { data, error } = await supabase
        .from("comment")
        .insert([commentData])
        .select(`
                    id,
                    comment,
                    date_created,
                    profile:profile_id(full_name, image)
                `)
        .single()

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message || "Failed to add comment")
      }

      toast.success("Comment added successfully")
      setComments((prev) => [...prev, data])
      setNewComment("")
    } catch (error) {
      toast.error("Failed to add comment")
      console.log("Comment insert error: ", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikeArticle = async () => {
    if (!user) {
      toast.error("Login to like this article")
      return
    }

    if (liking) return
    setLiking(true)

    if (!profile) {
      toast.error("Profile not found")
      setLiking(false)
      return
    }

    const existingLike = Array.isArray(likes) ? likes.find((like) => like.profile_id === profile.id) : null

    if (existingLike) {
      const updatedLikes = Array.isArray(likes) ? likes.filter((like) => like.profile_id !== profile.id) : []
      setLikes(updatedLikes)

      const { error: unlikeError } = await supabase.from("like").delete().eq("id", existingLike.id)

      if (unlikeError) {
        setLikes(likes)
        toast.error("Failed to unlike article")
        console.error("Unlike error: ", unlikeError)
      } else {
        toast.success("You unliked this article")
      }
    } else {
      const { data, error: likeError } = await supabase
        .from("like")
        .insert([
          {
            article_id: article.id,
            profile_id: profile.id,
            date_created: new Date(),
          },
        ])
        .select("id, profile_id")
        .single()

      if (likeError) {
        toast.error("Failed to like article")
        console.error("Like error:", likeError)
      } else {
        setLikes([...likes, { id: data.id, profile_id: profile.id }])
        toast.success("You liked this article")
      }
    }

    setLiking(false)
  }

  const handleBookmark = async () => {
    if (!user) {
      toast.error("Login to bookmark this article")
      return
    }

    if (bookmarking) return
    setBookmarking(true)

    const { data: existingBookmark, error: fetchError } = await supabase
      .from("bookmark")
      .select("id")
      .eq("profile_id", profile?.id)
      .eq("article_id", article?.id)
      .maybeSingle()

    if (fetchError && fetchError.code !== "PGRST116") {
      toast.error("Error checking bookmark")
      console.error("Bookmark fetch error: ", fetchError)
      setBookmarking(false)
      return
    }

    if (existingBookmark) {
      const { error: removeError } = await supabase.from("bookmark").delete().eq("id", existingBookmark?.id)

      if (removeError) {
        toast.error("Failed to remove bookmark")
        console.error("Bookmark removal error: ", removeError)
      } else {
        setBookmarked(false)
        toast.success("Bookmark removed")
      }
    } else {
      const { error: insertError } = await supabase.from("bookmark").insert([
        {
          profile_id: profile?.id,
          article_id: article?.id,
          date_created: new Date(),
        },
      ])

      if (insertError) {
        toast.error("Failed to bookmark article")
        console.error("Bookmark error: ", insertError)
      } else {
        setBookmarked(true)
        toast.success("Article Bookmarked!")
      }
    }

    setBookmarking(false)
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <i className="fas fa-spinner fa-spin text-4xl"></i>
        </div>
        <Footer />
      </div>
    )
  }

  if (!article) {
    return (
      <div>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p>Article not found</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <section className="lg:px-33 px-5 my-20 z-10 relative">
        <div className="relative w-full h-[30rem]">
          <Image
            width={800}
            height={600}
            src={article?.thumbnail || defaultArticle}
            className="w-full h-[30rem] object-cover absolute rounded-2xl"
            alt={article?.title || "Article thumbnail"}
          />
          <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center text-3xl font-semibold leading-[4rem] drop-shadow-lg">
            {article?.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button onClick={handleLikeArticle} disabled={liking} className="p-2 bg-neutral-800 rounded-lg">
            <i className="fas fa-thumbs-up"></i> {likes?.length || 0}
          </button>
          <button onClick={handleBookmark} disabled={bookmarking} className="p-2 px-4 bg-neutral-800 rounded-lg">
            {bookmarked ? <i className="fas fa-bookmark text-red-500"></i> : <i className="fas fa-bookmark"></i>}
          </button>
          <div className="p-2 px-4 bg-neutral-800 rounded-lg">
            <i className="fas fa-eye me-1"></i>
            {article?.views} views
          </div>
          <div className="p-2 px-4 bg-neutral-800 rounded-lg">
            <i className="fas fa-clock me-1"></i>
            {article?.read_time} mins read
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10 my-5">
          <div>
            <div className="bg-[#171717] p-4 rounded-3xl backdrop-blur-sm">
              <p>{article?.content}</p>
            </div>
            <div className="space-y-33 mt-5">
              <div className="flex items-center gap-3 bg-neutral-800 rounded-xl p-3 relative">
                <Image
                  width={100}
                  height={100}
                  src={article?.author?.image || defaultAvatar}
                  className="w-[5rem] h-[5rem] rounded-full"
                  alt={article?.author?.full_name || "Author"}
                />
                <Image
                  width={500}
                  height={300}
                  src={"/assets/elements/arrow-2.png"}
                  className="w-[3rem] absolute left-[18rem] top-[-1rem] rotate-30 animate-bounce"
                  alt=""
                />
                <div>
                  <h1 className="text-3xl font-bold">{article?.author?.full_name}</h1>
                  <p>{article?.author?.job_title || "Writer at Desphixs"} </p>
                </div>
              </div>
              <div>
                <h1 className="mb-5 text-2xl">Leave a comment</h1>
                <div className="space-y-5 relative">
                  <div className="flex flex-col items-start gap-2">
                    <label htmlFor="">Full Name</label>
                    <input
                      className="border-3 border-[#e1d1ff7a] p-2 rounded-lg w-full"
                      type="text"
                      value={profile?.full_name || "John Doe"}
                      readOnly
                      placeholder="Your name"
                    />
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <label htmlFor="">Your Comment</label>
                    <textarea
                      className="border-3 border-[#e1d1ff7a] p-2 rounded-lg w-full"
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write your comment"
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleAddComment}
                      disabled={submitting}
                      className="lg:flex bg-gradient-to-r from-neutral-500 to-black-500 cursor-pointer text-[15px] font-bold px-6 py-3 rounded-xl border-0 me-3"
                    >
                      {submitting ? (
                        <>
                          Submitting... <i className="fas fa-spinner fa-spin ms-1"></i>
                        </>
                      ) : (
                        <>
                          Submit Comment <i className="fas fa-paper-plane ms-1"></i>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h1 className="text-2xl mb-5">{comments?.length || 0} Comments</h1>
                <div className="space-y-6">
                  {comments?.map((comment) => (
                    <div className="bg-[#07050D] border border-[#131619] p-5 rounded-xl" key={comment?.id}>
                      <div className="flex items-center gap-3">
                        <Image
                          width={100}
                          height={100}
                          src={comment?.profile?.image || defaultAvatar}
                          className="w-[2rem] rounded-full"
                          alt={comment?.profile?.full_name || "User"}
                        />
                        <div>
                          <h1 className="text-lg font-bold">{comment?.profile?.full_name}</h1>
                          <p className="text-xs">{formatDate(comment?.date_created)}</p>
                        </div>
                      </div>
                      <p className="text-sm mt-3 text-gray-500">{comment?.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Category />
        </div>
      </section>
      <Footer />
    </div>
  )
}