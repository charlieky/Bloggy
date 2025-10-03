
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function generateStaticParams() {
  const { data: authors } = await supabase
    .from('author')
    .select('id');

 return authors?.map(author => ({ id: author.id })) || []
}

export const dynamicParams = false;
