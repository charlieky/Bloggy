import { supabase } from '@/lib/supabaseClient';

export const revalidate = 3600; // Optional ISR

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from('category')
    .select('slug')
    .order('title', { ascending: true });

  if (error) {
    console.error('Static Generation Error:', error);
    return [];
  }

  return data.map(({ slug }) => ({ 
    slug: slug.toString() // Ensure string conversion
  }));
}

export default function CategoryLayout({ children }) {
  return <>{children}</>;
}
