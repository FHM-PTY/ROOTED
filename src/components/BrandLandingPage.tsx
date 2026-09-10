import React, { useState, useMemo } from "react"
import { Vendor, Product } from "../types"

interface BrandLandingPageProps {
  vendor: Vendor
  allProducts: Product[]
  allVendors: Vendor[]
  wishlist: number[]
  currency: "ZAR" | "USD" | "EUR"
  formatPrice: (amount: number) => string
  onAddToCart: (product: Product, size: string) => void
  onToggleWishlist: (productId: number) => void
  onSelectProduct: (product: Product) => void
  onNavigateHome: () => void
  onNavigateBrand: (slug: string) => void
}

export default function BrandLandingPage({
  vendor,
  allProducts,
  allVendors,
  wishlist,
  formatPrice,
  onAddToCart,
  onToggleWishlist,
  onSelectProduct,
  onNavigateHome,
  onNavigateBrand,
}: BrandLandingPageProps) {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high">(
    "featured",
  )

  // Products belonging to this brand
  const brandProducts = useMemo(() => {
    let list = allProducts.filter(
      (p) => p.brandSlug === vendor.slug || p.brand === vendor.name,
    )

    if (selectedSubCategory !== "all") {
      list = list.filter((p) => p.category === selectedSubCategory)
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price)
    }

    return list
  }, [allProducts, vendor, selectedSubCategory, sortBy])

  // Other brands from same city / region
  const relatedVendors = useMemo(() => {
    return allVendors
      .filter(
        (v) =>
          v.id !== vendor.id &&
          (v.city === vendor.city || v.isThrift === vendor.isThrift),
      )
      .slice(0, 3)
  }, [allVendors, vendor])

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
      {/* 1. BREADCRUMBS & TOP BAR */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#111827] font-medium"
            >
              Home
            </button>
            <span>/</span>
            <a href="#/brands" className="hover:text-[#111827] font-medium">
              Brands
            </a>
            <span>/</span>
            <span className="text-[#111827] font-bold">{vendor.name}</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="text-xs font-bold text-[#111827] hover:underline flex items-center gap-1.5"
          >
            <span>←</span> Back to Marketplace
          </button>
        </div>
      </div>

      {/* 2. BRAND COVER HERO BANNER */}
      <section className="relative bg-[#111827] text-white">
        {/* Cover Background Image */}
        <div className="absolute inset-0 overflow-hidden opacity-35">
          <img
            src={vendor.coverImage}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/70 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
          <div className="max-w-3xl space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/10 text-white backdrop-blur-xs text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                <span>✓</span> Verified Founding Label
              </span>
              <span className="bg-white/15 text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase">
                {vendor.origin}
              </span>
              <span className="bg-white/10 text-[#9CA3AF] text-[10px] font-mono px-2 py-0.5 rounded-full">
                Est. {vendor.establishedYear}
              </span>
            </div>

            {/* Brand Title */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black font-display shrink-0 shadow-lg"
                style={{ backgroundColor: vendor.color }}
              >
                {vendor.letter}
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-display">
                  {vendor.name}
                </h1>
                <span className="text-xs sm:text-sm text-[#D1D5DB] font-mono">
                  Coordinates: {vendor.coordinates}
                </span>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-base sm:text-lg text-[#F3F4F6] font-light leading-relaxed">
              {vendor.tagline}
            </p>

            {/* Contact & Share */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const text = encodeURIComponent(
                    `Hello ${vendor.name}, I am browsing your collection on Le Benkeleng: ${window.location.href}`,
                  )
                  window.open(`https://wa.me/?text=${text}`, "_blank")
                }}
                className="bg-[#25D366] text-black text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#20ba5a] transition-colors flex items-center gap-2"
              >
                <span>💬</span> Message Atelier on WhatsApp
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert(`Copied link to ${vendor.name} store!`)
                }}
                className="bg-white/10 hover:bg-white/15 text-white text-xs font-bold px-5 py-2.5 rounded-full backdrop-blur-xs transition-all"
              >
                Share Brand Store
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BRAND TRUST STATS STRIP */}
      <section className="bg-white border-b border-[#E5E7EB] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <span className="text-[#6B7280] text-[10px] uppercase block">
              Dispatch SLA:
            </span>
            <span className="font-bold text-[#111827] text-sm">48 Hours</span>
            <span className="text-[10px] text-[#059669] block">
              ✓ Handed over to Bob Go
            </span>
          </div>

          <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <span className="text-[#6B7280] text-[10px] uppercase block">
              Fulfillment Hub:
            </span>
            <span className="font-bold text-[#111827] text-xs truncate block">
              {vendor.dispatchHub}
            </span>
            <span className="text-[10px] text-[#6B7280] block">
              Smart Locker Dispatched
            </span>
          </div>

          <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <span className="text-[#6B7280] text-[10px] uppercase block">
              Price Range:
            </span>
            <span className="font-bold text-[#111827] text-sm">
              {vendor.priceRange}
            </span>
            <span className="text-[10px] text-[#6B7280] block">
              Payflex 4x Available
            </span>
          </div>

          <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
            <span className="text-[#6B7280] text-[10px] uppercase block">
              Curation Quality:
            </span>
            <span className="font-bold text-gray-900 text-sm">
              4.9 / 5.0 ★
            </span>
            <span className="text-[10px] text-[#059669] block">
              100% Verified Craft
            </span>
          </div>
        </div>
      </section>

      {/* 4. ATELIER STORY & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs font-semibold mb-1">
            <span>✦</span> About the Atelier
          </span>
          <h2 className="text-xl font-bold text-[#111827]">
            Craftsmanship, Silhouette & South African Heritage
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed max-w-4xl font-light">
            {vendor.aboutStory}
          </p>
          {vendor.specialty && (
            <div className="mt-3 inline-block bg-[#F3F4F6] text-[#111827] px-3.5 py-1.5 rounded-md text-xs font-mono font-semibold">
              Signature Specialty: {vendor.specialty}
            </div>
          )}
        </div>
      </section>

      {/* 5. BRAND CATALOG SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Subcategory & Sort Bar */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#111827]">
              {vendor.name} Collection ({brandProducts.length} Items)
            </h3>
            <span className="text-xs text-[#6B7280]">
              Exclusive drops and official catalogue pieces
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#6B7280]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg px-2.5 py-1.5 font-medium text-[#111827] focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Brand Products Grid */}
        {brandProducts.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-xl py-16 text-center space-y-3">
            <span className="text-3xl">📦</span>
            <h4 className="font-bold text-[#111827]">
              No active pieces found in this category
            </h4>
            <button
              onClick={() => setSelectedSubCategory("all")}
              className="bg-[#111827] text-white px-4 py-2 rounded-full text-xs font-bold"
            >
              View All {vendor.name} Pieces
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {brandProducts.map((product) => {
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
                  {/* Image Container */}
                  <div
                    className="relative aspect-3/4 bg-[#F3F4F6] overflow-hidden cursor-pointer"
                    onClick={() => onSelectProduct(product)}
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

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span className="bg-[#111827] text-white text-[9px] font-bold px-2 py-0.5 rounded font-mono">
                        {product.badge}
                      </span>
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
                        if (totalStock === 0 || product.status === "sold_out") {
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

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleWishlist(product.id)
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

                    {/* Size Selector on Hover */}
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
                        if (totalStock === 0 || product.status === "sold_out") {
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
                                      if (!isSizeOut) onAddToCart(product, sz)
                                    }}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all ${
                                      isSizeOut
                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                                        : "bg-gray-100 text-gray-800 hover:bg-black hover:text-white"
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

                  {/* Details */}
                  <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88A35] block truncate">
                        {product.origin}
                      </span>
                      <h3
                        className="text-xs font-semibold text-[#111827] hover:underline cursor-pointer line-clamp-2 leading-snug mt-0.5"
                        onClick={() => onSelectProduct(product)}
                      >
                        {product.title}
                      </h3>
                      <p className="text-[11px] text-[#6B6964] line-clamp-1 mt-0.5 font-light">
                        {product.fabric}
                      </p>
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
                      <div className="text-[10px] text-[#6B6964] font-mono">
                        Pay 4x {formatPrice(Math.round(product.price / 4))} with
                        Payflex
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* 6. MORE INDEPENDENT LABELS CROSS-NAVIGATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-[#E5E7EB]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <span>✦</span> Discover More
              </span>
              <h3 className="text-lg font-bold text-[#111827]">
                Other Independent Streetwear Labels
              </h3>
            </div>
            <a
              href="#/brands"
              className="text-xs font-bold text-[#111827] hover:underline"
            >
              View All Brands A–Z →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedVendors.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onNavigateBrand(rel.slug)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-4 cursor-pointer hover:border-[#111827] transition-all flex items-center gap-3.5 shadow-xs"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold font-display text-base shrink-0"
                  style={{ backgroundColor: rel.color }}
                >
                  {rel.letter}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-[#111827] truncate">
                    {rel.name}
                  </h4>
                  <span className="text-xs text-gray-500 font-medium block">
                    {rel.origin}
                  </span>
                  <span className="text-[10px] text-[#6B6964] block">
                    {rel.productCount} active styles
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
