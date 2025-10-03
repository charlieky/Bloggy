export async function generateStaticParams() {

  const { data: articles } = await supabase
    .from('article')
    .select('slug');

  return articles?.map(article => ({
    slug: article.slug
  })) || [];
}


export default function Page() {
}
