
const nextConfig = {
   output: 'export',
     typescript: {
    ignoreBuildErrors: true,
  },
   eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'dxsgqurpvgvqpzfxluow.supabase.co',
      'www.tntmagazine.com',
      'miro.medium.com',
      'redstonesearch.com',
      'news.worldcasinodirectory.com',
      'altenar.com',
      'idea-tech.in',
      'thealternativeboard.com.au',
      'policy.un.org'
    ],
  },
 
};

export default nextConfig;

