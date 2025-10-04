"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import Image from "next/image"

export default function AuthorPageClient() {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchAuthors()
  }, [])

  const fetchAuthors = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setAuthors(data || [])
    } catch (error) {
      console.error("Error fetching authors:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAuthors = authors.filter((author) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      author.full_name?.toLowerCase().includes(query) ||
      author.username?.toLowerCase().includes(query) ||
      author.bio?.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading authors...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Authors</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors.map((author) => (
          <Link
            key={author.id}
            href={`/author/${author.id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              {author.avatar_url ? (
                <Image
                  src={author.avatar_url || "/placeholder.svg"}
                  alt={author.full_name || author.username || "Author"}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">
                    {(author.full_name || author.username || "?")[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{author.full_name || author.username || "Anonymous"}</h2>
                {author.username && <p className="text-gray-500">@{author.username}</p>}
              </div>
            </div>
            {author.bio && <p className="text-gray-600 line-clamp-3">{author.bio}</p>}
          </Link>
        ))}
      </div>

      {filteredAuthors.length === 0 && (
        <div className="text-center text-gray-500 py-12">No authors found matching your search.</div>
      )}
    </div>
  )
}
