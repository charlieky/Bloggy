"use client"
import { useState } from "react"
import Link from "next/link"
import { defaultArticle } from "./images"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

const Header = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState([])
  const [article, setArticle] = useState([])
  const [comments, setComments] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loadingDashboardStats, setLoadingDashboardStats] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const handleLogout = async () => {
    setLoading(true)

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error(error.message)
        toast.error("Logout failed")
        setLoading(false)
        return
      }

      toast.success("Logged out successfully")
      router.push("/auth/login")
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
      setLoading(false)
    }
  }
  return (
    <div>
      <header className="flex flex-row justify-between items-center bg-[#131415] my-4 mx-4 lg:mx-33 px-10 py-4 rounded-lg">
        <Link href="/">
          <h1 className="text-3xl lg:text-3xl font-bold ms-3">Logo</h1>
        </Link>
        <nav className="text-white hidden lg:flex gap-6 items-center">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/categories" className="hover:text-gray-300">
            Categories
          </Link>
          <div className="relative group">
            <button className="hover:text-gray-300">Dashboard</button>
            <div className="absolute hidden group-hover:block bg-[#131415] border border-gray-700 rounded-lg mt-2 py-2 min-w-[200px] z-50">
              <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-800">
                Overview
              </Link>
              <Link href="/dashboard/article/manage" className="block px-4 py-2 hover:bg-gray-800">
                Create Article
              </Link>
              <Link href="/dashboard/articles/all" className="block px-4 py-2 hover:bg-gray-800">
                Articles
              </Link>
              <Link href="/dashboard/profile" className="block px-4 py-2 hover:bg-gray-800">
                Edit Profile
              </Link>
            </div>
          </div>
          <div className="relative group">
            <button className="hover:text-gray-300">Pages</button>
            <div className="absolute hidden group-hover:block bg-[#131415] border border-gray-700 rounded-lg mt-2 py-2 min-w-[200px] z-50">
              <Link href="/pages/about" className="block px-4 py-2 hover:bg-gray-800">
                About
              </Link>
              <Link href="/pages/contact" className="block px-4 py-2 hover:bg-gray-800">
                Contact
              </Link>
            </div>
          </div>
        </nav>
        {/* Bookmarked Section */}
        <div className="flex gap-4 items-center">
          <div className="relative">
            <button onClick={() => setNotificationOpen(!notificationOpen)}>
              <i className="ri-notification-line text-2xl"></i>
            </button>
            {notificationOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setNotificationOpen(false)}
              >
                <div
                  className="max-w-xl w-full text-white bg-[#050510] border border-gray-800 rounded-lg p-6 m-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3>Bookmarked Article (3)</h3>
                    <button onClick={() => setNotificationOpen(false)} className="text-2xl">
                      &times;
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <div className="grid flex-1 gap-2">
                      <div className="overflow-y-auto max-h-[20rem]">
                        <div key={1}>
                          <Link href="/">
                            <div className="flex items-center gap-3 bg-[#08081a] p-3 rounded-lg my-5 ">
                              <img
                                src={article?.thumbnail || "/placeholder.svg"}
                                className="w-33 h-20 object-cover rounded-lg"
                                alt={article?.title}
                              />
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
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => setSearchOpen(!searchOpen)}>
              <i className="ri-search-line text-2xl"></i>
            </button>
            {searchOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={() => setSearchOpen(false)}
              >
                <div
                  className="max-w-xl w-full text-white bg-[#050510] border border-gray-800 rounded-lg p-6 m-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      className="flex-1 border border-[#0b0b24] bg-[#08081a] rounded-lg py-2 outline-0 focus:ring-indigo-500 focus:ring-2 px-2 placeholder:text-sm text-[#7070b2]"
                      placeholder="Enter a keyword..."
                      name=""
                      id=""
                    />
                    <button onClick={() => setSearchOpen(false)} className="text-2xl ml-2">
                      &times;
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <div className="grid flex-1 gap-2">
                      <h1>3 Articles Found</h1>
                      <div className="overflow-y-auto max-h-[20rem]">
                        <div key={1}>
                          <Link href=" ">
                            <div className="flex items-center gap-3 bg-[#08081a] p-3 rounded-lg my-5 ">
                              <img
                                src={defaultArticle || "/placeholder.svg"}
                                className="w-33 h-20 object-cover rounded-lg"
                                alt=""
                              />
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
                </div>
              </div>
            )}
          </div>

          {user ? (
            <button
              disabled={loading}
              onClick={handleLogout}
              className="hidden lg:flex items-center bg-[#131619] cursor-pointer text-[15px] font-bold px-6 py-3 rounded-xl border-0 me-3"
            >
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
            <Link
              href="/auth/login"
              className="hidden lg:flex items-center bg-[#131619] cursor-pointer text-[15px] font-bold px-6 py-3 rounded-lg border-0 me-3"
            >
              Login <i className="fas fa-sign-in-alt ms-1"></i>
            </Link>
          )}

          <div className="lg:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <i className="fas fa-bars text-2xl me-3"></i>
            </button>
            {mobileMenuOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setMobileMenuOpen(false)}>
                <div
                  className="fixed right-0 top-0 h-full w-80 bg-[#131619] border-l border-[#110c1f] text-white p-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold">Logo</h2>
                    <button onClick={() => setMobileMenuOpen(false)} className="text-2xl">
                      &times;
                    </button>
                  </div>
                  <ul className="ms-2 space-y-7">
                    <li>
                      <Link href="/" className="flex items-center gap-3">
                        <i className="fas fa-home"></i>
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/articles/all" className="flex items-center gap-3">
                        <i className="fas fa-book"></i>
                        <span>Articles</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/profile" className="flex items-center gap-3">
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard" className="flex items-center gap-3">
                        <i className="fas fa-gear"></i>
                        <span>Settings</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
