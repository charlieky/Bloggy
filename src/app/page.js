"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Header, Footer, Category } from "@/app/components/index";
import { defaultArticle, defaultAvatar , default1, default2, default3, default4, default6, default7, default8, default9} from "./components/images";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { formatDate } from "@/lib/utils";
import { ProviderSlider } from "@/components/ProviderSlider";
import { useSwipeable } from 'react-swipeable';
export default function Home() {
 
  const [mostPopularArticle, setMostPopularArticle] = useState(null);
   

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredGame, setHoveredGame] = useState(null);
  const topGames = Array(4).fill({ title: 'Fishing' });
  const middleGames = Array(4).fill({ title: 'Slot' });
  const bottomGames = Array(6).fill({ title: 'Slot' });
  const mobileGames = Array(4).fill({ title: 'Slot' });
      const [mostPopularArticles, setMostPopularArticles] = useState([]);
 const handlers = useSwipeable({
  onSwipedLeft: () => setCurrentSlide(prev => (prev + 1) % 7),
  onSwipedRight: () => setCurrentSlide(prev => (prev - 1 + 8) % 10)
});
  const [currentIndex, setCurrentIndex] = useState(0);
 

 
    const fetchArticles = async () => {
        setLoading(false);

        const { data, error } = await supabase
            .from("article")
            .select(
                `
                id, title, content, thumbnail, date_created, views, read_time, slug,
                category: category_id(title),
                author: profile_id(full_name, image, job_title)
            `,
                { count: "exact" }
            )
            .order("date_created", { ascending: false });

        if (error) {
            console.log("Error fetching articles: ", error);
        } else {
            setArticles(data);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    useEffect(() => {
        if (!articles?.length) return;

        const popularArticle = articles?.reduce((max, article) => (article.views > max.views ? article : max), articles[0]);
        setMostPopularArticle(popularArticle);
    }, [articles]);
  
   useEffect(() => {
        if (!articles?.length) return;

        // Sort articles by views and get the top 3 (or any number you prefer)
        const sortedArticles = articles.sort((a, b) => b.views - a.views);
        const topArticles = sortedArticles.slice(0, 4); // Adjust this number for how many you want
        setMostPopularArticles(topArticles);
    }, [articles]);

 

  return (
   <>
      <Header />
          <section className="grid lg:grid-cols-1 grid-cols-1 px-5 lg:px-33">
              <div>
            {[default1, default2, default3, default4].map((src, index) => (
              <Link href="/" key={index}>
                <div className="grid grid-col-1 py-1 relative group">
                  <Image
                    width={1200}
                    height={1000}
                    src={src}
                    className="w-full h-full object-cover"
                    alt={`Ad ${index + 1}`}
                  />
                  <div className="absolute top-0 right-0 p-1 bg-gradient-to-l from-black/60 to-transparent">
                    <h1 className="text-[5px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-semi-bold text-white drop-shadow-lg">
                      Advertisement
                    </h1>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* Dual Image Section */}
            <Link href="/">
          <div className="flex grid-col-1 gap-3"> {/* Single column layout */}
            {[default6, default7].map((src, index) => (
              <div key={index} className="relative py-1 group w-full">
                <Image
                  width={600}  // Increased width for better full-width display
                  height={600}  // Adjusted aspect ratio
                  src={src}
                  className="w-full h-full object-cover"
                  alt={`Ad ${index + 1}`}
                />
                <div className="absolute top-0 right-0 p-1 bg-gradient-to-l from-black/60 to-transparent">
                  <h1 className="text-[5px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-semi-bold text-white drop-shadow-lg">
                    Advertisement
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </Link>
          <Link href="/">
          <div className="flex grid-col-1 gap-3"> {/* Single column layout */}
            {[default8, default9].map((src, index) => (
              <div key={index} className="relative py-1 group w-full">
                <Image
                  width={600}  // Increased width for better full-width display
                  height={600}  // Adjusted aspect ratio
                  src={src}
                  className="w-full h-full object-cover"
                  alt={`Ad ${index + 1}`}
                />
                <div className="absolute top-0 right-0 p-1 bg-gradient-to-l from-black/60 to-transparent">
                  <h1 className="text-[5px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-semi-bold text-white drop-shadow-lg">
                    Advertisement
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </Link>
          </div>
      </section>


            <section className="grid lg:grid-cols-2 grid-cols-1 gap-7 px-5 lg:px-33 py-2">
           <div className="relative h-[40rem]">
            <Image 
                width={800} // Set to a higher resolution
                height={600} // Set to a higher resolution
                src={mostPopularArticle?.thumbnail || defaultArticle} 
                className="w-full h-full object-cover rounded-xl absolute" 
                alt="image title" 
            />
            <div className="absolute bg-[#232628] w-full bottom-0 backdrop-blur-md rounded-xl p-3 space-y-3">
                <div className="inline-flex items-center gap-2 bg-black p-1 w-auto text-xs me-2 rounded-full">
                    <i className="fas fa-umbrella"></i>
                    <p>{mostPopularArticle?.category.title}</p>
                </div>
                <h1 className="text-3xl font-bold drop-shadow-lg">{mostPopularArticle?.title}</h1>
                <div className="flex items-center gap-4 font-semibold">
                    <Image 
                        width={32} // Use appropriate size for the author image
                        height={32} 
                        src={mostPopularArticle?.author?.image || defaultAvatar} 
                        className="w-8 h-8 object-cover rounded-full" 
                        alt="Image title" 
                    />
                    <p>{formatDate(mostPopularArticle?.date_created)}</p>
                    <p>.</p>
                    <p>{mostPopularArticle?.read_time} mins read</p>
                </div>
            </div>
        </div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {articles?.slice(0, 4)?.map((article, index) => (
                  <div key={article.id || index}>
                      <Link href={`/${article?.slug}`}>
                          <div className="relative h-[300px] w-full border-1 border-[#131619] rounded-xl">
                              <Image 
                                  width={800} // Set to a higher resolution
                                  height={600} // Set to a higher resolution
                                  src={article?.thumbnail} 
                                  className="w-full h-full object-cover rounded-xl" 
                                  alt={article?.title || "Article thumbnail"} 
                              />
                              <div className="absolute bottom-0 left-0 w-full h-[10rem] bg-gradient-to-t from-[#131619] to-transparent rounded-b-xl" />
                              <div className="absolute bottom-0 p-3 space-y-3 rounded-b-xl">
                                  <div className="inline-flex items-center gap-2 bg-[#131619] p-1 w-auto text-xs me-2 rounded-full">
                                      <i className="fas fa-umbrella"></i>
                                      <p>{article?.category?.title}</p>
                                  </div>
                                  <h1 className="text-2xl font-bold drop-shadow-lg">{article?.title}</h1>
                                  <div className="flex items-center gap-4 font-light">
                                      <p>By {article?.author?.full_name}</p>
                                      <p>{article?.read_time} mins read</p>
                                  </div>
                              </div>
                          </div>
                      </Link>
                  </div>
              ))}
          </div>


       </section> 



            
       <section className="lg:px-33 px-5 lg:my-5 my-2">
    <div className="mb-5 relative">
        <h1 className="lg:text-2xl text-2xl font-bold" onClick={fetchArticles}>Hot Picks 🔥</h1>             
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-7">
        {/* Main Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 h-fit">
            {mostPopularArticles.map((article, index) => (
                <div key={article.id || index} className="border-2 border-[#131619] bg-[#232628] rounded-xl p-2 shadow-lg h-auto">
                    <Image width={800} height={600} src={article?.thumbnail || defaultArticle} className="w-full h-[29rem] object-cover rounded-xl" alt="Article thumbnail" />
                    
                    <div className="space-y-3 pt-5">
                        <div className="inline-flex items-center gap-2 bg-[#131619] p-1 w-auto text-xs me-2 rounded-full">
                            <i className="fas fa-umbrella"></i>
                            <p>{article?.category.title}</p>
                        </div>
                        <h1 className="text-2xl font-bold drop-shadow-lg">{article?.title}</h1>
                        
                        <div className="flex items-center gap-5 text-xs text-gray-300 font-light">
                            <div className="flex gap-1 items-center">
                                <i className="fas fa-eye"></i>
                                <p className="font-bold mb-0">{article?.views} Views</p>
                            </div>
                            <div className="flex gap-1 items-center">
                                <i className="fas fa-clock"></i>
                                <p className="font-bold mb-0">{article?.read_time} Mins Read</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 font-semibold bg-[#1D2022] p-2 rounded-xl mt-6">
                        <div className="flex items-center gap-2">
                            <Image 
                                width={100} 
                                height={100} 
                                src={article?.author?.image || defaultAvatar}  
                                className="w-8 h-8 object-cover rounded-full" 
                                alt="Author profile"
                            />
                            <div>
                                <h1 className="text-sm text-white font-bold mb-0">{article?.author?.full_name}</h1>
                                <p className="text-xs font-light text-gray-100 italic mt-0">
                                    {article?.author?.job_title || "Writer at Desphixs"}
                                </p>
                            </div>
                        </div>
                        <Link href={`/${article?.slug}`} className="bg-[#000] text-[12px] font-bold px-4 py-2 rounded-xl border border-transparent">
                            <i className="fas fa-arrow-right text-white"></i>
                        </Link>
                    </div>
                </div>
            ))}
        </div>

        {/* Sidebar Section */}
        <div>
            <Category />
            
            <div className="my-5">
                <h1 className="text-2xl font-bold">Recent Posts 📰</h1>
                <p className="italic font-normal text-xs mt-2 text-gray-500">All recent posts to keep you updated</p>
            </div>
            
            {articles?.slice(0, 2)?.map((article, index) => (
                <div key={article.id || index} className="mb-4 flex gap-2 border border-[#9498ff34] p-2 rounded-xl">
                    <Image 
                        width={100} 
                        height={100} 
                        src={article?.thumbnail} 
                        className="h-20 w-20 object-cover rounded-md" 
                        alt="Recent post thumbnail"
                    />
                    <div className="flex flex-col justify-between">
                        <h1 className="font-bold">{article?.title}</h1>
                        <div className="flex items-center gap-4 font-light text-xs">
                            <p>By {article?.author?.full_name}</p>
                            <p>{article?.read_time} min read</p>
                        </div>
                        
                    </div>
                    
                </div>
            ))}
        </div>
    </div>
</section>  



      

 


 

<section className="lg:px-33 px-4 lg:my-5  mb-2 ">
      <div className="mb-5 relative">
          <h1 className="lg:text-3xl text-2xl font-bold ">API Product Library 🎰</h1>

      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-12 gap-2 h-[660px]">
        {/* Hero Section */}
        <div className="col-span-4 h-full relative overflow-hidden">
          <a 
          href="https://jsgame.live/game/gamesUrl?id=381adef2-0545-40b2-b7e8-59fd50f07bb9" // Replace with your desired link
          target="_blank" // Opens the link in a new tab
          rel="noopener noreferrer" // Security best practice
          className="h-full cursor-pointer group" 
          onMouseEnter={() => setHoveredGame("hero")}
          onMouseLeave={() => setHoveredGame(null)}
          >
            <Image
              src="/assets/elements/first.png"
              alt="Hero Game"
              fill
              className=" rounded-lg transition-transform duration-300 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent transition-opacity duration-300 ${hoveredGame === 'hero' ? 'opacity-100' : 'opacity-0'}`}>
              <div className="absolute bottom-4 left-4 text-foreground">
                <h3 className="text-xl font-bold">Slot</h3>
             
              </div>
            </div>
          </a>
        </div>

        {/* Game Grid */}
        
<div className="col-span-8 h-full">
  <div className="grid grid-rows-3 gap-2 h-full">
    {/* Top Row */}
    <div className="grid grid-cols-4 gap-2 h-full">
      {topGames.map((game, index) => (
        <div
          key={`top-${index}`}
          className="relative h-full cursor-pointer group overflow-hidden"
          onMouseEnter={() => setHoveredGame(`top-${index}`)}
          onMouseLeave={() => setHoveredGame(null)}
        >
          <Image
           src={`/assets/elements/image-${index + 1}.png`} alt={game.title}layout="fill"  className="rounded-lg transition-transform duration-300 group-hover:scale-110"/>
          <div className={`absolute inset-0 bg-gradient-to-t from-background/20 transition-opacity duration-300 ${hoveredGame === `top-${index}` ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute bottom-2 left-2 text-foreground">
              <p className="text-xs font-semibold truncate">{game.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>


            {/* Middle Row */}
            <div className="grid grid-cols-4 gap-2 h-full">
              {middleGames.map((game, index) => (
                <div
                  key={`middle-${index}`}
                  className="relative h-full cursor-pointer group overflow-hidden"
                  onMouseEnter={() => setHoveredGame(`middle-${index}`)}
                  onMouseLeave={() => setHoveredGame(null)}
                >
                 <Image
            src={`/assets/elements/images-${index + 1}.png`}
            alt={game.title}
            layout="fill" // Ensure layout is set to fill
          // Use cover to fill the container
            className="rounded-lg transition-transform duration-300 group-hover:scale-110"
          />
                  <div className={`absolute inset-0 bg-gradient-to-t from-background/20 transition-opacity duration-300 ${hoveredGame === `middle-${index}` ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-2 left-2 text-foreground">
                      <p className="text-sm font-semibold truncate">{game.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-6 gap-2 h-full">
              {bottomGames.map((game, index) => (
                <div
                  key={`bottom-${index}`}
                  className="relative h-full cursor-pointer group overflow-hidden"
                  onMouseEnter={() => setHoveredGame(`bottom-${index}`)}
                  onMouseLeave={() => setHoveredGame(null)}
                >
                        <Image
            src={`/assets/elements/imax-${index + 1}.png`}
            alt={game.title}
            layout="fill"
            className="rounded-lg transition-transform duration-300 group-hover:scale-110"
          />
                  <div className={`absolute inset-0 bg-gradient-to-t from-background/20 transition-opacity duration-300 ${hoveredGame === `bottom-${index}` ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-1 left-1 text-foreground">
                      <p className="text-xs font-semibold truncate">{game.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden grid grid-cols-2 mb-4 gap-4">
        {mobileGames.map((game, index) => (
          <div
            key={`mobile-${index}`}
            className="relative aspect-square cursor-pointer group overflow-hidden"
          >
                <Image
            src={`/assets/elements/imax-${index + 1}.png`}
            alt={game.title}
            layout="fill" 
            className="rounded-lg transition-transform duration-300 group-hover:scale-110"
          />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 transition-opacity duration-300 group-hover:opacity-100 opacity-0">
              <div className="absolute bottom-3 left-3 text-foreground">
                <h3 className="text-sm font-bold">{game.title}</h3>
                <p className="text-xs text-muted-foreground">Howd</p>
              </div>
            </div>
          </div>
        ))}
        
      </div>



    
  
     <ProviderSlider />  

       
      
    





    </section>





            

 
        
      






       <section className="lg:px-33 px-5 lg:my-5  mb-2 ">
            <div className="mb-5 relative">
              <h1 className="lg:text-2xl text-2xl font-bold">Hand-Picked ✌️</h1>
            
            <Image width={500} height={300} src="/assets/elements/hero-7-top-dots.png" className="absolute left-[10rem] -top-1 z-1" alt="" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
              {articles?.length > 0 ? (
                articles.slice(0, 12).map((article, index) => (
                  <div 
                    key={article.id || index}
                    className="group relative transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <Link 
                      href={`/${article?.slug}`}
                      aria-label={`Read ${article.title}`}
                    >
                      <div className="relative h-[300px] w-full border border-[#232628] rounded-xl overflow-hidden">
                        <Image width={400} height={300}  src={article?.thumbnail || '/images/placeholder-news.jpg'} alt={""} className="w-full h-full object-cover rounded-xl" priority={index < 2} />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#232628] via-transparent to-transparent rounded-b-xl" />
                        
                        <div className="absolute bottom-0 p-4 space-y-3 w-full">
                          <div className="inline-flex items-center gap-2 bg-[#232628]/90 backdrop-blur-sm px-3 py-1.5 text-xs rounded-full">
                            <i className="fas fa-umbrella text-sm" />
                            <p>{article?.category?.title || 'General'}</p>
                          </div>
                          
                          <h2 className="text-xl font-bold line-clamp-2">
                            {article.title}
                          </h2>
                          
                          <div className="flex items-center gap-3 text-sm font-light">
                            <span className="flex items-center gap-1.5">
                              <i className="fas fa-user" />
                              {article?.author?.full_name || 'Anonymous'}
                            </span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full" />
                            <span className="flex items-center gap-1.5">
                              <i className="fas fa-clock" />
                              {article?.read_time || 5} min read
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No articles found
                </div>
              )}
            </div>
        </section>

  
     



      <Footer />
   </>
   
  );
}
