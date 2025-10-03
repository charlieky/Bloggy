// src/app/author/[id]/page.js
export async function generateStaticParams() {
  // Add this function or import it
  const authors = await fetchAuthors(); // Ensure this function exists
  return authors.map((author) => ({ id: author.id }));
}
