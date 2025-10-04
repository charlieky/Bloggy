import { supabase } from "@/lib/supabaseClient"
import CategoryPageClient from "./page-client"

export async function generateStaticParams() {
  const { data: categories } = await supabase.from("category").select("slug")

  return (
    categories?.map((category) => ({
      slug: category.slug,
    })) || []
  )
}

export default async function CategoryPage({ params }) {
  const { slug } = await params

  return <CategoryPageClient slug={slug} />
}
