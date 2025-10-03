"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Header, Footer } from "@/app/components";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";


export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const articleId = searchParams.get("id");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingArticle, setLoadingArticle] = useState(false);
    const [categories, setCategories] = useState([]);

        const fetchCategories = async () => {
            const { data, error } = await supabase.from("category").select("*");

            if (error) {
                toast.error("Failed to fetch categories");
                console.log("Fetch categories error", error);
            } else {
                setCategories(data);
                if (data?.length && !category) {
                    setCategory(data[0].id); // Set the default category to the first one
                }
            }
        };

     const fetchArticle = async () => {
    if (articleId && user) {
            setLoadingArticle(true);

            const { data, error } = await supabase.from("article").select("*").eq("id", articleId).eq("profile_id", user?.id).single();

            if (error) {
                toast.error("Failed to load article");
                console.error("Fetch Error: ", error);
            } else {
                setTitle(data?.title);
                setContent(data?.content);
                setThumbnail(data?.thumbnail);
                setCategory(data?.category_id);
            }

            setLoadingArticle(false);
        }
    };

useEffect(() => {
        fetchCategories();
        fetchArticle();
    }, []);

    const handleThumbnailChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
        }
    };

    
   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const wordCount =
        content
            ?.replace(/<[^>]*>/g, "")
            ?.trim()
            ?.split(/\s+/)?.length || 0;
    const readTime = Math.ceil(wordCount / 500);

    let thumbnailUrl = "";

    // Handle thumbnail upload
    if (thumbnail && thumbnail.name) {
        const fileExt = thumbnail.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("blog-bucket").upload(filePath, thumbnail);

        if (uploadError) {
            toast.error("Thumbnail Upload Failed");
            console.log("Upload error: ", uploadError);
            setLoading(false);
            return;
        }

        const { data: publicUrlData } = supabase.storage.from("blog-bucket").getPublicUrl(filePath);
        thumbnailUrl = publicUrlData.publicUrl;
    }

    const slug = title
        ?.toLowerCase()
        ?.trim()
        ?.replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    try {
        // Edit Mode
        if (articleId) {
            const { error } = await supabase
                .from("article")
                .update({
                    title,
                    content,
                    category_id: category,
                    thumbnail: thumbnailUrl || undefined,
                    read_time: readTime,
                })
                .eq("id", articleId)
                .eq("profile_id", user?.id);

            if (error) {
                toast.error("Failed to update article");
                console.error("Update Error: ", error);
                setLoading(false);
                return;
            }

            toast.success("Article updated successfully");
        } else {
            const { data, error } = await supabase
                .from("article")
                .insert({
                    title,
                    content,
                    category_id: category,
                    thumbnail: thumbnailUrl || undefined,
                    read_time: readTime,
                    slug,
                    profile_id: user?.id,
                })
                .select("id")
                .single();

            if (error) {
                toast.error("Failed to create article");
                console.error("Insert Error: ", error);
                setLoading(false);
                return;
            }

            toast.success("Article created successfully");
            router.push(`/dashboard/article/manage?id=${data?.id}`);
            return; // Ensure the function ends here
        }

        // Navigate to home page after successful submission
       console.log("Navigating to home page...");
        router.push('/dashboard'); // Directly navigate to home without setTimeout
    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An error occurred while submitting the form.");
    } finally {
        setLoading(false); // Ensure loading state is reset
    }

    
    };
        

    return (
 <div>
            <Header pageType="dashboard" />
            <section className="lg:px-33 px-5 lg:my-30 my-10 flex justify-center items-center">
                <div className="bg-[#171717] border border-[#110c1f] backdrop-blur-md w-full p-10 rounded-2xl">
                    <div className="flex justify-between items-center mb-10">
                        <h1 className="lg:text-5xl text-4xl font-bold" onClick={fetchArticle}>
                            Create New Post 📝
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-10 relative">
                        {/* Thumbnail Section */}
                        <div className="flex lg:flex-row flex-col gap-7 items-center">
                            <Image width={500} height={500} src={typeof thumbnail === "string" ? thumbnail : thumbnail ? URL.createObjectURL(thumbnail) : "/assets/images/default/defaultArticle.png"} className="w-[40rem] h-[20rem] object-cover rounded-xl" alt="Thumbnail Preview" />
                            <div>
                                <input type="file" id="article-image" className="hidden" onChange={handleThumbnailChange} />
                                <label htmlFor="article-image" className="bg-gradient-to-r from-neutral-500 to-neutral-500 hover:from-zinc-500 hover:to-zinc-500 transition-all duration-500 text-[15px] text-white font-bold px-6 py-3 rounded-lg w-full">
                                    Upload Thumbnail
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter a catchy title"
                                className="bg-[#1a202c] border p-4 rounded-lg w-full outline-none"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                                required
                            />
                        </div>

                        {/* Content Field with CKEditor */}
                        <div className="space-y-4 ">
                            <label htmlFor="content">Content</label>
                            <textarea
                                id="content"
                                type="text"
                                placeholder="Write content..."
                                className="bg-[#1a202c] border p-4 rounded-lg w-full outline-none"
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                }}
                                required
                            />
                        </div>

                        {/* Category Selection */}
                        <div className="flex md:flex-row flex-col justify-between gap-5">
                            <div className="space-y-4 w-full">
                                <label htmlFor="category" onClick={fetchCategories}>
                                    Category
                                </label>
                                <select
                                    id="category"
                                    className="bg-[#1a202c] p-4 rounded-lg w-full outline-none text-gray-300"
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                    }}
                                >
                                    {categories?.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-10">
                            <button type="submit" className="bg-gradient-to-r from-neutral-500 to-neutral-500 hover:from-gray-500 hover:to-gray-500 transition-all duration-500 text-[15px] text-white font-bold px-6 py-3 rounded-lg w-full">
                                {loading ? (
                                    articleId ? (
                                        <>
                                            Updating Post <i className="fas fa-spinner fa-spin ms-2" />
                                        </>
                                    ) : (
                                        <>
                                            Creating Post <i className="fas fa-spinner fa-spin ms-2" />
                                        </>
                                    )
                                ) : articleId ? (
                                    <>
                                        Update Post <i className="fas fa-paper-plane ms-2" />
                                    </>
                                ) : (
                                    <>
                                        Create Post <i className="fas fa-paper-plane ms-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
            <Footer />
        </div>
    );
}
  