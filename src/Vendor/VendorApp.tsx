import React, { useState, useMemo } from "react"
import { Vendor, Product, VendorOrder } from "../types"
import {
  vendors as defaultVendors,
  products as defaultProducts,
  initialVendorOrders,
} from "../data/marketplaceData"
import AtelierLoginPage from "./AtelierLoginPage"

interface DummyAccount {
  id: string
  founderName: string
  email: string
  brandSlug: string
  brandName: string
  role: string
  tier: string
  status: string
  city: string
  phone: string
  passkey: string
  isTestMode: boolean
}

const DEFAULT_DUMMY_ACCOUNT: DummyAccount = {
  id: "test-user-012",
  founderName: "Thabo M.",
  email: "tester@urbansoul.co.za",
  brandSlug: "urban-soul",
  brandName: "Urban Soul",
  role: "Founder & Creative Director",
  tier: "Partner Atelier (Sandbox Test Mode)",
  status: "Active Testing Sandbox",
  city: "Pretoria (012), Gauteng",
  phone: "+27 82 555 0123",
  passkey: "test-pass-2026",
  isTestMode: true,
}

interface OrderRecord {
  id: string
  customer: string
  item: string
  amount: string
  date: string
  status: "processing" | "shipped" | "delivered"
  tracking?: string
}

interface ProductItem {
  id: string
  name: string
  price: number
  sold: number
  stock: number
  maxStock: number
  pattern: string
  category: string
  isBest: boolean
  isLow: boolean
}

const INITIAL_TEST_ORDERS: OrderRecord[] = [
  {
    id: "#10482",
    customer: "L. Mokoena",
    item: "420 GSM Oversized Hoodie (M)",
    amount: "R699",
    date: "12 Sep",
    status: "shipped",
    tracking: "BOB-GO-981023",
  },
  {
    id: "#10481",
    customer: "S. Naidoo",
    item: "Heavyweight Twill Cargo Pant (L)",
    amount: "R849",
    date: "12 Sep",
    status: "processing",
    tracking: "",
  },
  {
    id: "#10480",
    customer: "K. van Wyk",
    item: "Boxy Capital Heritage Tee (M)",
    amount: "R449",
    date: "11 Sep",
    status: "delivered",
    tracking: "BOB-GO-849102",
  },
  {
    id: "#10479",
    customer: "T. Dlamini",
    item: "012 Embroidered Graphic Cap",
    amount: "R320",
    date: "11 Sep",
    status: "shipped",
    tracking: "BOB-GO-762910",
  },
  {
    id: "#10478",
    customer: "A. Botha",
    item: "420 GSM Oversized Hoodie (L)",
    amount: "R699",
    date: "10 Sep",
    status: "delivered",
    tracking: "BOB-GO-651294",
  },
  {
    id: "#10477",
    customer: "P. Sithole",
    item: "Heavyweight Twill Cargo Pant (M)",
    amount: "R849",
    date: "10 Sep",
    status: "delivered",
    tracking: "BOB-GO-541920",
  },
  {
    id: "#10476",
    customer: "N. Adams",
    item: "Boxy Capital Heritage Tee (S)",
    amount: "R449",
    date: "9 Sep",
    status: "processing",
    tracking: "",
  },
]

const INITIAL_TEST_PRODUCTS: ProductItem[] = [
  {
    id: "p1",
    name: "420 GSM Oversized Hoodie",
    price: 699,
    sold: 92,
    stock: 28,
    maxStock: 40,
    pattern:
      "repeating-linear-gradient(125deg,#454e3d,#454e3d 9px,#3a4232 9px,#3a4232 18px)",
    category: "hoodies",
    isBest: true,
    isLow: false,
  },
  {
    id: "p2",
    name: "Heavyweight Twill Cargo Pant",
    price: 849,
    sold: 68,
    stock: 19,
    maxStock: 35,
    pattern:
      "repeating-linear-gradient(35deg,#a64b34,#a64b34 9px,#8f3e2b 9px,#8f3e2b 18px)",
    category: "pants",
    isBest: true,
    isLow: false,
  },
  {
    id: "p3",
    name: "012 Embroidered Graphic Cap",
    price: 320,
    sold: 14,
    stock: 4,
    maxStock: 30,
    pattern: "radial-gradient(circle at 65% 25%,#e9c079,#d6a34c 65%)",
    category: "accessories",
    isBest: false,
    isLow: true,
  },
  {
    id: "p4",
    name: "Boxy Capital Heritage Tee",
    price: 449,
    sold: 44,
    stock: 22,
    maxStock: 40,
    pattern: "linear-gradient(155deg,#1e1c15,#5c6851)",
    category: "tees",
    isBest: true,
    isLow: false,
  },
]

type PageTab = "overview" | "orders" | "products" | "analytics" | "insights" | "reports" | "marketing" | "brandpage" | "payouts" | "settings"

const pageTitles: Record<PageTab, [string, string]> = {
  overview: [
    "Overview",
    "Welcome back, Thabo — here's how Urban Soul is doing.",
  ],
  orders: ["Orders", "Every order placed through your ROOTED storefront."],
  products: ["Products", "What's currently listed and selling."],
  analytics: ["Analytics", "Deeper numbers behind your sales."],
  insights: ["Insights", "Data turned into plain-language recommendations."],
  reports: [
    "Monthly reports",
    "A summary delivered every month, ready to act on.",
  ],
  marketing: ["Marketing", "Tools to help more customers discover Urban Soul."],
  brandpage: ["Brand page", "How customers see Urban Soul on ROOTED."],
  payouts: ["Payouts", "Commission, statements, and what's coming to you."],
  settings: ["Settings", "Brand profile, notifications and your plan."],
}

export default function VendorApp() {
  const [activePage, setActivePage] = useState<PageTab>("overview")
  const [overviewPeriod, setOverviewPeriod] = useState<string>("Last 6 months")
  const [analyticsPeriod, setAnalyticsPeriod] =
    useState<string>("Last 6 months")
  const [orderFilter, setOrderFilter] = useState<string>("all")
  const [productFilter, setProductFilter] = useState<string>("all")
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isListingModalOpen, setIsListingModalOpen] = useState<boolean>(false)
  const [isTenantSecurityModalOpen, setIsTenantSecurityModalOpen] =
    useState<boolean>(false)
  const [isDiscreetMode, setIsDiscreetMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    return (
      localStorage.getItem("rooted_privacy_shield") === "true" ||
      localStorage.getItem("lebenkeleng_privacy_shield") === "true"
    )
  })

  // Insights interactive toggles
  const [actionedInsights, setActionedInsights] =
    useState<Record<string, boolean>>({
      "rev-conc": false,
      "cat-growth": false,
      "views-purch": false,
      "basket-pat": true,
    })

  // Notifications settings toggles
  const [notificationToggles, setNotificationToggles] =
    useState<Record<string, boolean>>({
      newOrder: true,
      lowStock: true,
      monthlyReport: true,
      newFollower: false,
      marketingOpp: true,
    })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Active brand strictly tied to authenticated tenant (Strict Tenant Isolation)
  // ============ DUMMY ACCOUNT & SANDBOX STATE ============
  // Initial state is null by default so the Atelier Landing Page is GUARANTEED to be the FIRST page seen
  const [currentUser, setCurrentUser] = useState<DummyAccount | null>(() => {
    if (typeof window === "undefined") return null
    const hash = window.location.hash.toLowerCase()
    // Only restore session if user explicitly navigated to a dashboard subroute
    if (hash.includes("dashboard")) {
      const saved =
        sessionStorage.getItem("rooted_vendor_dummy_account") ||
        sessionStorage.getItem("lebenkeleng_vendor_dummy_account")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {}
      }
    }
    return null
  })

  // Synchronize hash routing with landing page / dashboard view
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash.toLowerCase()
      if (
        hash === "#/vendor" ||
        hash === "#/vendor/" ||
        hash === "#vendor" ||
        hash === "#/vendor-portal" ||
        !hash.includes("dashboard")
      ) {
        // Navigating to vendor entry point -> show landing page
        setCurrentUser(null)
      } else if (hash.includes("dashboard")) {
        const saved =
          sessionStorage.getItem("rooted_vendor_dummy_account") ||
          sessionStorage.getItem("lebenkeleng_vendor_dummy_account")
        if (saved) {
          try {
            setCurrentUser(JSON.parse(saved))
          } catch (e) {}
        }
      }
    }

    window.addEventListener("hashchange", handleHashSync)
    return () => window.removeEventListener("hashchange", handleHashSync)
  }, [])

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>("tester@urbansoul.co.za")
  const [loginPasskey, setLoginPasskey] = useState<string>("test-pass-2026")
  const [loginError, setLoginError] = useState<string | null>(null)

  // Dynamic sandbox orders & products
  const [ordersList, setOrdersList] =
    useState<OrderRecord[]>(INITIAL_TEST_ORDERS)
  const [productsList, setProductsList] = useState<ProductItem[]>(
    INITIAL_TEST_PRODUCTS,
  )

  // New product form inputs
  const [newProdName, setNewProdName] = useState<string>("")
  const [newProdPrice, setNewProdPrice] = useState<string>("")
  const [newProdStock, setNewProdStock] = useState<string>("")
  const [newProdFab, setNewProdFab] = useState<string>("")

  const handleSignInWithDummy = (customAccount?: Partial<DummyAccount>) => {
    const acc = { ...DEFAULT_DUMMY_ACCOUNT, ...customAccount }
    setCurrentUser(acc)
    sessionStorage.setItem("rooted_vendor_dummy_account", JSON.stringify(acc))
    window.location.hash = "#/vendor/dashboard"
    setLoginError(null)
    showToast(`Signed in as ${acc.founderName} (${acc.brandName} Test Account)`)
  }

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail.trim()) {
      setLoginError("Please enter your brand email or passkey.")
      return
    }
    const matchedVendor = defaultVendors.find(
      (v) =>
        v.slug.toLowerCase() === loginEmail.toLowerCase().trim() ||
        loginEmail.toLowerCase().includes(v.slug.toLowerCase()) ||
        v.name.toLowerCase().includes(loginEmail.toLowerCase().trim()),
    )
    if (matchedVendor) {
      handleSignInWithDummy({
        brandSlug: matchedVendor.slug,
        brandName: matchedVendor.name,
        founderName: `${matchedVendor.name} Founder`,
        email: loginEmail.trim(),
        city: matchedVendor.origin,
      })
    } else {
      handleSignInWithDummy({
        email: loginEmail.trim(),
      })
    }
  }

  const handleSignOut = () => {
    sessionStorage.removeItem("rooted_vendor_dummy_account")
    sessionStorage.removeItem("lebenkeleng_vendor_dummy_account")
    setCurrentUser(null)
    window.location.hash = "#/vendor"
    showToast("Signed out of Atelier Studio.")
  }

  const handleResetSandboxData = () => {
    setOrdersList(INITIAL_TEST_ORDERS)
    setProductsList(INITIAL_TEST_PRODUCTS)
    setActionedInsights({
      "rev-conc": false,
      "cat-growth": false,
      "views-purch": false,
      "basket-pat": true,
    })
    setNotificationToggles({
      newOrder: true,
      lowStock: true,
      monthlyReport: true,
      newFollower: false,
      marketingOpp: true,
    })
    showToast(
      "All sandbox test data (orders, stock, metrics) reset to defaults!",
    )
  }

  const handleAdvanceOrderStatus = (orderId: string) => {
    setOrdersList((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          if (o.status === "processing") {
            const newWaybill = `BOB-GO-${Math.floor(100000 + Math.random() * 900000)}`
            showToast(
              `Order ${o.id} dispatched! Waybill ${newWaybill} generated for Bob Go pickup.`,
            )
            return { ...o, status: "shipped", tracking: newWaybill }
          }
          if (o.status === "shipped") {
            showToast(
              `Order ${o.id} confirmed delivered to customer smart locker!`,
            )
            return { ...o, status: "delivered" }
          }
        }
        return o
      }),
    )
  }

  const handleSimulateNewOrder = () => {
    const nextId = `#${Math.floor(10483 + Math.random() * 80)}`
    const sampleCustomers = [
      "Z. Mthembu",
      "D. Khumalo",
      "E. Pretorius",
      "B. Ndlovu",
      "J. Pillay",
      "K. Sithole",
    ]
    const sampleItems = [
      { item: "420 GSM Oversized Hoodie (L)", amount: "R699" },
      { item: "Heavyweight Twill Cargo Pant (32)", amount: "R849" },
      { item: "Boxy Capital Heritage Tee (M)", amount: "R449" },
      { item: "012 Embroidered Graphic Cap", amount: "R320" },
    ]
    const chosenCust =
      sampleCustomers[Math.floor(Math.random() * sampleCustomers.length)]
    const chosenProd =
      sampleItems[Math.floor(Math.random() * sampleItems.length)]

    const newOrder: OrderRecord = {
      id: nextId,
      customer: chosenCust,
      item: chosenProd.item,
      amount: chosenProd.amount,
      date: "Just now",
      status: "processing",
      tracking: "",
    }

    setOrdersList((prev) => [newOrder, ...prev])
    showToast(
      `Simulated test order ${nextId} received from ${chosenCust} (${chosenProd.amount})!`,
    )
  }

  const handleStockChange = (productId: string, delta: number) => {
    setProductsList((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStock = Math.max(0, p.stock + delta)
          const isLow = nextStock <= 5
          showToast(`Updated ${p.name} stock: ${nextStock} units`)
          return { ...p, stock: nextStock, isLow }
        }
        return p
      }),
    )
  }

  const handleAddNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProdName.trim()) return

    const newPrice = Number(newProdPrice) || 650
    const newStock = Number(newProdStock) || 25
    const newId = `p${Date.now()}`

    const newProduct: ProductItem = {
      id: newId,
      name: newProdName.trim(),
      price: newPrice,
      sold: 0,
      stock: newStock,
      maxStock: Math.max(newStock, 30),
      pattern: "linear-gradient(135deg, #454e3d, #d6a34c)",
      category: "streetwear",
      isBest: false,
      isLow: newStock <= 5,
    }

    setProductsList((prev) => [newProduct, ...prev])
    setIsListingModalOpen(false)
    setNewProdName("")
    setNewProdPrice("")
    setNewProdStock("")
    setNewProdFab("")
    showToast(
      `"${newProduct.name}" added to your test catalog with ${newStock} units!`,
    )
  }

  const currentBrand = useMemo(() => {
    const slug = currentUser?.brandSlug || "urban-soul"
    return defaultVendors.find((v) => v.slug === slug) || defaultVendors[0]
  }, [currentUser?.brandSlug])

  const maskFinancial = (val: string) => {
    if (!isDiscreetMode) return val
    return val.startsWith("R") ? "R••••••" : val
  }

  // Overview dynamic period data
  const periodData: Record<string, {
    stats: [string, string, string][]
    chart: number[]
    label: string
    growth: string
  }> = {
    "This week": {
      stats: [
        ["Revenue", "R11,240", "+6.1%"],
        ["Orders", "29", "+3"],
        ["Units sold", "54", "+8"],
        ["Growth", "+6.1%", "vs last week"],
      ],
      chart: [5, 6, 5, 7, 8, 9, 8, 11],
      label: "— last 8 days",
      growth: "+6.1%",
    },
    "This month": {
      stats: [
        ["Revenue this month", "R48,750", "+18.4%"],
        ["Orders", "127", "+9 vs last mo."],
        ["Products sold", "243", "+31 units"],
        ["Growth", "+18.4%", "vs last month"],
      ],
      chart: [22, 26, 24, 31, 29, 36, 34, 41],
      label: "— last 8 weeks",
      growth: "+18.4%",
    },
    "Last 6 months": {
      stats: [
        ["Revenue — 6 months", "R214,750", "+26.3%"],
        ["Orders", "560", "+118 vs prior 6mo"],
        ["Products sold", "1,120", "+240 units"],
        ["Growth", "+26.3%", "vs prior 6 months"],
      ],
      chart: [26, 29, 33, 37, 41.2, 48.75],
      label: "— last 6 months",
      growth: "+26.3%",
    },
    "This year": {
      stats: [
        ["Revenue — YTD", "R512,900", "+34.6%"],
        ["Orders", "1,284", "+240 vs 2025"],
        ["Products sold", "2,610", "+410 units"],
        ["Growth", "+34.6%", "vs 2025"],
      ],
      chart: [12, 15, 17, 19, 22, 26, 30, 36],
      label: "— monthly, last 8 months",
      growth: "+34.6%",
    },
  }

  // Analytics dynamic period data
  const analyticsData: Record<string, {
    stats: [string, string, string][]
    trend: number[]
  }> = {
    Weekly: {
      stats: [
        ["Revenue", "R11,240", "+6.1%"],
        ["Orders", "29", "+3"],
        ["Units sold", "54", "+8"],
        ["Avg. order value", "R388", "+R9"],
      ],
      trend: [5, 6, 5, 7, 8, 9, 8, 11],
    },
    Monthly: {
      stats: [
        ["Revenue", "R48,750", "+18.4%"],
        ["Orders", "127", "+9"],
        ["Units sold", "243", "+31"],
        ["Avg. order value", "R384", "+R22"],
      ],
      trend: [22, 26, 24, 31, 29, 36, 34, 41],
    },
    "Last 6 months": {
      stats: [
        ["Revenue", "R214,750", "+26.3%"],
        ["Orders", "560", "+118"],
        ["Units sold", "1,120", "+240"],
        ["Avg. order value", "R391", "+R28"],
      ],
      trend: [26, 29, 33, 37, 41.2, 48.75],
    },
    Yearly: {
      stats: [
        ["Revenue", "R512,900", "+34.6%"],
        ["Orders", "1,284", "+240"],
        ["Units sold", "2,610", "+410"],
        ["Avg. order value", "R399", "+R31"],
      ],
      trend: [12, 15, 17, 19, 22, 26, 30, 36],
    },
  }

  const bestSellers = [
    { name: "Oversized Hoodie", sold: 92, pct: 92, slow: false },
    { name: "Cargo Pant", sold: 68, pct: 68, slow: false },
    { name: "Boxy Tee", sold: 44, pct: 44, slow: false },
    { name: "Graphic Cap", sold: 14, pct: 14, slow: true },
  ]

  const filteredOrders = useMemo(() => {
    if (orderFilter === "all") return ordersList
    return ordersList.filter((o) => o.status === orderFilter)
  }, [orderFilter, ordersList])

  // SVG Line Chart renderer
  const renderLineChart = (
    values: number[],
    color: string,
    w = 620,
    h = 210,
  ) => {
    const max = Math.max(...values) * 1.15
    const min = 0
    const step = w / (values.length - 1)
    const pts = values
      .map((v, i) => `${i * step},${h - ((v - min) / (max - min)) * h}`)
      .join(" ")
    const area = `0,${h} ${pts} ${w},${h}`
    return (
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="w-full h-auto"
      >
        <polygon points={area} fill={color} opacity="0.10" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" />
        {values.map((v, i) => (
          <circle
            key={i}
            cx={i * step}
            cy={h - ((v - min) / (max - min)) * h}
            r="3.5"
            fill={color}
          />
        ))}
      </svg>
    )
  }

  // SVG Pie Chart renderer
  const renderPieChart = (data: [string, number, string][]) => {
    let acc = 0
    const r = 64
    const cx = 80
    const cy = 80
    const paths = data.map(([label, val, color], idx) => {
      const start = (acc / 100) * 2 * Math.PI
      acc += val
      const end = (acc / 100) * 2 * Math.PI
      const x1 = cx + r * Math.sin(start)
      const y1 = cy - r * Math.cos(start)
      const x2 = cx + r * Math.sin(end)
      const y2 = cy - r * Math.cos(end)
      const large = end - start > Math.PI ? 1 : 0
      return (
        <path
          key={idx}
          d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`}
          fill={color}
        />
      )
    })

    return (
      <div className="flex gap-5 items-center">
        <svg width="150" height="150" viewBox="0 0 160 160">
          {paths}
        </svg>
        <div className="space-y-1.5">
          {data.map(([label, pct, color], i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs font-mono text-[#6b6960]"
            >
              <span
                className="w-2.5 h-2.5 inline-block rounded-xs shrink-0"
                style={{ backgroundColor: color }}
              />
              <span>
                {label} — {pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const currentOverview =
    periodData[overviewPeriod] || periodData["Last 6 months"]
  const currentAnalytics =
    analyticsData[analyticsPeriod] || analyticsData["Last 6 months"]

  const filteredProducts = useMemo(() => {
    if (productFilter === "best") return productsList.filter((p) => p.isBest)
    if (productFilter === "low")
      return productsList.filter((p) => p.isLow || p.stock <= 5)
    return productsList
  }, [productFilter, productsList])

  // ============ AUTHENTICATION GATE & ATELIER LOGIN LANDING PAGE ============
  if (!currentUser) {
    return (
      <AtelierLoginPage
        onSignInWithDummy={handleSignInWithDummy}
        onManualLogin={handleManualLogin}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPasskey={loginPasskey}
        setLoginPasskey={setLoginPasskey}
        loginError={loginError}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f6f1] text-[#15140f] font-sans flex flex-col md:grid md:grid-cols-[230px_1fr] selection:bg-[#d6a34c]/20">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="bg-[#15140f] text-white p-6 flex flex-col md:sticky md:top-0 md:h-screen md:overflow-y-auto shrink-0 border-r border-[#2b291f]">
        {/* Brand Block */}
        <div className="flex items-center gap-3 pb-5 border-b border-[#2b291f] mb-4">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold font-serif shrink-0 shadow-sm"
            style={{
              background:
                currentBrand.slug === "urban-soul"
                  ? "linear-gradient(155deg, #e9c079, #a64b34)"
                  : currentBrand.color,
            }}
          >
            {currentBrand.letter}
          </div>
          <div className="overflow-hidden">
            <b className="font-serif text-[15.5px] block truncate text-white">
              {currentBrand.name}
            </b>
            <span className="text-[10.5px] text-[#b9b6aa] block truncate font-mono">
              {currentBrand.city} · Streetwear
            </span>
          </div>
        </div>

        {/* Group 1: Run the business */}
        <div className="text-[9.5px] text-[#7a7768] uppercase tracking-wider px-2.5 py-2 font-mono">
          Run the business
        </div>
        <nav className="flex flex-col gap-0.5">
          <button
            onClick={() => setActivePage("overview")}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[12.8px] text-left transition-colors cursor-pointer ${
              activePage === "overview"
                ? "bg-[#d6a34c] text-[#15140f] font-semibold"
                : "text-[#c7c3b6] hover:bg-[#211f18] hover:text-white"
            }`}
          >
            <span className="w-4 inline-flex items-center justify-center text-sm">
              ◆
            </span>
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActivePage("orders")}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[12.8px] text-left transition-colors cursor-pointer ${
              activePage === "orders"
                ? "bg-[#d6a34c] text-[#15140f] font-semibold"
                : "text-[#c7c3b6] hover:bg-[#211f18] hover:text-white"
            }`}
          >
            <span className="w-4 inline-flex items-center justify-center text-sm">
              □
            </span>
            <span>Orders</span>
          </button>
          <button
            onClick={() => setActivePage("products")}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[12.8px] text-left transition-colors cursor-pointer ${
              activePage === "products"
                ? "bg-[#d6a34c] text-[#15140f] font-semibold"
                : "text-[#c7c3b6] hover:bg-[#211f18] hover:text-white"
            }`}
          >
            <span className="w-4 inline-flex items-center justify-center text-sm">
              ●
            </span>
            <span>Products</span>
          </button>
        </nav>

        {/* Group 2: Understand it */}
        <div className="text-[9.5px] text-[#7a7768] uppercase tracking-wider px-2.5 pt-4 pb-1 font-mono">
          Understand it
        </div>
        <nav className="flex flex-col gap-0.5">
          <button
            onClick={() => setActivePage("analytics")}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[12.8px] text-left transition-colors cursor-pointer ${
              activePage === "analytics"
                ? "bg-[#d6a34c] text-[#15140f] font-semibold"
                : "text-[#c7c3b6] hover:bg-[#211f18] hover:text-white"
            }`}
          >
            <span className="w-4 inline-flex items-center justify-center text-sm">
              ▲
            </span>
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setActivePage("insights")}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[12.8px] text-left transition-colors cursor-pointer ${
              activePage === "insights"
                ? "bg-[#d6a34c] text-[#15140f] font-semibold"
                : "text-[#c7c3b6] hover:bg-[#211f18] hover:text-white"
            }`}
          >
            <span className="w-4 inline-flex items-center justify-center text-sm">
              ✦
            </span>
            <span>Insights</span>
          </button>
          <button
            onClick={() => setActivePage("reports")}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[12.8px] text-left transition-colors cursor-pointer ${
              activePage === "reports"
                ? "bg-[#d6a34c] text-[#15140f] font-semibold"
                : "text-[#c7c3b6] hover:bg-[#211f18] hover:text-white"
            }`}
          >
            <span className="w-4 inline-flex items-center justify-center text-sm">
              ◧
            </span>
            <span>Monthly reports</span>
          </button>
        </nav>

        {/* Group 3: Grow it */}
        <div className="text-[9.5px] text-[#7a7768] uppercase tracking-wider px-2.5 pt-4 pb-1 font-mono">
          Grow it
        </div>
        <nav className="flex flex-col gap-0.5">
          <button
            onClick={() => setActivePage("marketing")}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[12.8px] text-left transition-colors cursor-pointer ${
              activePage === "marketing"
                ? "bg-[#d6a34c] text-[#15140f] font-semibold"
                : "text-[#c7c3b6] hover:bg-[#211f18] hover:text-white"
            }`}
          >
            <span className="w-4 inline-flex items-center justify-center text-sm">
              ★
            </span>
            <span>Marketing</span>
          </button>
          <button
            onClick={() => setActivePage("brandpage")}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[12.8px] text-left transition-colors cursor-pointer ${
              activePage === "brandpage"
                ? "bg-[#d6a34c] text-[#15140f] font-semibold"
                : "text-[#c7c3b6] hover:bg-[#211f18] hover:text-white"
            }`}
          >
            <span className="w-4 inline-flex items-center justify-center text-sm">
              ◉
            </span>
            <span>Brand page</span>
          </button>
        </nav>

        {/* Group 4: Account */}
        <div className="text-[9.5px] text-[#7a7768] uppercase tracking-wider px-2.5 pt-4 pb-1 font-mono">
          Account
        </div>
        <nav className="flex flex-col gap-0.5">
          <button
            onClick={() => setActivePage("payouts")}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[12.8px] text-left transition-colors cursor-pointer ${
              activePage === "payouts"
                ? "bg-[#d6a34c] text-[#15140f] font-semibold"
                : "text-[#c7c3b6] hover:bg-[#211f18] hover:text-white"
            }`}
          >
            <span className="w-4 inline-flex items-center justify-center text-sm">
              $
            </span>
            <span>Payouts</span>
          </button>
          <button
            onClick={() => setActivePage("settings")}
            className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[12.8px] text-left transition-colors cursor-pointer ${
              activePage === "settings"
                ? "bg-[#d6a34c] text-[#15140f] font-semibold"
                : "text-[#c7c3b6] hover:bg-[#211f18] hover:text-white"
            }`}
          >
            <span className="w-4 inline-flex items-center justify-center text-sm">
              ⚙
            </span>
            <span>Settings</span>
          </button>
        </nav>

        {/* Quick Link back to Atelier Landing Page */}
        <div className="pt-3">
          <button
            onClick={() => {
              setCurrentUser(null)
              window.location.hash = "#/vendor"
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-mono text-[#e9c079] bg-[#211f18] hover:bg-[#2b291f] border border-[#d6a34c]/30 transition-colors cursor-pointer"
            title="Return to Atelier Landing Page"
          >
            <span>←</span>
            <span>Atelier Landing Page</span>
          </button>
        </div>

        {/* Sidebar Footer: Dummy Account Info & Quick Actions */}
        <div className="mt-auto border-t border-[#2b291f] pt-4 mt-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#454e3d] flex items-center justify-center text-white font-serif font-bold text-xs shrink-0 shadow-xs">
              {currentUser?.founderName?.charAt(0) || "T"}
            </div>
            <div className="overflow-hidden">
              <b className="text-xs font-sans text-white block truncate">
                {currentUser?.founderName || "Thabo M."}
              </b>
              <span className="text-[9.5px] text-[#e9c079] font-mono block truncate">
                🧪 Test Account
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleResetSandboxData}
              className="p-1.5 rounded-lg text-[#9a9788] hover:text-white hover:bg-[#26231a] transition-colors cursor-pointer text-xs"
              title="Reset Sandbox Test Data"
            >
              ↺
            </button>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-[#9a9788] hover:text-[#e9c079] hover:bg-[#26231a] transition-colors cursor-pointer text-xs"
              title="Sign Out to Login Gateway"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="min-w-0 flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-[#e4e1d6] bg-white sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-serif text-xl sm:text-2xl font-normal text-[#15140f]">
                {pageTitles[activePage][0]}
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#d6a34c]/15 border border-[#d6a34c]/40 text-[#15140f] rounded-full text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-[#5c6851] animate-pulse" />
                <span className="font-semibold">Sandbox Test Mode</span>
                <span className="text-[#6b6960] text-[10px] hidden sm:inline">
                  ({currentUser?.email})
                </span>
              </div>
            </div>
            <div className="text-xs text-[#6b6960] font-light">
              {pageTitles[activePage][1]}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentUser(null)
                window.location.hash = "#/vendor"
              }}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 border border-[#e4e1d6] hover:border-[#15140f] hover:text-[#15140f] rounded-full text-xs font-mono text-[#6b6960] transition-colors cursor-pointer bg-white shadow-2xs"
              title="Return to public Atelier landing page"
            >
              <span>← Landing Page</span>
            </button>

            <button
              onClick={handleSignOut}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 border border-[#e4e1d6] hover:border-[#a64b34] hover:text-[#a64b34] rounded-full text-xs font-mono text-[#6b6960] transition-colors cursor-pointer bg-white shadow-2xs"
              title="Sign out of dummy test account"
            >
              <span>Sign Out</span>
            </button>

            {/* Discreet Shield Mode (Hide Financial Figures from Shoulder Surfers) */}
            <button
              onClick={() => {
                const next = !isDiscreetMode
                setIsDiscreetMode(next)
                localStorage.setItem("rooted_privacy_shield", String(next))
                showToast(
                  next
                    ? "Discreet Shield ON: Financial figures masked."
                    : "Discreet Shield OFF: Revealing amounts.",
                )
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                isDiscreetMode
                  ? "bg-[#faf1de] text-[#a07a1f] border-[#d6a34c]"
                  : "bg-white text-[#6b6960] border-[#e4e1d6] hover:border-[#15140f]"
              }`}
              title="Toggle Discreet Shield to mask sensitive turnover & balances"
            >
              <span>{isDiscreetMode ? "👁‍🗨" : "👁"}</span>
              <span className="hidden md:inline">
                {isDiscreetMode ? "Discreet: ON" : "Discreet"}
              </span>
            </button>

            {/* Locked Tenant Isolation Badge (Strict Multi-Tenant Security) */}
            <button
              onClick={() => setIsTenantSecurityModalOpen(true)}
              className="flex items-center gap-2 border border-[#e4e1d6] hover:border-[#454e3d] bg-[#f7f6f1] hover:bg-white rounded-full px-3.5 py-1.5 text-xs font-mono text-[#15140f] transition-all cursor-pointer shadow-2xs group"
              title="Tenant Isolation Policy: Brand workspace is strictly locked to your authenticated credentials. Click to view policy."
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0 shadow-2xs"
                style={{ backgroundColor: currentBrand.color || "#454e3d" }}
              >
                {currentBrand.letter}
              </span>
              <span className="font-semibold text-[11.5px]">
                {currentBrand.name}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#454e3d] bg-[#eef1ec] border border-[#454e3d]/20 px-2 py-0.5 rounded-full">
                <span>🔒</span>
                <span>Isolated</span>
              </span>
            </button>

            {/* Notification / Message Icon Buttons */}
            <button
              onClick={() =>
                showToast("No unread messages from customer support.")
              }
              className="w-8 h-8 rounded-lg border border-[#e4e1d6] hover:border-[#15140f] flex items-center justify-center text-sm text-[#6b6960] relative cursor-pointer transition-colors"
              title="Messages"
            >
              <span>✉</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#a64b34]" />
            </button>

            <button
              onClick={() =>
                showToast(
                  "All system services and Bob Go dispatch operational.",
                )
              }
              className="w-8 h-8 rounded-lg border border-[#e4e1d6] hover:border-[#15140f] flex items-center justify-center text-sm text-[#6b6960] relative cursor-pointer transition-colors"
              title="Notifications"
            >
              <span>🔔</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#a64b34]" />
            </button>

            {/* Public Storefront Preview Link */}
            <a
              href="#/"
              className="hidden sm:flex items-center gap-1.5 border border-[#e4e1d6] hover:border-[#15140f] text-[#15140f] text-xs font-mono font-medium px-3.5 py-1.5 rounded-full transition-colors"
              title="View Customer Storefront"
            >
              <span>Storefront ↗</span>
            </a>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-w-[1280px] w-full">
          {/* ============ TAB 1: OVERVIEW ============ */}
          {activePage === "overview" && (
            <section className="space-y-5 animate-fade-in">
              {/* Period Row */}
              <div className="flex gap-2 flex-wrap">
                {Object.keys(periodData).map((k) => (
                  <button
                    key={k}
                    onClick={() => setOverviewPeriod(k)}
                    className={`px-4 py-1.5 border rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                      overviewPeriod === k
                        ? "bg-[#15140f] text-white border-[#15140f]"
                        : "bg-white text-[#15140f] border-[#e4e1d6] hover:border-[#15140f]"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* Growth Banner */}
              <div className="bg-gradient-to-r from-[#15140f] to-[#454e3d] text-white rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row justify-between sm:items-center gap-5 shadow-sm">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-white max-w-xl">
                    Six months in, {currentBrand.name} is growing steadily on
                    ROOTED.
                  </h3>
                  <p className="text-xs text-[#cfcbc0] mt-1.5 max-w-lg font-light leading-relaxed">
                    Revenue is up across the period and the Oversized Hoodie
                    continues to carry most of the growth. See the full
                    breakdown in Analytics.
                  </p>
                </div>
                <div className="font-serif text-3xl sm:text-4xl text-[#e9c079] font-normal">
                  {currentOverview.growth}
                </div>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {currentOverview.stats.map(([lbl, val, delta], idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#e4e1d6] rounded-xl p-4 sm:p-5 shadow-2xs"
                  >
                    <div className="text-[11px] text-[#6b6960] font-mono font-medium mb-2">
                      {lbl}
                    </div>
                    <div className="font-serif text-2xl sm:text-[23px] font-semibold text-[#15140f]">
                      {val}
                    </div>
                    <div className="text-[11px] font-mono font-semibold mt-1.5 text-[#5c6851]">
                      {delta}
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel Row 1: Revenue Trend Chart & Best Sellers */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4">
                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs">
                  <h4 className="font-serif text-sm font-semibold text-[#15140f] mb-4">
                    Revenue trend{" "}
                    <span className="font-sans font-normal text-xs text-[#6b6960]">
                      {currentOverview.label}
                    </span>
                  </h4>
                  <div className="w-full">
                    {renderLineChart(currentOverview.chart, "#d6a34c")}
                  </div>
                </div>

                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs">
                  <h4 className="font-serif text-sm font-semibold text-[#15140f] mb-4">
                    Best &amp; slow sellers
                  </h4>
                  <div className="space-y-3">
                    {bestSellers.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="w-32 sm:w-36 text-xs text-[#15140f] font-serif truncate">
                          {item.name}
                        </span>
                        <div className="flex-1 h-2 bg-[#f7f6f1] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.slow ? "bg-[#a64b34]" : "bg-[#5c6851]"
                            }`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                        <span className="w-14 text-right text-[11px] text-[#6b6960] font-mono shrink-0">
                          {item.sold} sold
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Panel Row 2: Recent Orders & Insights For You */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs">
                  <h4 className="font-serif text-sm font-semibold text-[#15140f] mb-4">
                    Recent orders
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#e4e1d6] text-[10px] text-[#6b6960] uppercase font-mono">
                          <th className="py-2 px-2">Order</th>
                          <th className="py-2 px-2">Item</th>
                          <th className="py-2 px-2">Amount</th>
                          <th className="py-2 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e4e1d6]">
                        {ordersList.slice(0, 4).map((o) => (
                          <tr key={o.id}>
                            <td className="py-2.5 px-2 font-mono font-medium text-[#15140f]">
                              {o.id}
                            </td>
                            <td className="py-2.5 px-2 text-[#15140f] font-serif">
                              {o.item}
                            </td>
                            <td className="py-2.5 px-2 font-mono font-bold text-[#15140f]">
                              {o.amount}
                            </td>
                            <td className="py-2.5 px-2">
                              <span
                                className={`text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                                  o.status === "shipped"
                                    ? "bg-[#eef1ec] text-[#5c6851]"
                                    : o.status === "processing"
                                      ? "bg-[#faf1de] text-[#a07a1f]"
                                      : "bg-[#eef1ec] text-[#5c6851]"
                                }`}
                              >
                                {o.status.charAt(0).toUpperCase() +
                                  o.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs">
                  <h4 className="font-serif text-sm font-semibold text-[#15140f] mb-4">
                    Insights for you
                  </h4>
                  <div className="space-y-2.5">
                    <div className="border-l-3 border-[#d6a34c] bg-[#faf6ec] p-3 rounded-r-lg text-[11.5px] text-[#15140f]">
                      <b className="font-serif text-xs block mb-0.5">
                        Revenue concentration
                      </b>
                      The Oversized Hoodie generated 48% of revenue this month.
                    </div>
                    <div className="border-l-3 border-[#d6a34c] bg-[#faf6ec] p-3 rounded-r-lg text-[11.5px] text-[#15140f]">
                      <b className="font-serif text-xs block mb-0.5">
                        Basket pattern
                      </b>
                      Customers buying hoodies frequently add a cap to the same
                      order.
                    </div>
                    <div className="border-l-3 border-[#d6a34c] bg-[#faf6ec] p-3 rounded-r-lg text-[11.5px] text-[#15140f]">
                      <b className="font-serif text-xs block mb-0.5">
                        Watch this
                      </b>
                      The Graphic Cap has high views but low purchases — worth
                      testing the price.
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ============ TAB 2: ORDERS ============ */}
          {activePage === "orders" && (
            <section className="space-y-5 animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setOrderFilter("all")}
                    className={`px-4 py-1.5 border rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                      orderFilter === "all"
                        ? "bg-[#15140f] text-white border-[#15140f]"
                        : "bg-white text-[#15140f] border-[#e4e1d6] hover:border-[#15140f]"
                    }`}
                  >
                    All orders ({ordersList.length})
                  </button>
                  <button
                    onClick={() => setOrderFilter("processing")}
                    className={`px-4 py-1.5 border rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                      orderFilter === "processing"
                        ? "bg-[#15140f] text-white border-[#15140f]"
                        : "bg-white text-[#15140f] border-[#e4e1d6] hover:border-[#15140f]"
                    }`}
                  >
                    Processing (
                    {ordersList.filter((o) => o.status === "processing").length}
                    )
                  </button>
                  <button
                    onClick={() => setOrderFilter("shipped")}
                    className={`px-4 py-1.5 border rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                      orderFilter === "shipped"
                        ? "bg-[#15140f] text-white border-[#15140f]"
                        : "bg-white text-[#15140f] border-[#e4e1d6] hover:border-[#15140f]"
                    }`}
                  >
                    Shipped (
                    {ordersList.filter((o) => o.status === "shipped").length})
                  </button>
                  <button
                    onClick={() => setOrderFilter("delivered")}
                    className={`px-4 py-1.5 border rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                      orderFilter === "delivered"
                        ? "bg-[#15140f] text-white border-[#15140f]"
                        : "bg-white text-[#15140f] border-[#e4e1d6] hover:border-[#15140f]"
                    }`}
                  >
                    Delivered (
                    {ordersList.filter((o) => o.status === "delivered").length})
                  </button>
                </div>

                <button
                  onClick={handleSimulateNewOrder}
                  className="px-4 py-1.5 bg-[#d6a34c] hover:bg-[#e9c079] text-[#15140f] rounded-full text-xs font-mono font-bold transition-all shadow-sm cursor-pointer hover:-translate-y-0.5 flex items-center gap-1.5"
                >
                  <span>➕</span>
                  <span>Simulate New Test Order</span>
                </button>
              </div>

              <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#e4e1d6] text-[10px] text-[#6b6960] uppercase font-mono">
                        <th className="py-2.5 px-3">Order</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Item</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">
                          Testing Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e1d6]">
                      {filteredOrders.map((o) => (
                        <tr
                          key={o.id}
                          className="hover:bg-[#f7f6f1] transition-colors"
                        >
                          <td className="py-3 px-3 font-mono font-semibold text-[#15140f]">
                            {o.id}
                          </td>
                          <td className="py-3 px-3 text-[#15140f] font-mono">
                            {o.customer}
                          </td>
                          <td className="py-3 px-3 text-[#15140f] font-serif font-medium">
                            {o.item}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#15140f]">
                            {o.amount}
                          </td>
                          <td className="py-3 px-3 font-mono text-[#6b6960]">
                            {o.date}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[9.5px] font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                                o.status === "shipped"
                                  ? "bg-[#eef1ec] text-[#5c6851]"
                                  : o.status === "processing"
                                    ? "bg-[#faf1de] text-[#a07a1f]"
                                    : "bg-[#eef1ec] text-[#5c6851]"
                              }`}
                            >
                              {o.status.charAt(0).toUpperCase() +
                                o.status.slice(1)}
                            </span>
                            {o.tracking && (
                              <span className="block text-[9px] font-mono text-[#6b6960] mt-0.5">
                                {o.tracking}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            {o.status === "processing" && (
                              <button
                                onClick={() => handleAdvanceOrderStatus(o.id)}
                                className="px-2.5 py-1 bg-[#15140f] hover:bg-[#2b291f] text-white text-[10px] font-mono font-bold rounded-md transition-colors cursor-pointer"
                              >
                                📦 Dispatch (Ship)
                              </button>
                            )}
                            {o.status === "shipped" && (
                              <button
                                onClick={() => handleAdvanceOrderStatus(o.id)}
                                className="px-2.5 py-1 bg-[#454e3d] hover:bg-[#5c6851] text-white text-[10px] font-mono font-bold rounded-md transition-colors cursor-pointer"
                              >
                                ✓ Mark Delivered
                              </button>
                            )}
                            {o.status === "delivered" && (
                              <span className="text-[10px] font-mono text-[#5c6851] font-semibold">
                                ✓ Locker Picked Up
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ============ TAB 3: PRODUCTS ============ */}
          {activePage === "products" && (
            <section className="space-y-5 animate-fade-in">
              {/* Callout */}
              <div className="bg-[#faf6ec] border border-[#ecdfba] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <b className="font-serif text-sm text-[#15140f] block mb-1">
                    Adding something new?
                  </b>
                  <p className="text-xs text-[#15140f] max-w-xl font-light leading-relaxed">
                    Brands don't upload directly during the beta — send photos,
                    pricing and stock to your ROOTED account manager and we'll
                    list it within 48 hours.
                  </p>
                </div>
                <button
                  onClick={() => setIsListingModalOpen(true)}
                  className="bg-[#15140f] hover:bg-black text-white text-xs font-mono font-semibold px-4 py-2 rounded-full transition-colors shrink-0 cursor-pointer"
                >
                  Request new listing
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setProductFilter("all")}
                  className={`px-4 py-1.5 border rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                    productFilter === "all"
                      ? "bg-[#15140f] text-white border-[#15140f]"
                      : "bg-white text-[#15140f] border-[#e4e1d6] hover:border-[#15140f]"
                  }`}
                >
                  All products ({productsList.length})
                </button>
                <button
                  onClick={() => setProductFilter("best")}
                  className={`px-4 py-1.5 border rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                    productFilter === "best"
                      ? "bg-[#15140f] text-white border-[#15140f]"
                      : "bg-white text-[#15140f] border-[#e4e1d6] hover:border-[#15140f]"
                  }`}
                >
                  Best sellers ({productsList.filter((p) => p.isBest).length})
                </button>
                <button
                  onClick={() => setProductFilter("low")}
                  className={`px-4 py-1.5 border rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                    productFilter === "low"
                      ? "bg-[#15140f] text-white border-[#15140f]"
                      : "bg-white text-[#15140f] border-[#e4e1d6] hover:border-[#15140f]"
                  }`}
                >
                  Low stock (
                  {productsList.filter((p) => p.isLow || p.stock <= 5).length})
                </button>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-[#e4e1d6] rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between"
                  >
                    <div
                      className="h-32 relative"
                      style={{ background: p.pattern }}
                    >
                      {p.isLow && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#a64b34] text-white uppercase tracking-wider shadow-sm">
                          Low stock ({p.stock})
                        </span>
                      )}
                    </div>
                    <div className="p-3.5">
                      <b className="font-serif text-[13px] block mb-1 text-[#15140f] truncate">
                        {p.name}
                      </b>
                      <div className="text-[10.5px] text-[#6b6960] flex justify-between font-mono">
                        <span>R{p.price}</span>
                        <span>{p.sold} sold</span>
                      </div>
                      <div className="h-1.5 bg-[#f7f6f1] rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            p.stock <= 5 ? "bg-[#a64b34]" : "bg-[#5c6851]"
                          }`}
                          style={{
                            width: `${Math.min(100, (p.stock / p.maxStock) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-[#e4e1d6] flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#6b6960]">
                          Stock:{" "}
                          <strong className="text-[#15140f]">{p.stock}</strong>
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStockChange(p.id, -1)}
                            className="w-5 h-5 rounded border border-[#e4e1d6] hover:bg-[#efeee3] flex items-center justify-center font-bold text-xs cursor-pointer"
                            title="Decrease stock (simulate sale)"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleStockChange(p.id, 1)}
                            className="w-5 h-5 rounded border border-[#e4e1d6] hover:bg-[#efeee3] flex items-center justify-center font-bold text-xs cursor-pointer"
                            title="Increase stock (replenish)"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ============ TAB 4: ANALYTICS ============ */}
          {activePage === "analytics" && (
            <section className="space-y-5 animate-fade-in">
              {/* Period Selector */}
              <div className="flex gap-2 flex-wrap">
                {Object.keys(analyticsData).map((k) => (
                  <button
                    key={k}
                    onClick={() => setAnalyticsPeriod(k)}
                    className={`px-4 py-1.5 border rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                      analyticsPeriod === k
                        ? "bg-[#15140f] text-white border-[#15140f]"
                        : "bg-white text-[#15140f] border-[#e4e1d6] hover:border-[#15140f]"
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {currentAnalytics.stats.map(([lbl, val, delta], idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#e4e1d6] rounded-xl p-4 sm:p-5 shadow-2xs"
                  >
                    <div className="text-[11px] text-[#6b6960] font-mono font-medium mb-2">
                      {lbl}
                    </div>
                    <div className="font-serif text-2xl sm:text-[23px] font-semibold text-[#15140f]">
                      {val}
                    </div>
                    <div className="text-[11px] font-mono font-semibold mt-1.5 text-[#5c6851]">
                      {delta}
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel Row 1: Sales Trend & Revenue by Category */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4">
                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs">
                  <h4 className="font-serif text-sm font-semibold text-[#15140f] mb-4">
                    Sales trend
                  </h4>
                  <div className="w-full">
                    {renderLineChart(currentAnalytics.trend, "#a64b34")}
                  </div>
                </div>

                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                  <h4 className="font-serif text-sm font-semibold text-[#15140f] mb-4">
                    Revenue by category
                  </h4>
                  <div className="py-2">
                    {renderPieChart([
                      ["Hoodies", 48, "#d6a34c"],
                      ["Pants", 24, "#a64b34"],
                      ["Tees", 18, "#5c6851"],
                      ["Accessories", 10, "#c7c3ac"],
                    ])}
                  </div>
                </div>
              </div>

              {/* Panel Row 2: Customer Behaviour & Views vs Purchases */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs">
                  <h4 className="font-serif text-sm font-semibold text-[#15140f] mb-4">
                    Customer behaviour
                  </h4>
                  <div className="space-y-3">
                    {[
                      { name: "New customers", pct: 64, val: "64%" },
                      { name: "Returning customers", pct: 36, val: "36%" },
                      { name: "Avg. order value", pct: 80, val: "R391" },
                      { name: "Repeat purchase rate", pct: 29, val: "29%" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-36 text-xs text-[#15140f] font-mono shrink-0">
                          {row.name}
                        </span>
                        <div className="flex-1 h-2 bg-[#f7f6f1] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#5c6851] rounded-full"
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span className="w-14 text-right text-xs text-[#6b6960] font-mono shrink-0">
                          {row.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs">
                  <h4 className="font-serif text-sm font-semibold text-[#15140f] mb-4">
                    Views vs. purchases
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Oversized Hoodie",
                        pct: 74,
                        conv: "74% conv.",
                        slow: false,
                      },
                      {
                        name: "Cargo Pant",
                        pct: 58,
                        conv: "58% conv.",
                        slow: false,
                      },
                      {
                        name: "Boxy Tee",
                        pct: 41,
                        conv: "41% conv.",
                        slow: false,
                      },
                      {
                        name: "Graphic Cap",
                        pct: 9,
                        conv: "9% conv.",
                        slow: true,
                      },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-36 text-xs text-[#15140f] font-serif truncate">
                          {row.name}
                        </span>
                        <div className="flex-1 h-2 bg-[#f7f6f1] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.slow ? "bg-[#a64b34]" : "bg-[#5c6851]"
                            }`}
                            style={{ width: `${row.pct}%` }}
                          />
                        </div>
                        <span className="w-20 text-right text-[11px] text-[#6b6960] font-mono shrink-0">
                          {row.conv}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ============ TAB 5: INSIGHTS (Business Intelligence) ============ */}
          {activePage === "insights" && (
            <section className="space-y-5 animate-fade-in">
              <p className="text-xs text-[#6b6960] max-w-2xl font-light leading-relaxed">
                ROOTED turns your last 6 months of sales data into
                plain-language recommendations. This is the same pipeline behind
                your monthly report.
              </p>

              {/* Pipeline Diagram */}
              <div className="flex gap-2 flex-wrap">
                {["Raw data", "Analysis", "Insight", "Recommendation"].map(
                  (step, idx) => (
                    <div
                      key={idx}
                      className="flex-1 min-w-[110px] text-center py-2.5 px-2 rounded-lg bg-[#454e3d] text-white border border-[#454e3d] text-xs font-mono font-semibold"
                    >
                      ✓ {step}
                    </div>
                  ),
                )}
                <div className="flex-1 min-w-[120px] text-center py-2.5 px-2 rounded-lg bg-white border border-[#d6a34c] text-[#15140f] text-xs font-mono font-bold shadow-2xs">
                  Action → Growth
                </div>
              </div>

              {/* Full Insights Cards */}
              <div className="space-y-3">
                {[
                  {
                    key: "rev-conc",
                    title: "Revenue concentration",
                    desc: "Your Oversized Hoodie has generated 48% of revenue this month — consider expanding this range with new colourways.",
                  },
                  {
                    key: "cat-growth",
                    title: "Category growth",
                    desc: "Your hoodie category grew 24% over the last 6 months, outpacing every other line you sell.",
                  },
                  {
                    key: "views-purch",
                    title: "Views vs. purchases",
                    desc: "The Graphic Cap has high page views but a 9% conversion rate — well below your other products. Try a new price or product photo before ordering more stock.",
                  },
                  {
                    key: "basket-pat",
                    title: "Basket pattern",
                    desc: "Customers who buy the Oversized Hoodie frequently add the Graphic Cap or Boxy Tee to the same order — a bundle could lift average order value.",
                  },
                ].map((ins) => {
                  const isDone = actionedInsights[ins.key]
                  return (
                    <div
                      key={ins.key}
                      className="bg-white border border-[#e4e1d6] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-2xs"
                    >
                      <div>
                        <b className="font-serif text-sm text-[#15140f] block mb-1">
                          {ins.title}
                        </b>
                        <p className="text-xs text-[#6b6960] max-w-xl font-light leading-relaxed">
                          {ins.desc}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#6b6960] shrink-0">
                        <span>Mark as actioned</span>
                        <div
                          onClick={() => {
                            const next = !isDone
                            setActionedInsights((prev) => ({
                              ...prev,
                              [ins.key]: next,
                            }))
                            showToast(
                              next
                                ? "Marked insight as actioned."
                                : "Re-opened insight.",
                            )
                          }}
                          className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${
                            isDone ? "bg-[#454e3d]" : "bg-[#e4e1d6]"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                              isDone ? "left-4.5" : "left-0.5"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ============ TAB 6: MONTHLY REPORTS ============ */}
          {activePage === "reports" && (
            <section className="space-y-6 animate-fade-in">
              {/* Report List */}
              <div className="flex flex-col gap-2.5">
                {[
                  {
                    month: "August 2026",
                    details: "Revenue R48,750 · +18.4% vs July",
                  },
                  {
                    month: "July 2026",
                    details: "Revenue R41,200 · +10.7% vs June",
                  },
                  {
                    month: "June 2026",
                    details: "Revenue R37,000 · +8.2% vs May",
                  },
                  {
                    month: "May 2026",
                    details: "Revenue R33,400 · +13.6% vs April",
                  },
                ].map((rep, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white border border-[#e4e1d6] rounded-xl p-4 sm:p-5 shadow-2xs"
                  >
                    <div>
                      <b className="font-serif text-sm text-[#15140f] block">
                        {rep.month}
                      </b>
                      <span className="text-[11.5px] text-[#6b6960] font-mono block mt-0.5">
                        {rep.details}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const el = document.getElementById("reportDoc")
                        el?.scrollIntoView({ behavior: "smooth" })
                        showToast(
                          `Opened ${rep.month} executive report document.`,
                        )
                      }}
                      className="border border-[#15140f] hover:bg-[#15140f] hover:text-white text-[#15140f] font-mono text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-pointer"
                    >
                      View report
                    </button>
                  </div>
                ))}
              </div>

              {/* Report Document */}
              <div
                id="reportDoc"
                className="bg-white border border-[#e4e1d6] rounded-xl p-6 sm:p-8 shadow-2xs space-y-4"
              >
                <div className="border-b border-[#e4e1d6] pb-3">
                  <h3 className="font-serif text-xl text-[#15140f]">
                    {currentBrand.name} — August 2026
                  </h3>
                  <span className="text-xs text-[#6b6960] font-mono block mt-0.5">
                    Prepared by ROOTED Insights (Verified Atelier Analytics)
                  </span>
                </div>

                <div className="space-y-3.5 divide-y divide-[#e4e1d6]/60 text-xs">
                  <div className="pt-2">
                    <h5 className="text-[10.5px] text-[#a64b34] font-mono font-bold uppercase tracking-wider mb-1">
                      Performance summary
                    </h5>
                    <p className="text-[#15140f] leading-relaxed">
                      Revenue reached R48,750 in August, up 18.4% on July,
                      across 127 orders and 243 units sold.
                    </p>
                  </div>

                  <div className="pt-3">
                    <h5 className="text-[10.5px] text-[#a64b34] font-mono font-bold uppercase tracking-wider mb-1">
                      What worked
                    </h5>
                    <p className="text-[#15140f] leading-relaxed">
                      The Oversized Hoodie carried 48% of total revenue and was
                      the clear driver of this month's growth.
                    </p>
                  </div>

                  <div className="pt-3">
                    <h5 className="text-[10.5px] text-[#a64b34] font-mono font-bold uppercase tracking-wider mb-1">
                      What didn't work
                    </h5>
                    <p className="text-[#15140f] leading-relaxed">
                      The Graphic Cap saw more product views than any other item
                      but converted far less often — a sign the price or photos
                      may need testing.
                    </p>
                  </div>

                  <div className="pt-3">
                    <h5 className="text-[10.5px] text-[#a64b34] font-mono font-bold uppercase tracking-wider mb-1">
                      Customer behaviour
                    </h5>
                    <p className="text-[#15140f] leading-relaxed">
                      Customers who bought the Oversized Hoodie were also likely
                      to add the Boxy Tee to the same order.
                    </p>
                  </div>

                  <div className="pt-3">
                    <h5 className="text-[10.5px] text-[#a64b34] font-mono font-bold uppercase tracking-wider mb-1">
                      Recommendation
                    </h5>
                    <p className="text-[#15140f] leading-relaxed">
                      Consider a hoodie-and-tee bundle, and test a lower price
                      or new product photo on the Graphic Cap before ordering
                      more stock.
                    </p>
                  </div>

                  <div className="pt-3">
                    <h5 className="text-[10.5px] text-[#a64b34] font-mono font-bold uppercase tracking-wider mb-1">
                      Next month's focus
                    </h5>
                    <p className="text-[#15140f] leading-relaxed">
                      Track whether the bundle lifts average order value, and
                      re-measure Graphic Cap conversion after the price test.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ============ TAB 7: MARKETING ============ */}
          {activePage === "marketing" && (
            <section className="space-y-5 animate-fade-in">
              {/* Stat Mini Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {[
                  { lbl: "Brand page views", val: "4,120" },
                  { lbl: "Discovered via other brands", val: "612" },
                  { lbl: "Followers", val: "318" },
                  { lbl: "Search appearances", val: "1,940" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#e4e1d6] rounded-xl p-4 shadow-2xs"
                  >
                    <div className="text-[10.5px] text-[#6b6960] font-mono mb-1">
                      {s.lbl}
                    </div>
                    <div className="font-serif text-xl text-[#15140f] font-semibold">
                      {s.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Marketing Opportunity Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                  <div>
                    <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#eef1ec] text-[#5c6851] inline-block mb-2.5">
                      Available now
                    </span>
                    <h4 className="font-serif text-[15px] font-semibold text-[#15140f] mb-2">
                      Apply for Brand of the Week
                    </h4>
                    <p className="text-xs text-[#6b6960] mb-4 font-light leading-relaxed">
                      Get featured on the ROOTED homepage for a full week, with
                      your story, founder photo and top products in front of
                      every visitor.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      showToast(
                        "Brand of the Week application submitted to curators.",
                      )
                    }
                    className="bg-[#d6a34c] hover:bg-[#e9c079] text-[#15140f] font-mono text-xs font-bold px-4 py-2 rounded-full transition-colors cursor-pointer w-fit"
                  >
                    Apply now
                  </button>
                </div>

                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                  <div>
                    <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#eef1ec] text-[#5c6851] inline-block mb-2.5">
                      Available now
                    </span>
                    <h4 className="font-serif text-[15px] font-semibold text-[#15140f] mb-2">
                      Create a bundle promotion
                    </h4>
                    <p className="text-xs text-[#6b6960] mb-4 font-light leading-relaxed">
                      Pair your Oversized Hoodie with the Boxy Tee at a small
                      discount — insights show these are already bought together
                      often.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      showToast("Bundle discount campaign draft created.")
                    }
                    className="bg-[#15140f] hover:bg-black text-white font-mono text-xs font-bold px-4 py-2 rounded-full transition-colors cursor-pointer w-fit"
                  >
                    Set up bundle
                  </button>
                </div>

                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                  <div>
                    <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#eef1ec] text-[#5c6851] inline-block mb-2.5">
                      Available now
                    </span>
                    <h4 className="font-serif text-[15px] font-semibold text-[#15140f] mb-2">
                      Featured placement
                    </h4>
                    <p className="text-xs text-[#6b6960] mb-4 font-light leading-relaxed">
                      Pay to feature a product on the marketplace homepage or
                      category page. Always clearly marked as sponsored to
                      customers.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      showToast("Product sponsorship slot selected.")
                    }
                    className="bg-[#15140f] hover:bg-black text-white font-mono text-xs font-bold px-4 py-2 rounded-full transition-colors cursor-pointer w-fit"
                  >
                    Boost a product
                  </button>
                </div>

                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
                  <div>
                    <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#f7f6f1] text-[#6b6960] inline-block mb-2.5">
                      Included
                    </span>
                    <h4 className="font-serif text-[15px] font-semibold text-[#15140f] mb-2">
                      Follower notifications
                    </h4>
                    <p className="text-xs text-[#6b6960] mb-4 font-light leading-relaxed">
                      Your 318 followers are notified automatically whenever you
                      list a new product. No setup required.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      showToast("Follower broadcast queue is active.")
                    }
                    className="border border-[#15140f] text-[#15140f] hover:bg-[#15140f] hover:text-white font-mono text-xs font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer w-fit"
                  >
                    View followers
                  </button>
                </div>

                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between opacity-60">
                  <div>
                    <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#f7f6f1] text-[#6b6960] inline-block mb-2.5">
                      Coming soon
                    </span>
                    <h4 className="font-serif text-[15px] font-semibold text-[#15140f] mb-2">
                      Creator &amp; influencer connections
                    </h4>
                    <p className="text-xs text-[#6b6960] mb-4 font-light leading-relaxed">
                      ROOTED will introduce you to local creators and
                      photographers who want to work with independent brands.
                    </p>
                  </div>
                  <button
                    disabled
                    className="border border-[#e4e1d6] text-[#6b6960] font-mono text-xs px-4 py-2 rounded-full cursor-not-allowed w-fit"
                  >
                    Coming soon
                  </button>
                </div>

                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between opacity-60">
                  <div>
                    <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#f7f6f1] text-[#6b6960] inline-block mb-2.5">
                      Coming soon
                    </span>
                    <h4 className="font-serif text-[15px] font-semibold text-[#15140f] mb-2">
                      Loyalty &amp; repeat-purchase rewards
                    </h4>
                    <p className="text-xs text-[#6b6960] mb-4 font-light leading-relaxed">
                      Let customers earn ROOTED points for shopping your brand,
                      redeemable across the marketplace.
                    </p>
                  </div>
                  <button
                    disabled
                    className="border border-[#e4e1d6] text-[#6b6960] font-mono text-xs px-4 py-2 rounded-full cursor-not-allowed w-fit"
                  >
                    Coming soon
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ============ TAB 8: BRAND PAGE ============ */}
          {activePage === "brandpage" && (
            <section className="space-y-5 animate-fade-in">
              {/* Callout */}
              <div className="bg-[#faf6ec] border border-[#ecdfba] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <b className="font-serif text-sm text-[#15140f] block mb-1">
                    This is your public page
                  </b>
                  <p className="text-xs text-[#15140f] max-w-xl font-light leading-relaxed">
                    Founder story, timeline and photos are set up by the ROOTED
                    team during onboarding. Request a change any time.
                  </p>
                </div>
                <button
                  onClick={() =>
                    showToast(
                      "Brand profile update request logged with onboarding concierge.",
                    )
                  }
                  className="bg-[#15140f] hover:bg-black text-white text-xs font-mono font-semibold px-4 py-2 rounded-full transition-colors shrink-0 cursor-pointer"
                >
                  Request an update
                </button>
              </div>

              {/* Brand Page Live Preview */}
              <div className="bg-white border border-[#e4e1d6] rounded-xl overflow-hidden shadow-2xs">
                <div className="flex gap-5 p-6 items-end border-b border-[#e4e1d6]">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-serif font-bold shrink-0 shadow-sm"
                    style={{ backgroundColor: currentBrand.color }}
                  >
                    {currentBrand.letter}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-normal text-[#15140f]">
                      {currentBrand.name}
                    </h3>
                    <span className="text-xs text-[#6b6960] font-mono block mt-1">
                      {currentBrand.origin} — Streetwear, est.{" "}
                      {currentBrand.establishedYear}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm text-[#15140f] font-serif italic leading-relaxed max-w-2xl">
                    "{currentBrand.aboutStory}"
                  </p>
                </div>

                <div className="flex gap-0 px-6 py-5 overflow-x-auto border-t border-[#e4e1d6]">
                  {[
                    {
                      year: "2023",
                      text: "First ten hoodies, sold from a garage",
                    },
                    {
                      year: "2024",
                      text: "First full collection, six cities shipped to",
                    },
                    {
                      year: "2025",
                      text: "Featured in a local streetwear pop-up",
                    },
                    { year: "2026", text: "Joined ROOTED" },
                  ].map((tl, i) => (
                    <div
                      key={i}
                      className="min-w-[150px] pr-5 mr-5 border-r border-dashed border-[#e4e1d6] last:border-none"
                    >
                      <b className="font-serif text-[#a64b34] text-sm">
                        {tl.year}
                      </b>
                      <p className="text-[11px] text-[#6b6960] mt-1 font-mono leading-snug">
                        {tl.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ============ TAB 9: PAYOUTS ============ */}
          {activePage === "payouts" && (
            <section className="space-y-5 animate-fade-in">
              {/* Payout Hero Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 shadow-2xs">
                  <div className="text-[11px] text-[#6b6960] font-mono mb-2">
                    Next payout
                  </div>
                  <div className="font-serif text-2xl text-[#15140f] font-semibold">
                    R11,940
                  </div>
                  <div className="text-[11px] text-[#6b6960] font-mono mt-1.5">
                    Due 20 Sep 2026
                  </div>
                </div>

                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 shadow-2xs">
                  <div className="text-[11px] text-[#6b6960] font-mono mb-2">
                    Commission rate
                  </div>
                  <div className="font-serif text-2xl text-[#15140f] font-semibold">
                    8%
                  </div>
                  <div className="text-[11px] text-[#6b6960] font-mono mt-1.5">
                    Per completed sale
                  </div>
                </div>

                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 shadow-2xs">
                  <div className="text-[11px] text-[#6b6960] font-mono mb-2">
                    Paid out — last 6 months
                  </div>
                  <div className="font-serif text-2xl text-[#15140f] font-semibold">
                    R197,570
                  </div>
                  <div className="text-[11px] text-[#6b6960] font-mono mt-1.5">
                    Across 6 payouts
                  </div>
                </div>
              </div>

              {/* Payout History Table */}
              <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs">
                <h4 className="font-serif text-sm font-semibold text-[#15140f] mb-4">
                  Payout history
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#e4e1d6] text-[10px] text-[#6b6960] uppercase font-mono">
                        <th className="py-2.5 px-3">Period</th>
                        <th className="py-2.5 px-3">Gross sales</th>
                        <th className="py-2.5 px-3">Commission</th>
                        <th className="py-2.5 px-3">Paid out</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e1d6]">
                      {[
                        {
                          period: "August 2026",
                          gross: "R48,750",
                          comm: "R3,900",
                          net: "R44,850",
                          status: "Pending",
                        },
                        {
                          period: "July 2026",
                          gross: "R41,200",
                          comm: "R3,296",
                          net: "R37,904",
                          status: "Paid",
                        },
                        {
                          period: "June 2026",
                          gross: "R37,000",
                          comm: "R2,960",
                          net: "R34,040",
                          status: "Paid",
                        },
                        {
                          period: "May 2026",
                          gross: "R33,400",
                          comm: "R2,672",
                          net: "R30,728",
                          status: "Paid",
                        },
                      ].map((p, i) => (
                        <tr
                          key={i}
                          className="hover:bg-[#f7f6f1] transition-colors"
                        >
                          <td className="py-3 px-3 font-mono font-semibold text-[#15140f]">
                            {p.period}
                          </td>
                          <td className="py-3 px-3 font-mono text-[#15140f]">
                            {p.gross}
                          </td>
                          <td className="py-3 px-3 font-mono text-[#6b6960]">
                            {p.comm}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#454e3d]">
                            {p.net}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[9.5px] font-mono font-semibold px-2.5 py-0.5 rounded-full ${
                                p.status === "Pending"
                                  ? "bg-[#faf1de] text-[#a07a1f]"
                                  : "bg-[#eef1ec] text-[#5c6851]"
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ============ TAB 10: SETTINGS ============ */}
          {activePage === "settings" && (
            <section className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Brand Profile */}
                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs">
                  <h4 className="font-serif text-sm font-semibold text-[#15140f] mb-4">
                    Brand profile
                  </h4>
                  <div className="space-y-3 text-xs">
                    {[
                      ["Brand name", currentBrand.name],
                      ["Location", currentBrand.origin],
                      ["Category", "Streetwear"],
                      ["Founder", "Thabo M."],
                      ["Joined ROOTED", currentBrand.establishedYear || "2026"],
                    ].map(([label, val], idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-2.5 border-b border-[#e4e1d6] last:border-none"
                      >
                        <span className="text-[#15140f] font-medium">
                          {label}
                        </span>
                        <span className="text-[#6b6960] font-mono">{val}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11.5px] text-[#6b6960] mt-3 font-light leading-relaxed">
                    These details are managed by your ROOTED account manager
                    during the beta — request changes from the Brand Page tab.
                  </p>
                </div>

                {/* Notifications */}
                <div className="bg-white border border-[#e4e1d6] rounded-xl p-5 sm:p-6 shadow-2xs">
                  <h4 className="font-serif text-sm font-semibold text-[#15140f] mb-4">
                    Notifications
                  </h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { key: "newOrder", label: "New order received" },
                      { key: "lowStock", label: "Low stock alerts" },
                      { key: "monthlyReport", label: "Monthly report ready" },
                      { key: "newFollower", label: "New follower" },
                      { key: "marketingOpp", label: "Marketing opportunities" },
                    ].map((n) => {
                      const isOn = notificationToggles[n.key]
                      return (
                        <div
                          key={n.key}
                          className="flex justify-between items-center py-2.5 border-b border-[#e4e1d6] last:border-none"
                        >
                          <span className="text-[#15140f]">{n.label}</span>
                          <div
                            onClick={() => {
                              const next = !isOn
                              setNotificationToggles((prev) => ({
                                ...prev,
                                [n.key]: next,
                              }))
                              showToast(
                                `${n.label} notification ${
                                  next ? "enabled" : "muted"
                                }.`,
                              )
                            }}
                            className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${
                              isOn ? "bg-[#454e3d]" : "bg-[#e4e1d6]"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                                isOn ? "left-4.5" : "left-0.5"
                              }`}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Testing & Dummy Account Sandbox Card */}
              <div className="border border-[#d6a34c] bg-[#fdfaf3] rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧪</span>
                    <h4 className="font-serif text-[15px] font-semibold text-[#15140f]">
                      Testing Sandbox & Dummy Account Controls
                    </h4>
                  </div>
                  <span className="text-[10.5px] font-mono font-bold bg-[#d6a34c]/20 text-[#15140f] px-2.5 py-0.5 rounded-full">
                    {currentUser?.status || "Active Sandbox"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-white p-4 rounded-xl border border-[#e4e1d6]">
                  <div>
                    <span className="text-[#6b6960] block text-[10px] uppercase">
                      Active Founder:
                    </span>
                    <b className="text-[#15140f]">{currentUser?.founderName}</b>
                  </div>
                  <div>
                    <span className="text-[#6b6960] block text-[10px] uppercase">
                      Brand Email:
                    </span>
                    <b className="text-[#15140f]">{currentUser?.email}</b>
                  </div>
                  <div>
                    <span className="text-[#6b6960] block text-[10px] uppercase">
                      Test Passkey:
                    </span>
                    <span className="text-[#a64b34] font-semibold">
                      {currentUser?.passkey}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6b6960] block text-[10px] uppercase">
                      Origin / City:
                    </span>
                    <span className="text-[#15140f]">{currentUser?.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap pt-1">
                  <button
                    onClick={handleResetSandboxData}
                    className="px-4 py-2 bg-[#15140f] hover:bg-black text-white text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    ↺ Reset Sandbox Data (Orders &amp; Stock)
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 border border-[#a64b34] text-[#a64b34] hover:bg-[#a64b34] hover:text-white text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    🚪 Sign Out of Atelier Studio
                  </button>
                </div>
              </div>

              {/* Subscription Plans */}
              <div className="space-y-3.5">
                <div className="border border-[#454e3d] bg-[#f7faf6] rounded-xl p-5 sm:p-6">
                  <h4 className="font-serif text-[14.5px] font-semibold text-[#15140f] mb-1.5">
                    Standard plan{" "}
                    <span className="text-[11px] font-mono font-semibold text-[#5c6851]">
                      — current plan
                    </span>
                  </h4>
                  <p className="text-xs text-[#6b6960] mb-2 font-light">
                    Marketplace listing, order management, and basic analytics —
                    included for every brand on ROOTED.
                  </p>
                </div>

                <div className="border border-[#d6a34c] bg-[#fdf9f0] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h4 className="font-serif text-[14.5px] font-semibold text-[#15140f] mb-1.5">
                      Premium analytics{" "}
                      <span className="text-[11px] font-mono font-semibold text-[#d6a34c]">
                        — upgrade
                      </span>
                    </h4>
                    <p className="text-xs text-[#6b6960] font-light max-w-xl">
                      Deeper customer segmentation, full sales history, and
                      priority access to new business intelligence features.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      showToast(
                        "Upgrade request registered. Account manager will follow up.",
                      )
                    }
                    className="bg-[#d6a34c] hover:bg-[#e9c079] text-[#15140f] font-mono text-xs font-bold px-4 py-2 rounded-full transition-colors shrink-0 cursor-pointer"
                  >
                    Upgrade plan
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ---------------- NEW LISTING REQUEST MODAL ---------------- */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 relative border border-[#e4e1d6]">
            <button
              onClick={() => setIsListingModalOpen(false)}
              className="absolute top-4 right-4 text-[#6b6960] hover:text-[#15140f] text-base font-bold cursor-pointer"
            >
              ✕
            </button>

            <span className="inline-block text-[9.5px] font-mono font-bold text-[#a64b34] border border-[#a64b34] px-2.5 py-0.5 rounded-full mb-2">
              CURATED ONBOARDING
            </span>
            <h3 className="font-serif text-xl text-[#15140f] mb-1">
              Request New Streetwear Listing
            </h3>
            <p className="text-xs text-[#6b6960] mb-4 font-light">
              Submit product details for {currentBrand.name}. Curators review
              and publish within 48 hours.
            </p>

            <form
              onSubmit={handleAddNewProductSubmit}
              className="space-y-3.5 text-xs font-mono"
            >
              <div>
                <label className="block text-[10px] uppercase text-[#6b6960] mb-1 font-bold">
                  Silhouette / Garment Name
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. 460 GSM Heavyweight Terry Crewneck"
                  className="w-full border border-[#e4e1d6] rounded-lg p-2.5 focus:outline-none focus:border-[#d6a34c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-[#6b6960] mb-1 font-bold">
                    Retail Price (ZAR)
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="750"
                    className="w-full border border-[#e4e1d6] rounded-lg p-2.5 focus:outline-none focus:border-[#d6a34c]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-[#6b6960] mb-1 font-bold">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="30"
                    className="w-full border border-[#e4e1d6] rounded-lg p-2.5 focus:outline-none focus:border-[#d6a34c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#6b6960] mb-1 font-bold">
                  Fabric &amp; Cut Specification
                </label>
                <input
                  type="text"
                  value={newProdFab}
                  onChange={(e) => setNewProdFab(e.target.value)}
                  placeholder="e.g. 100% Combed Ring-Spun Cotton, Boxy Cut"
                  className="w-full border border-[#e4e1d6] rounded-lg p-2.5 focus:outline-none focus:border-[#d6a34c]"
                />
              </div>

              <div className="pt-3 border-t border-[#e4e1d6] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsListingModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#e4e1d6] text-xs font-mono hover:bg-[#f7f6f1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#15140f] hover:bg-black text-white px-5 py-2 rounded-full text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  Submit Listing Request →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenant Isolation Security Modal */}
      {isTenantSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15140f]/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-6 sm:p-7 relative border border-[#e4e1d6]">
            <button
              onClick={() => setIsTenantSecurityModalOpen(false)}
              className="absolute top-4 right-4 text-[#6b6960] hover:text-[#15140f] text-base font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#454e3d] text-white flex items-center justify-center text-xs">
                🔒
              </span>
              <span className="text-[10px] font-mono font-bold uppercase text-[#454e3d] tracking-wider">
                POPIA &amp; Multi-Tenant Isolation Policy
              </span>
            </div>

            <h3 className="font-serif text-xl text-[#15140f] mb-1.5">
              Strict Tenant Isolation Enforced
            </h3>

            <p className="text-xs text-[#6b6960] leading-relaxed mb-4 font-light">
              To protect brand turnover, proprietary customer order logs, and
              supplier margins,
              <strong> {currentBrand.name}</strong> operates in a dedicated,
              isolated workspace. Direct workspace hopping is strictly disabled
              by policy.
            </p>

            <div className="bg-[#f7f6f1] p-3.5 rounded-xl border border-[#e4e1d6] space-y-2 mb-5 text-xs font-mono">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#6b6960]">Authenticated Tenant:</span>
                <b className="text-[#15140f]">{currentBrand.name}</b>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#6b6960]">Access Status:</span>
                <span className="text-[#454e3d] font-bold">
                  Encrypted &amp; Isolated
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#6b6960]">Cross-Tenant Access:</span>
                <span className="text-[#a64b34] font-bold">Forbidden</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  setIsTenantSecurityModalOpen(false)
                  handleSignOut()
                }}
                className="flex-1 py-2.5 bg-[#a64b34] hover:bg-[#8e3f2b] text-white text-xs font-mono font-bold rounded-xl transition-colors cursor-pointer text-center shadow-xs"
              >
                🚪 Sign Out &amp; Switch Label
              </button>
              <button
                onClick={() => setIsTenantSecurityModalOpen(false)}
                className="py-2.5 px-4 border border-[#e4e1d6] hover:bg-[#f7f6f1] text-[#15140f] text-xs font-mono rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#15140f] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#2b291f] flex items-center gap-3 animate-fade-in text-xs font-mono">
          <span className="text-[#d6a34c] text-base">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
