import { useState, useEffect, useMemo } from "react"
import {
  Gender,
  Category,
  Product,
  Vendor,
  LockerStation,
  CartItem,
  VendorOrder,
  OrderItem,
} from "../types"
import {
  vendors as defaultVendors,
  products as defaultProducts,
  lockerStations,
  initialVendorOrders,
} from "../data/marketplaceData"
import BrandLandingPage from "./BrandLandingPage"
import { marketplaceService } from "../services/marketplaceService"
import BackendStatusBadge from "../components/BackendStatusBadge"

export type RouteState = { type: "home" } | { type: "brand" slug: string } | {
  type: "brands"
} | { type: "vault" }

export default function CustomerApp() {
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

  // Reactive Products, Vendors & Orders state (PostgreSQL / Supabase + Offline Fallback)
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [vendors, setVendors] = useState<Vendor[]>(defaultVendors)
  const [orders, setOrders] = useState<VendorOrder[]>(initialVendorOrders)

  useEffect(() => {
    let isMounted = true

    const loadMarketplaceData = async () => {
      try {
        const [fetchedProds, fetchedVendors, fetchedOrders] = await Promise.all([
          marketplaceService.getProducts(),
          marketplaceService.getVendors(),
          marketplaceService.getOrders(),
        ])
        if (isMounted) {
          setProducts(fetchedProds)
          setVendors(fetchedVendors)
          setOrders(fetchedOrders)
        }
      } catch (err) {
        console.warn("Marketplace data load fallback:", err)
      }
    }

    loadMarketplaceData()

    // Subscribe to live database updates and cross-tab changes
    const unsubscribe = marketplaceService.subscribe(() => {
      loadMarketplaceData()
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

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
  const [buyerPhone, setBuyerPhone] = useState("+27 82 555 4321")
  const [buyerName, setBuyerName] = useState("Lerato Khumalo")
  const [isCheckingOut, setIsCheckingOut] = useState(false)

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

  // Rooted Revised Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    if ((window as any).__toastTimer) clearTimeout((window as any).__toastTimer)
    ;(window as any).__toastTimer = setTimeout(() => {
      setToastMessage(null)
    }, 2400)
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const isAlready = prev.includes(productId)
      if (isAlready) {
        showToast("Removed from saved collection.")
        return prev.filter((id) => id !== productId)
      } else {
        showToast("Saved to your ROOTED collection.")
        return [...prev, productId]
      }
    })
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
          showToast("Notice: 1-of-1 vintage piece. Only one unit is available.")
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
    showToast(`${product.title} added to your ROOTED bag.`)
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
    const query = trackingInput.trim()
    if (!query) return

    const matchedOrder = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === query.toLowerCase() ||
        o.waybillNumber.toLowerCase() === query.toLowerCase() ||
        o.id === query
    )

    if (matchedOrder) {
      let step = 1
      let statusText = "Order Received & Packing at Atelier"
      if (matchedOrder.status === "dispatched_to_locker") {
        step = 2
        statusText = "Dispatched with Bob Go Courier Guy"
      } else if (matchedOrder.status === "in_transit") {
        step = 3
        statusText = "In Transit to Pickup Locker"
      } else if (matchedOrder.status === "ready_for_pickup") {
        step = 4
        statusText = "Ready for Collection in Locker"
      } else if (matchedOrder.status === "collected") {
        step = 5
        statusText = "Parcel Collected by Customer"
      }

      setTrackingResult({
        waybill: matchedOrder.waybillNumber,
        destination: matchedOrder.lockerStation,
        status: statusText,
        step,
        eta: "48h SLA Guaranteed",
        pin: "Verified PIN via SMS/WhatsApp",
        orderNumber: matchedOrder.orderNumber,
        customer: matchedOrder.customerName,
      })
      return
    }

    setTrackingResult({
      waybill: query.startsWith("BOB") || query.startsWith("BG")
        ? query
        : `BG-${Math.floor(100000 + Math.random() * 900000)}-PTA`,
      destination: selectedStation.name,
      status: "In Transit with The Courier Guy (Bob Go)",
      step: 3,
      eta: "Tomorrow by 14:00",
      pin: "849 201",
    })
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-sans antialiased pb-20 md:pb-0 selection:bg-[var(--gold)] selection:text-[var(--ink)]">
      {/* ROOTED REVISED TOP PROGRESS BAR */}
      <div className="top-progress">
        <span style={{ width: "100%" }}></span>
      </div>

      {/* ROOTED REVISED UNIFIED FLOATING PILL NAVIGATION DOCK */}
      <nav className="rooted-nav">
        {/* Brand Logo with Root Symbol */}
        <div
          className="nav-brand cursor-pointer select-none"
          onClick={() => {
            setSelectedCategory("all")
            setSelectedBrand(null)
            setSelectedDepartment("ALL")
            setSearchQuery("")
            navigateTo("#/")
          }}
        >
          <span className="root-symbol">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="9"
            >
              <circle cx="50" cy="50" r="43" />
              <path d="M50 8v84M50 50 25 75M50 65 32 83M50 50l25 25M50 65l18 18" />
            </svg>
          </span>
          <span className="font-bold tracking-[0.16em] text-sm font-syncopate">
            ROOTED
          </span>
        </div>

        {/* Center Navigation Links */}
        <div className="nav-links">
          <button
            onClick={() => {
              setSelectedCategory("all")
              setSelectedBrand(null)
              setSelectedDepartment("ALL")
              setSearchQuery("")
              navigateTo("#/")
            }}
            className={`nav-link cursor-pointer ${
              currentRoute.type === "home" ? "active" : ""
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              if (currentRoute.type !== "home") navigateTo("#/")
              setTimeout(() => {
                const el = document.getElementById("catalog")
                if (el) el.scrollIntoView({ behavior: "smooth" })
              }, 50)
            }}
            className="nav-link cursor-pointer"
          >
            Discover
          </button>
          <a
            href="#/brands"
            className={`nav-link ${
              currentRoute.type === "brands" ? "active" : ""
            }`}
          >
            Brands
          </a>
          <a
            href="#/vault"
            className={`nav-link ${
              currentRoute.type === "vault" ? "active" : ""
            }`}
          >
            Thrift Zone
          </a>
          <a
            href="#/vendor"
            className="nav-link text-[#e9c079] hover:text-white"
            title="Merchant Atelier Studio"
          >
            Atelier
          </a>
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Cloud Database / Supabase Backend Badge */}
          <div className="hidden sm:flex items-center">
            <BackendStatusBadge compact />
          </div>

          {/* Smart Locker Location */}
          <button
            onClick={() => setIsLockerPickerOpen(true)}
            className="nav-action"
            title={`Deliver to: ${selectedStation.name} (Click to change)`}
            aria-label="Smart Locker Locations"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </button>

          {/* Bob Go Parcel Tracking */}
          <button
            onClick={() => setIsTrackingModalOpen(true)}
            className="nav-action"
            title="Track Bob Go Shipment"
            aria-label="Track Shipment"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m7.5 4.27 9 5.15" />
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="nav-action"
            title="Saved Collection"
            aria-label="Wishlist"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {wishlist.length > 0 && (
              <span className="nav-badge">{wishlist.length}</span>
            )}
          </button>

          {/* Shopping Bag */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="nav-action"
            title="Shopping Bag"
            aria-label="Shopping Bag"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cart.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
              <span className="nav-badge">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* 4. MULTI-PAGE ROUTE SWITCHER */}
      {currentRoute.type === "brand" && activeVendorForRoute ? (
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
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 pt-28 sm:pt-32">
          <div className="bg-[#fffdf8] border border-[rgba(21,20,15,0.12)] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[rgba(21,20,15,0.08)] pb-5">
              <div>
                <div className="eyebrow" style={{ color: "var(--clay)" }}>
                  Marketplace Directory
                </div>
                <h1 className="text-3xl sm:text-4xl font-normal text-[#15140f] font-serif">
                  All Independent Streetwear Labels A–Z
                </h1>
                <p className="text-xs text-[rgba(21,20,15,0.65)] mt-1.5 max-w-xl">
                  Explore dedicated brand storefronts for Pretoria (012),
                  Soweto, Johannesburg, and Durban designers.
                </p>
              </div>

              {/* Letter Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-sans font-medium">
                {["ALL", "B", "D", "G", "K", "L", "M", "S"].map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setBrandLetterFilter(letter)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer font-sans ${
                      brandLetterFilter === letter
                        ? "bg-[#15140f] text-[#fffdf8] shadow-xs font-bold"
                        : "bg-[#efeee3] text-[rgba(21,20,15,0.7)] hover:bg-[#e6e3d3]"
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
                  className="border border-[rgba(21,20,15,0.12)] rounded-2xl p-6 hover:border-[#15140f] transition-all flex flex-col justify-between space-y-4 bg-[#fffdf8] hover:shadow-lg hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-sans font-bold text-[#a64b34] uppercase tracking-wider">
                        {b.origin}
                      </span>
                      <span className="text-[10px] font-mono text-[rgba(21,20,15,0.45)]">
                        {b.coordinates}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 mt-3.5">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-xs"
                        style={{ backgroundColor: b.color }}
                      >
                        {b.letter}
                      </div>
                      <div>
                        <h3 className="text-xl font-normal font-serif text-[#15140f] tracking-tight leading-tight">
                          {b.name}
                        </h3>
                        <span className="text-xs text-[rgba(21,20,15,0.55)] block font-sans mt-0.5">
                          Est. {b.establishedYear}
                        </span>
                      </div>
                    </div>

                    <p className="text-[13px] font-sans text-[rgba(21,20,15,0.7)] mt-3 line-clamp-2 leading-relaxed">
                      {b.tagline}
                    </p>

                    {b.specialty && (
                      <div className="mt-3 text-[11px] font-sans text-[#15140f] bg-[#efeee3] px-3 py-1.5 rounded-lg border border-[rgba(21,20,15,0.08)] leading-snug">
                        {b.specialty}
                      </div>
                    )}
                  </div>

                  <div className="pt-3.5 border-t border-[rgba(21,20,15,0.08)] flex items-center justify-between">
                    <span className="text-xs font-sans text-[rgba(21,20,15,0.6)]">
                      {b.productCount} active styles
                    </span>
                    <a href={`#/brand/${b.slug}`} className="btn small">
                      Visit Brand Store →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : currentRoute.type === "vault" ? (
        /* DEDICATED 1-OF-1 THRIFT ZONE VIEW */
        <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6 pt-28 sm:pt-32">
          <div className="relative bg-[#15140f] text-[#fffdf8] rounded-2xl p-8 sm:p-12 space-y-4 overflow-hidden border border-[rgba(255,253,248,0.1)] shadow-sm">
            <div className="hero-grid"></div>
            <div className="relative z-10 space-y-3">
              <div className="eyebrow" style={{ color: "var(--gold-2)" }}>
                Curated South African Vintage Archive (1-of-1)
              </div>
              <h1 className="text-3xl sm:text-5xl font-normal font-serif text-[#fffdf8]">
                Thrift Zone Archive.
              </h1>
              <p className="text-xs sm:text-sm text-[#fffdf8]/75 max-w-2xl leading-relaxed">
                Hand-hunted across Small Street CBD wholesale stashes, Bree Taxi
                Interchange, and Durban beachfront arcades. Every single piece
                is verified Grade A+ mint, triple steam-cleaned, measured to the
                centimeter, and guaranteed 1-of-1 in South Africa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products
              .filter((p) => p.isThrift)
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-[#fffdf8] border border-[rgba(21,20,15,0.12)] rounded-2xl overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div
                    className="relative aspect-3/4 bg-[#efeee3] overflow-hidden cursor-pointer"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#15140f] text-[#e9c079] text-[9px] font-semibold px-2.5 py-0.5 rounded-full font-mono border border-[#d6a34c]/30 shadow-xs">
                      1-OF-1 VINTAGE
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-[#15140f]/90 text-[#fffdf8] text-[9px] font-mono p-1.5 rounded-md border border-[rgba(255,253,248,0.1)]">
                      {product.measurements}
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <a
                        href={`#/brand/${product.brandSlug}`}
                        className="text-[11px] font-semibold uppercase tracking-wider text-[#a64b34] block truncate hover:underline"
                      >
                        {product.brand}
                      </a>
                      <h3 className="text-xs font-medium text-[#15140f] hover:text-[#a64b34] line-clamp-2 mt-1 leading-snug">
                        {product.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-[rgba(21,20,15,0.08)] flex items-center justify-between">
                      <span className="text-sm font-semibold font-serif text-[#15140f]">
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
                          <span className="bg-[#15140f] text-[#fffdf8] text-[9px] font-mono font-semibold px-2.5 py-0.5 rounded-full border border-red-500/40">
                            SOLD OUT
                          </span>
                        ) : (
                          <button
                            onClick={() => addToCart(product, product.sizes[0])}
                            className="bg-[#15140f] hover:bg-[#1e1c15] text-[#fffdf8] text-[10px] font-medium px-3.5 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
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
        /* MARKETPLACE HOME PAGE VIEW (Rooted Revised Dev Style) */
        <main>
          {/* 1. EDITORIAL HERO (Rooted Revised) */}
          <header className="hero">
            <div className="container hero-grid">
              <div>
                <div className="eyebrow" style={{ color: "var(--gold-2)" }}>
                  SOUTH AFRICAN FASHION, ROOTED HERE
                </div>
                <h1>
                  Discover the people behind what you <em>wear.</em>
                </h1>
                <p className="hero-copy">
                  ROOTED brings independent South African clothing brands into
                  one place — their garments, stories, regional provenance and
                  growth. One basket, consolidated dispatch, and nationwide
                  smart locker pickup.
                </p>
                <div className="hero-actions">
                  <a className="btn light" href="#catalog">
                    Explore the collective →
                  </a>
                  <a
                    className="btn"
                    href="#how"
                    style={{
                      background: "transparent",
                      borderColor: "rgba(255,255,255,0.3)",
                      color: "#fff",
                    }}
                  >
                    Why ROOTED?
                  </a>
                  <a className="btn clay" href="#/vendor">
                    Merchant Atelier Studio →
                  </a>
                </div>
              </div>

              {/* Rotated Staggered Editorial Art Collage */}
              <div className="hero-art">
                <a
                  href="#/brand/lesupa-atelier"
                  className="art-card group block"
                >
                  <img
                    src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80"
                    alt="Lesupa Atelier"
                  />
                  <span className="art-label">
                    Lesupa Atelier · Pretoria West
                  </span>
                </a>
                <a
                  href="#/brand/soweto-threads"
                  className="art-card group block"
                >
                  <img
                    src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80"
                    alt="Soweto Threads"
                  />
                  <span className="art-label">
                    Soweto Threads · Johannesburg
                  </span>
                </a>
                <a href="#/brand/mokasi" className="art-card group block">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80"
                    alt="Mokasi"
                  />
                  <span className="art-label">Mokasi · Pretoria (012)</span>
                </a>
                <a href="#/brand/galxboy" className="art-card group block">
                  <img
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80"
                    alt="Galxboy"
                  />
                  <span className="art-label">
                    Galxboy · Gauteng Streetwear
                  </span>
                </a>
              </div>
            </div>
          </header>

          {/* 2. UNIVERSAL SEARCH SHELL & QUICK FILTER CHIPS (Rooted Revised) */}
          <section className="container" style={{ paddingTop: "35px" }}>
            <div className="search-shell">
              <div className="search-box">
                <span className="text-base text-[var(--muted)]">⌕</span>
                <input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try “hoodie”, “Pretoria”, “Lesupa”, “cargo”, “vintage”..."
                  autoComplete="off"
                />
              </div>
              {searchQuery && (
                <button className="btn" onClick={() => setSearchQuery("")}>
                  Clear
                </button>
              )}
            </div>

            <div className="filters">
              {[
                { label: "All", cat: "all", dept: "ALL" },
                { label: "Outerwear & Jackets", cat: "outerwear", dept: "ALL" },
                { label: "Hoodies & Sweats", cat: "hoodies", dept: "ALL" },
                { label: "Denim & Workwear", cat: "workwear", dept: "ALL" },
                { label: "Sneakers", cat: "kicks", dept: "ALL" },
                { label: "Accessories", cat: "accessories", dept: "ALL" },
                { label: "Pretoria (012)", cat: "pretoria", dept: "ALL" },
                { label: "Men", cat: "all", dept: "MEN" },
                { label: "Women", cat: "all", dept: "WOMEN" },
              ].map((f) => (
                <button
                  key={f.label}
                  onClick={() => {
                    setSelectedCategory(f.cat as any)
                    setSelectedDepartment(f.dept as any)
                    setSelectedBrand(null)
                  }}
                  className={`filter cursor-pointer ${
                    selectedCategory === f.cat && selectedDepartment === f.dept
                      ? "active"
                      : ""
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </section>

          {/* 3. PLATFORM ECOSYSTEM PILLARS (Rooted Revised) */}
          <section id="how" className="feature-band">
            <div className="container section">
              <div className="section-head">
                <div>
                  <div className="eyebrow" style={{ color: "var(--gold-2)" }}>
                    MORE THAN A MARKETPLACE
                  </div>
                  <h2>We connect the whole journey.</h2>
                </div>
              </div>
              <div className="feature-grid">
                <div className="feature">
                  <div className="feature-number">01</div>
                  <h3>Discover</h3>
                  <p>
                    Find independent labels by city hub, category, craft
                    discipline and story instead of wading through generic
                    mass-retail listings.
                  </p>
                </div>
                <div className="feature">
                  <div className="feature-number">02</div>
                  <h3>Buy Together</h3>
                  <p>
                    Shop across Pretoria, Joburg, Soweto and Durban
                    simultaneously. ROOTED consolidates your items into one box
                    with smart locker pickup.
                  </p>
                </div>
                <div className="feature">
                  <div className="feature-number">03</div>
                  <h3>Help Brands Grow</h3>
                  <p>
                    Every checkout transmits live sizing curves, demand
                    telemetry and inventory velocity back to the maker's
                    workshop.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. FOUR CREATIVE HUBS (Rooted Revised) */}
          <section className="section">
            <div className="container">
              <div className="section-head">
                <div>
                  <div className="eyebrow">LOCAL, NOT GENERIC</div>
                  <h2>Four creative hubs. One collective.</h2>
                </div>
              </div>
              <div className="hub-grid">
                <div
                  className="hub pta cursor-pointer"
                  onClick={() => {
                    setSelectedCity("Pretoria")
                    const el = document.getElementById("catalog")
                    if (el) el.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <small>Gauteng · 012</small>
                  <h3>Pretoria</h3>
                  <p>
                    Structured tailoring · heavy fleece · Lesupa &amp; Mokasi
                  </p>
                </div>
                <div
                  className="hub jhb cursor-pointer"
                  onClick={() => {
                    setSelectedCity("Johannesburg")
                    const el = document.getElementById("catalog")
                    if (el) el.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <small>Gauteng</small>
                  <h3>Johannesburg</h3>
                  <p>Architectural streetwear · Maboneng &amp; Braam</p>
                </div>
                <div
                  className="hub ct cursor-pointer"
                  onClick={() => {
                    setSelectedCity("Cape Town")
                    const el = document.getElementById("catalog")
                    if (el) el.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <small>Western Cape</small>
                  <h3>Cape Town</h3>
                  <p>Heavy duck canvas · utility · coastal craft</p>
                </div>
                <div
                  className="hub dbn cursor-pointer"
                  onClick={() => {
                    setSelectedCity("Durban")
                    const el = document.getElementById("catalog")
                    if (el) el.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  <small>KwaZulu-Natal</small>
                  <h3>Durban</h3>
                  <p>Linen · relaxed silhouettes · subtropical life</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. MEET THE MAKERS (Rooted Revised) */}
          <section className="section" style={{ background: "var(--paper-2)" }}>
            <div className="container">
              <div className="section-head">
                <div>
                  <div className="eyebrow">MEET THE MAKERS</div>
                  <h2>The story is part of the product.</h2>
                </div>
                <a className="btn ghost" href="#/brands">
                  Meet every brand →
                </a>
              </div>
              <div className="story-grid">
                <article className="story">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"
                    alt="Lesupa Atelier Founder"
                  />
                  <div className="story-copy">
                    <div className="brand-location">
                      Lesupa Atelier · Pretoria West
                    </div>
                    <h3>Built for a longer life.</h3>
                    <p>
                      From a small workspace in Pretoria, Lesupa treats
                      heavyweight fleece, chore jackets and tailored workwear as
                      an investment that improves with age.
                    </p>
                  </div>
                </article>
                <article className="story">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80"
                    alt="Sipho Nkosi"
                  />
                  <div className="story-copy">
                    <div className="brand-location">
                      Nkosi Studio · Maboneng
                    </div>
                    <h3>Joburg in the silhouette.</h3>
                    <p>
                      Heavyweight 500gsm loopback fleece, oversized cuts and the
                      visual tempo of the city translate into a modern South
                      African uniform.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* Hype Drop Calendar */}
          <section
            id="drop-calendar"
            className="max-w-7xl mx-auto px-4 sm:px-8 py-4"
          >
            <div className="bg-[#fffdf8] border border-[rgba(21,20,15,0.12)] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1.5">
                <div className="eyebrow" style={{ color: "var(--clay)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a64b34] pulse-drop inline-block mr-1"></span>
                  Scheduled Capsule Drop
                </div>
                <h2 className="text-xl sm:text-2xl font-normal font-serif text-[#15140f]">
                  Lesupa × Mokasi: The 012 Autumn Drop
                </h2>
                <p className="text-xs text-[rgba(21,20,15,0.65)]">
                  Exclusive 50-piece numbered release engineered in Pretoria.
                  Heavyweight fleece & corduroy sets.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <div className="grid grid-cols-4 gap-2 font-mono text-center shrink-0">
                  <div className="bg-[#efeee3] border border-[rgba(21,20,15,0.08)] px-3 py-1.5 rounded-lg">
                    <span className="block text-lg font-bold text-[#15140f]">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase text-[rgba(21,20,15,0.6)]">
                      Days
                    </span>
                  </div>
                  <div className="bg-[#efeee3] border border-[rgba(21,20,15,0.08)] px-3 py-1.5 rounded-lg">
                    <span className="block text-lg font-bold text-[#15140f]">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase text-[rgba(21,20,15,0.6)]">
                      Hours
                    </span>
                  </div>
                  <div className="bg-[#efeee3] border border-[rgba(21,20,15,0.08)] px-3 py-1.5 rounded-lg">
                    <span className="block text-lg font-bold text-[#15140f]">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase text-[rgba(21,20,15,0.6)]">
                      Mins
                    </span>
                  </div>
                  <div className="bg-[#efeee3] border border-[rgba(21,20,15,0.08)] px-3 py-1.5 rounded-lg">
                    <span className="block text-lg font-bold text-[#a64b34]">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase text-[rgba(21,20,15,0.6)]">
                      Secs
                    </span>
                  </div>
                </div>

                {isDropNotified ? (
                  <span className="text-xs font-semibold text-[#454e3d] bg-[#454e3d]/10 px-4 py-2 rounded-full border border-[#454e3d]/20">
                    ✓ WhatsApp Alert Registered
                  </span>
                ) : (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input
                      type="tel"
                      value={dropWhatsapp}
                      onChange={(e) => setDropWhatsapp(e.target.value)}
                      placeholder="+27 WhatsApp Number"
                      className="bg-[#efeee3] border border-[rgba(21,20,15,0.12)] rounded-full px-4 py-2 text-xs focus:outline-none focus:border-[#15140f] font-mono text-[#15140f]"
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
                      className="bg-[#454e3d] hover:bg-[#5c6851] text-[#fffdf8] font-medium text-xs px-5 py-2 rounded-full transition-all shrink-0 hover:-translate-y-0.5"
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
            <div className="bg-[#fffdf8] border border-[rgba(21,20,15,0.12)] rounded-2xl p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
              <div>
                <h2 className="text-xl sm:text-2xl font-normal font-serif text-[#15140f]">
                  {selectedBrand
                    ? selectedBrand
                    : selectedCategory === "pretoria"
                      ? "Pretoria (012) Streetwear"
                      : selectedCategory === "thrift"
                        ? "Thrift Zone (1-of-1 Archive)"
                        : "All Products"}
                </h2>
                <span className="text-xs text-[rgba(21,20,15,0.65)]">
                  Showing {filteredProducts.length} items from independent South
                  African labels
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-[rgba(21,20,15,0.65)] font-medium">
                    Origin:
                  </span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-[#efeee3] border border-[rgba(21,20,15,0.12)] rounded-full px-3.5 py-1.5 font-medium text-[#15140f] focus:outline-none"
                  >
                    <option value="ALL">All Cities</option>
                    <option value="Pretoria">Pretoria (012)</option>
                    <option value="Soweto">Soweto</option>
                    <option value="Johannesburg">Johannesburg</option>
                    <option value="Durban">Durban</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[rgba(21,20,15,0.65)] font-medium">
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#efeee3] border border-[rgba(21,20,15,0.12)] rounded-full px-3.5 py-1.5 font-medium text-[#15140f] focus:outline-none"
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
                    className="bg-[#fffdf8] border border-[rgba(21,20,15,0.12)] rounded-2xl overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <div
                      className="relative aspect-3/4 bg-[#efeee3] overflow-hidden cursor-pointer"
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
                          <span className="bg-[#a64b34] text-[#fffdf8] text-[9px] font-semibold px-2.5 py-0.5 rounded-full font-mono shadow-xs">
                            012 PRETORIA
                          </span>
                        )}
                        {product.isThrift && (
                          <span className="bg-[#15140f] text-[#e9c079] text-[9px] font-semibold px-2.5 py-0.5 rounded-full font-mono border border-[#d6a34c]/30 shadow-xs">
                            1-OF-1 VINTAGE
                          </span>
                        )}
                        {discountPercent && (
                          <span className="bg-[#a64b34] text-[#fffdf8] text-[9px] font-semibold px-2 py-0.5 rounded-full font-mono shadow-xs">
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
                              <span className="bg-[#15140f] text-[#fffdf8] text-[9px] font-mono font-semibold px-2.5 py-0.5 rounded-full border border-red-500/40">
                                SOLD OUT
                              </span>
                            )
                          }
                          if (totalStock <= 4) {
                            return (
                              <span className="bg-[#d6a34c] text-[#15140f] text-[9px] font-mono font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
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
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#fffdf8]/90 backdrop-blur-xs flex items-center justify-center text-[#15140f] hover:bg-[#fffdf8] shadow-xs transition-transform active:scale-90 border border-[rgba(21,20,15,0.08)]"
                        aria-label="Save to Wishlist"
                      >
                        <svg
                          className="w-4 h-4"
                          fill={isSaved ? "#a64b34" : "none"}
                          stroke={isSaved ? "#a64b34" : "currentColor"}
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

                      <div className="absolute inset-x-0 bottom-0 bg-[#fffdf8]/95 backdrop-blur-xs p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 border-t border-[rgba(21,20,15,0.1)]">
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
                              <div className="text-center text-[10px] font-mono font-bold text-[#a64b34] py-1">
                                OUT OF STOCK
                              </div>
                            )
                          }
                          return (
                            <>
                              <span className="text-[9px] font-semibold text-[rgba(21,20,15,0.6)] uppercase tracking-wider block text-center mb-1">
                                Quick Add Size:
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
                                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium transition-all ${
                                        isSizeOut
                                          ? "bg-[#e6e3d3] text-[rgba(21,20,15,0.3)] cursor-not-allowed line-through"
                                          : "bg-[#efeee3] text-[#15140f] hover:bg-[#15140f] hover:text-[#fffdf8]"
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

                    <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <a
                          href={`#/brand/${product.brandSlug}`}
                          className="text-[11px] font-semibold uppercase tracking-wider text-[#a64b34] block truncate hover:underline"
                        >
                          {product.brand} →
                        </a>
                        <h3
                          className="text-xs font-medium text-[#15140f] hover:text-[#a64b34] cursor-pointer line-clamp-2 leading-snug mt-1"
                          onClick={() => setQuickViewProduct(product)}
                        >
                          {product.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-[rgba(21,20,15,0.08)] space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold font-serif text-[#15140f]">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-[rgba(21,20,15,0.4)] line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[rgba(21,20,15,0.6)] font-mono">
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
        <div className="relative bg-[#15140f] text-[#fffdf8] rounded-3xl p-7 sm:p-12 shadow-sm relative overflow-hidden border border-[rgba(255,253,248,0.1)]">
          <div className="hero-grid"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="eyebrow" style={{ color: "var(--gold-2)" }}>
                Commuter Logistics & Smart Lockers
              </div>
              <h2 className="text-2xl sm:text-4xl font-normal font-serif tracking-tight text-[#fffdf8]">
                1,400+ Smart Lockers & Collection Hubs.
              </h2>
              <p className="text-xs sm:text-sm text-[#fffdf8]/75 leading-relaxed">
                Powered by Bob Go courier aggregation (The Courier Guy, Pargo,
                PEP Paxi). Collect your drops on your daily commute at transit
                stations, spaza counters, and retail plazas.
              </p>

              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <div className="bg-[#1e1c15] border border-[rgba(255,253,248,0.1)] p-4 rounded-2xl transition-all">
                  <span className="text-[#fffdf8] font-bold text-sm block">
                    48-Hour SLA
                  </span>
                  <span className="text-xs text-[#fffdf8]/60 block mt-0.5 font-mono">
                    Direct atelier dispatch
                  </span>
                </div>
                <div className="bg-[#1e1c15] border border-[rgba(255,253,248,0.1)] p-4 rounded-2xl transition-all">
                  <span className="text-[#fffdf8] font-bold text-sm block">
                    WhatsApp PIN
                  </span>
                  <span className="text-xs text-[#fffdf8]/60 block mt-0.5 font-mono">
                    Contactless locker access
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#fffdf8] text-[#15140f] rounded-2xl p-6 sm:p-7 shadow-xl space-y-4 border border-[rgba(21,20,15,0.1)]">
              <div className="flex items-center justify-between border-b border-[rgba(21,20,15,0.08)] pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(21,20,15,0.6)] font-mono">
                  Selected Hub:
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#454e3d]/10 text-[#454e3d] border border-[#454e3d]/20">
                  Free over R 650
                </span>
              </div>
              <div className="p-4 bg-[#efeee3] rounded-xl space-y-1 border border-[rgba(21,20,15,0.08)]">
                <span className="text-sm font-semibold font-serif text-[#15140f] block">
                  {selectedStation.name}
                </span>
                <span className="text-xs text-[rgba(21,20,15,0.65)] block">
                  {selectedStation.address}
                </span>
                <span className="text-xs font-medium text-[#a64b34] block pt-1 font-mono">
                  {selectedStation.commuterTag}
                </span>
              </div>
              <button
                onClick={() => setIsLockerPickerOpen(true)}
                className="w-full bg-[#15140f] hover:bg-[#1e1c15] text-[#fffdf8] py-3.5 rounded-full text-xs font-medium transition-all shadow-xs cursor-pointer hover:-translate-y-0.5"
              >
                Change Locker Location ({lockerStations.length} Hubs Available)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL MARKETPLACE FOOTER */}
      <footer className="bg-[#fffdf8] border-t border-[rgba(21,20,15,0.12)] pt-14 pb-24 md:pb-12 text-[#15140f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Main 3-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[rgba(21,20,15,0.1)]">
            {/* Column 1: Quick Action Utility List with Icons & Dividers */}
            <div className="lg:col-span-5 space-y-0 divide-y divide-[rgba(21,20,15,0.1)]">
              {/* Row 1: Pay online */}
              <div
                onClick={() => {
                  alert(
                    "Pay online with Capitec 1-Tap QR, Payflex 4x 0% installments, Ozow Instant EFT, or Visa/Mastercard at checkout.",
                  )
                }}
                className="py-3.5 first:pt-0 flex items-center gap-3.5 text-sm font-medium text-[#15140f] hover:text-[#a64b34] cursor-pointer transition-colors group"
              >
                <svg
                  className="w-5 h-5 shrink-0 text-[#15140f] group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span className="group-hover:translate-x-0.5 transition-transform">
                  Pay your order online
                </span>
              </div>

              {/* Row 2: Track order */}
              <div
                onClick={() => setIsTrackingModalOpen(true)}
                className="py-3.5 flex items-center gap-3.5 text-sm font-medium text-[#15140f] hover:text-[#a64b34] cursor-pointer transition-colors group"
              >
                <svg
                  className="w-5 h-5 shrink-0 text-[#15140f] group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1"
                  />
                </svg>
                <span className="group-hover:translate-x-0.5 transition-transform">
                  Track your order
                </span>
              </div>

              {/* Row 3: Log a return */}
              <div
                onClick={() => {
                  alert(
                    "Returns & Exchanges: Independent labels offer 7-day unworn returns and size exchanges. Log directly via WhatsApp or your order tracking code.",
                  )
                }}
                className="py-3.5 flex items-center gap-3.5 text-sm font-medium text-[#15140f] hover:text-[#a64b34] cursor-pointer transition-colors group"
              >
                <svg
                  className="w-5 h-5 shrink-0 text-[#15140f] group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 10h10a5 5 0 015 5v2m0 0l-4-4m4 4l4-4M3 10l4-4M3 10l4 4"
                  />
                </svg>
                <span className="group-hover:translate-x-0.5 transition-transform">
                  Log a return
                </span>
              </div>

              {/* Row 4: Find nearest locker or store */}
              <div
                onClick={() => setIsLockerPickerOpen(true)}
                className="py-3.5 flex items-center gap-3.5 text-sm font-medium text-[#15140f] hover:text-[#a64b34] cursor-pointer transition-colors group"
              >
                <svg
                  className="w-5 h-5 shrink-0 text-[#15140f] group-hover:scale-110 transition-transform"
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
                <span className="group-hover:translate-x-0.5 transition-transform">
                  Find your nearest store or locker
                </span>
              </div>

              {/* Row 5: Get the app */}
              <div
                onClick={() => {
                  alert(
                    "ROOTED Mobile PWA is optimized for all iOS & Android browsers! Tap Share > 'Add to Home Screen' for instant drop notifications.",
                  )
                }}
                className="py-3.5 flex items-center gap-3.5 text-sm font-medium text-[#15140f] hover:text-[#a64b34] cursor-pointer transition-colors group"
              >
                <svg
                  className="w-5 h-5 shrink-0 text-[#15140f] group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="group-hover:translate-x-0.5 transition-transform">
                  ROOTED Web & Mobile PWA
                </span>
              </div>
            </div>

            {/* Column 2: ROOTED Help */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="font-normal font-serif text-base text-[#15140f]">
                ROOTED Help
              </h3>
              <ul className="space-y-2.5 text-xs text-[rgba(21,20,15,0.7)]">
                <li>
                  <a
                    href="#/"
                    onClick={() => {
                      setSelectedCategory("all")
                      setSelectedDepartment("ALL")
                      navigateTo("#/")
                    }}
                    className="hover:text-[#a64b34] hover:underline"
                  >
                    Help home
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => setIsLockerPickerOpen(true)}
                    className="hover:text-[#a64b34] hover:underline text-left cursor-pointer"
                  >
                    Collect and Deliver (Lockers)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsTrackingModalOpen(true)}
                    className="hover:text-[#a64b34] hover:underline text-left cursor-pointer"
                  >
                    Returns and Refunds
                  </button>
                </li>
                <li>
                  <a
                    href="#/brands"
                    className="hover:text-[#a64b34] hover:underline"
                  >
                    How to shop online
                  </a>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#a64b34] hover:underline">
                    Terms & Conditions
                  </span>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#a64b34] hover:underline">
                    Contact us
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-normal font-serif text-base text-[#15140f]">
                Company
              </h3>
              <ul className="space-y-2.5 text-xs text-[rgba(21,20,15,0.7)]">
                <li>
                  <button
                    onClick={() => setIsLockerPickerOpen(true)}
                    className="hover:text-[#a64b34] hover:underline text-left cursor-pointer"
                  >
                    Store & Locker finder
                  </button>
                </li>
                <li>
                  <a
                    href="#/brands"
                    className="hover:text-[#a64b34] hover:underline"
                  >
                    About ROOTED
                  </a>
                </li>
                <li>
                  <a
                    href="#/brand/lesupa-atelier"
                    className="hover:text-[#a64b34] hover:underline"
                  >
                    About Gauteng Streetwear
                  </a>
                </li>
                <li>
                  <span className="cursor-pointer hover:text-[#a64b34] hover:underline">
                    Sustainability, CSI, BEE
                  </span>
                </li>
                <li>
                  <button
                    onClick={() => setIsVendorModalOpen(true)}
                    className="hover:text-[#a64b34] hover:underline text-left cursor-pointer"
                  >
                    Careers & Designer Submissions
                  </button>
                </li>
                <li>
                  <a
                    href="#/vendor"
                    className="hover:text-[#a64b34] hover:underline text-left cursor-pointer flex items-center gap-1.5 font-bold text-[#15140f] pt-1"
                  >
                    <span>🏛️</span> Vendor Atelier Studio
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* South African Payment Badges & Legal Bottom Row */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[rgba(21,20,15,0.6)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium text-[#15140f] mr-1 font-serif">
                Accepted Payments:
              </span>
              <span className="bg-[#efeee3] border border-[rgba(21,20,15,0.12)] text-[#15140f] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium">
                CAPITEC
              </span>
              <span className="bg-[#efeee3] border border-[rgba(21,20,15,0.12)] text-[#15140f] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium">
                PAYFLEX
              </span>
              <span className="bg-[#efeee3] border border-[rgba(21,20,15,0.12)] text-[#15140f] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium">
                OZOW
              </span>
              <span className="bg-[#efeee3] border border-[rgba(21,20,15,0.12)] text-[#15140f] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium">
                VISA/MASTERCARD
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-right font-mono text-[11px]">
              <span>© 2026 ROOTED™ · MULTI-VENDOR MARKETPLACE</span>
              <span className="hidden sm:inline text-[rgba(21,20,15,0.2)]">
                |
              </span>
              <span className="font-semibold text-[#a64b34]">
                PROUDLY ROOTED IN SOUTH AFRICAN STREETWEAR CULTURE
              </span>
            </div>
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
          className={`flex flex-col items-center gap-1 ${
            currentRoute.type === "vault"
              ? "text-black font-bold"
              : "hover:text-[#111827]"
          }`}
        >
          <span className="text-base">⚡</span>
          <span className="text-[10px]">Thrift Zone</span>
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
                    <span className="text-xl font-medium lowercase tracking-tight font-serif text-[#fffdf8]">
                      rooted
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
                        className="text-left px-3 py-2 rounded-lg bg-neutral-100 text-neutral-800 hover:bg-black hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        Thrift Zone ⚡
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
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsLockerPickerOpen(true)
                    }}
                    className="flex items-center gap-1.5 text-gray-600 hover:text-[#C88A35] font-semibold cursor-pointer"
                  >
                    <span>⚡</span> Lockers
                  </button>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <a
                    href="#/vendor"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#15140f] text-[#fffdf8] font-mono text-xs font-bold hover:bg-[#26231a] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>🏛️</span>
                      <span>Vendor Atelier Studio</span>
                    </span>
                    <span className="text-[#e9c079]">Portal →</span>
                  </a>
                </div>
                <div className="text-[10px] text-gray-400 pt-1">
                  "ROOTED™ · FICA & POPIA Compliant"
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
            className="absolute inset-0 bg-[#15140f]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#fffdf8] shadow-2xl flex flex-col justify-between border-l border-[rgba(21,20,15,0.12)]">
              <div className="p-6 border-b border-[rgba(21,20,15,0.1)] flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-normal font-serif text-[#15140f]">
                    Shopping Bag
                  </h3>
                  <span className="text-xs text-[rgba(21,20,15,0.6)]">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                    in your basket
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-[rgba(21,20,15,0.5)] hover:text-[#15140f] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <span className="text-3xl">🛍️</span>
                    <h4 className="font-normal font-serif text-lg text-[#15140f]">
                      Your Bag is Empty
                    </h4>
                    <p className="text-xs text-[rgba(21,20,15,0.6)] max-w-xs mx-auto">
                      Discover local Pretoria streetwear from Lesupa & Mokasi or
                      unique 1-of-1 vintage grails.
                    </p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.size}-${idx}`}
                      className="flex gap-3.5 pb-4 border-b border-[rgba(21,20,15,0.08)]"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-20 object-cover bg-[#efeee3] rounded-xl shrink-0 border border-[rgba(21,20,15,0.08)]"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-medium text-[#15140f] line-clamp-1">
                              {item.product.title}
                            </h4>
                            <button
                              onClick={() =>
                                removeFromCart(item.product.id, item.size)
                              }
                              className="text-xs text-[rgba(21,20,15,0.4)] hover:text-[#a64b34] cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                          <span className="text-[11px] font-mono text-[#a64b34] block mt-0.5">
                            {item.product.brand} · Size: {item.size}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center border border-[rgba(21,20,15,0.15)] rounded-full text-xs font-mono bg-[#efeee3]">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.size, -1)
                              }
                              className="px-2.5 py-0.5 hover:bg-[#e6e3d3] rounded-l-full cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 font-bold text-[#15140f]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.size, 1)
                              }
                              className="px-2.5 py-0.5 hover:bg-[#e6e3d3] rounded-r-full cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-semibold font-serif text-sm text-[#15140f]">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-[#efeee3]/60 border-t border-[rgba(21,20,15,0.1)] space-y-4 text-xs">
                  <div className="bg-[#fffdf8] p-3.5 rounded-xl border border-[rgba(21,20,15,0.1)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[rgba(21,20,15,0.6)] uppercase block font-mono">
                        Pick-Up Hub:
                      </span>
                      <span className="font-medium text-[#15140f] block truncate max-w-56 font-serif">
                        {selectedStation.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false)
                        setIsLockerPickerOpen(true)
                      }}
                      className="text-[#a64b34] font-semibold hover:underline text-xs cursor-pointer"
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
                        className="bg-[#fffdf8] border border-[rgba(21,20,15,0.15)] rounded-full px-4 py-2 flex-1 font-mono uppercase text-xs focus:outline-none focus:border-[#15140f]"
                      />
                      <button
                        onClick={() => applyVoucher(voucherCode)}
                        className="bg-[#15140f] text-[#fffdf8] px-4 py-2 rounded-full font-medium cursor-pointer hover:bg-[#1e1c15]"
                      >
                        Apply
                      </button>
                    </div>
                    {voucherMessage && (
                      <span className="text-[10px] font-mono block text-[#454e3d]">
                        {voucherMessage}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[rgba(21,20,15,0.08)] font-mono">
                    <div className="flex justify-between text-[rgba(21,20,15,0.65)]">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-[#454e3d]">
                        <span>Discount ({appliedDiscount}%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[rgba(21,20,15,0.65)]">
                      <span>Locker Delivery</span>
                      <span>
                        {shippingCost === 0
                          ? "FREE"
                          : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-normal font-serif text-[#15140f] pt-2 border-t border-[rgba(21,20,15,0.1)]">
                      <span>Total Due</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false)
                      setIsCheckoutModalOpen(true)
                    }}
                    className="w-full bg-[#15140f] text-[#fffdf8] py-3.5 rounded-full font-medium hover:bg-[#1e1c15] transition-all hover:-translate-y-0.5 cursor-pointer shadow-xs"
                  >
                    Proceed to Secure Checkout →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 10. SLIDE-OUT WISHLIST DRAWER */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-[#15140f]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsWishlistOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#fffdf8] shadow-2xl flex flex-col justify-between border-l border-[rgba(21,20,15,0.12)]">
              <div className="p-6 border-b border-[rgba(21,20,15,0.1)] flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-normal font-serif text-[#15140f]">
                    Saved Items ({wishlist.length})
                  </h3>
                  <span className="text-xs text-[rgba(21,20,15,0.6)]">
                    Your curated wishlist
                  </span>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-2 text-[rgba(21,20,15,0.5)] hover:text-[#15140f] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <span className="text-3xl">🤍</span>
                    <h4 className="font-normal font-serif text-lg text-[#15140f]">
                      No saved items yet
                    </h4>
                    <p className="text-xs text-[rgba(21,20,15,0.6)]">
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
                        className="flex gap-3.5 pb-4 border-b border-[rgba(21,20,15,0.08)] items-center"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-20 object-cover bg-[#efeee3] rounded-xl shrink-0 border border-[rgba(21,20,15,0.08)]"
                        />
                        <div className="flex-1">
                          <span className="text-[10px] font-semibold text-[#a64b34] uppercase font-mono">
                            {product.brand}
                          </span>
                          <h4 className="text-xs font-medium text-[#15140f] line-clamp-1 mt-0.5">
                            {product.title}
                          </h4>
                          <span className="text-xs font-semibold font-serif text-[#15140f] block mt-1">
                            {formatPrice(product.price)}
                          </span>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                addToCart(product, product.sizes[0])
                                toggleWishlist(product.id)
                              }}
                              className="bg-[#15140f] hover:bg-[#1e1c15] text-[#fffdf8] text-[10px] font-medium px-3.5 py-1 rounded-full transition-all hover:-translate-y-0.5"
                            >
                              + Move to Bag
                            </button>
                            <button
                              onClick={() => toggleWishlist(product.id)}
                              className="text-[10px] text-[#a64b34] font-medium hover:underline cursor-pointer"
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

      {/* 11. ORDER TRACKING MODAL */}
      {isTrackingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15140f]/60 backdrop-blur-xs">
          <div className="bg-[#fffdf8] max-w-md w-full rounded-2xl shadow-2xl p-6 sm:p-8 relative border border-[rgba(21,20,15,0.12)]">
            <button
              onClick={() => {
                setIsTrackingModalOpen(false)
                setTrackingResult(null)
              }}
              className="absolute top-5 right-5 text-[rgba(21,20,15,0.5)] hover:text-[#15140f] cursor-pointer"
            >
              ✕
            </button>

            <div className="eyebrow" style={{ color: "var(--clay)" }}>
              Bob Go Courier Aggregator
            </div>
            <h3 className="text-2xl font-normal font-serif text-[#15140f] mt-1">
              Track Your Locker Delivery
            </h3>
            <p className="text-xs text-[rgba(21,20,15,0.65)] mt-1.5">
              Enter your Bob Go waybill number or mobile number to track
              dispatch status.
            </p>

            {/* Dummy Customer Account for Sandbox Testing */}
            <div className="mt-4 p-3.5 bg-[#efeee3] rounded-xl border border-[rgba(21,20,15,0.1)] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5c6851] animate-pulse" />
                  <span className="font-bold text-[#15140f]">
                    Test Customer: Lerato Khumalo
                  </span>
                </div>
                <span className="text-[9.5px] font-semibold bg-[#d6a34c]/20 text-[#15140f] px-2 py-0.5 rounded-full">
                  Dummy Account
                </span>
              </div>
              <div className="text-[11px] text-[rgba(21,20,15,0.65)] font-mono">
                lerato.test@rooted.co.za · 082 555 4321
              </div>
              <div className="pt-1.5 border-t border-[rgba(21,20,15,0.08)] flex items-center gap-2 flex-wrap text-[10.5px] font-mono">
                <span className="text-[9.5px] text-[rgba(21,20,15,0.5)] uppercase">
                  Quick-test:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTrackingInput("BOB-GO-849201")
                    setTrackingResult({
                      waybill: "BOB-GO-849201",
                      destination: "PUDO Locker Menlyn Maine (012)",
                      eta: "Today by 16:30",
                      pin: "9482",
                    })
                  }}
                  className="px-2 py-1 bg-[#fffdf8] hover:bg-[#15140f] hover:text-[#fffdf8] rounded border border-[rgba(21,20,15,0.15)] transition-colors cursor-pointer text-[10px] font-semibold"
                >
                  #BOB-GO-849201 (In-Transit)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrackingInput("BOB-GO-720194")
                    setTrackingResult({
                      waybill: "BOB-GO-720194",
                      destination: "PUDO Locker Rosebank Mall (011)",
                      eta: "Delivered (Ready for pickup)",
                      pin: "3109",
                    })
                  }}
                  className="px-2 py-1 bg-[#fffdf8] hover:bg-[#15140f] hover:text-[#fffdf8] rounded border border-[rgba(21,20,15,0.15)] transition-colors cursor-pointer text-[10px] font-semibold"
                >
                  #BOB-GO-720194 (Delivered)
                </button>
              </div>
            </div>

            <form onSubmit={handleTrackOrder} className="mt-5 flex gap-2">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="e.g. BOB-GO-849201 or 082..."
                className="bg-[#efeee3] border border-[rgba(21,20,15,0.12)] rounded-full px-4 py-2.5 text-xs flex-1 font-mono text-[#15140f] focus:outline-none focus:border-[#15140f]"
              />
              <button
                type="submit"
                className="bg-[#15140f] hover:bg-[#1e1c15] text-[#fffdf8] px-5 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all hover:-translate-y-0.5"
              >
                Track
              </button>
            </form>

            {trackingResult && (
              <div className="mt-5 p-4 bg-[#efeee3] rounded-xl border border-[rgba(21,20,15,0.08)] space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-[rgba(21,20,15,0.08)] pb-2 font-mono">
                  <span className="font-bold text-[#15140f]">
                    {trackingResult.waybill}
                  </span>
                  <span className="text-[#454e3d] font-semibold bg-[#454e3d]/15 px-2.5 py-0.5 rounded-full text-[10px]">
                    Active In-Transit
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[rgba(21,20,15,0.6)] block font-mono">
                    Destination Hub:
                  </span>
                  <span className="font-medium text-[#15140f] font-serif text-sm">
                    {trackingResult.destination}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[rgba(21,20,15,0.6)] block font-mono">
                    Estimated Arrival:
                  </span>
                  <span className="font-medium text-[#15140f]">
                    {trackingResult.eta}
                  </span>
                </div>
                <div className="bg-[#fffdf8] p-3 rounded-lg border border-[rgba(21,20,15,0.1)] font-mono text-[11px] text-[#a64b34]">
                  Locker PIN Code:{" "}
                  <span className="font-bold text-[#15140f]">
                    {trackingResult.pin}
                  </span>{" "}
                  (Sent via WhatsApp)
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 12. LOCKER PICKER MODAL */}
      {isLockerPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15140f]/60 backdrop-blur-xs">
          <div className="bg-[#fffdf8] max-w-xl w-full rounded-3xl shadow-2xl p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto border border-[rgba(21,20,15,0.12)]">
            <button
              onClick={() => setIsLockerPickerOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#efeee3] hover:bg-[#e6e3d3] text-[rgba(21,20,15,0.6)] hover:text-[#15140f] flex items-center justify-center text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>
            <div className="eyebrow" style={{ color: "var(--clay)" }}>
              1,400+ Smart Lockers & Spaza Hubs
            </div>
            <h3 className="text-2xl font-normal font-serif text-[#15140f] mt-1">
              Select Your Preferred Pickup Hub
            </h3>
            <p className="text-xs text-[rgba(21,20,15,0.65)] mt-1.5">
              Select a secure pickup point along your transit, campus, or
              residential route.
            </p>

            <div className="mt-6 space-y-3">
              {lockerStations.map((station) => (
                <div
                  key={station.id}
                  onClick={() => {
                    setSelectedStation(station)
                    setIsLockerPickerOpen(false)
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedStation.id === station.id
                      ? "border-[#15140f] bg-[#efeee3] shadow-xs ring-1 ring-[#15140f]"
                      : "border-[rgba(21,20,15,0.12)] hover:border-[#15140f] bg-[#fffdf8]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#a64b34] font-mono uppercase tracking-wider text-[10px]">
                      {station.city}
                    </span>
                    <span className="text-[rgba(21,20,15,0.6)] font-mono text-[11px]">
                      {station.distance}
                    </span>
                  </div>
                  <h4 className="font-normal font-serif text-base text-[#15140f] mt-1">
                    {station.name}
                  </h4>
                  <p className="text-xs text-[rgba(21,20,15,0.65)] mt-0.5">
                    {station.address}
                  </p>
                  <div className="mt-2.5 text-xs text-[#15140f] bg-[#fffdf8] p-2 rounded-xl border border-[rgba(21,20,15,0.08)] font-mono">
                    {station.commuterTag}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 13. VENDOR ONBOARDING MODAL ("SELL WITH US") */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15140f]/60 backdrop-blur-xs">
          <div className="bg-[#fffdf8] max-w-lg w-full rounded-2xl shadow-2xl p-6 sm:p-8 relative border border-[rgba(21,20,15,0.12)]">
            <button
              onClick={() => setIsVendorModalOpen(false)}
              className="absolute top-5 right-5 text-[rgba(21,20,15,0.5)] hover:text-[#15140f] cursor-pointer"
            >
              ✕
            </button>
            <div className="eyebrow" style={{ color: "var(--clay)" }}>
              Multi-Vendor Marketplace Curation
            </div>
            <h3 className="text-2xl font-normal font-serif text-[#15140f] mt-1">
              List Your Label on ROOTED
            </h3>
            <p className="text-xs text-[rgba(21,20,15,0.65)] mt-1 leading-relaxed">
              Join Lesupa Atelier, Mokasi, and Soweto Threads. 13% commission
              model, zero upfront listing fees, professional lookbook support,
              and weekly automated payouts.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert(
                  "Thank you! Your brand application has been received. Our curator team will review your catalogue within 24 hours.",
                )
                setIsVendorModalOpen(false)
              }}
              className="mt-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-[#15140f] font-semibold uppercase text-[10px] mb-1 font-mono">
                  Brand Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Pretoria Heavy Co."
                  className="w-full bg-[#efeee3] border border-[rgba(21,20,15,0.15)] rounded-xl p-3 focus:outline-none focus:border-[#15140f]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#15140f] font-semibold uppercase text-[10px] mb-1 font-mono">
                    City / Township *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Pretoria (012), Soweto"
                    className="w-full bg-[#efeee3] border border-[rgba(21,20,15,0.15)] rounded-xl p-3 focus:outline-none focus:border-[#15140f]"
                  />
                </div>
                <div>
                  <label className="block text-[#15140f] font-semibold uppercase text-[10px] mb-1 font-mono">
                    Instagram Handle *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="@yourbrand"
                    className="w-full bg-[#efeee3] border border-[rgba(21,20,15,0.15)] rounded-xl p-3 focus:outline-none focus:border-[#15140f]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#15140f] font-semibold uppercase text-[10px] mb-1 font-mono">
                  Founder WhatsApp Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+27 82 000 0000"
                  className="w-full bg-[#efeee3] border border-[rgba(21,20,15,0.15)] rounded-xl p-3 focus:outline-none focus:border-[#15140f]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#15140f] hover:bg-[#1e1c15] text-[#fffdf8] py-3.5 rounded-full font-medium transition-all hover:-translate-y-0.5 mt-2 cursor-pointer"
              >
                Submit Brand for Curation Review →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 14. QUICK VIEW PRODUCT MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15140f]/60 backdrop-blur-xs">
          <div className="bg-[#fffdf8] max-w-2xl w-full rounded-2xl shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto border border-[rgba(21,20,15,0.12)]">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 text-[rgba(21,20,15,0.5)] hover:text-[#15140f] cursor-pointer"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.title}
                  className="w-full aspect-3/4 object-cover rounded-2xl bg-[#efeee3] border border-[rgba(21,20,15,0.08)]"
                />
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <a
                    href={`#/brand/${quickViewProduct.brandSlug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="text-xs font-semibold text-[#a64b34] uppercase font-mono hover:underline block"
                  >
                    {quickViewProduct.brand} · {quickViewProduct.origin} →
                  </a>
                  <h3 className="text-2xl font-normal font-serif text-[#15140f] mt-1">
                    {quickViewProduct.title}
                  </h3>
                  <div className="text-2xl font-normal font-serif text-[#15140f] mt-2">
                    {formatPrice(quickViewProduct.price)}
                  </div>
                  <p className="text-xs text-[rgba(21,20,15,0.7)] mt-3 leading-relaxed">
                    {quickViewProduct.description}
                  </p>
                  <div className="mt-4 p-3.5 bg-[#efeee3] rounded-xl text-xs font-mono space-y-1 border border-[rgba(21,20,15,0.08)]">
                    <div>
                      <span className="font-semibold text-[#15140f]">
                        Fabric:
                      </span>{" "}
                      {quickViewProduct.fabric}
                    </div>
                    {quickViewProduct.measurements && (
                      <div>
                        <span className="font-semibold text-[#a64b34]">
                          Measurements:
                        </span>{" "}
                        {quickViewProduct.measurements}
                      </div>
                    )}
                    {quickViewProduct.condition && (
                      <div>
                        <span className="font-semibold text-[#15140f]">
                          Condition:
                        </span>{" "}
                        {quickViewProduct.condition}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[rgba(21,20,15,0.08)]">
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
                        <div className="text-center bg-red-50 text-red-700 font-mono font-semibold py-2.5 rounded-xl text-xs">
                          SOLD OUT — Currently unavailable from{" "}
                          {quickViewProduct.brand}
                        </div>
                      )
                    }
                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-[rgba(21,20,15,0.65)] font-mono">
                            Select Size:
                          </span>
                          {totalStock <= 4 && (
                            <span className="text-[10px] font-mono font-semibold text-[#d6a34c] bg-[#d6a34c]/15 px-2.5 py-0.5 rounded-full">
                              Low Stock ({totalStock} left)
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
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
                                className={`px-4 py-2 rounded-full text-xs font-mono font-medium transition-all ${
                                  isSizeOut
                                    ? "bg-[#e6e3d3] text-[rgba(21,20,15,0.3)] cursor-not-allowed line-through"
                                    : "bg-[#efeee3] border border-[rgba(21,20,15,0.15)] hover:bg-[#15140f] hover:text-[#fffdf8] text-[#15140f]"
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

      {/* 15. CHECKOUT MODAL */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15140f]/60 backdrop-blur-xs">
          <div className="bg-[#fffdf8] max-w-md w-full rounded-2xl shadow-2xl p-6 sm:p-8 relative border border-[rgba(21,20,15,0.12)]">
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute top-5 right-5 text-[rgba(21,20,15,0.5)] hover:text-[#15140f] cursor-pointer"
            >
              ✕
            </button>
            <div className="eyebrow" style={{ color: "var(--clay)" }}>
              Secure South African Checkout
            </div>
            <h3 className="text-2xl font-normal font-serif text-[#15140f] mt-1">
              Payment Method
            </h3>
            <p className="text-xs text-[rgba(21,20,15,0.65)] mt-1">
              Order Total:{" "}
              <span className="font-bold text-[#15140f]">
                {formatPrice(total)}
              </span>{" "}
              · Dispatched to{" "}
              <span className="text-[#a64b34] font-medium">
                {selectedStation.name}
              </span>
            </p>

            {/* Dummy Customer Test Autofill */}
            <div className="mt-4 p-3 bg-[#efeee3] rounded-xl border border-[rgba(21,20,15,0.08)] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-sm">🧪</span>
                <span className="text-[#15140f] text-[11px]">
                  Testing order? <b>Lerato Khumalo</b> (Menlyn Maine)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setBuyerName("Lerato Khumalo")
                  setBuyerPhone("+27 82 555 4321")
                  showToast("Autofilled customer details for quick test.")
                }}
                className="px-2.5 py-1 bg-[#15140f] hover:bg-[#2b291f] text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
              >
                1-Click Autofill
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[rgba(21,20,15,0.6)] mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Lerato Khumalo"
                  className="w-full bg-[#efeee3] border border-[rgba(21,20,15,0.15)] rounded-xl p-2.5 text-xs font-medium text-[#15140f] focus:outline-none focus:border-[#15140f]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-[rgba(21,20,15,0.6)] mb-1">
                  Mobile Number (For Bob Go Locker PIN)
                </label>
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+27 82 123 4567"
                  className="w-full bg-[#efeee3] border border-[rgba(21,20,15,0.15)] rounded-xl p-2.5 text-xs font-mono text-[#15140f] focus:outline-none focus:border-[#15140f]"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="p-3.5 border border-[#15140f] rounded-2xl flex items-center justify-between cursor-pointer bg-[#efeee3]">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[#15140f] bg-[#15140f]"></span>
                  <div>
                    <span className="font-semibold block text-[#15140f]">
                      Capitec 1-Tap Pay
                    </span>
                    <span className="text-[10px] text-[rgba(21,20,15,0.6)]">
                      Instant QR code scan via Capitec App
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold bg-[#15140f] text-[#fffdf8] px-2.5 py-0.5 rounded-full">
                  INSTANT
                </span>
              </div>

              <div className="p-3.5 border border-[rgba(21,20,15,0.12)] hover:border-[#15140f] rounded-2xl flex items-center justify-between cursor-pointer bg-[#fffdf8] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[rgba(21,20,15,0.3)]"></span>
                  <div>
                    <span className="font-semibold block text-[#15140f]">
                      Payflex (Pay in 4)
                    </span>
                    <span className="text-[10px] text-[rgba(21,20,15,0.6)]">
                      4 interest-free installments of {formatPrice(Math.round(total / 4))}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold bg-[#d6a34c] text-[#15140f] px-2.5 py-0.5 rounded-full">
                  0% INT
                </span>
              </div>

              <div className="p-3.5 border border-[rgba(21,20,15,0.12)] hover:border-[#15140f] rounded-2xl flex items-center justify-between cursor-pointer bg-[#fffdf8] transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[rgba(21,20,15,0.3)]"></span>
                  <div>
                    <span className="font-semibold block text-[#15140f]">
                      Ozow Instant EFT
                    </span>
                    <span className="text-[10px] text-[rgba(21,20,15,0.6)]">
                      Capitec, FNB, Standard Bank, Nedbank
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[rgba(21,20,15,0.6)]">
                  ZERO FEES
                </span>
              </div>

              <button
                disabled={isCheckingOut}
                onClick={async () => {
                  if (cart.length === 0) return
                  setIsCheckingOut(true)
                  try {
                    const orderItems: OrderItem[] = cart.map((c) => ({
                      productId: c.product.id,
                      productTitle: c.product.title,
                      size: c.size,
                      quantity: c.quantity,
                      price: c.product.price,
                      image: c.product.image,
                    }))

                    const primaryBrand = cart[0]?.product.brandSlug || "lesupa-atelier"
                    const res = await marketplaceService.createOrder({
                      customerName: buyerName.trim() || "Customer",
                      customerCity: selectedStation.city,
                      customerPhone: buyerPhone.trim(),
                      lockerStation: selectedStation.name,
                      items: orderItems,
                      totalAmount: total,
                      brandSlug: primaryBrand,
                    })

                    if (res.success) {
                      const pin = Math.floor(100000 + Math.random() * 900000)
                      alert(
                        `Order Confirmed & Synced to Cloud DB!\n\nOrder Number: ${res.orderNumber}\nWaybill: ${res.waybillNumber}\nPickup Destination: ${selectedStation.name}\nSmart Locker PIN: ${pin}\n\nThank you for supporting independent South African streetwear labels.`
                      )
                      setCart([])
                      setIsCheckoutModalOpen(false)
                      showToast(`Order ${res.orderNumber} successfully processed!`)
                    } else {
                      alert(`Order error: ${res.error || "Please try again."}`)
                    }
                  } catch (err: any) {
                    alert(`Checkout error: ${err.message}`)
                  } finally {
                    setIsCheckingOut(false)
                  }
                }}
                className="w-full bg-[#15140f] hover:bg-[#1e1c15] text-[#fffdf8] py-3.5 rounded-full font-medium transition-all hover:-translate-y-0.5 mt-3 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isCheckingOut ? "Processing Transaction..." : `Confirm & Pay ${formatPrice(total)} →`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROOTED REVISED FLOATING TOAST NOTIFICATION */}
      <div className={`toast ${toastMessage ? "show" : ""}`}>
        {toastMessage}
      </div>
    </div>
  )
}
