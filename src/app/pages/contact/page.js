"use client"

import { useEffect, useState } from "react"

export default function ContactPage() {
  const [params, setParams] = useState({})

  useEffect(() => {
    // Read URL parameters on client side
    const urlParams = new URL(window.location.search)
    const paramsObj = Object.fromEntries(urlParams.entries())
    setParams(paramsObj)
  }, [])

  // Use params here
  return (
    <div>Hello World</div>
  )
}
