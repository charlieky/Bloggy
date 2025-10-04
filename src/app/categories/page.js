"use client";

import React, { useState, useEffect } from 'react';
import { Header, Footer } from "../components";
import Image from "next/image";
import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient";
import { toast } from 'sonner';



export default function Page() {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from("category")
            .select("id, title, slug, thumbnail");

        if (error) {
            toast.error("Failed to fetch categories");
            console.error("Fetch categories error", error);
        } else {
            setCategories(data || []);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    

    return (
        <div className="">
            <Header />
            <section className="lg:px-33 px-5 lg:my-30">
                <div className="mb-1 relative">
                    <h1 className="lg:text-4xl text-2xl font-bold">Categories</h1>
                    <p className="italic font-normal text-sm mt-4 text-gray-500">
                        Discover articles across various topics
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 justify-between mt-10">
                    {categories.map((category) => (
                        <Link 
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group hover:scale-[1.02] transition-transform"
                        >
                            <div className="w-full h-[10rem] relative overflow-hidden rounded-lg">
                                <Image
                                    width={300}
                                    height={200}
                                    src={category.thumbnail || '/default-category.jpg'}
                                    className="w-full h-full object-cover"
                                    alt={category.title || 'Category image'}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <h1 className="text-xl font-semibold text-white absolute bottom-4 left-4 right-4">
                                    {category.title}
                                </h1>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
}
