import { supabase } from "@/lib/supabaseClient"
import AuthorPageClient from "./page-client"

export async function generateStaticParams() {
  const { data: profiles } = await supabase.from("profile").select("id")

  return (
    profiles?.map((profile) => ({
      id: profile.id.toString(),
    })) || []
  )
}

export default async function AuthorPage({ params }) {
  const { id } = await params

  return <AuthorPageClient id={id} />
}
