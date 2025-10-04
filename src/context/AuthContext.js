"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const loadUserProfile = async (userId) => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profile")
          .select("*")
          .eq("id", userId)
          .single()

        if (profileError) {
          console.error("Error fetching profile: ", profileError.message)
        } else {
          setProfile(profileData)
        }
      } catch (error) {
        console.error("Failed to load profile: ", error)
      }
    }

    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        setUser(null)
        setProfile(null)
      } else {
        setUser(data?.user)
        loadUserProfile(data?.user?.id)
      }

      setLoading(false)
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session?.user) {
        setUser(session.user)
        loadUserProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => authListener.subscription.unsubscribe()
  }, [router])

  return <AuthContext.Provider value={{ user, profile, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
