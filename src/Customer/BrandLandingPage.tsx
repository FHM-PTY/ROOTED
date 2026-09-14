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
    <div className="min-h-screen bg-[#efeee3] text-[#15140f] font-sans selection:bg-[#d6a34c]/20">
      {/* 1. BREADCRUMBS & TOP BAR */}
      <div className="bg-[#fffdf8] border-b border-[rgba(21,20,15,0.12)] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[rgba(21,20,15,0.6)] font-mono">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#15140f] font-medium transition-colors"
            >
              Home
            </button>
            <span className="opacity-40">/</span>
            <a
              href="#/brands"
              className="hover:text-[#15140f] font-medium transition-colors"
            >
              Brands
            </a>
            <span className="opacity-40">/</span>
            <span className="text-[#15140f] font-bold">{vendor.name}</span>
          </div>

          <button
            onClick={onNavigateHome}
            className="text-xs font-mono font-bold text-[#15140f] hover:text-[#a64b34] flex items-center gap-1.5 transition-colors group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            <span>Back to Marketplace</span>
          </button>
        </div>
      </div>

      {/* 2. BRAND COVER HERO BANNER */}
      <section className="relative bg-[#15140f] text-[#fffdf8] overflow-hidden">
        {/* ROOTED Cross-Line Grid Background */}
        <div className="hero-grid absolute inset-0 opacity-40 pointer-events-none" />

        {/* Cover Background Image */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <img
            src={vendor.coverImage}
            alt={vendor.name}
            className="w-full h-full object-cover scale-105 filter saturate-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15140f] via-[#15140f]/75 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 z-10">
          <div className="max-w-3xl space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[rgba(255,253,248,0.1)] text-[#fffdf8] border border-[rgba(255,253,248,0.2)] backdrop-blur-xs text-[11px] font-mono px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="text-[#d6a34c]">✓</span> Verified Founding
                Label
              </span>
              <span className="bg-[#a64b34] text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                {vendor.origin}
              </span>
              <span className="bg-[rgba(255,253,248,0.08)] text-[rgba(255,253,248,0.7)] text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[rgba(255,253,248,0.12)]">
                Est. {vendor.establishedYear}
              </span>
            </div>

            {/* Brand Title */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-serif shrink-0 shadow-lg border border-[rgba(255,253,248,0.2)]"
                style={{ backgroundColor: vendor.color }}
              >
                {vendor.letter}
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl font-normal tracking-tight font-serif text-[#fffdf8]">
                  {vendor.name}
                </h1>
                <span className="text-xs sm:text-sm text-[#d6a34c] font-mono block mt-0.5">
                  Coordinates: {vendor.coordinates}
                </span>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-base sm:text-lg text-[rgba(255,253,248,0.88)] font-serif italic leading-relaxed">
              &ldquo;{vendor.tagline}&rdquo;
            </p>

            {/* Contact & Share */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const text = encodeURIComponent(
                    `Hello ${vendor.name}, I am browsing your collection on ROOTED: ${window.location.href}`,
                  )
                  window.open(`https://wa.me/?text=${text}`, "_blank")
                }}
                className="bg-[#454e3d] hover:bg-[#5c6851] text-[#fffdf8] text-xs font-mono font-bold px-5 py-2.5 rounded-full border border-[rgba(255,253,248,0.2)] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>💬</span> Message Atelier on WhatsApp
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert(`Copied link to ${vendor.name} store!`)
                }}
                className="bg-[rgba(255,253,248,0.1)] hover:bg-[rgba(255,253,248,0.18)] text-[#fffdf8] text-xs font-mono font-medium px-5 py-2.5 rounded-full backdrop-blur-xs border border-[rgba(255,253,248,0.18)] transition-all cursor-pointer"
              >
                Share Brand Store
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BRAND TRUST STATS STRIP */}
      <section className="bg-[#fffdf8] border-b border-[rgba(21,20,15,0.12)] py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 bg-[#e6e3d3]/30 rounded-xl border border-[rgba(21,20,15,0.08)] hover:border-[#d6a34c]/40 transition-colors">
            <span className="text-[rgba(21,20,15,0.6)] text-[10px] uppercase tracking-wider block">
              Dispatch SLA:
            </span>
            <span className="font-bold text-[#15140f] text-sm">48 Hours</span>
            <span className="text-[10px] text-[#454e3d] font-semibold block">
              ✓ Handed over to Bob Go
            </span>
          </div>

          <div className="p-3.5 bg-[#e6e3d3]/30 rounded-xl border border-[rgba(21,20,15,0.08)] hover:border-[#d6a34c]/40 transition-colors">
            <span className="text-[rgba(21,20,15,0.6)] text-[10px] uppercase tracking-wider block">
              Fulfillment Hub:
            </span>
            <span className="font-bold text-[#15140f] text-xs truncate block">
              {vendor.dispatchHub}
            </span>
            <span className="text-[10px] text-[rgba(21,20,15,0.6)] block">
              Smart Locker Dispatched
            </span>
          </div>

          <div className="p-3.5 bg-[#e6e3d3]/30 rounded-xl border border-[rgba(21,20,15,0.08)] hover:border-[#d6a34c]/40 transition-colors">
            <span className="text-[rgba(21,20,15,0.6)] text-[10px] uppercase tracking-wider block">
              Price Range:
            </span>
            <span className="font-bold text-[#15140f] text-sm">
              {vendor.priceRange}
            </span>
            <span className="text-[10px] text-[rgba(21,20,15,0.6)] block">
              Payflex 4x Available
            </span>
          </div>

          <div className="p-3.5 bg-[#e6e3d3]/30 rounded-xl border border-[rgba(21,20,15,0.08)] hover:border-[#d6a34c]/40 transition-colors">
            <span className="text-[rgba(21,20,15,0.6)] text-[10px] uppercase tracking-wider block">
              Curation Quality:
            </span>
            <span className="font-bold text-[#15140f] text-sm">
              4.9 / 5.0 ★
            </span>
            <span className="text-[10px] text-[#454e3d] font-semibold block">
              100% Verified Craft
            </span>
          </div>
        </div>
      </section>

      {/* 4. ATELIER STORY & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-[#fffdf8] border border-[rgba(21,20,15,0.12)] rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
          <div className="eyebrow">ABOUT THE ATELIER</div>
          <h2 className="text-2xl sm:text-3xl font-normal font-serif text-[#15140f] tracking-tight">
            Craftsmanship, Silhouette & South African Heritage
          </h2>
          <p className="text-sm sm:text-base text-[rgba(21,20,15,0.75)] leading-relaxed max-w-4xl font-light">
            {vendor.aboutStory}
          </p>
          {vendor.specialty && (
            <div className="mt-3 inline-flex items-center gap-2 bg-[#e6e3d3] text-[#15140f] border border-[rgba(21,20,15,0.12)] px-3.5 py-1.5 rounded-full text-xs font-mono font-medium">
              <span className="text-[#a64b34]">✦</span>
              <span>Signature Specialty: {vendor.specialty}</span>
            </div>
          )}
        </div>
      </section>

      {/* 5. BRAND CATALOG SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Subcategory & Sort Bar */}
        <div className="bg-[#fffdf8] border border-[rgba(21,20,15,0.12)] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h3 className="text-xl font-normal font-serif text-[#15140f]">
              {vendor.name} Collection ({brandProducts.length} Pieces)
            </h3>
            <span className="text-xs font-mono text-[rgba(21,20,15,0.6)]">
              Official catalogue pieces & limited atelier drops
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[rgba(21,20,15,0.6)] font-mono">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#efeee3] border border-[rgba(21,20,15,0.12)] rounded-full px-3 py-1.5 font-mono font-medium text-[#15140f] focus:outline-none focus:border-[#a64b34]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Brand Products Grid */}
        {brandProducts.length === 0 ? (
          <div className="bg-[#fffdf8] border border-[rgba(21,20,15,0.12)] rounded-2xl py-16 text-center space-y-3">
            <span className="text-3xl">📦</span>
            <h4 className="font-serif text-lg font-normal text-[#15140f]">
              No active pieces found in this category
            </h4>
            <button
              onClick={() => setSelectedSubCategory("all")}
              className="bg-[#15140f] hover:bg-[#1e1c15] text-[#fffdf8] px-5 py-2 rounded-full text-xs font-mono font-bold transition-colors cursor-pointer"
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
                  className="bg-[#fffdf8] border border-[rgba(21,20,15,0.12)] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#a64b34] hover:shadow-lg transition-all duration-300"
                >
                  {/* Image Container */}
                  <div
                    className="relative aspect-3/4 bg-[#e6e3d3]/40 overflow-hidden cursor-pointer"
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
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      <span className="bg-[#15140f] text-[#fffdf8] text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
                        {product.badge}
                      </span>
                      {discountPercent && (
                        <span className="bg-[#a64b34] text-white text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
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
                            <span className="bg-[#a64b34] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                              SOLD OUT
                            </span>
                          )
                        }
                        if (totalStock <= 4) {
                          return (
                            <span className="bg-[#d6a34c] text-[#15140f] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
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
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#fffdf8]/90 backdrop-blur-xs flex items-center justify-center text-[#15140f] hover:bg-[#fffdf8] border border-[rgba(21,20,15,0.12)] shadow-xs transition-transform active:scale-90 z-10"
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

                    {/* Size Selector on Hover */}
                    <div className="absolute inset-x-0 bottom-0 bg-[#fffdf8]/95 backdrop-blur-xs p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 border-t border-[rgba(21,20,15,0.12)] z-10">
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
                            <div className="text-center text-[10px] font-mono font-bold text-[#a64b34] py-1">
                              OUT OF STOCK
                            </div>
                          )
                        }
                        return (
                          <>
                            <span className="text-[9px] font-mono font-bold text-[rgba(21,20,15,0.6)] uppercase tracking-wider block text-center mb-1">
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
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                                      isSizeOut
                                        ? "bg-[#efeee3] text-[rgba(21,20,15,0.3)] cursor-not-allowed line-through"
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

                  {/* Details */}
                  <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#a64b34] block truncate">
                        {product.origin}
                      </span>
                      <h3
                        className="text-xs font-serif font-semibold text-[#15140f] group-hover:text-[#a64b34] cursor-pointer line-clamp-2 leading-snug mt-0.5 transition-colors"
                        onClick={() => onSelectProduct(product)}
                      >
                        {product.title}
                      </h3>
                      <p className="text-[11px] text-[rgba(21,20,15,0.6)] line-clamp-1 mt-0.5 font-light">
                        {product.fabric}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[rgba(21,20,15,0.08)] space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-serif font-bold text-[#15140f]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-[rgba(21,20,15,0.4)] line-through font-mono">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[rgba(21,20,15,0.6)] font-mono">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 border-t border-[rgba(21,20,15,0.12)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow">DISCOVER MORE</div>
              <h3 className="text-xl sm:text-2xl font-normal font-serif text-[#15140f]">
                Other Independent Streetwear Labels
              </h3>
            </div>
            <a
              href="#/brands"
              className="text-xs font-mono font-bold text-[#15140f] hover:text-[#a64b34] transition-colors"
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
                className="bg-[#fffdf8] border border-[rgba(21,20,15,0.12)] rounded-2xl p-4 cursor-pointer hover:border-[#a64b34] hover:shadow-md transition-all flex items-center gap-3.5 shadow-xs group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-serif font-bold text-base shrink-0 shadow-xs"
                  style={{ backgroundColor: rel.color }}
                >
                  {rel.letter}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-serif font-bold text-[#15140f] group-hover:text-[#a64b34] truncate transition-colors">
                    {rel.name}
                  </h4>
                  <span className="text-xs text-[rgba(21,20,15,0.6)] font-mono block">
                    {rel.origin}
                  </span>
                  <span className="text-[10px] text-[#d6a34c] font-mono block">
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
