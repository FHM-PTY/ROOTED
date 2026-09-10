import React, { useState, useMemo } from "react"
import { Vendor, Product, VendorOrder, Category, Gender } from "../types"
import { streetwearImagePresets } from "../data/marketplaceData"

interface VendorDashboardProps {
  currentVendor: Vendor
  allVendors: Vendor[]
  allProducts: Product[]
  allOrders: VendorOrder[]
  onSelectVendor: (vendor: Vendor) => void
  onAddProduct: (product: Product) => void
  onUpdateProduct: (product: Product) => void
  onDeleteProduct: (productId: number) => void
  onUpdateStock: (productId: number, size: string, newQty: number) => void
  onUpdateVendorProfile: (vendor: Vendor) => void
  onUpdateOrderStatus: (
    orderId: string,
    newStatus: VendorOrder["status"],
  ) => void
  onResetDemoData: () => void
  onNavigateHome: () => void
  onNavigateBrand: (slug: string) => void
  formatPrice: (amount: number) => string
}

export default function VendorDashboard({
  currentVendor,
  allVendors,
  allProducts,
  allOrders,
  onSelectVendor,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateStock,
  onUpdateVendorProfile,
  onUpdateOrderStatus,
  onResetDemoData,
  onNavigateHome,
  onNavigateBrand,
  formatPrice,
}: VendorDashboardProps) {
  // Tabs: overview, inventory, storefront, orders
  const [activeTab, setActiveTab] =
    useState<"overview" | "inventory" | "storefront" | "orders">("inventory")

  // Filter & Search in Inventory
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [stockStatusFilter, setStockStatusFilter] =
    useState<"all" | "low" | "out">("all")

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isSwitchVendorOpen, setIsSwitchVendorOpen] = useState(false)
  const [productToEdit, setProductToEdit] = useState<Product | null>(null)

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Products belonging to this vendor
  const vendorProducts = useMemo(() => {
    return allProducts.filter(
      (p) =>
        p.brandSlug === currentVendor.slug || p.brand === currentVendor.name,
    )
  }, [allProducts, currentVendor])

  // Orders for this vendor
  const vendorOrders = useMemo(() => {
    return allOrders.filter((o) => o.brandSlug === currentVendor.slug)
  }, [allOrders, currentVendor])

  // Financial calculations
  const analytics = useMemo(() => {
    const totalGmv = vendorOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    const totalCommission = vendorOrders.reduce(
      (sum, o) => sum + o.commissionAmount,
      0,
    )
    const netPayout = vendorOrders.reduce((sum, o) => sum + o.payoutAmount, 0)
    const lowStockCount = vendorProducts.filter((p) => {
      const total =
        p.stock ??
        (p.stockPerSize
          ? Object.values(p.stockPerSize).reduce((a, b) => a + b, 0)
          : 0)
      return total > 0 && total <= 4
    }).length
    const outOfStockCount = vendorProducts.filter((p) => {
      const total =
        p.stock ??
        (p.stockPerSize
          ? Object.values(p.stockPerSize).reduce((a, b) => a + b, 0)
          : 0)
      return total === 0
    }).length

    return {
      totalGmv,
      totalCommission,
      netPayout,
      totalProducts: vendorProducts.length,
      lowStockCount,
      outOfStockCount,
      activeOrdersCount: vendorOrders.filter((o) => o.status !== "collected")
        .length,
    }
  }, [vendorOrders, vendorProducts])

  // Filtered inventory list
  const filteredInventory = useMemo(() => {
    return vendorProducts.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = p.title.toLowerCase().includes(q)
        const matchesCategory = p.category.toLowerCase().includes(q)
        const matchesFabric = p.fabric.toLowerCase().includes(q)
        if (!matchesTitle && !matchesCategory && !matchesFabric) return false
      }

      if (filterCategory !== "all" && p.category !== filterCategory) {
        return false
      }

      const totalStock =
        p.stock ??
        (p.stockPerSize
          ? Object.values(p.stockPerSize).reduce((a, b) => a + b, 0)
          : 0)
      if (stockStatusFilter === "low" && (totalStock > 4 || totalStock === 0))
        return false
      if (stockStatusFilter === "out" && totalStock > 0) return false

      return true
    })
  }, [vendorProducts, searchQuery, filterCategory, stockStatusFilter])

  // Product Form State (for both Add and Edit)
  const [formTitle, setFormTitle] = useState("")
  const [formCategory, setFormCategory] = useState<Category>("outerwear")
  const [formGender, setFormGender] = useState<Gender[]>(["UNISEX"])
  const [formPrice, setFormPrice] = useState<number>(850)
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | "">("")
  const [formFabric, setFormFabric] = useState(
    "460 GSM Heavyweight French Terry Cotton",
  )
  const [formDescription, setFormDescription] = useState("")
  const [formBadge, setFormBadge] = useState("NEW DROP")
  const [formImage, setFormImage] = useState("")
  const [formSecondaryImage, setFormSecondaryImage] = useState("")
  const [formImageMode, setFormImageMode] = useState<"custom" | "preset">(
    "preset",
  )
  const [formSizesInput, setFormSizesInput] = useState<string>("S, M, L, XL")
  const [formStockPerSize, setFormStockPerSize] =
    useState<Record<string, number>>({
      S: 5,
      M: 8,
      L: 6,
      XL: 3,
    })
  // Thrift-specific
  const [formIsThrift, setFormIsThrift] = useState<boolean>(
    currentVendor.isThrift || false,
  )
  const [formCondition, setFormCondition] = useState("★ Grade A+ Mint Vintage")
  const [formMeasurements, setFormMeasurements] = useState(
    "Pit-to-Pit: 58cm | Length: 70cm",
  )

  // Storefront Profile Form State
  const [profileTagline, setProfileTagline] = useState(currentVendor.tagline)
  const [profileStory, setProfileStory] = useState(currentVendor.aboutStory)
  const [profileHub, setProfileHub] = useState(currentVendor.dispatchHub)
  const [profileCover, setProfileCover] = useState(currentVendor.coverImage)
  const [profilePhone, setProfilePhone] = useState(
    currentVendor.contactPhone || "+27 72 849 2011",
  )
  const [profileInstagram, setProfileInstagram] = useState(
    currentVendor.instagram || "@" + currentVendor.slug.replace("-", ""),
  )
  const [profileColor, setProfileColor] = useState(currentVendor.color)

  // Sync profile form when switching current vendor
  React.useEffect(() => {
    setProfileTagline(currentVendor.tagline)
    setProfileStory(currentVendor.aboutStory)
    setProfileHub(currentVendor.dispatchHub)
    setProfileCover(currentVendor.coverImage)
    setProfilePhone(currentVendor.contactPhone || "+27 72 849 2011")
    setProfileInstagram(
      currentVendor.instagram || "@" + currentVendor.slug.replace("-", ""),
    )
    setProfileColor(currentVendor.color)
    setFormIsThrift(currentVendor.isThrift || false)
  }, [currentVendor])

  // Open modal to create new product
  const handleOpenAddModal = () => {
    setProductToEdit(null)
    setFormTitle("")
    setFormCategory(currentVendor.isThrift ? "thrift" : "outerwear")
    setFormGender(["UNISEX"])
    setFormPrice(currentVendor.isThrift ? 450 : 850)
    setFormOriginalPrice("")
    setFormFabric(
      currentVendor.isThrift
        ? "100% Vintage Washed Cotton"
        : "380 GSM Heavyweight Cotton Fleece",
    )
    setFormDescription(
      "Architecturally tailored for Gauteng urban lifestyle. Detailed finish and reinforced seams.",
    )
    setFormBadge(currentVendor.isThrift ? "1-OF-1 VINTAGE" : "NEW DROP")
    setFormImage(streetwearImagePresets[0].image)
    setFormSecondaryImage(streetwearImagePresets[0].secondaryImage)
    setFormImageMode("preset")

    const defaultSizes = currentVendor.isThrift
      ? ["L (Boxy 90s Fit)"]
      : ["S", "M", "L", "XL"]
    setFormSizesInput(defaultSizes.join(", "))
    const initialStocks: Record<string, number> = {}
    defaultSizes.forEach((s) => {
      initialStocks[s] = currentVendor.isThrift ? 1 : 5
    })
    setFormStockPerSize(initialStocks)
    setIsProductModalOpen(true)
  }

  // Open modal to edit existing product
  const handleOpenEditModal = (product: Product) => {
    setProductToEdit(product)
    setFormTitle(product.title)
    setFormCategory(product.category)
    setFormGender(product.gender)
    setFormPrice(product.price)
    setFormOriginalPrice(product.originalPrice ?? "")
    setFormFabric(product.fabric)
    setFormDescription(product.description)
    setFormBadge(product.badge)
    setFormImage(product.image)
    setFormSecondaryImage(product.secondaryImage)
    setFormImageMode("custom")
    setFormSizesInput(product.sizes.join(", "))

    // Parse stock
    if (product.stockPerSize && Object.keys(product.stockPerSize).length > 0) {
      setFormStockPerSize(product.stockPerSize)
    } else {
      const derived: Record<string, number> = {}
      const avg = Math.max(
        1,
        Math.floor((product.stock || 8) / product.sizes.length),
      )
      product.sizes.forEach((s) => (derived[s] = avg))
      setFormStockPerSize(derived)
    }

    setFormIsThrift(product.isThrift || false)
    setFormCondition(product.condition || "★ Grade A+ Mint Vintage")
    setFormMeasurements(
      product.measurements || "Pit-to-Pit: 58cm | Length: 70cm",
    )
    setIsProductModalOpen(true)
  }

  // Image Upload handler for custom file
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isSecondary: boolean = false,
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (isSecondary) {
          setFormSecondaryImage(reader.result as string)
        } else {
          setFormImage(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Save product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    // Parse sizes
    const parsedSizes = formSizesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    // Calculate total stock
    const totalStock = Object.values(formStockPerSize).reduce(
      (a, b) => a + Number(b || 0),
      0,
    )

    if (productToEdit) {
      // Update
      const updated: Product = {
        ...productToEdit,
        title: formTitle,
        category: formCategory,
        gender: formGender,
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : null,
        fabric: formFabric,
        description: formDescription,
        badge: formBadge,
        image: formImage || streetwearImagePresets[0].image,
        secondaryImage:
          formSecondaryImage ||
          formImage ||
          streetwearImagePresets[0].secondaryImage,
        sizes: parsedSizes.length > 0 ? parsedSizes : ["One Size"],
        stockPerSize: formStockPerSize,
        stock: totalStock,
        status: totalStock === 0 ? "sold_out" : "active",
        isThrift: formIsThrift,
        condition: formIsThrift ? formCondition : undefined,
        measurements: formIsThrift ? formMeasurements : undefined,
      }
      onUpdateProduct(updated)
      showToast(`Updated "${updated.title}" successfully. Live site updated!`)
    } else {
      // Add new
      const newProduct: Product = {
        id: Date.now(),
        title: formTitle,
        brand: currentVendor.name,
        brandSlug: currentVendor.slug,
        category: formCategory,
        city: currentVendor.city,
        gender: formGender,
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : null,
        fabric: formFabric,
        description: formDescription,
        badge: formBadge,
        origin: currentVendor.origin,
        image: formImage || streetwearImagePresets[0].image,
        secondaryImage:
          formSecondaryImage ||
          formImage ||
          streetwearImagePresets[0].secondaryImage,
        sizes: parsedSizes.length > 0 ? parsedSizes : ["One Size"],
        stockPerSize: formStockPerSize,
        stock: totalStock,
        status: totalStock === 0 ? "sold_out" : "active",
        isNew: true,
        isThrift: formIsThrift,
        isPretoria: currentVendor.city === "Pretoria",
        condition: formIsThrift ? formCondition : undefined,
        measurements: formIsThrift ? formMeasurements : undefined,
      }
      onAddProduct(newProduct)
      showToast(
        `Added "${newProduct.title}" to catalog! Visible on homepage & brand page.`,
      )
    }

    setIsProductModalOpen(false)
  }

  // Save brand storefront profile
  const handleSaveStorefront = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedVendor: Vendor = {
      ...currentVendor,
      tagline: profileTagline,
      aboutStory: profileStory,
      dispatchHub: profileHub,
      coverImage: profileCover,
      contactPhone: profilePhone,
      instagram: profileInstagram,
      color: profileColor,
    }
    onUpdateVendorProfile(updatedVendor)
    showToast(
      `Saved brand settings for ${updatedVendor.name}! Public storefront updated.`,
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] pb-16">
      {/* 1. TOP PORTAL HEADER BAR */}
      <header className="bg-[#111827] text-white border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0"
              style={{ backgroundColor: currentVendor.color }}
            >
              {currentVendor.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight">
                  {currentVendor.name}
                </span>
                <span className="bg-[#C88A35] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  Vendor Partner
                </span>
              </div>
              <span className="text-[11px] text-gray-400 block">
                {currentVendor.origin} • 13% Marketplace Commission Model
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* Switch Brand Demo Account */}
            <button
              onClick={() => setIsSwitchVendorOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>⇄</span> Switch Brand
            </button>

            {/* View Live Storefront */}
            <button
              onClick={() => onNavigateBrand(currentVendor.slug)}
              className="bg-[#C88A35] hover:bg-[#B37827] text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>View Public Storefront →</span>
            </button>

            {/* Return to Marketplace */}
            <button
              onClick={onNavigateHome}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              ← Customer View
            </button>

            {/* Reset Data */}
            <button
              onClick={() => {
                if (
                  confirm(
                    "Reset all products and vendors to demo seed data? Any custom additions will be cleared.",
                  )
                ) {
                  onResetDemoData()
                  showToast("Restored all marketplace data to default seed!")
                }
              }}
              title="Reset data to defaults"
              className="text-gray-400 hover:text-red-400 px-2 py-1 transition-colors"
            >
              ↺ Reset Seed
            </button>
          </div>
        </div>

        {/* 2. NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-6 overflow-x-auto text-xs font-bold border-t border-gray-800">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "inventory"
                ? "border-[#C88A35] text-[#C88A35]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span>📦 Clothing Inventory & Stock</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px]">
              {vendorProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-[#C88A35] text-[#C88A35]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span>📊 Sales & Payouts</span>
            <span className="bg-[#C88A35]/20 text-[#C88A35] px-2 py-0.5 rounded-full text-[10px]">
              {formatPrice(analytics.netPayout)}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-[#C88A35] text-[#C88A35]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span>🚚 Bob Go Orders & Logistics</span>
            {analytics.activeOrdersCount > 0 && (
              <span className="bg-amber-500 text-black px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold">
                {analytics.activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("storefront")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "storefront"
                ? "border-[#C88A35] text-[#C88A35]"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span>🏪 Storefront Brand Settings</span>
          </button>
        </div>
      </header>

      {/* TOAST MESSAGE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-fade-in text-xs font-medium">
          <span className="text-emerald-400 text-base">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* ========================================================================= */}
        {/* TAB 1: INVENTORY & CLOTHING CATALOG */}
        {/* ========================================================================= */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            {/* Top Bar: Action + Stats Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <div>
                <h1 className="text-xl font-bold text-[#111827]">
                  Clothing Stock & Catalog
                </h1>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Input stock per size, update retail prices, and toggle styles.
                  Changes reflect instantly on Le Benkeleng clothing cards.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenAddModal}
                  className="bg-[#111827] hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 shrink-0"
                >
                  <span className="text-base leading-none">+</span>
                  <span>Add New Clothing Piece</span>
                </button>
              </div>
            </div>

            {/* Quick Alerts for Low / Out of Stock */}
            {(analytics.lowStockCount > 0 || analytics.outOfStockCount > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analytics.lowStockCount > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-medium">
                      <span>⚠️</span>
                      <span>
                        <strong>{analytics.lowStockCount} items</strong> have
                        low stock (&lt;= 4 pieces left). Customers see "Low
                        Stock" warning.
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setStockStatusFilter(
                          stockStatusFilter === "low" ? "all" : "low",
                        )
                      }
                      className="text-amber-800 font-bold underline shrink-0 ml-2"
                    >
                      {stockStatusFilter === "low" ? "Show All" : "Filter Low"}
                    </button>
                  </div>
                )}

                {analytics.outOfStockCount > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-red-900 font-medium">
                      <span>🛑</span>
                      <span>
                        <strong>{analytics.outOfStockCount} items</strong> are
                        Sold Out. Storefront cards show "SOLD OUT" badge.
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setStockStatusFilter(
                          stockStatusFilter === "out" ? "all" : "out",
                        )
                      }
                      className="text-red-800 font-bold underline shrink-0 ml-2"
                    >
                      {stockStatusFilter === "out" ? "Show All" : "Filter Out"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Search & Category Filter Strip */}
            <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                <span className="text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search your collection by title, fabric, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full focus:outline-none text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#111827]"
                >
                  <option value="all">All Categories</option>
                  <option value="outerwear">Outerwear & Hoodies</option>
                  <option value="workwear">Workwear & Denim</option>
                  <option value="kicks">Footwear & Sneakers</option>
                  <option value="accessories">Accessories & Bags</option>
                  <option value="pretoria">Pretoria (012) Special</option>
                  <option value="thrift">1-of-1 Vintage / Thrift</option>
                </select>

                <select
                  value={stockStatusFilter}
                  onChange={(e) => setStockStatusFilter(e.target.value as any)}
                  className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#111827]"
                >
                  <option value="all">All Stock Levels</option>
                  <option value="low">Low Stock (≤ 4)</option>
                  <option value="out">Sold Out (0)</option>
                </select>
              </div>
            </div>

            {/* Inventory Table / Card Grid */}
            {filteredInventory.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#E5E7EB] p-12 text-center space-y-3">
                <span className="text-4xl block">👕</span>
                <h3 className="text-base font-bold text-[#111827]">
                  No clothing pieces found
                </h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                  {searchQuery ||
                  filterCategory !== "all" ||
                  stockStatusFilter !== "all"
                    ? "Try adjusting your search query or filters."
                    : "You haven't listed any clothing pieces under this label yet. Click below to add your first piece!"}
                </p>
                <button
                  onClick={handleOpenAddModal}
                  className="bg-[#111827] text-white text-xs font-bold px-4 py-2 rounded-xl mt-2 hover:bg-black"
                >
                  + Add First Piece
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-[10px] font-mono tracking-wider border-b border-[#E5E7EB]">
                      <tr>
                        <th className="py-3 px-4">Item & Silhouette</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Retail Price</th>
                        <th className="py-3 px-4">Stock by Size (Live)</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {filteredInventory.map((product) => {
                        const totalStock =
                          product.stock ??
                          (product.stockPerSize
                            ? Object.values(product.stockPerSize).reduce(
                                (a, b) => a + b,
                                0,
                              )
                            : 0)

                        return (
                          <tr
                            key={product.id}
                            className="hover:bg-[#F9FAFB] transition-colors"
                          >
                            {/* Product Info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-12 h-14 object-cover rounded-lg bg-gray-100 shrink-0 border border-[#E5E7EB]"
                                />
                                <div className="space-y-0.5">
                                  <div className="font-bold text-[#111827] hover:underline cursor-pointer">
                                    {product.title}
                                  </div>
                                  <div className="text-[10px] text-[#6B7280] font-mono">
                                    {product.badge} • {product.origin}
                                  </div>
                                  {product.isThrift && (
                                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono">
                                      1-of-1 Vintage
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4 font-mono text-[11px] text-[#4B5563] capitalize">
                              {product.category}
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#111827]">
                                {formatPrice(product.price)}
                              </div>
                              {product.originalPrice && (
                                <div className="text-[10px] text-[#9CA3AF] line-through">
                                  {formatPrice(product.originalPrice)}
                                </div>
                              )}
                              <div className="text-[10px] text-emerald-700 font-mono">
                                Net: {formatPrice(product.price * 0.87)}
                              </div>
                            </td>

                            {/* Live Stock per Size with Inline Adjustment */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {product.sizes.map((size) => {
                                  const sizeStock =
                                    product.stockPerSize?.[size] ??
                                    (product.isThrift ? 1 : 0)
                                  return (
                                    <div
                                      key={size}
                                      className={`border rounded-md px-2 py-1 text-[11px] flex items-center gap-1.5 ${
                                        sizeStock === 0
                                          ? "border-red-200 bg-red-50 text-red-700"
                                          : sizeStock <= 2
                                            ? "border-amber-200 bg-amber-50 text-amber-800"
                                            : "border-[#E5E7EB] bg-white text-[#111827]"
                                      }`}
                                    >
                                      <span className="font-bold font-mono">
                                        {size}:
                                      </span>
                                      <span className="font-mono">
                                        {sizeStock}
                                      </span>
                                      <div className="flex items-center gap-0.5 ml-1">
                                        <button
                                          onClick={() => {
                                            if (sizeStock > 0) {
                                              onUpdateStock(
                                                product.id,
                                                size,
                                                sizeStock - 1,
                                              )
                                              showToast(
                                                `Reduced ${product.title} (${size}) stock to ${sizeStock - 1}`,
                                              )
                                            }
                                          }}
                                          className="w-4 h-4 rounded bg-gray-200 hover:bg-gray-300 text-black flex items-center justify-center font-bold text-[9px]"
                                          title="Decrease stock by 1"
                                        >
                                          -
                                        </button>
                                        <button
                                          onClick={() => {
                                            onUpdateStock(
                                              product.id,
                                              size,
                                              sizeStock + 1,
                                            )
                                            showToast(
                                              `Restocked ${product.title} (${size}) to ${sizeStock + 1}`,
                                            )
                                          }}
                                          className="w-4 h-4 rounded bg-gray-200 hover:bg-gray-300 text-black flex items-center justify-center font-bold text-[9px]"
                                          title="Increase stock by 1"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                              <div className="text-[10px] text-[#6B7280] font-mono mt-1">
                                Total:{" "}
                                <strong className="text-[#111827]">
                                  {totalStock} in stock
                                </strong>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              {totalStock === 0 ? (
                                <span className="bg-red-100 text-red-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                                  SOLD OUT
                                </span>
                              ) : totalStock <= 4 ? (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                                  LOW STOCK ({totalStock})
                                </span>
                              ) : (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                                  LIVE ({totalStock})
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => handleOpenEditModal(product)}
                                className="bg-[#F3F4F6] hover:bg-gray-200 text-[#111827] font-bold px-2.5 py-1 rounded-md text-[11px] transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Remove "${product.title}" from store? This will immediately remove it from all customer clothing cards.`,
                                    )
                                  ) {
                                    onDeleteProduct(product.id)
                                    showToast(
                                      `Removed "${product.title}" from catalog.`,
                                    )
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 px-2 py-1 text-[11px]"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: OVERVIEW & FINANCIAL EARNINGS */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <h1 className="text-xl font-bold text-[#111827]">
                Earnings & Commission Overview
              </h1>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Transparent 13% commission model per Kasi Drip business plan.
                87% direct payout to your South African business account.
              </p>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#6B7280] uppercase">
                  Gross Merchandise Value (GMV)
                </span>
                <div className="text-2xl font-black text-[#111827] font-display">
                  {formatPrice(analytics.totalGmv)}
                </div>
                <span className="text-[10px] text-[#6B7280] block">
                  Customer checkout volume
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">
                  Net Vendor Payout (87%)
                </span>
                <div className="text-2xl font-black text-emerald-700 font-display">
                  {formatPrice(analytics.netPayout)}
                </div>
                <span className="text-[10px] text-emerald-600 block">
                  Ready for Instant EFT disbursement
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#6B7280] uppercase">
                  Platform Commission (13%)
                </span>
                <div className="text-2xl font-black text-[#6B7280] font-display">
                  {formatPrice(analytics.totalCommission)}
                </div>
                <span className="text-[10px] text-[#6B7280] block">
                  Covers payment gateways & Bob Go hub SLA
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#C88A35] uppercase">
                  48-Hour Dispatch Compliance
                </span>
                <div className="text-2xl font-black text-[#C88A35] font-display">
                  98.5%
                </div>
                <span className="text-[10px] text-[#6B7280] block">
                  Pretoria / Gauteng Bob Go courier handoff
                </span>
              </div>
            </div>

            {/* Payout & Banking Info */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">
                    Registered Payout Account
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Weekly automated EFT payouts every Tuesday at 10:00 AM.
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-mono font-bold px-3 py-1 rounded-full">
                  ✓ Verified Capitec / FNB Business
                </span>
              </div>

              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#6B7280] block text-[10px]">
                    ACCOUNT HOLDER
                  </span>
                  <span className="font-bold text-[#111827]">
                    {currentVendor.name} (Pty) Ltd
                  </span>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px]">
                    BANK & BRANCH
                  </span>
                  <span className="font-bold text-[#111827]">
                    Capitec Business (Branch: 470010)
                  </span>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px]">
                    FULFILLMENT DEPOT
                  </span>
                  <span className="font-bold text-[#111827]">
                    {currentVendor.dispatchHub}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BOB GO ORDERS & LOGISTICS */}
        {/* ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <div>
                <h1 className="text-xl font-bold text-[#111827]">
                  Customer Orders & Bob Go Dispatch
                </h1>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Pack items in Le Benkeleng branded compostable polybags and
                  drop off at your designated Bob Go locker depot within 48
                  hours.
                </p>
              </div>
              <div className="text-xs font-mono bg-[#F3F4F6] px-3 py-1.5 rounded-lg text-[#111827]">
                Local Hub: <strong>{currentVendor.dispatchHub}</strong>
              </div>
            </div>

            {vendorOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#E5E7EB] p-12 text-center space-y-3">
                <span className="text-4xl block">📦</span>
                <h3 className="text-base font-bold text-[#111827]">
                  No customer orders yet
                </h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                  When customers purchase your items via Capitec QR or Payflex,
                  orders appear here with Bob Go waybill labels ready for
                  packing.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {vendorOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[#111827] font-mono">
                            Order #{order.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                              order.status === "pending_pack"
                                ? "bg-amber-100 text-amber-800"
                                : order.status === "dispatched_to_locker"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "in_transit"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {order.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <span className="text-xs text-[#6B7280] mt-0.5 block">
                          Placed: {order.createdAt} • Buyer:{" "}
                          {order.customerName} ({order.customerCity})
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#6B7280] block">
                          Vendor Net Payout
                        </span>
                        <span className="text-base font-black text-emerald-700 font-mono">
                          {formatPrice(order.payoutAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-1"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.productTitle}
                              className="w-10 h-12 object-cover rounded bg-gray-100 border border-[#E5E7EB]"
                            />
                            <div>
                              <div className="font-bold text-[#111827]">
                                {item.productTitle}
                              </div>
                              <div className="text-[11px] text-[#6B7280] font-mono">
                                Size:{" "}
                                <strong className="text-[#111827]">
                                  {item.size}
                                </strong>{" "}
                                • Qty: {item.quantity}
                              </div>
                            </div>
                          </div>
                          <span className="font-bold text-[#111827] font-mono">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bob Go Locker Dispatch Info & Action */}
                    <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-[#6B7280] uppercase block">
                          Destination Bob Go Locker
                        </span>
                        <span className="font-bold text-[#111827]">
                          {order.lockerStation}
                        </span>
                        <span className="text-[11px] text-gray-500 block font-mono">
                          Waybill: {order.waybillNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === "pending_pack" && (
                          <button
                            onClick={() => {
                              onUpdateOrderStatus(
                                order.id,
                                "dispatched_to_locker",
                              )
                              showToast(
                                `Order #${order.orderNumber} marked as dispatched to Bob Go locker!`,
                              )
                            }}
                            className="bg-[#111827] hover:bg-black text-white font-bold px-4 py-2 rounded-xl transition-colors"
                          >
                            Mark as Dispatched to Locker →
                          </button>
                        )}

                        {order.status === "dispatched_to_locker" && (
                          <button
                            onClick={() => {
                              onUpdateOrderStatus(order.id, "in_transit")
                              showToast(
                                `Order #${order.orderNumber} is in transit with courier.`,
                              )
                            }}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl transition-colors"
                          >
                            Mark In Transit →
                          </button>
                        )}

                        {order.status === "in_transit" && (
                          <button
                            onClick={() => {
                              onUpdateOrderStatus(order.id, "ready_for_pickup")
                              showToast(
                                `Order #${order.orderNumber} ready for customer PIN collection.`,
                              )
                            }}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl transition-colors"
                          >
                            Mark Ready for PIN Collection →
                          </button>
                        )}

                        {order.status === "ready_for_pickup" && (
                          <span className="text-emerald-700 font-mono font-bold text-xs">
                            ✓ Waiting for customer PIN retrieval
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: STOREFRONT BRAND SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "storefront" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <div>
                <h1 className="text-xl font-bold text-[#111827]">
                  Brand Storefront Settings
                </h1>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Customize the look, cover photo, founder bio, and logistics
                  hub for your dedicated brand landing page (
                  <code>#/brand/{currentVendor.slug}</code>).
                </p>
              </div>
              <button
                onClick={() => onNavigateBrand(currentVendor.slug)}
                className="bg-[#111827] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-black"
              >
                Preview Live Brand Page →
              </button>
            </div>

            <form
              onSubmit={handleSaveStorefront}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] space-y-5 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={profileTagline}
                    onChange={(e) => setProfileTagline(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                    required
                  />
                  <span className="text-[10px] text-[#6B7280] mt-1 block">
                    Shown on the Brands A–Z directory card and hero badge.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                    Primary Dispatch & Logistics Hub
                  </label>
                  <input
                    type="text"
                    value={profileHub}
                    onChange={(e) => setProfileHub(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                    required
                  />
                  <span className="text-[10px] text-[#6B7280] mt-1 block">
                    Fulfillment center for your 48-hour Bob Go courier handoffs.
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                  Atelier Story & Brand Philosophy
                </label>
                <textarea
                  rows={4}
                  value={profileStory}
                  onChange={(e) => setProfileStory(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827] leading-relaxed"
                  required
                />
                <span className="text-[10px] text-[#6B7280] mt-1 block">
                  Displayed prominently on your dedicated brand storefront hero.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                    Designer WhatsApp Contact
                  </label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                  />
                  <span className="text-[10px] text-[#6B7280] mt-1 block">
                    Powers the "Chat with Designer" button on your storefront.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={profileInstagram}
                    onChange={(e) => setProfileInstagram(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                    Brand Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={profileColor}
                      onChange={(e) => setProfileColor(e.target.value)}
                      className="w-10 h-10 rounded border border-[#D1D5DB] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={profileColor}
                      onChange={(e) => setProfileColor(e.target.value)}
                      className="flex-1 border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827] font-mono uppercase text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                  Hero Cover Campaign Banner
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={profileCover}
                    alt="Cover Banner"
                    className="w-full sm:w-64 h-32 object-cover rounded-xl border border-[#E5E7EB] bg-gray-100"
                  />
                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="url"
                      value={profileCover}
                      onChange={(e) => setProfileCover(e.target.value)}
                      placeholder="Enter high-res image URL"
                      className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                    />
                    <div className="text-[11px] text-[#6B7280]">
                      Or upload a custom campaign cover image from your device:
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = () =>
                            setProfileCover(reader.result as string)
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#111827] file:text-white hover:file:bg-black cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
                <button
                  type="submit"
                  className="bg-[#111827] hover:bg-black text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  Save & Publish Storefront Changes →
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. MODAL: ADD / EDIT CLOTHING PIECE */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white max-w-3xl w-full rounded-2xl shadow-2xl p-6 sm:p-8 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827] text-lg font-bold"
            >
              ✕
            </button>

            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C88A35] block">
              {productToEdit
                ? "Modify Existing Piece"
                : "New Collection Addition"}
            </span>
            <h3 className="text-xl font-bold text-[#111827] mt-0.5">
              {productToEdit
                ? `Edit "${productToEdit.title}"`
                : `Add Piece to ${currentVendor.name}`}
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              All details and stock quantities will reactively update the
              customer marketplace cards in real time.
            </p>

            <form
              onSubmit={handleSaveProduct}
              className="mt-5 space-y-4 text-xs"
            >
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                    Clothing Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 420 GSM Boxy Heavyweight Hoodie"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as Category)
                    }
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                  >
                    <option value="outerwear">Outerwear & Jackets</option>
                    <option value="workwear">Workwear & Trousers</option>
                    <option value="kicks">Footwear & Sneakers</option>
                    <option value="accessories">Accessories & Bags</option>
                    <option value="pretoria">Pretoria (012) Exclusive</option>
                    <option value="thrift">1-of-1 Curated Vintage</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                    Retail Price (ZAR R) *
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    step={10}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827] font-mono font-bold"
                  />
                  <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
                    You receive: R {(formPrice * 0.87).toFixed(0)} (87%)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    min={50}
                    step={10}
                    placeholder="e.g. 1200 for discount"
                    value={formOriginalPrice}
                    onChange={(e) =>
                      setFormOriginalPrice(
                        e.target.value ? Number(e.target.value) : "",
                      )
                    }
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827] font-mono"
                  />
                  <span className="text-[10px] text-[#6B7280] mt-0.5 block">
                    Triggers a sale badge & discount percentage.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                    Card Badge Tag
                  </label>
                  <input
                    type="text"
                    placeholder="NEW DROP, PRETORIA CUT, etc."
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827] uppercase font-mono"
                  />
                </div>
              </div>

              {/* Fabric & Composition */}
              <div>
                <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                  Fabric & Construction Specification
                </label>
                <input
                  type="text"
                  placeholder="e.g. 480 GSM French Terry Cotton, High Collar, Drop Shoulder"
                  value={formFabric}
                  onChange={(e) => setFormFabric(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                />
              </div>

              {/* Photo Input (Preset OR Custom Upload / URL) */}
              <div className="border border-[#E5E7EB] rounded-xl p-4 bg-[#F9FAFB] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#111827] uppercase text-[10px]">
                    Garment Photography
                  </label>
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setFormImageMode("preset")}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        formImageMode === "preset"
                          ? "bg-[#111827] text-white"
                          : "bg-gray-200 text-[#4B5563]"
                      }`}
                    >
                      Pick Streetwear Preset
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormImageMode("custom")}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        formImageMode === "custom"
                          ? "bg-[#111827] text-white"
                          : "bg-gray-200 text-[#4B5563]"
                      }`}
                    >
                      Upload / Custom Photo
                    </button>
                  </div>
                </div>

                {formImageMode === "preset" ? (
                  <div>
                    <span className="text-[11px] text-[#6B7280] block mb-2">
                      Select one of our curated high-res street style
                      photography presets:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {streetwearImagePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormImage(preset.image)
                            setFormSecondaryImage(preset.secondaryImage)
                            if (!formTitle) setFormTitle(preset.label)
                            setFormCategory(preset.category)
                          }}
                          className={`group rounded-lg overflow-hidden border-2 relative transition-all ${
                            formImage === preset.image
                              ? "border-[#111827] scale-105"
                              : "border-transparent"
                          }`}
                        >
                          <img
                            src={preset.image}
                            alt={preset.label}
                            className="w-full h-16 object-cover"
                          />
                          <span className="text-[8px] block font-mono text-center p-0.5 truncate bg-white">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-[#6B7280] font-bold mb-1">
                          Primary Front Image (URL or Upload):
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs mb-2"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, false)}
                          className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-gray-200 file:text-black cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-[#6B7280] font-bold mb-1">
                          Secondary Hover Angle Image:
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={formSecondaryImage}
                          onChange={(e) =>
                            setFormSecondaryImage(e.target.value)
                          }
                          className="w-full border border-[#D1D5DB] rounded-lg p-2 text-xs mb-2"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, true)}
                          className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-gray-200 file:text-black cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview Thumbnail */}
                {formImage && (
                  <div className="flex items-center gap-3 pt-2 border-t border-[#E5E7EB]">
                    <span className="text-[10px] font-mono text-[#6B7280]">
                      Preview:
                    </span>
                    <img
                      src={formImage}
                      alt="Front"
                      className="w-12 h-14 object-cover rounded border border-[#E5E7EB]"
                    />
                    {formSecondaryImage && (
                      <img
                        src={formSecondaryImage}
                        alt="Hover Angle"
                        className="w-12 h-14 object-cover rounded border border-[#E5E7EB]"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Sizes & Stock Per Size */}
              <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-3">
                <label className="block font-bold text-[#111827] uppercase text-[10px]">
                  Sizes & Stock Quantities *
                </label>
                <div>
                  <span className="text-[10px] text-[#6B7280] block mb-1">
                    Enter comma-separated size labels (e.g. S, M, L, XL or UK 7,
                    UK 8, UK 9):
                  </span>
                  <input
                    type="text"
                    value={formSizesInput}
                    onChange={(e) => {
                      const val = e.target.value
                      setFormSizesInput(val)
                      const parsed = val
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                      const nextStock = { ...formStockPerSize }
                      parsed.forEach((s) => {
                        if (nextStock[s] === undefined) nextStock[s] = 5
                      })
                      setFormStockPerSize(nextStock)
                    }}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2 focus:outline-none focus:border-[#111827]"
                  />
                </div>

                {/* Stock per size input boxes */}
                <div>
                  <span className="text-[10px] font-mono text-[#6B7280] uppercase block mb-1.5">
                    Available Stock Count per Size:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {formSizesInput
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((size) => (
                        <div
                          key={size}
                          className="flex items-center gap-1 border border-[#D1D5DB] rounded-lg px-2 py-1 bg-white"
                        >
                          <span className="font-bold font-mono text-xs">
                            {size}:
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={formStockPerSize[size] ?? 0}
                            onChange={(e) => {
                              const qty = Math.max(
                                0,
                                parseInt(e.target.value) || 0,
                              )
                              setFormStockPerSize((prev) => ({
                                ...prev,
                                [size]: qty,
                              }))
                            }}
                            className="w-12 text-center font-mono font-bold focus:outline-none border-b border-gray-300"
                          />
                        </div>
                      ))}
                  </div>
                  <span className="text-[10px] text-[#6B7280] font-mono mt-2 block">
                    Total Calculated Stock:{" "}
                    <strong>
                      {Object.values(formStockPerSize).reduce(
                        (a, b) => a + Number(b || 0),
                        0,
                      )}{" "}
                      units
                    </strong>
                  </span>
                </div>
              </div>

              {/* Thrift 1-of-1 specifics */}
              {formIsThrift && (
                <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 space-y-3">
                  <span className="text-[10px] font-mono font-bold text-amber-900 uppercase block">
                    1-of-1 Curated Vintage Specs (Dunusa Vault)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-amber-900 mb-1">
                        Condition Standard
                      </label>
                      <input
                        type="text"
                        value={formCondition}
                        onChange={(e) => setFormCondition(e.target.value)}
                        className="w-full border border-amber-300 rounded-lg p-2 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-amber-900 mb-1">
                        Garment Measurements (cm)
                      </label>
                      <input
                        type="text"
                        value={formMeasurements}
                        onChange={(e) => setFormMeasurements(e.target.value)}
                        className="w-full border border-amber-300 rounded-lg p-2 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-bold text-[#111827] uppercase text-[10px] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827]"
                  placeholder="Design inspiration, cut details, fit notes..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#111827] hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  {productToEdit
                    ? "Save Changes to Commerce Site"
                    : "Add to Commerce Storefront →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: SWITCH VENDOR ACCOUNT (DEMO LOGIN) */}
      {/* ========================================================================= */}
      {isSwitchVendorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setIsSwitchVendorOpen(false)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827] font-bold"
            >
              ✕
            </button>

            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C88A35] block">
              Vendor Authentication
            </span>
            <h3 className="text-xl font-bold text-[#111827] mt-0.5">
              Switch Vendor Account
            </h3>
            <p className="text-xs text-[#6B7280] mt-1">
              Select any verified Gauteng / Pretoria brand partner to manage
              their inventory and storefront:
            </p>

            <div className="grid grid-cols-1 gap-2.5 mt-4 max-h-[60vh] overflow-y-auto pr-1">
              {allVendors.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    onSelectVendor(v)
                    setIsSwitchVendorOpen(false)
                    showToast(`Logged in as ${v.name} (${v.origin})`)
                  }}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    v.id === currentVendor.id
                      ? "border-[#111827] bg-[#F9FAFB] shadow-xs"
                      : "border-[#E5E7EB] hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: v.color }}
                    >
                      {v.letter}
                    </div>
                    <div>
                      <div className="font-bold text-[#111827] text-xs flex items-center gap-2">
                        <span>{v.name}</span>
                        {v.isThrift && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-mono">
                            Thrift
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#6B7280] block">
                        {v.origin}
                      </span>
                    </div>
                  </div>

                  {v.id === currentVendor.id ? (
                    <span className="text-xs font-bold text-emerald-600">
                      Active ✓
                    </span>
                  ) : (
                    <span className="text-xs text-[#6B7280]">Select →</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
