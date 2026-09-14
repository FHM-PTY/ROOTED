import { useState, useEffect } from "react"
import CustomerApp from "./Customer/CustomerApp"
import VendorApp from "./Vendor/VendorApp"

function checkIsVendorRoute(): boolean {
  if (typeof window === "undefined") return false
  const hash = window.location.hash.toLowerCase()
  const pathname = window.location.pathname.toLowerCase()
  return (
    hash.startsWith("#/vendor") ||
    hash.startsWith("#vendor") ||
    hash.includes("vendor") ||
    pathname.includes("/vendor")
  )
}

export default function App() {
  const [isVendorRoute, setIsVendorRoute] =
    useState<boolean>(checkIsVendorRoute)

  useEffect(() => {
    const handleRouteChange = () => {
      setIsVendorRoute(checkIsVendorRoute())
    }

    window.addEventListener("hashchange", handleRouteChange)
    window.addEventListener("popstate", handleRouteChange)
    return () => {
      window.removeEventListener("hashchange", handleRouteChange)
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  if (isVendorRoute) {
    return <VendorApp />
  }

  return <CustomerApp />
}
