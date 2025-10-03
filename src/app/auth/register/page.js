"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Header, Footer } from "@/app/components";
import Link from "next/link";

export default function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { fullName },
            },
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
            return;
        }

        const userId = data?.user?.id;
        if (userId) {
            const { error: profileError } = await supabase.from("profile").insert([{ id: userId, full_name: fullName, role: "user" }]);
            if (profileError) {
                toast.error("Failed to create a user profile");
                setLoading(false);
                return;
            }
        }

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            toast.error("Registeration successful, but login failed. Please try logging in manually");
            setLoading(false);
            return;
        }

        toast.success("Registeration successful! Redirecting...");
        setLoading(false);
        router.push("/dashboard");
    };

    return (
        <div>
            <Header />
            <section className="lg:px-33 px-5 lg:my-20 my-10 flex justify-center items-center">
                <div className="bg-[#0002] backdrop-blur-md w-[33rem] p-10 rounded-2xl">
                    <div className="mb-10">
                        <h1 className="lg:text-5xl text-4xl font-bold">Register 🔒</h1>
                        <p className="font-normal text-sm mt-2">Hey there, welcome to Bloogy! Sign up to continue.</p>
                    </div>
                    <form onSubmit={handleRegister} className="space-y-5 relative">
                        <input type="text" placeholder="Full Name" className="border-3 border-[#e1d1ff7a] p-2 rounded-lg w-full outline-none" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        <input type="email" placeholder="Email Address" className="border-3 border-[#e1d1ff7a] p-2 rounded-lg w-full outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" className="border-3 border-[#e1d1ff7a] p-2 rounded-lg w-full outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <input type="password" placeholder="Confirm Password" className="border-3 border-[#e1d1ff7a] p-2 rounded-lg w-full outline-none" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <button type="submit" disabled={loading} className="lg:flex justify-center items-center bg-gradient-to-r from-neutral-500 to-black-500 cursor-pointer text-[15px] font-bold px-6 py-3 rounded-full border-0 me-3 w-full ">
                            {loading ? (
                                <>
                                    Creating Account... <i className="fas fa-spinner fa-spin ms-1"></i>
                                </>
                            ) : (
                                <>
                                    Create Account <i className="fas fa-user-plus ms-1"></i>
                                </>
                            )}
                        </button>
                    </form>
                    <p className="font-light text-xs text-center mt-10 text-gray-300">
                        Already have an account?
                        <Link className="border-b border-dashed border-gray-300" href="/auth/login">
                            Login Now
                        </Link>
                    </p>
                </div>
            </section>
            <Footer />
        </div>
    );
}
