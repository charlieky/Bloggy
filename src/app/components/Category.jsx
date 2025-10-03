"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react"; // Import useEffect
import { supabase } from "@/lib/supabaseClient";
import { toast } from 'sonner'; // Ensure you have toast notifications set up

export default function Page() {
    const [categories, setCategories] = useState([]); // State to store categories
    const [category, setCategory] = useState(null); // State to store the selected category

    // Function to fetch categories from Supabase
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

    // UseEffect to fetch categories when the component mounts
    useEffect(() => {
        fetchCategories();
    }, []); // Empty dependency array ensures this runs only once

    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Trending Categories ✨</h1>
                <p className="italic font-normal text-xs mt-2 text-gray-500">
                    Latest breaking news, pictures, videos and special reports
                </p>

                <div className="space-y-4 mt-5">
                    {categories.slice(0, 11).map((category) => (
                        <div key={category.id} className="w-full h-[5rem] relative">
                            <Image 
                                width={100} 
                                height={100} 
                                src={category.thumbnail} 
                                className="w-full h-[5rem] object-cover absolute rounded-lg" 
                                alt={category.title} 
                            />
                            <div className="w-full h-[5rem] bg-[#0c1011cc] absolute rounded-lg" />
                            <h1 className="text-xl font-semibold absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center">
                                {category.title}
                            </h1>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
