import { supabase } from "@/lib/supabaseClient"
import ArticlePageClient from "./page-client"

export async function generateStaticParams() {
  const { data: articles } = await supabase.from("article").select("slug")

  return (
    articles?.map((article) => ({
      slug: article.slug,
    })) || []
  )
}

export default async function ArticlePage({ params }) {
  const { slug } = await params

  return <ArticlePageClient slug={slug} />
}
