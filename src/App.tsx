import { useState, useEffect, useMemo } from "react"
import {
  Gender,
  Category,
  Product,
  Vendor,
  LockerStation,
  CartItem,
  VendorOrder,
} from "./types"
import {
  vendors as defaultVendors,
  products as defaultProducts,
  lockerStations,
  initialVendorOrders,
} from "./data/marketplaceData"
import BrandLandingPage from "./components/BrandLandingPage"
import VendorDashboard from "./components/VendorDashboard"

export type RouteState =
  | { type: "home" }
  | { type: "brand"; slug: string }
  | { type: "brands" }
  | { type: "vault" }
  | { type: "vendor-portal" };

export default function App() {
  // Navigation & Routing state (hash-based for multi-page support)
  const [currentRoute, setCurrentRoute] = useState<RouteState>({ type: "home" })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, "")
      if (hash.startsWith("brand/")) {
        const slug = hash.replace("brand/", "")
        setCurrentRoute({ type: "brand", slug })
      } else if (hash === "brands") {
        setCurrentRoute({ type: "brands" })
      } else if (hash === "vault") {
        setCurrentRoute({ type: "vault" })
      } else if (
        hash === "vendor" ||
        hash === "portal" ||
        hash === "vendor-portal" ||
        hash === "seller"
      ) {
        setCurrentRoute({ type: "vendor-portal" })
      } else {
        setCurrentRoute({ type: "home" })
      }
      window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // Initial parse
    handleHashChange()

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const navigateTo = (path: string) => {
    window.location.hash = path
  }

  // Persistent Products, Vendors & Orders state
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("le_benkeleng_products")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {}
    }
    return defaultProducts
  })

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem("le_benkeleng_vendors")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {}
    }
    return defaultVendors
  })

  const [orders, setOrders] = useState<VendorOrder[]>(() => {
    const saved = localStorage.getItem("le_benkeleng_orders")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch (e) {}
    }
    return initialVendorOrders
  })

  const [activeVendorSession, setActiveVendorSession] = useState<Vendor>(() => {
    const savedVendors = localStorage.getItem("le_benkeleng_vendors")
    if (savedVendors) {
      try {
        const parsed = JSON.parse(savedVendors)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return (
            parsed.find((v: Vendor) => v.slug === "lesupa-atelier") || parsed[0]
          )
        }
      } catch (e) {}
    }
    return (
      defaultVendors.find((v) => v.slug === "lesupa-atelier") ||
      defaultVendors[0]
    )
  })

  useEffect(() => {
    localStorage.setItem("le_benkeleng_products", JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem("le_benkeleng_vendors", JSON.stringify(vendors))
  }, [vendors])

  useEffect(() => {
    localStorage.setItem("le_benkeleng_orders", JSON.stringify(orders))
  }, [orders])

  // Vendor Action Handlers (reflect directly on commerce storefront)
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev])
    setVendors((prev) =>
      prev.map((v) =>
        v.slug === newProduct.brandSlug
          ? { ...v, productCount: v.productCount + 1 }
          : v,
      ),
    )
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
    )
  }

  const handleDeleteProduct = (productId: number) => {
    const target = products.find((p) => p.id === productId)
    setProducts((prev) => prev.filter((p) => p.id !== productId))
    if (target) {
      setVendors((prev) =>
        prev.map((v) =>
          v.slug === target.brandSlug
            ? { ...v, productCount: Math.max(0, v.productCount - 1) }
            : v,
        ),
      )
    }
  }

  const handleUpdateStock = (
    productId: number,
    size: string,
    newQty: number,
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p
        const nextStockPerSize = { ...(p.stockPerSize || {}), [size]: newQty }
        const total = Object.values(nextStockPerSize).reduce((a, b) => a + b, 0)
        return {
          ...p,
          stockPerSize: nextStockPerSize,
          stock: total,
          status: total === 0 ? "sold_out" : "active",
        }
      }),
    )
  }

  const handleUpdateVendorProfile = (updatedVendor: Vendor) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === updatedVendor.id ? updatedVendor : v)),
    )
    setActiveVendorSession(updatedVendor)
  }

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: VendorOrder["status"],
  ) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    )
  }

  const handleResetDemoData = () => {
    localStorage.removeItem("le_benkeleng_products")
    localStorage.removeItem("le_benkeleng_vendors")
    localStorage.removeItem("le_benkeleng_orders")
    setProducts(defaultProducts)
    setVendors(defaultVendors)
    setOrders(initialVendorOrders)
    setActiveVendorSession(
      defaultVendors.find((v) => v.slug === "lesupa-atelier") ||
        defaultVendors[0],
    )
  }

  // Filtering & Commerce state
  const [selectedDepartment, setSelectedDepartment] =
    useState<"ALL" | "MEN" | "WOMEN" | "VINTAGE">("ALL")
  const [selectedCategory, setSelectedCategory] = useState<Category>("all")
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] =
    useState<"featured" | "price-low" | "price-high" | "newest">("featured")

  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [selectedStation, setSelectedStation] = useState<LockerStation>(
    lockerStations[2],
  ) // Hatfield default
  const [currency, setCurrency] = useState<"ZAR" | "USD" | "EUR">("ZAR")

  // Modals
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [isLockerPickerOpen, setIsLockerPickerOpen] = useState(false)
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false)
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // Forms
  const [voucherCode, setVoucherCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0)
  const [voucherMessage, setVoucherMessage] = useState<string>("")
  const [trackingInput, setTrackingInput] = useState("")
  const [trackingResult, setTrackingResult] = useState<any | null>(null)
  const [whatsappUpdates, setWhatsappUpdates] = useState(true)
  const [buyerPhone, setBuyerPhone] = useState("+27 ")

  // Brand directory jump filter
  const [brandLetterFilter, setBrandLetterFilter] = useState<string>("ALL")

  // Drop countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 38,
    seconds: 45,
  })
  const [isDropNotified, setIsDropNotified] = useState(false)
  const [dropWhatsapp, setDropWhatsapp] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        if (prev.days > 0)
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const exchangeRates = {
    ZAR: 1,
    USD: 0.054,
    EUR: 0.051,
  }

  const currencySymbols = {
    ZAR: "R ",
    USD: "$ ",
    EUR: "€ ",
  }

  const formatPrice = (zarAmount: number) => {
    const converted = zarAmount * exchangeRates[currency]
    if (currency === "ZAR") {
      return `R ${zarAmount.toLocaleString()}`
    }
    return `${currencySymbols[currency]}${converted.toFixed(0)}`
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    )
  }

  // Filtered products logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (
        selectedDepartment === "MEN" &&
        !p.gender.includes("MEN") &&
        !p.gender.includes("UNISEX")
      )
        return false
      if (
        selectedDepartment === "WOMEN" &&
        !p.gender.includes("WOMEN") &&
        !p.gender.includes("UNISEX")
      )
        return false
      if (selectedDepartment === "VINTAGE" && !p.isThrift) return false

      if (selectedCategory === "pretoria" && p.city !== "Pretoria") return false
      if (selectedCategory === "thrift" && !p.isThrift) return false
      if (
        selectedCategory !== "all" &&
        selectedCategory !== "pretoria" &&
        selectedCategory !== "thrift" &&
        p.category !== selectedCategory
      )
        return false

      if (selectedBrand && p.brand !== selectedBrand) return false
      if (selectedCity !== "ALL" && p.city !== selectedCity) return false

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase()
        const matchTitle = p.title.toLowerCase().includes(query)
        const matchBrand = p.brand.toLowerCase().includes(query)
        const matchOrigin = p.origin.toLowerCase().includes(query)
        const matchFabric = p.fabric.toLowerCase().includes(query)
        if (!matchTitle && !matchBrand && !matchOrigin && !matchFabric)
          return false
      }

      return true
    })

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "newest") {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    }

    return result
  }, [
    products,
    selectedDepartment,
    selectedCategory,
    selectedBrand,
    selectedCity,
    searchQuery,
    sortBy,
  ])

  const filteredBrandDirectory = useMemo(() => {
    return vendors.filter((v) => {
      if (brandLetterFilter !== "ALL" && v.letter !== brandLetterFilter)
        return false
      return true
    })
  }, [vendors, brandLetterFilter])

  const activeVendorForRoute = useMemo(() => {
    if (currentRoute.type !== "brand") return null
    return vendors.find((v) => v.slug === currentRoute.slug) || null
  }, [vendors, currentRoute])

  const addToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size,
      )
      if (existing) {
        if (product.isThrift) {
          alert(
            "Notice: This is a 1-of-1 vintage piece. Only one unit is available in South Africa.",
          )
          return prev
        }
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...prev, { product, size, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId: number, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.size === size),
      ),
    )
  }

  const updateQuantity = (productId: number, size: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            if (item.product.id === productId && item.size === size) {
              if (item.product.isThrift && delta > 0) {
                alert(
                  "Notice: 1-of-1 vintage items are limited to single quantity.",
                )
                return item
              }
              const newQty = item.quantity + delta
              return newQty > 0 ? { ...item, quantity: newQty } : null
            }
            return item
          })
          .filter(Boolean) as CartItem[],
    )
  }

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  )
  const shippingCost = subtotal >= 650 || cart.length === 0 ? 0 : 75
  const discountAmount = (subtotal * appliedDiscount) / 100
  const total = Math.max(0, subtotal - discountAmount + shippingCost)

  const applyVoucher = (code: string) => {
    const clean = code.trim().toUpperCase()
    if (clean === "LOCAL10" || clean === "SWENKA10") {
      setAppliedDiscount(10)
      setVoucherMessage("✓ 'LOCAL10' applied: 10% discount on order")
    } else if (clean === "VINTAGE15" || clean === "DUNUSA") {
      setAppliedDiscount(15)
      setVoucherMessage("✓ 'VINTAGE15' applied: 15% off curated vintage pieces")
    } else if (clean === "PRETORIA12" || clean === "PITORI") {
      setAppliedDiscount(12)
      setVoucherMessage(
        "✓ 'PRETORIA12' applied: 12% off Pretoria labels (Lesupa/Mokasi)",
      )
    } else {
      setVoucherMessage("✕ Invalid code. Try LOCAL10, VINTAGE15, or PRETORIA12")
    }
  }

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingInput.trim()) return
    setTrackingResult({
      waybill: trackingInput.startsWith("BOB")
        ? trackingInput
        : `BOB-GO-${Math.floor(100000 + Math.random() * 900000)}`,
      destination: selectedStation.name,
      status: "In Transit with The Courier Guy",
      step: 3,
      eta: "Tomorrow by 14:00",
      pin: "849 201",
    })
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans antialiased pb-16 md:pb-0">
      {/* 1. BASH-STYLE TOP UTILITY BAR */}
      {/* 1. TOP LOGISTICS & ANNOUNCEMENT BAR */}
      <aside
        aria-label="Utility bar"
        className="bg-[#0B0B0B] text-[#9CA3AF] text-[11px] font-medium border-b border-[#1C1E22] px-4 sm:px-8 py-1.5 hidden md:block"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            onClick={() => setIsLockerPickerOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors group"
          >
            <span className="text-[#C88A35]">📍</span>
            <span>Deliver to:</span>
            <span className="font-semibold text-white underline decoration-dotted underline-offset-4 group-hover:text-[#C88A35]">
              {selectedStation.name}
            </span>
            <span className="text-[9px] text-[#9CA3AF]">(Change)</span>
          </div>

          <div className="flex items-center gap-2 text-center text-[#D1D5DB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>
              Free Smart Locker & Pick-Up Hub Delivery on Orders Over R 650
            </span>
            <span className="text-[#374151]">|</span>
            <span className="text-[#C88A35] font-semibold">
              48h Vendor Dispatch SLA
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#D1D5DB]">
            <button
              onClick={() => setIsTrackingModalOpen(true)}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>📦</span> Track Order
            </button>
            <a
              href="#/vendor"
              className={`hover:text-[#C88A35] transition-colors flex items-center gap-1 text-xs font-semibold ${
                currentRoute.type === "vendor-portal" ? "text-[#C88A35]" : ""
              }`}
              title="Merchant & Designer Atelier Portal"
            >
              <span>🔒</span> Atelier Studio
            </a>
            <div className="flex items-center gap-1 bg-[#1F2937] px-2 py-0.5 rounded text-[10px] font-mono">
              {(["ZAR", "USD", "EUR"] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-1 rounded cursor-pointer ${
                    currency === curr
                      ? "bg-[#374151] text-white font-bold"
                      : "text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN BASH-INSPIRED STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-black text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: Hamburger & Logo */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 -ml-1 text-white hover:text-gray-300 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Brand Logo (lowercase bold sans-serif, matching bash inspo) */}
            <div
              className="cursor-pointer select-none shrink-0"
              onClick={() => {
                setSelectedCategory("all")
                setSelectedBrand(null)
                setSelectedDepartment("ALL")
                setSearchQuery("")
                navigateTo("#/")
              }}
            >
              <span className="text-2xl sm:text-3xl font-black tracking-tight lowercase text-white font-sans">
                le benkeleng
              </span>
            </div>
          </div>

          {/* Middle: Rounded Charcoal Pill Search Bar */}
          <div className="flex-1 max-w-2xl mx-1 sm:mx-4">
            <div className="relative flex items-center">
              <span className="absolute left-3.5 sm:left-4 text-gray-400 pointer-events-none flex items-center">
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  if (currentRoute.type !== "home") navigateTo("#/")
                }}
                placeholder="Search products, stores or brands"
                className="w-full bg-[#27292D] focus:bg-[#1E2024] border border-transparent focus:border-[#4B5563] text-white placeholder-gray-400 text-xs sm:text-sm rounded-full py-2 sm:py-2.5 pl-10 sm:pl-11 pr-8 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right: 3 White Icons (Location Pin, User Account, Shopping Cart) */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* 1. Location Pin (Locker Stations & Pickup Hubs) */}
            <button
              onClick={() => setIsLockerPickerOpen(true)}
              className="p-2 text-white hover:text-[#C88A35] transition-colors relative cursor-pointer"
              title={`Deliver to: ${selectedStation.name}`}
              aria-label="Smart Locker & Pickup Locations"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* 2. User Profile (Order Tracking & Account) */}
            <button
              onClick={() => setIsTrackingModalOpen(true)}
              className="p-2 text-white hover:text-[#C88A35] transition-colors relative cursor-pointer"
              title="Track Orders & Account"
              aria-label="Account and Order Tracking"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* 3. Shopping Cart (Bag) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-white hover:text-[#C88A35] transition-colors relative cursor-pointer"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-[#C88A35] text-black text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. BASH CATEGORY SUB-NAV STRIP: Pure White with Active Black Pill */}
        <nav className="border-t border-black bg-white px-4 sm:px-8 py-2.5 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar whitespace-nowrap text-xs sm:text-sm font-semibold">
            {/* All */}
            <button
              onClick={() => {
                setSelectedCategory("all")
                setSelectedDepartment("ALL")
                setSelectedBrand(null)
                setSearchQuery("")
                navigateTo("#/")
              }}
              className={`rounded-full transition-all shrink-0 cursor-pointer ${
                selectedCategory === "all" &&
                selectedDepartment === "ALL" &&
                currentRoute.type === "home"
                  ? "bg-black text-white px-4 py-1.5 font-bold shadow-xs"
                  : "text-[#4B5563] hover:text-black font-semibold px-2 py-1"
              }`}
            >
              All
            </button>

            {/* Women */}
            <button
              onClick={() => {
                setSelectedDepartment("WOMEN")
                setSelectedCategory("all")
                setSelectedBrand(null)
                navigateTo("#/")
              }}
              className={`rounded-full transition-all shrink-0 cursor-pointer ${
                selectedDepartment === "WOMEN" &&
                selectedCategory === "all" &&
                currentRoute.type === "home"
                  ? "bg-black text-white px-4 py-1.5 font-bold shadow-xs"
                  : "text-[#4B5563] hover:text-black font-semibold px-2 py-1"
              }`}
            >
              Women
            </button>

            {/* Men */}
            <button
              onClick={() => {
                setSelectedDepartment("MEN")
                setSelectedCategory("all")
                setSelectedBrand(null)
                navigateTo("#/")
              }}
              className={`rounded-full transition-all shrink-0 cursor-pointer ${
                selectedDepartment === "MEN" &&
                selectedCategory === "all" &&
                currentRoute.type === "home"
                  ? "bg-black text-white px-4 py-1.5 font-bold shadow-xs"
                  : "text-[#4B5563] hover:text-black font-semibold px-2 py-1"
              }`}
            >
              Men
            </button>

            {/* Hoodies & Sweats */}
            <button
              onClick={() => {
                setSelectedCategory("outerwear")
                setSelectedBrand(null)
                navigateTo("#/")
              }}
              className={`rounded-full transition-all shrink-0 cursor-pointer ${
                selectedCategory === "outerwear" && currentRoute.type === "home"
                  ? "bg-black text-white px-4 py-1.5 font-bold shadow-xs"
                  : "text-[#4B5563] hover:text-black font-semibold px-2 py-1"
              }`}
            >
              Hoodies & Sweats
            </button>

            {/* Denim & Workwear */}
            <button
              onClick={() => {
                setSelectedCategory("workwear")
                setSelectedBrand(null)
                navigateTo("#/")
              }}
              className={`rounded-full transition-all shrink-0 cursor-pointer ${
                selectedCategory === "workwear" && currentRoute.type === "home"
                  ? "bg-black text-white px-4 py-1.5 font-bold shadow-xs"
                  : "text-[#4B5563] hover:text-black font-semibold px-2 py-1"
              }`}
            >
              Denim & Workwear
            </button>

            {/* Footwear & Sneakers */}
            <button
              onClick={() => {
                setSelectedCategory("kicks")
                setSelectedBrand(null)
                navigateTo("#/")
              }}
              className={`rounded-full transition-all shrink-0 cursor-pointer ${
                selectedCategory === "kicks" && currentRoute.type === "home"
                  ? "bg-black text-white px-4 py-1.5 font-bold shadow-xs"
                  : "text-[#4B5563] hover:text-black font-semibold px-2 py-1"
              }`}
            >
              Sneakers
            </button>

            {/* Accessories */}
            <button
              onClick={() => {
                setSelectedCategory("accessories")
                setSelectedBrand(null)
                navigateTo("#/")
              }}
              className={`rounded-full transition-all shrink-0 cursor-pointer ${
                selectedCategory === "accessories" &&
                currentRoute.type === "home"
                  ? "bg-black text-white px-4 py-1.5 font-bold shadow-xs"
                  : "text-[#4B5563] hover:text-black font-semibold px-2 py-1"
              }`}
            >
              Accessories
            </button>

            {/* Pretoria (012) */}
            <button
              onClick={() => {
                setSelectedCategory("pretoria")
                setSelectedBrand(null)
                navigateTo("#/")
              }}
              className={`rounded-full transition-all shrink-0 cursor-pointer ${
                selectedCategory === "pretoria" && currentRoute.type === "home"
                  ? "bg-black text-white px-4 py-1.5 font-bold shadow-xs"
                  : "text-[#4B5563] hover:text-black font-semibold px-2 py-1"
              }`}
            >
              Pretoria (012)
            </button>

            {/* Brands A–Z */}
            <a
              href="#/brands"
              className={`rounded-full transition-all shrink-0 ${
                currentRoute.type === "brands"
                  ? "bg-black text-white px-4 py-1.5 font-bold shadow-xs"
                  : "text-[#4B5563] hover:text-black font-semibold px-2 py-1"
              }`}
            >
              Brands
            </a>

            {/* The Dunusa Vault */}
            <a
              href="#/vault"
              className={`rounded-full transition-all shrink-0 ${
                currentRoute.type === "vault"
                  ? "bg-black text-white px-4 py-1.5 font-bold shadow-xs"
                  : "text-[#4B5563] hover:text-black font-semibold px-2 py-1"
              }`}
            >
              The Vault (1-of-1)
            </a>

            {/* Locker Stations */}
            <button
              onClick={() => setIsLockerPickerOpen(true)}
              className="text-[#4B5563] hover:text-black font-semibold px-2 py-1 rounded-full transition-all shrink-0 cursor-pointer"
            >
              Locker Stations
            </button>
          </div>
        </nav>
      </header>

      {/* 4. MULTI-PAGE ROUTE SWITCHER */}
      {currentRoute.type === "vendor-portal" ? (
        /* DEDICATED VENDOR DASHBOARD / SELLER PORTAL VIEW */
        <VendorDashboard
          currentVendor={activeVendorSession}
          allVendors={vendors}
          allProducts={products}
          allOrders={orders}
          onSelectVendor={(v) => setActiveVendorSession(v)}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateStock={handleUpdateStock}
          onUpdateVendorProfile={handleUpdateVendorProfile}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onResetDemoData={handleResetDemoData}
          onNavigateHome={() => navigateTo("#/")}
          onNavigateBrand={(slug) => navigateTo(`#/brand/${slug}`)}
          formatPrice={formatPrice}
        />
      ) : currentRoute.type === "brand" && activeVendorForRoute ? (
        /* DEDICATED BRAND LANDING PAGE VIEW */
        <BrandLandingPage
          vendor={activeVendorForRoute}
          allProducts={products}
          allVendors={vendors}
          wishlist={wishlist}
          currency={currency}
          formatPrice={formatPrice}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          onSelectProduct={(p) => setQuickViewProduct(p)}
          onNavigateHome={() => navigateTo("#/")}
          onNavigateBrand={(slug) => navigateTo(`#/brand/${slug}`)}
        />
      ) : currentRoute.type === "brands" ? (
        /* DEDICATED BRANDS A-Z DIRECTORY PAGE VIEW */
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E7EB] pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C88A35] block">
                  Marketplace Directory
                </span>
                <h1 className="text-3xl font-black text-[#111827] uppercase font-display">
                  All Independent Streetwear Labels A–Z
                </h1>
                <p className="text-xs text-[#6B7280] mt-1 max-w-xl">
                  Explore dedicated brand storefronts for Pretoria (012),
                  Soweto, Johannesburg, and Durban designers.
                </p>
              </div>

              {/* Letter Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-xs font-mono font-bold">
                {["ALL", "B", "D", "G", "K", "L", "M", "S"].map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setBrandLetterFilter(letter)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      brandLetterFilter === letter
                        ? "bg-[#111827] text-white"
                        : "bg-[#F3F4F6] text-[#4B5563] hover:bg-gray-200"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Storefront Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {filteredBrandDirectory.map((b) => (
                <div
                  key={b.id}
                  className="border border-[#E5E7EB] rounded-xl p-5 hover:border-[#111827] transition-all flex flex-col justify-between space-y-4 bg-[#F9FAFB] hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#C88A35] uppercase">
                        {b.origin}
                      </span>
                      <span className="text-[10px] font-mono text-[#9CA3AF]">
                        {b.coordinates}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                        style={{ backgroundColor: b.color }}
                      >
                        {b.letter}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#111827]">
                          {b.name}
                        </h3>
                        <span className="text-[11px] text-[#6B7280] block">
                          Est. {b.establishedYear}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#6B7280] mt-2.5 line-clamp-2 leading-relaxed">
                      {b.tagline}
                    </p>

                    {b.specialty && (
                      <div className="mt-2.5 text-[10px] font-mono text-[#111827] bg-white p-2 rounded border border-[#E5E7EB]">
                        {b.specialty}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#6B7280]">
                      {b.productCount} active styles
                    </span>
                    <a
                      href={`#/brand/${b.slug}`}
                      className="bg-[#111827] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-black transition-colors"
                    >
                      Visit Brand Store →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : currentRoute.type === "vault" ? (
        /* DEDICATED 1-OF-1 DUNUSA VINTAGE VAULT VIEW */
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          <div className="bg-[#111827] text-white rounded-2xl p-8 sm:p-12 space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C88A35] block">
              1-of-1 Curated South African Archive
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-display">
              The Dunusa Vintage Vault.
            </h1>
            <p className="text-xs sm:text-sm text-[#D1D5DB] max-w-2xl leading-relaxed">
              Hand-hunted across Small Street CBD wholesale stashes, Bree Taxi
              Interchange, and Durban beachfront arcades. Every single piece is
              verified Grade A+ mint, triple steam-cleaned, measured to the
              centimeter, and guaranteed 1-of-1 in South Africa.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products
              .filter((p) => p.isThrift)
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
                >
                  <div
                    className="relative aspect-3/4 bg-[#F3F4F6] overflow-hidden cursor-pointer"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#111827] text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                      1-OF-1 VINTAGE
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-black/80 text-white text-[9px] font-mono p-1.5 rounded">
                      {product.measurements}
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <a
                        href={`#/brand/${product.brandSlug}`}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#C88A35] block truncate hover:underline"
                      >
                        {product.brand}
                      </a>
                      <h3 className="text-xs font-semibold text-[#111827] line-clamp-2 mt-0.5">
                        {product.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between">
                      <span className="text-sm font-bold text-[#111827]">
                        {formatPrice(product.price)}
                      </span>
                      {(() => {
                        const totalStock =
                          product.stock ??
                          (product.stockPerSize
                            ? Object.values(product.stockPerSize).reduce(
                                (a, b) => a + b,
                                0,
                              )
                            : 0)
                        const isSoldOut =
                          totalStock === 0 || product.status === "sold_out"
                        return isSoldOut ? (
                          <span className="bg-red-100 text-red-700 text-[10px] font-mono font-bold px-3 py-1 rounded-full">
                            SOLD OUT
                          </span>
                        ) : (
                          <button
                            onClick={() => addToCart(product, product.sizes[0])}
                            className="bg-[#111827] text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-black transition-colors"
                          >
                            Add to Bag
                          </button>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </main>
      ) : (
        /* MARKETPLACE HOME PAGE VIEW */
        <main>
          {/* Shop By Brand Strip (Clicking opens brand landing page) */}
          <section className="bg-white border-b border-[#E5E7EB] py-4 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                  Featured Independent Labels:
                </span>
                <a
                  href="#/brands"
                  className="text-xs font-bold text-[#111827] hover:underline"
                >
                  View All Brands A–Z →
                </a>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                {vendors.map((vendor) => (
                  <a
                    key={vendor.id}
                    href={`#/brand/${vendor.slug}`}
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-full border text-xs font-bold shrink-0 transition-all bg-[#F9FAFB] text-[#374151] border-[#E5E7EB] hover:border-[#111827] hover:bg-white hover:shadow-xs"
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-mono"
                      style={{ backgroundColor: vendor.color }}
                    >
                      {vendor.letter}
                    </span>
                    <span>{vendor.name}</span>
                    {vendor.city === "Pretoria" && (
                      <span className="text-[9px] bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.2 rounded font-mono font-normal">
                        012
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Hero Promo Banner */}
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
            <div className="bg-linear-to-r from-[#111827] via-[#1F2937] to-[#111827] text-white rounded-2xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-[#C88A35]/20 text-[#FBBF24] border border-[#C88A35]/40 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono">
                    <span>✦</span> Home of Pretoria & Gauteng Streetwear
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-display">
                    The Curated Multi-Brand Marketplace.
                  </h1>

                  <p className="text-sm sm:text-base text-[#D1D5DB] max-w-xl leading-relaxed">
                    Featuring dedicated storefronts for{" "}
                    <a
                      href="#/brand/lesupa-atelier"
                      className="text-white font-semibold underline"
                    >
                      Lesupa Atelier
                    </a>
                    ,{" "}
                    <a
                      href="#/brand/mokasi"
                      className="text-white font-semibold underline"
                    >
                      Mokasi
                    </a>
                    , and{" "}
                    <a
                      href="#/brand/galxboy"
                      className="text-white font-semibold underline"
                    >
                      Galxboy
                    </a>{" "}
                    alongside Soweto raw denim and 1-of-1 vintage grails. One
                    basket, one checkout, and 48-hour smart locker pickup.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href="#/brand/lesupa-atelier"
                      className="bg-white text-[#111827] font-bold px-6 py-3 rounded-full text-xs hover:bg-[#F3F4F6] transition-colors shadow-xs"
                    >
                      Visit Lesupa Atelier Store
                    </a>
                    <a
                      href="#/brand/mokasi"
                      className="border border-white/30 text-white font-bold px-6 py-3 rounded-full text-xs hover:bg-white/10 transition-colors"
                    >
                      Visit Mokasi Store
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                  <a
                    href="#/brand/lesupa-atelier"
                    className="rounded-xl overflow-hidden aspect-4/5 relative group bg-black/40 block"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80"
                      alt="Lesupa Tee"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-xs p-2 rounded text-white text-[10px] font-mono">
                      <span className="font-bold block">Lesupa Atelier</span>
                      <span className="text-[#C88A35]">Visit Brand Page →</span>
                    </div>
                  </a>
                  <a
                    href="#/brand/soweto-threads"
                    className="rounded-xl overflow-hidden aspect-4/5 relative group bg-black/40 mt-6 block"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80"
                      alt="Soweto Raw Denim"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-xs p-2 rounded text-white text-[10px] font-mono">
                      <span className="font-bold block">Soweto Threads</span>
                      <span className="text-[#C88A35]">Visit Brand Page →</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Hype Drop Calendar */}
          <section
            id="drop-calendar"
            className="max-w-7xl mx-auto px-4 sm:px-8 py-4"
          >
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 bg-[#FEE2E2] text-[#DC2626] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] pulse-drop"></span>
                  Scheduled Capsule Drop
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  Lesupa × Mokasi: The 012 Autumn Drop
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Exclusive 50-piece numbered release engineered in Pretoria.
                  Heavyweight fleece & corduroy sets.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <div className="grid grid-cols-4 gap-2 font-mono text-center shrink-0">
                  <div className="bg-[#F3F4F6] px-3 py-1.5 rounded-md">
                    <span className="block text-lg font-bold text-[#111827]">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase text-[#6B7280]">
                      Days
                    </span>
                  </div>
                  <div className="bg-[#F3F4F6] px-3 py-1.5 rounded-md">
                    <span className="block text-lg font-bold text-[#111827]">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase text-[#6B7280]">
                      Hours
                    </span>
                  </div>
                  <div className="bg-[#F3F4F6] px-3 py-1.5 rounded-md">
                    <span className="block text-lg font-bold text-[#111827]">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase text-[#6B7280]">
                      Mins
                    </span>
                  </div>
                  <div className="bg-[#F3F4F6] px-3 py-1.5 rounded-md">
                    <span className="block text-lg font-bold text-[#DC2626]">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase text-[#6B7280]">
                      Secs
                    </span>
                  </div>
                </div>

                {isDropNotified ? (
                  <span className="text-xs font-bold text-[#059669] bg-[#DCFCE7] px-4 py-2 rounded-full">
                    ✓ WhatsApp Alert Registered
                  </span>
                ) : (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="tel"
                      value={dropWhatsapp}
                      onChange={(e) => setDropWhatsapp(e.target.value)}
                      placeholder="+27 WhatsApp Number"
                      className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-full px-4 py-2 text-xs focus:outline-none focus:border-[#111827] font-mono"
                    />
                    <button
                      onClick={() => {
                        if (dropWhatsapp.length >= 10) {
                          setIsDropNotified(true)
                        } else {
                          alert(
                            "Please enter a valid South African WhatsApp number.",
                          )
                        }
                      }}
                      className="bg-[#25D366] text-black font-bold text-xs px-4 py-2 rounded-full hover:bg-[#20ba5a] transition-colors shrink-0"
                    >
                      Notify Me
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Product Catalog with Toolbar */}
          <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">
                  {selectedBrand
                    ? selectedBrand
                    : selectedCategory === "pretoria"
                      ? "Pretoria (012) Streetwear"
                      : selectedCategory === "thrift"
                        ? "The Dunusa 1-of-1 Vault"
                        : "All Products"}
                </h2>
                <span className="text-xs text-[#6B7280]">
                  Showing {filteredProducts.length} items from South African
                  labels
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#6B7280]">Origin:</span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 font-medium text-[#111827] focus:outline-none"
                  >
                    <option value="ALL">All Cities</option>
                    <option value="Pretoria">Pretoria (012)</option>
                    <option value="Soweto">Soweto</option>
                    <option value="Johannesburg">Johannesburg</option>
                    <option value="Durban">Durban</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#6B7280]">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 font-medium text-[#111827] focus:outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest Drops</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const isSaved = wishlist.includes(product.id)
                const discountPercent = product.originalPrice
                  ? Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )
                  : null

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
                  >
                    <div
                      className="relative aspect-3/4 bg-[#F3F4F6] overflow-hidden cursor-pointer"
                      onClick={() => setQuickViewProduct(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <img
                        src={product.secondaryImage}
                        alt={`${product.title} Detail`}
                        className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />

                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        {product.city === "Pretoria" && (
                          <span className="bg-[#FEF3C7] text-[#92400E] text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                            012 PRETORIA
                          </span>
                        )}
                        {product.isThrift && (
                          <span className="bg-[#111827] text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                            1-OF-1 VINTAGE
                          </span>
                        )}
                        {discountPercent && (
                          <span className="bg-[#DC2626] text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                            -{discountPercent}%
                          </span>
                        )}
                        {(() => {
                          const totalStock =
                            product.stock ??
                            (product.stockPerSize
                              ? Object.values(product.stockPerSize).reduce(
                                  (a, b) => a + b,
                                  0,
                                )
                              : 0)
                          if (
                            totalStock === 0 ||
                            product.status === "sold_out"
                          ) {
                            return (
                              <span className="bg-red-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                                SOLD OUT
                              </span>
                            )
                          }
                          if (totalStock <= 4) {
                            return (
                              <span className="bg-amber-500 text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                                LOW STOCK ({totalStock})
                              </span>
                            )
                          }
                          return null
                        })()}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWishlist(product.id)
                        }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#111827] hover:bg-white shadow-xs transition-transform active:scale-90"
                        aria-label="Save to Wishlist"
                      >
                        <svg
                          className="w-4 h-4"
                          fill={isSaved ? "#EF4444" : "none"}
                          stroke={isSaved ? "#EF4444" : "currentColor"}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>

                      <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-xs p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 border-t border-[#E5E7EB]">
                        {(() => {
                          const totalStock =
                            product.stock ??
                            (product.stockPerSize
                              ? Object.values(product.stockPerSize).reduce(
                                  (a, b) => a + b,
                                  0,
                                )
                              : 0)
                          if (
                            totalStock === 0 ||
                            product.status === "sold_out"
                          ) {
                            return (
                              <div className="text-center text-[10px] font-mono font-bold text-red-600 py-1">
                                OUT OF STOCK
                              </div>
                            )
                          }
                          return (
                            <>
                              <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block text-center mb-1">
                                Select Size to Bag:
                              </span>
                              <div className="flex items-center justify-center gap-1 flex-wrap">
                                {product.sizes.map((sz) => {
                                  const sizeStock =
                                    product.stockPerSize?.[sz] ??
                                    (product.isThrift ? 1 : 5)
                                  const isSizeOut = sizeStock === 0
                                  return (
                                    <button
                                      key={sz}
                                      disabled={isSizeOut}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (!isSizeOut) addToCart(product, sz)
                                      }}
                                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                                        isSizeOut
                                          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through"
                                          : "bg-white border border-[#D1D5DB] hover:border-[#111827] hover:bg-[#111827] hover:text-white"
                                      }`}
                                    >
                                      {sz}
                                    </button>
                                  )
                                })}
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <a
                          href={`#/brand/${product.brandSlug}`}
                          className="text-[10px] font-bold uppercase tracking-wider text-[#C88A35] block truncate hover:underline"
                        >
                          {product.brand} →
                        </a>
                        <h3
                          className="text-xs font-semibold text-[#111827] hover:underline cursor-pointer line-clamp-2 leading-snug mt-0.5"
                          onClick={() => setQuickViewProduct(product)}
                        >
                          {product.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-[#F3F4F6] space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-[#111827]">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-[#9CA3AF] line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#6B7280] font-mono">
                          Pay 4x {formatPrice(Math.round(product.price / 4))}{" "}
                          with Payflex
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </main>
      )}

      {/* 5. SMART LOCKERS & LOGISTICS NETWORK */}
      <section id="lockers" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="bg-[#111827] text-white rounded-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C88A35] block">
                Frictionless Commuter Logistics
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                1,400+ Smart Lockers & Collection Hubs.
              </h2>
              <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
                Powered by Bob Go courier aggregation (The Courier Guy, Pargo,
                PEP Paxi). Collect your drops on your daily commute at transit
                stations, spaza counters, and retail plazas.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                  <span className="text-[#C88A35] font-bold block">
                    48-Hour SLA
                  </span>
                  <span className="text-[10px] text-[#9CA3AF]">
                    Direct brand dispatch
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                  <span className="text-[#C88A35] font-bold block">
                    WhatsApp PIN
                  </span>
                  <span className="text-[10px] text-[#9CA3AF]">
                    Contactless locker access
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white text-[#111827] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                <span className="text-xs font-bold uppercase">
                  Current Collection Hub:
                </span>
                <span className="text-xs font-bold text-[#059669]">
                  Free over R 650
                </span>
              </div>
              <div className="p-3 bg-[#F3F4F6] rounded-lg">
                <span className="text-xs font-bold block">
                  {selectedStation.name}
                </span>
                <span className="text-[11px] text-[#6B6964] block">
                  {selectedStation.address}
                </span>
                <span className="text-[10px] font-mono text-[#C88A35] block mt-1">
                  {selectedStation.commuterTag}
                </span>
              </div>
              <button
                onClick={() => setIsLockerPickerOpen(true)}
                className="w-full bg-[#111827] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-black transition-colors"
              >
                Change Locker Location ({lockerStations.length} Hubs Available)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BASH FOOTER */}
      <footer className="bg-white border-t border-[#E5E7EB] pt-12 pb-24 md:pb-12 text-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#E5E7EB]">
            <div className="space-y-3">
              <h3 className="font-display text-2xl font-black uppercase">
                Le Benkeleng
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                The multi-vendor home for Pretoria and Gauteng's independent
                streetwear labels and 1-of-1 curated vintage archives.
              </p>
              <div className="text-xs font-mono text-[#C88A35] font-semibold">
                Pretoria (012) · Soweto · Johannesburg · Durban
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#111827] block">
                Shop by Brand
              </span>
              <a
                href="#/brand/lesupa-atelier"
                className="block text-[#6B7280] hover:text-[#111827]"
              >
                Lesupa Atelier (Pretoria 012)
              </a>
              <a
                href="#/brand/mokasi"
                className="block text-[#6B7280] hover:text-[#111827]"
              >
                Mokasi Streetwear (Pretoria)
              </a>
              <a
                href="#/brand/galxboy"
                className="block text-[#6B7280] hover:text-[#111827]"
              >
                Galxboy Heritage (Pretoria)
              </a>
              <a
                href="#/brand/soweto-threads"
                className="block text-[#6B7280] hover:text-[#111827]"
              >
                Soweto Threads (Soweto)
              </a>
              <a
                href="#/brands"
                className="block text-[#C88A35] font-bold hover:underline"
              >
                View All Brands A–Z →
              </a>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#111827] block">
                Customer Service
              </span>
              <button
                onClick={() => setIsTrackingModalOpen(true)}
                className="block text-[#6B7280] hover:text-[#111827]"
              >
                Track Your Order
              </button>
              <button
                onClick={() => setIsLockerPickerOpen(true)}
                className="block text-[#6B7280] hover:text-[#111827]"
              >
                Locker Stations & Spaza Hubs
              </button>
              <button
                onClick={() => setIsVendorModalOpen(true)}
                className="block text-[#6B7280] hover:text-[#111827]"
              >
                Sell With Us (13% Commission)
              </button>
              <a
                href="#/vendor"
                className="block text-[#6B7280] hover:text-[#C88A35] transition-colors"
              >
                🔒 Atelier Studio Login
              </a>
              <span className="block text-[#6B7280]">
                Dispatch SLA: 48 Hours
              </span>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-[#111827] block">
                Secure South African Payment
              </span>
              <p className="text-xs text-[#6B6964]">
                Capitec 1-Tap QR, Payflex 4-part 0% interest installments, Ozow
                Instant EFT, and Cards.
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold">
                <span className="bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-1 rounded">
                  CAPITEC
                </span>
                <span className="bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-1 rounded">
                  PAYFLEX
                </span>
                <span className="bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-1 rounded">
                  OZOW
                </span>
                <span className="bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-1 rounded">
                  VISA/MC
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA3AF] gap-4">
            <span>
              © 2026 LE BENKELENG™ · MULTI-VENDOR MARKETPLACE · FICA & POPIA
              COMPLIANT
            </span>
            <span>PROUDLY BUILT FOR SOUTH AFRICAN STREETWEAR CULTURE</span>
          </div>
        </div>
      </footer>

      {/* 7. MOBILE STICKY BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E5E7EB] z-40 py-2 px-6 flex items-center justify-between text-xs font-semibold text-[#6B7280] shadow-lg">
        <button
          onClick={() => {
            setSelectedCategory("all")
            setSelectedBrand(null)
            navigateTo("#/")
          }}
          className="flex flex-col items-center gap-1 hover:text-[#111827]"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-[10px]">Home</span>
        </button>

        <a
          href="#/brands"
          className="flex flex-col items-center gap-1 hover:text-[#111827]"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className="text-[10px]">Brands</span>
        </a>

        <a
          href="#/vault"
          className="flex flex-col items-center gap-1 hover:text-[#111827]"
        >
          <span className="text-base">⚡</span>
          <span className="text-[10px]">Vault</span>
        </a>

        <a
          href="#/vendor"
          className={`flex flex-col items-center gap-1 ${
            currentRoute.type === "vendor-portal"
              ? "text-[#C88A35] font-bold"
              : "hover:text-[#111827]"
          }`}
          title="Merchant Studio"
        >
          <span className="text-base">🔒</span>
          <span className="text-[10px]">Studio</span>
        </a>

        <button
          onClick={() => setIsWishlistOpen(true)}
          className="flex flex-col items-center gap-1 hover:text-[#111827] relative"
        >
          <svg
            className="w-5 h-5"
            fill={wishlist.length > 0 ? "#EF4444" : "none"}
            stroke={wishlist.length > 0 ? "#EF4444" : "currentColor"}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-[10px]">Saved</span>
          {wishlist.length > 0 && (
            <span className="absolute -top-1 right-2 bg-[#EF4444] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 hover:text-[#111827] relative"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span className="text-[10px]">Bag</span>
          {cart.length > 0 && (
            <span className="absolute -top-1 right-2 bg-[#111827] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* 8. BASH-STYLE SLIDE-OUT NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Drawer Header */}
                <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black lowercase tracking-tight font-sans">
                      le benkeleng
                    </span>
                    <span className="text-[10px] font-mono text-[#C88A35] font-bold uppercase tracking-wider">
                      012 Heat
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Delivery Location bar */}
                <div
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setIsLockerPickerOpen(true)
                  }}
                  className="bg-[#F9FAFB] border-b border-[#E5E7EB] px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-base">📍</span>
                    <div>
                      <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider">
                        Collection Point
                      </span>
                      <span className="font-semibold text-gray-900">
                        {selectedStation.name}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#C88A35] font-bold">
                    Change →
                  </span>
                </div>

                {/* Navigation Sections */}
                <div className="p-6 space-y-6">
                  {/* Shop by Department */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                      Departments
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedDepartment("ALL")
                          setSelectedCategory("all")
                          setIsMobileMenuOpen(false)
                          navigateTo("#/")
                        }}
                        className="text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-black hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        All Streetwear
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDepartment("MEN")
                          setSelectedCategory("all")
                          setIsMobileMenuOpen(false)
                          navigateTo("#/")
                        }}
                        className="text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-black hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        "Men's Heat"
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDepartment("WOMEN")
                          setSelectedCategory("all")
                          setIsMobileMenuOpen(false)
                          navigateTo("#/")
                        }}
                        className="text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-black hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        "Women's Styles"
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          navigateTo("#/vault")
                        }}
                        className="text-left px-3 py-2 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-900 hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        1-of-1 Vault ⚡
                      </button>
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                      Categories
                    </span>
                    <div className="space-y-1 text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedCategory("outerwear")
                          setIsMobileMenuOpen(false)
                          navigateTo("#/")
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-between text-gray-700 hover:text-black transition-colors cursor-pointer"
                      >
                        <span>🧥 Hoodies & Sweats</span>
                        <span className="text-xs text-gray-400">→</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory("workwear")
                          setIsMobileMenuOpen(false)
                          navigateTo("#/")
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-between text-gray-700 hover:text-black transition-colors cursor-pointer"
                      >
                        <span>👖 Denim & Workwear</span>
                        <span className="text-xs text-gray-400">→</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory("kicks")
                          setIsMobileMenuOpen(false)
                          navigateTo("#/")
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-between text-gray-700 hover:text-black transition-colors cursor-pointer"
                      >
                        <span>👟 Footwear & Sneakers</span>
                        <span className="text-xs text-gray-400">→</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory("accessories")
                          setIsMobileMenuOpen(false)
                          navigateTo("#/")
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-between text-gray-700 hover:text-black transition-colors cursor-pointer"
                      >
                        <span>🧢 Headwear & Accessories</span>
                        <span className="text-xs text-gray-400">→</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategory("pretoria")
                          setIsMobileMenuOpen(false)
                          navigateTo("#/")
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-between text-gray-700 hover:text-black transition-colors cursor-pointer"
                      >
                        <span>🇿🇦 Pretoria (012) Streetwear</span>
                        <span className="text-xs text-gray-400">→</span>
                      </button>
                    </div>
                  </div>

                  {/* Independent Brands Directory */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Featured Labels
                      </span>
                      <a
                        href="#/brands"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xs font-bold text-[#C88A35] hover:underline"
                      >
                        All Brands A–Z →
                      </a>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {vendors.slice(0, 6).map((v) => (
                        <a
                          key={v.slug}
                          href={`#/brand/${v.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-2.5 py-1.5 rounded border border-gray-200 hover:border-black text-gray-700 hover:text-black truncate transition-colors font-medium"
                        >
                          {v.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsTrackingModalOpen(true)
                    }}
                    className="flex items-center gap-1.5 hover:text-black font-semibold cursor-pointer"
                  >
                    <span>📦</span> Track Order
                  </button>
                  <a
                    href="#/vendor"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 text-gray-600 hover:text-[#C88A35] font-semibold"
                  >
                    <span>🔒</span> Atelier Studio
                  </a>
                </div>
                <div className="text-[10px] text-gray-400 pt-2 border-t border-gray-200">
                  "Le Benkeleng™ · FICA & POPIA Compliant"
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. SLIDE-OUT SHOPPING BAG DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">
                    Shopping Bag
                  </h3>
                  <span className="text-xs text-[#6B7280]">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                    in your basket
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-[#6B7280] hover:text-[#111827]"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <span className="text-3xl">🛍️</span>
                    <h4 className="font-bold text-base text-[#111827]">
                      Your Bag is Empty
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      Discover Pretoria streetwear from Lesupa & Mokasi or
                      unique 1-of-1 vintage pieces.
                    </p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.size}-${idx}`}
                      className="flex gap-3 pb-4 border-b border-[#F3F4F6]"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-20 object-cover bg-[#F3F4F6] rounded-md shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold text-[#111827] line-clamp-1">
                              {item.product.title}
                            </h4>
                            <button
                              onClick={() =>
                                removeFromCart(item.product.id, item.size)
                              }
                              className="text-xs text-[#9CA3AF] hover:text-[#DC2626]"
                            >
                              ✕
                            </button>
                          </div>
                          <span className="text-[11px] font-mono text-[#C88A35] block">
                            {item.product.brand} · Size: {item.size}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-[#E5E7EB] rounded text-xs font-mono">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.size, -1)
                              }
                              className="px-2 py-0.5 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-2 font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.size, 1)
                              }
                              className="px-2 py-0.5 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-xs text-[#111827]">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-5 bg-[#F9FAFB] border-t border-[#E5E7EB] space-y-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-[#E5E7EB] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#6B7280] uppercase block">
                        Pick-Up Hub:
                      </span>
                      <span className="font-bold text-[#111827] block truncate max-w-56">
                        {selectedStation.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false)
                        setIsLockerPickerOpen(true)
                      }}
                      className="text-[#C88A35] font-bold underline text-[11px]"
                    >
                      Change
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        placeholder="Voucher Code (LOCAL10, VINTAGE15)"
                        className="bg-white border border-[#D1D5DB] rounded-lg px-3 py-1.5 flex-1 font-mono uppercase focus:outline-none focus:border-[#111827]"
                      />
                      <button
                        onClick={() => applyVoucher(voucherCode)}
                        className="bg-[#111827] text-white px-3 py-1.5 rounded-lg font-bold"
                      >
                        Apply
                      </button>
                    </div>
                    {voucherMessage && (
                      <span className="text-[10px] font-mono block text-[#059669]">
                        {voucherMessage}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 pt-2 border-t border-[#E5E7EB] font-mono">
                    <div className="flex justify-between text-[#6B7280]">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-[#059669]">
                        <span>Discount ({appliedDiscount}%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#6B7280]">
                      <span>Locker Delivery</span>
                      <span>
                        {shippingCost === 0
                          ? "FREE"
                          : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-[#111827] pt-2 border-t border-[#E5E7EB]">
                      <span>Total Due</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false)
                      setIsCheckoutModalOpen(true)
                    }}
                    className="w-full bg-[#111827] text-white py-3.5 rounded-full font-bold hover:bg-black transition-colors"
                  >
                    Proceed to Secure Checkout →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. SLIDE-OUT WISHLIST DRAWER */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsWishlistOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#111827]">
                    Saved Items ({wishlist.length})
                  </h3>
                  <span className="text-xs text-[#6B7280]">
                    Your personalized wishlist
                  </span>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-2 text-[#6B6964] hover:text-[#111827]"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <span className="text-3xl">🤍</span>
                    <h4 className="font-bold text-base text-[#111827]">
                      No saved items yet
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      Tap the heart icon on any piece in the catalog to save it
                      for later.
                    </p>
                  </div>
                ) : (
                  products
                    .filter((p) => wishlist.includes(p.id))
                    .map((product) => (
                      <div
                        key={product.id}
                        className="flex gap-3 pb-4 border-b border-[#F3F4F6] items-center"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-20 object-cover bg-[#F3F4F6] rounded-md shrink-0"
                        />
                        <div className="flex-1">
                          <span className="text-[10px] font-bold text-[#C88A35] uppercase">
                            {product.brand}
                          </span>
                          <h4 className="text-xs font-bold text-[#111827] line-clamp-1">
                            {product.title}
                          </h4>
                          <span className="text-xs font-bold text-[#111827] block mt-1">
                            {formatPrice(product.price)}
                          </span>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                addToCart(product, product.sizes[0])
                                toggleWishlist(product.id)
                              }}
                              className="bg-[#111827] text-white text-[10px] font-bold px-3 py-1 rounded-full hover:bg-black"
                            >
                              + Move to Bag
                            </button>
                            <button
                              onClick={() => toggleWishlist(product.id)}
                              className="text-[10px] text-[#DC2626] font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. ORDER TRACKING MODAL */}
      {isTrackingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => {
                setIsTrackingModalOpen(false)
                setTrackingResult(null)
              }}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827]"
            >
              ✕
            </button>

            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C88A35] block">
              Bob Go Aggregator Tracker
            </span>
            <h3 className="text-xl font-bold text-[#111827] mt-0.5">
              Track Your Locker Delivery
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              Enter your Bob Go waybill number or mobile number to track status.
            </p>

            <form onSubmit={handleTrackOrder} className="mt-4 flex gap-2">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="e.g. BOB-GO-849201 or 082..."
                className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg px-3 py-2 text-xs flex-1 font-mono focus:outline-none focus:border-[#111827]"
              />
              <button
                type="submit"
                className="bg-[#111827] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black"
              >
                Track
              </button>
            </form>

            {trackingResult && (
              <div className="mt-5 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2 font-mono">
                  <span className="font-bold text-[#111827]">
                    {trackingResult.waybill}
                  </span>
                  <span className="text-[#059669] font-bold bg-[#DCFCE7] px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block">
                    Destination Hub:
                  </span>
                  <span className="font-bold text-[#111827]">
                    {trackingResult.destination}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B7280] block">
                    Estimated Arrival:
                  </span>
                  <span className="font-bold text-[#111827]">
                    {trackingResult.eta}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded border border-[#E5E7EB] font-mono text-[11px] text-[#C88A35]">
                  Locker PIN Code:{" "}
                  <span className="font-bold text-[#111827]">
                    {trackingResult.pin}
                  </span>{" "}
                  (Sent via WhatsApp)
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 11. LOCKER PICKER MODAL */}
      {isLockerPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsLockerPickerOpen(false)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827]"
            >
              ✕
            </button>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C88A35] block">
              1,400+ Smart Lockers & Spaza Hubs
            </span>
            <h3 className="text-xl font-bold text-[#111827] mt-0.5">
              Select Your Preferred Pickup Hub
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              Select a secure pickup point along your transit or campus route.
            </p>

            <div className="mt-4 space-y-2.5">
              {lockerStations.map((station) => (
                <div
                  key={station.id}
                  onClick={() => {
                    setSelectedStation(station)
                    setIsLockerPickerOpen(false)
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedStation.id === station.id
                      ? "border-[#111827] bg-[#F9FAFB] ring-1 ring-[#111827]"
                      : "border-[#E5E7EB] hover:border-[#9CA3AF] bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-[#C88A35]">
                      {station.city}
                    </span>
                    <span className="text-[#6B7280]">{station.distance}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#111827] mt-0.5">
                    {station.name}
                  </h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {station.address}
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-[#111827] bg-[#F3F4F6] p-1.5 rounded">
                    {station.commuterTag}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 12. VENDOR ONBOARDING MODAL ("SELL WITH US") */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setIsVendorModalOpen(false)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827]"
            >
              ✕
            </button>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C88A35] block">
              Multi-Vendor Marketplace
            </span>
            <h3 className="text-2xl font-bold text-[#111827] mt-0.5">
              List Your Label on Le Benkeleng
            </h3>
            <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
              Join Lesupa Atelier, Mokasi, and Soweto Threads. 13% commission
              model, zero upfront listing fees, professional photography
              support, and weekly automated payouts.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert(
                  "Thank you! Your brand application has been received. Our curator team will review your catalogue within 24 hours.",
                )
                setIsVendorModalOpen(false)
              }}
              className="mt-5 space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#111827] font-bold uppercase text-[10px] mb-1">
                  Brand Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Pretoria Heavy Co."
                  className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#111827] font-bold uppercase text-[10px] mb-1">
                    City / Township *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Pretoria (012), Soweto"
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                  />
                </div>
                <div>
                  <label className="block text-[#111827] font-bold uppercase text-[10px] mb-1">
                    Instagram Handle *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="@yourbrand"
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#111827] font-bold uppercase text-[10px] mb-1">
                  Founder WhatsApp Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+27 82 000 0000"
                  className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#111827] text-white py-3 rounded-full font-bold hover:bg-black transition-colors mt-2"
              >
                Submit Brand for Curation Review →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 13. QUICK VIEW PRODUCT MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827]"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.title}
                  className="w-full aspect-3/4 object-cover rounded-xl bg-[#F3F4F6]"
                />
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <a
                    href={`#/brand/${quickViewProduct.brandSlug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="text-xs font-bold text-[#C88A35] uppercase hover:underline block"
                  >
                    {quickViewProduct.brand} · {quickViewProduct.origin} →
                  </a>
                  <h3 className="text-xl font-bold text-[#111827] mt-1">
                    {quickViewProduct.title}
                  </h3>
                  <div className="text-xl font-bold text-[#111827] mt-2">
                    {formatPrice(quickViewProduct.price)}
                  </div>
                  <p className="text-xs text-[#6B7280] mt-3 leading-relaxed">
                    {quickViewProduct.description}
                  </p>
                  <div className="mt-4 p-3 bg-[#F9FAFB] rounded-lg text-xs font-mono space-y-1">
                    <div>
                      <span className="font-bold">Fabric:</span>{" "}
                      {quickViewProduct.fabric}
                    </div>
                    {quickViewProduct.measurements && (
                      <div>
                        <span className="font-bold text-[#DC2626]">
                          Measurements:
                        </span>{" "}
                        {quickViewProduct.measurements}
                      </div>
                    )}
                    {quickViewProduct.condition && (
                      <div>
                        <span className="font-bold">Condition:</span>{" "}
                        {quickViewProduct.condition}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
                  {(() => {
                    const totalStock =
                      quickViewProduct.stock ??
                      (quickViewProduct.stockPerSize
                        ? Object.values(quickViewProduct.stockPerSize).reduce(
                            (a, b) => a + b,
                            0,
                          )
                        : 0)
                    if (
                      totalStock === 0 ||
                      quickViewProduct.status === "sold_out"
                    ) {
                      return (
                        <div className="text-center bg-red-50 text-red-700 font-mono font-bold py-2.5 rounded-lg text-xs">
                          SOLD OUT — Currently unavailable from{" "}
                          {quickViewProduct.brand}
                        </div>
                      )
                    }
                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#6B7280]">
                            Select Size:
                          </span>
                          {totalStock <= 4 && (
                            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                              Low Stock ({totalStock} left)
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {quickViewProduct.sizes.map((s) => {
                            const sizeStock =
                              quickViewProduct.stockPerSize?.[s] ??
                              (quickViewProduct.isThrift ? 1 : 5)
                            const isSizeOut = sizeStock === 0
                            return (
                              <button
                                key={s}
                                disabled={isSizeOut}
                                onClick={() => {
                                  if (!isSizeOut) {
                                    addToCart(quickViewProduct, s)
                                    setQuickViewProduct(null)
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                  isSizeOut
                                    ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through"
                                    : "border border-[#111827] hover:bg-[#111827] hover:text-white"
                                }`}
                              >
                                {isSizeOut
                                  ? `${s} (Sold Out)`
                                  : `Add ${s} to Bag`}
                              </button>
                            )
                          })}
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14. CHECKOUT MODAL */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827]"
            >
              ✕
            </button>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C88A35] block">
              Secure South African Checkout
            </span>
            <h3 className="text-2xl font-bold text-[#111827] mt-0.5">
              Payment Method
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              Order Total:{" "}
              <span className="font-bold text-[#111827]">
                {formatPrice(total)}
              </span>{" "}
              · Dispatched to{" "}
              <span className="text-[#C88A35] font-semibold">
                {selectedStation.name}
              </span>
            </p>

            <div className="mt-5 space-y-2.5 text-xs">
              <div className="p-3.5 border border-[#111827] rounded-xl flex items-center justify-between cursor-pointer bg-[#F9FAFB]">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[#111827]"></span>
                  <div>
                    <span className="font-bold block">Capitec 1-Tap Pay</span>
                    <span className="text-[10px] text-[#6B7280]">
                      Instant QR code scan via Capitec App
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#111827] text-white px-2 py-0.5 rounded">
                  INSTANT
                </span>
              </div>

              <div className="p-3.5 border border-[#E5E7EB] hover:border-[#111827] rounded-xl flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></span>
                  <div>
                    <span className="font-bold block">Payflex (Pay in 4)</span>
                    <span className="text-[10px] text-[#6B7280]">
                      4 equal interest-free installments of{" "}
                      {formatPrice(Math.round(total / 4))}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-[#C88A35] text-white px-2 py-0.5 rounded">
                  0% INTEREST
                </span>
              </div>

              <div className="p-3.5 border border-[#E5E7EB] hover:border-[#111827] rounded-xl flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></span>
                  <div>
                    <span className="font-bold block">Ozow Instant EFT</span>
                    <span className="text-[10px] text-[#6B7280]">
                      All major South African banks
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-[#6B7280]">ZERO FEES</span>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappUpdates}
                    onChange={(e) => setWhatsappUpdates(e.target.checked)}
                    className="accent-[#111827]"
                  />
                  <span className="text-xs text-[#111827]">
                    Send dispatch updates & collection PIN to WhatsApp
                  </span>
                </label>
                {whatsappUpdates && (
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+27 82 123 4567"
                    className="mt-2 w-full border border-[#D1D5DB] rounded-lg p-2 text-xs font-mono focus:outline-none"
                  />
                )}
              </div>

              <button
                onClick={() => {
                  const pin = Math.floor(100000 + Math.random() * 900000)
                  alert(
                    `Order Confirmed!\n\nWaybill: BOB-GO-${Math.floor(100000 + Math.random() * 900000)}\nDestination: ${selectedStation.name}\nLocker PIN: ${pin}\n\nThank you for supporting independent South African streetwear labels.`,
                  )
                  setCart([])
                  setIsCheckoutModalOpen(false)
                }}
                className="w-full bg-[#111827] text-white py-3.5 rounded-full font-bold hover:bg-black transition-colors mt-3"
              >
                Confirm & Pay {formatPrice(total)} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
