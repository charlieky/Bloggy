"use client";
import React, { useState } from "react";
import Link from 'next/link';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../../../src/components/ui/menubar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { defaultArticle } from './images';
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

 const Header = () => {
    const { user  } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState([]);
    const [article, setArticle] = useState([]);
    const [comments, setComments] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loadingDashboardStats, setLoadingDashboardStats] = useState(false);
    const [loading, setLoading] = useState(false);

    



    const handleLogout = async () => {
        setLoading(true);

        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error(error.message);
                toast.error("Logout failed");
                setLoading(false);
                return;
            }

            toast.success("Logged out successfully");
            router.push("/auth/login");
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
            setLoading(false);
        }
    };
      return  (


 <div>
    
        <header className="flex flex-row justify-between items-center bg-[#131415] my-4 mx-4 lg:mx-33 px-10 py-4 rounded-lg">
            <Link href="/">
                    <h1 className="text-3xl lg:text-3xl font-bold ms-3">Logo</h1>
            </Link>
                <Menubar className={"text-white bg-[#0000] border-0 shadow-none hidden lg:flex"}>
                    <MenubarMenu>
                        <MenubarTrigger>
                                    <Link href="/">Home</Link>
                        </MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Link href="/categories">Categories</Link>
                        </MenubarTrigger>
                   </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>Dasboard</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <Link href="/dashboard">Overview</Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link href="/dashboard/article/manage">Create Article</Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link href="/dashboard/articles/all">Articles</Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link href="/dashboard/profile">Edit Profile</Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>Pages</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                <Link href="/pages/about">About</Link>
                            </MenubarItem>
                            <MenubarItem>
                                <Link href="/pages/contact">Contact</Link>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                  {/* Bookmarked Section */}
                 <div className="flex gap-4 items-center">
                    <Dialog>
                        <DialogTrigger asChild={true}>
                            <button>
                               <i className="ri-notification-line text-2xl"></i>
                            </button>
                        </DialogTrigger>
                        <DialogContent className={"max-w-xl text-white bg-[#050510] border-1 border-gray-800"}>
                            <DialogHeader>
                                <h3>Bookmarked Article (3)</h3>
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-6">
                                <div className="grid flex-1 gap-2">
                                    <div className="overflow-y-auto max-h-[20rem]">
                                        <div key={1}>
                                            <Link href="/">
                                                <div className="flex items-center gap-3 bg-[#08081a] p-3 rounded-lg my-5 ">
                                                    <img src={article?.thumbnail} className="w-33 h-20 object-cover rounded-lg" alt={article?.title} />
                                                    <div className="space-y-2 w-full">
                                                        <h3>Example Article Title</h3>
                                                        <div className="flex justify-between items-center gap-3">
                                                            <p className="text-sm text-gray-400">
                                                                <i className="fas fa-eye"></i> 123 Views
                                                            </p>
                                                            <button className="bg-red-200 text-red-600 px-3 py-2 rounded-sm hover:text-red-700">
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                      <Dialog>
                        <DialogTrigger asChild={true}>
                            <button>
                                <i className="ri-search-line text-2xl"></i>
                            </button>
                        </DialogTrigger>
                        <DialogContent className={"max-w-xl text-white bg-[#050510] border-1 border-gray-800"}>
                            <DialogHeader>
                                <input type="text" className="border-1 border-[#0b0b24] bg-[#08081a] rounded-lg py-2 outline-0 focus:ring-indigo-500 focus:ring-2 px-2 placeholder:text-sm text-[#7070b2]" placeholder="Enter a keyword..." name="" id="" />
                            </DialogHeader>
                            <div className="flex items-center space-x-2 mt-6">
                                <div className="grid flex-1 gap-2">
                                    <h1>3 Articles Found</h1>
                                    <div className="overflow-y-auto max-h-[20rem]">
                                        <div key={1}>
                                            <Link href=" ">
                                                <div className="flex items-center gap-3 bg-[#08081a] p-3 rounded-lg my-5 ">
                                                    <img src={defaultArticle} className="w-33 h-20 object-cover rounded-lg" alt="" />
                                                    <div className="space-y-2 w-full">
                                                        <h3>Example Article Title</h3>
                                                        <div className="flex justify-between items-center gap-3">
                                                            <p className="text-sm text-gray-400">
                                                                <i className="fas fa-eye"></i> 123 Views
                                                            </p>
                                                            <button className="bg-red-200 text-red-600 px-3 py-2 rounded-sm hover:text-red-700">
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                     {user ? (
                        <button disabled={loading} onClick={handleLogout} className="hidden lg:flex items-center bg-[#131619] cursor-pointer text-[15px] font-bold px-6 py-3 rounded-xl border-0 me-3">
                            {loading ? (
                                <>
                                    Logging Out <i className="fas fa-spinner fa-spin me-1"></i>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-out-alt me-1"></i> Logout
                                </>
                            )}
                        </button>
                    ) : (
                        <Link href="/auth/login" className="hidden lg:flex items-center bg-[#131619] cursor-pointer text-[15px] font-bold px-6 py-3 rounded-lg border-0 me-3">
                            Login <i className="fas fa-sign-in-alt ms-1"></i>
                        </Link>
                      )}

                         <Sheet>
                        <SheetTrigger className="lg:hidden">
                            <i className="fas fa-bars text-2xl me-3"></i>
                        </SheetTrigger>
                        <SheetContent className={`bg-[#131619] border border-[#110c1f] text-white`}>
                            <SheetHeader>
                                <SheetTitle className={"text-white"}>Logo</SheetTitle>
                            </SheetHeader>

                            <ul className="ms-2 space-y-7">
                                <li>
                                    <a href="" className="flex items-center gap-3">
                                        <i className="fas fa-home"></i>
                                        <span>Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="" className="flex items-center gap-3">
                                        <i className="fas fa-book"></i>
                                        <span>Articles</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="" className="flex items-center gap-3">
                                        <i className="fas fa-user"></i>
                                        <span>Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="" className="flex items-center gap-3">
                                        <i className="fas fa-gear"></i>
                                        <span>Settings</span>
                                    </a>
                                </li>
                            </ul>
                        </SheetContent>
                    </Sheet>
                </div>
        </header>
    </div> );
 };

export default Header;
