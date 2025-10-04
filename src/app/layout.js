import { Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bloggy",
  description: "Connecting iGaming",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
         <title>{metadata?.title}</title>
          <meta name="description" content={metadata?.description} />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
         <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
        </head> 
       <body className={`${sora?.className} antialiased bg-gradient-to-b from-[#131619] to-[#131619] text-white relative`}>
        <Toaster richColors position="top-right" />
        <AuthProvider>{children}</AuthProvider> 
        </body>
    </html>
  );
}
