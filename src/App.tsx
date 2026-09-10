import { useState } from "react";

type Gender = "ALL" | "WOMEN" | "MEN" | "KIDS";
type Category = "All" | "Outerwear" | "Denim" | "Formalwear" | "Streetwear" | "Activewear" | "Accessories";

interface Vendor {
  id: number;
  name: string;
  tagline: string;
  gender: Gender[];
  categories: Category[];
  priceRange: string;
  origin: string;
  featured: boolean;
  color: string;
  productCount: number;
}

interface Product {
  id: number;
  name: string;
  vendor: string;
  price: number;
  gender: Gender;
  category: Category;
  image: string;
  isNew: boolean;
  isSale: boolean;
  salePrice?: number;
}

const vendors: Vendor[] = [
  { id: 1, name: "NORR", tagline: "Scandinavian minimalism, redefined", gender: ["WOMEN"], categories: ["Outerwear", "Accessories"], priceRange: "$$$", origin: "Copenhagen", featured: true, color: "#1C1C1C", productCount: 42 },
  { id: 2, name: "VOLT", tagline: "Voltage-charged streetwear for the new generation", gender: ["MEN", "WOMEN"], categories: ["Streetwear", "Accessories"], priceRange: "$$", origin: "London", featured: true, color: "#D42B0A", productCount: 87 },
  { id: 3, name: "STRATA", tagline: "Layered denim with geological precision", gender: ["MEN"], categories: ["Denim", "Outerwear"], priceRange: "$$", origin: "Los Angeles", featured: false, color: "#2B3A5C", productCount: 33 },
  { id: 4, name: "MERIDIAN", tagline: "Suiting for the modern professional", gender: ["MEN", "WOMEN"], categories: ["Formalwear"], priceRange: "$$$", origin: "Milan", featured: false, color: "#4A3728", productCount: 56 },
  { id: 5, name: "FLUX KIDS", tagline: "Playful, durable, built to move", gender: ["KIDS"], categories: ["Streetwear", "Activewear", "Denim"], priceRange: "$", origin: "Amsterdam", featured: false, color: "#1A6B3C", productCount: 74 },
  { id: 6, name: "APEX RUN", tagline: "Performance athletic wear with edge", gender: ["MEN", "WOMEN"], categories: ["Activewear"], priceRange: "$$", origin: "Portland", featured: true, color: "#333", productCount: 91 },
  { id: 7, name: "REVERIE", tagline: "Romantic silhouettes, unapologetic femininity", gender: ["WOMEN"], categories: ["Formalwear", "Accessories"], priceRange: "$$$", origin: "Paris", featured: false, color: "#7A3B5E", productCount: 38 },
  { id: 8, name: "GROUNDWORK", tagline: "Utilitarian workwear for every terrain", gender: ["MEN"], categories: ["Outerwear", "Denim", "Accessories"], priceRange: "$$", origin: "Detroit", featured: false, color: "#3D3328", productCount: 49 },
];

const products: Product[] = [
  { id: 1, name: "Fjord Wool Coat", vendor: "NORR", price: 490, gender: "WOMEN", category: "Outerwear", image: "photo-1539109136881-3be0616acf4b", isNew: true, isSale: false },
  { id: 2, name: "Static Bomber Jacket", vendor: "VOLT", price: 220, gender: "MEN", category: "Streetwear", image: "photo-1551537482-f2075a1d41f2", isNew: false, isSale: false },
  { id: 3, name: "Voltage Cargo Pant", vendor: "VOLT", price: 165, gender: "WOMEN", category: "Streetwear", image: "photo-1509631179647-0177331693ae", isNew: true, isSale: false },
  { id: 4, name: "Canyon Raw Denim", vendor: "STRATA", price: 195, gender: "MEN", category: "Denim", image: "photo-1542272604-787c3835535d", isNew: false, isSale: true, salePrice: 140 },
  { id: 5, name: "Atlas Suit Jacket", vendor: "MERIDIAN", price: 780, gender: "MEN", category: "Formalwear", image: "photo-1594938298603-c8148c4dae35", isNew: false, isSale: false },
  { id: 6, name: "Drift Blazer", vendor: "MERIDIAN", price: 640, gender: "WOMEN", category: "Formalwear", image: "photo-1591369822096-ffd140ec948f", isNew: true, isSale: false },
  { id: 7, name: "Sprint Shell Jacket", vendor: "APEX RUN", price: 175, gender: "MEN", category: "Activewear", image: "photo-1544441893-675973e31985", isNew: false, isSale: true, salePrice: 119 },
  { id: 8, name: "Luminary Gown", vendor: "REVERIE", price: 890, gender: "WOMEN", category: "Formalwear", image: "photo-1515886657613-9f3515b0c78f", isNew: true, isSale: false },
  { id: 9, name: "Terrain Field Jacket", vendor: "GROUNDWORK", price: 285, gender: "MEN", category: "Outerwear", image: "photo-1487222477894-8943e31ef7b2", isNew: false, isSale: false },
  { id: 10, name: "Bolt Track Set", vendor: "FLUX KIDS", price: 78, gender: "KIDS", category: "Activewear", image: "photo-1503944583220-79d4dd712a31", isNew: true, isSale: false },
  { id: 11, name: "Mini Canyon Jeans", vendor: "FLUX KIDS", price: 55, gender: "KIDS", category: "Denim", image: "photo-1471286174890-9c112ac6a1f5", isNew: false, isSale: false },
  { id: 12, name: "Meridian Tote", vendor: "NORR", price: 145, gender: "WOMEN", category: "Accessories", image: "photo-1548036328-c9fa89d128fa", isNew: false, isSale: true, salePrice: 99 },
];

const categories: Category[] = ["All", "Outerwear", "Denim", "Formalwear", "Streetwear", "Activewear", "Accessories"];
const genders: { label: string; value: Gender }[] = [
  { label: "ALL", value: "ALL" },
  { label: "WOMEN", value: "WOMEN" },
  { label: "MEN", value: "MEN" },
  { label: "KIDS", value: "KIDS" },
];

const ticker = ["NORR", "VOLT", "STRATA", "MERIDIAN", "FLUX KIDS", "APEX RUN", "REVERIE", "GROUNDWORK", "FREE SHIPPING OVER $150", "NEW ARRIVALS WEEKLY", "NORR", "VOLT", "STRATA", "MERIDIAN", "FLUX KIDS", "APEX RUN", "REVERIE", "GROUNDWORK", "FREE SHIPPING OVER $150", "NEW ARRIVALS WEEKLY"];

export default function App() {
  const [activeGender, setActiveGender] = useState<Gender>("ALL");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeSection, setActiveSection] = useState<"shop" | "vendors">("shop");
  const [cartCount, setCartCount] = useState(0);
  const [vendorFilter, setVendorFilter] = useState<Gender>("ALL");

  const filteredProducts = products.filter((p) => {
    const genderMatch = activeGender === "ALL" || p.gender === activeGender;
    const catMatch = activeCategory === "All" || p.category === activeCategory;
    return genderMatch && catMatch;
  });

  const filteredVendors = vendors.filter((v) => {
    return vendorFilter === "ALL" || v.gender.includes(vendorFilter);
  });

  return (
    <div className="min-h-full bg-[#F4EFE4]" style={{ fontFamily: "'Work Sans', sans-serif" }}>
      {/* Ticker */}
      <div className="bg-[#0A0A0A] text-[#F4EFE4] py-1.5 overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track">
          {ticker.map((t, i) => (
            <span key={i} className="text-[11px] font-semibold tracking-[0.2em] uppercase px-6">
              {t} <span className="text-[#D42B0A] px-2">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="border-b-2 border-[#0A0A0A] bg-[#F4EFE4] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div
                className="text-2xl font-black tracking-[-0.04em] cursor-pointer"
                style={{ fontFamily: "'Libre Baskerville', serif" }}
                onClick={() => setActiveSection("shop")}
              >
                LE <span className="text-[#D42B0A]">BENKELENG</span>
              </div>
              <nav className="hidden md:flex items-center gap-0">
                <button
                  onClick={() => setActiveSection("shop")}
                  className={`text-[12px] font-semibold tracking-[0.15em] uppercase px-4 py-2 border-r border-[#0A0A0A] transition-colors ${activeSection === "shop" ? "bg-[#0A0A0A] text-[#F4EFE4]" : "hover:bg-[#0A0A0A] hover:text-[#F4EFE4]"}`}
                >
                  Shop
                </button>
                <button
                  onClick={() => setActiveSection("vendors")}
                  className={`text-[12px] font-semibold tracking-[0.15em] uppercase px-4 py-2 border-r border-[#0A0A0A] transition-colors ${activeSection === "vendors" ? "bg-[#0A0A0A] text-[#F4EFE4]" : "hover:bg-[#0A0A0A] hover:text-[#F4EFE4]"}`}
                >
                  Vendors
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-[12px] font-semibold tracking-[0.12em] uppercase border border-[#0A0A0A] px-3 py-1.5 hover:bg-[#0A0A0A] hover:text-[#F4EFE4] transition-colors">
                Search
              </button>
              <button
                onClick={() => setCartCount(c => c + 1)}
                className="text-[12px] font-semibold tracking-[0.12em] uppercase bg-[#0A0A0A] text-[#F4EFE4] px-3 py-1.5 hover:bg-[#D42B0A] transition-colors flex items-center gap-2"
              >
                Cart {cartCount > 0 && <span className="bg-[#D42B0A] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {activeSection === "shop" && (
        <>
          {/* Hero */}
          <section className="border-b-2 border-[#0A0A0A]">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-16 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-[#0A0A0A]">
                <div>
                  <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#D42B0A] mb-6">
                    Season Drop — Autumn 2026
                  </div>
                  <h1
                    className="text-[64px] lg:text-[80px] font-bold leading-[0.92] tracking-[-0.03em] mb-8"
                    style={{ fontFamily: "'Libre Baskerville', serif" }}
                  >
                    Eight<br />Brands.<br /><em>One</em><br />Address.
                  </h1>
                  <p className="text-[16px] text-[#5A5045] leading-relaxed max-w-sm font-light">
                    Curated vendors across every gender, every category. From Scandinavian outerwear to Detroit workwear — all in one marketplace.
                  </p>
                </div>
                <div className="flex gap-3 mt-10">
                  <button
                    onClick={() => setActiveGender("WOMEN")}
                    className="text-[12px] font-bold tracking-[0.2em] uppercase bg-[#0A0A0A] text-[#F4EFE4] px-6 py-3 hover:bg-[#D42B0A] transition-colors"
                  >
                    Shop Women
                  </button>
                  <button
                    onClick={() => setActiveGender("MEN")}
                    className="text-[12px] font-bold tracking-[0.2em] uppercase border-2 border-[#0A0A0A] px-6 py-3 hover:bg-[#0A0A0A] hover:text-[#F4EFE4] transition-colors"
                  >
                    Shop Men
                  </button>
                </div>
              </div>
              <div className="relative h-[420px] lg:h-auto bg-[#1C1C1C] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&h=700&fit=crop&auto=format"
                  alt="Fashion editorial — layered outerwear"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#F4EFE4]/70 mb-1">Featured Brand</div>
                  <div className="text-[28px] font-bold text-[#F4EFE4]" style={{ fontFamily: "'Libre Baskerville', serif" }}>NORR</div>
                  <div className="text-[12px] text-[#F4EFE4]/80">Scandinavian minimalism, redefined</div>
                </div>
                <div className="absolute top-4 right-4 bg-[#D42B0A] text-white text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1">
                  New Collection
                </div>
              </div>
            </div>
          </section>

          {/* Gender + Category Filters */}
          <section className="border-b-2 border-[#0A0A0A] bg-[#0A0A0A]">
            <div className="max-w-[1400px] mx-auto flex flex-wrap items-stretch">
              {/* Gender tabs */}
              <div className="flex border-r-2 border-[#333]">
                {genders.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setActiveGender(g.value)}
                    className={`text-[11px] font-bold tracking-[0.2em] uppercase px-6 py-4 transition-colors border-r border-[#333] last:border-r-0 ${
                      activeGender === g.value
                        ? "bg-[#D42B0A] text-white"
                        : "text-[#F4EFE4]/60 hover:text-[#F4EFE4]"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              {/* Category tabs */}
              <div className="flex flex-wrap flex-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`text-[11px] font-semibold tracking-[0.15em] uppercase px-5 py-4 border-r border-[#333] transition-colors ${
                      activeCategory === c
                        ? "bg-[#F4EFE4] text-[#0A0A0A]"
                        : "text-[#F4EFE4]/60 hover:text-[#F4EFE4]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="px-6 py-4 text-[11px] font-semibold tracking-[0.1em] text-[#F4EFE4]/40 self-center">
                {filteredProducts.length} items
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="max-w-[1400px] mx-auto px-6 py-12">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 border-2 border-dashed border-[#0A0A0A]/20">
                <div className="text-[48px] font-bold tracking-[-0.04em]" style={{ fontFamily: "'Libre Baskerville', serif" }}>No items found</div>
                <p className="text-[#5A5045] mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 border-t-2 border-l-2 border-[#0A0A0A]">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => setCartCount(c => c + 1)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Gender Feature Strips */}
          <GenderStrips onGenderSelect={setActiveGender} onSectionChange={setActiveSection} setVendorFilter={setVendorFilter} />
        </>
      )}

      {activeSection === "vendors" && (
        <VendorDirectory
          vendors={filteredVendors}
          allVendors={vendors}
          vendorFilter={vendorFilter}
          setVendorFilter={setVendorFilter}
        />
      )}

      {/* Footer */}
      <footer className="border-t-2 border-[#0A0A0A] bg-[#0A0A0A] text-[#F4EFE4] mt-0">
        <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-[20px] font-bold tracking-[-0.03em] mb-3" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              LE <span className="text-[#D42B0A]">BENKELENG</span>
            </div>
            <p className="text-[12px] text-[#F4EFE4]/50 leading-relaxed">
              The multi-brand fashion marketplace for the discerning buyer.
            </p>
          </div>
          {[
            { title: "Shop", links: ["Women", "Men", "Kids", "New Arrivals", "Sale"] },
            { title: "Vendors", links: ["NORR", "VOLT", "STRATA", "MERIDIAN", "FLUX KIDS"] },
            { title: "Help", links: ["Shipping", "Returns", "Sizing", "Contact", "FAQ"] },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#F4EFE4]/40 mb-4">{col.title}</div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-[#F4EFE4]/70 hover:text-[#D42B0A] transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#333] max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-[11px] text-[#F4EFE4]/30 tracking-[0.1em]">© 2026 LE BENKELENG. ALL RIGHTS RESERVED.</span>
          <span className="text-[11px] text-[#F4EFE4]/30 tracking-[0.1em]">8 BRANDS — 1 ADDRESS</span>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="border-b-2 border-r-2 border-[#0A0A0A] group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative bg-[#E8E2D4] overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={`https://images.unsplash.com/${product.image}?w=500&h=660&fit=crop&auto=format`}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-[#0A0A0A] text-[#F4EFE4] text-[9px] font-black tracking-[0.2em] uppercase px-2 py-0.5">New</span>
          )}
          {product.isSale && (
            <span className="bg-[#D42B0A] text-white text-[9px] font-black tracking-[0.2em] uppercase px-2 py-0.5">Sale</span>
          )}
        </div>
        <button
          onClick={onAddToCart}
          className={`absolute bottom-0 left-0 right-0 bg-[#0A0A0A] text-[#F4EFE4] text-[11px] font-bold tracking-[0.2em] uppercase py-3 transition-transform duration-300 ${hovered ? "translate-y-0" : "translate-y-full"} hover:bg-[#D42B0A]`}
        >
          Add to Cart
        </button>
      </div>
      <div className="p-4 bg-[#F4EFE4]">
        <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#D42B0A] mb-1">{product.vendor}</div>
        <div className="text-[14px] font-semibold leading-tight mb-2">{product.name}</div>
        <div className="flex items-center gap-2">
          {product.isSale && product.salePrice ? (
            <>
              <span className="text-[14px] font-bold text-[#D42B0A]">${product.salePrice}</span>
              <span className="text-[12px] text-[#5A5045] line-through">${product.price}</span>
            </>
          ) : (
            <span className="text-[14px] font-bold">${product.price}</span>
          )}
          <span className="ml-auto text-[10px] font-semibold tracking-[0.15em] uppercase text-[#5A5045]">{product.gender}</span>
        </div>
      </div>
    </div>
  );
}

function GenderStrips({
  onGenderSelect,
  onSectionChange,
  setVendorFilter,
}: {
  onGenderSelect: (g: Gender) => void;
  onSectionChange: (s: "shop" | "vendors") => void;
  setVendorFilter: (g: Gender) => void;
}) {
  const strips: { gender: Gender; label: string; sub: string; image: string; accent: string }[] = [
    { gender: "WOMEN", label: "Women's", sub: "Outerwear · Formalwear · Accessories", image: "photo-1483985988355-763728e1935b", accent: "#7A3B5E" },
    { gender: "MEN", label: "Men's", sub: "Denim · Streetwear · Formalwear", image: "photo-1490481651871-ab68de25d43d", accent: "#2B3A5C" },
    { gender: "KIDS", label: "Kids'", sub: "Activewear · Denim · Streetwear", image: "photo-1519238263530-99bdd11df2ea", accent: "#1A6B3C" },
  ];

  return (
    <section className="border-t-2 border-[#0A0A0A]">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="flex items-baseline gap-4 mb-8">
          <h2 className="text-[36px] font-bold tracking-[-0.03em]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Shop by Gender
          </h2>
          <div className="flex-1 border-t-2 border-[#0A0A0A] mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t-2 border-l-2 border-[#0A0A0A]">
          {strips.map((s) => (
            <button
              key={s.gender}
              onClick={() => onGenderSelect(s.gender)}
              className="border-b-2 border-r-2 border-[#0A0A0A] text-left group overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden" style={{ backgroundColor: s.accent }}>
                <img
                  src={`https://images.unsplash.com/${s.image}?w=600&h=450&fit=crop&auto=format`}
                  alt={`${s.label} fashion`}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
              </div>
              <div className="p-6 bg-[#F4EFE4] group-hover:bg-[#0A0A0A] group-hover:text-[#F4EFE4] transition-colors duration-200">
                <div className="text-[28px] font-bold tracking-[-0.03em] leading-none" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  {s.label}
                </div>
                <div className="text-[11px] font-medium tracking-[0.1em] text-[#5A5045] group-hover:text-[#F4EFE4]/60 mt-2 transition-colors">
                  {s.sub}
                </div>
                <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#D42B0A] mt-4 group-hover:text-[#D42B0A]">
                  Shop Now →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function VendorDirectory({
  vendors,
  allVendors,
  vendorFilter,
  setVendorFilter,
}: {
  vendors: Vendor[];
  allVendors: Vendor[];
  vendorFilter: Gender;
  setVendorFilter: (g: Gender) => void;
}) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div>
      {/* Vendor Hero */}
      <section className="border-b-2 border-[#0A0A0A] bg-[#0A0A0A] text-[#F4EFE4]">
        <div className="max-w-[1400px] mx-auto px-6 py-16">
          <div className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#D42B0A] mb-4">Our Network</div>
          <h2 className="text-[56px] lg:text-[72px] font-bold tracking-[-0.03em] leading-[0.9]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            {allVendors.length} Brands.<br />
            <em>All Verified.</em>
          </h2>
          <p className="text-[15px] text-[#F4EFE4]/60 mt-6 max-w-lg font-light leading-relaxed">
            Every vendor on Le Benkeleng is vetted for quality, ethical production, and design integrity. Browse by speciality or discover new labels.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="border-b-2 border-[#0A0A0A] bg-[#F4EFE4] sticky top-[64px] z-40">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center gap-0">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#5A5045] pr-6 border-r-2 border-[#0A0A0A] py-4">Filter</span>
          {(["ALL", "WOMEN", "MEN", "KIDS"] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => setVendorFilter(g)}
              className={`text-[11px] font-bold tracking-[0.2em] uppercase px-6 py-4 border-r border-[#0A0A0A]/20 transition-colors ${
                vendorFilter === g ? "bg-[#0A0A0A] text-[#F4EFE4]" : "hover:bg-[#E0D9CC]"
              }`}
            >
              {g}
            </button>
          ))}
          <div className="ml-auto text-[11px] text-[#5A5045] font-semibold pr-2">
            {vendors.length} vendor{vendors.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Vendor Table / Cards */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 text-[10px] font-bold tracking-[0.25em] uppercase text-[#5A5045] pb-3 border-b-2 border-[#0A0A0A] mb-0">
          <span>Brand</span>
          <span>Speciality</span>
          <span>Gender</span>
          <span>Origin</span>
          <span>Price Range</span>
          <span>Items</span>
        </div>

        <div className="border-b-2 border-[#0A0A0A]">
          {vendors.map((vendor, idx) => (
            <VendorRow
              key={vendor.id}
              vendor={vendor}
              expanded={expandedId === vendor.id}
              onToggle={() => setExpandedId(expandedId === vendor.id ? null : vendor.id)}
              idx={idx}
            />
          ))}
        </div>
      </div>

      {/* Featured Vendor Spotlight */}
      <section className="border-t-2 border-[#0A0A0A] bg-[#0A0A0A]">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <div className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#F4EFE4]/40 mb-6">Featured Vendors</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t-2 border-l-2 border-[#333]">
            {allVendors.filter(v => v.featured).map((v) => (
              <div key={v.id} className="border-b-2 border-r-2 border-[#333] p-8 group cursor-pointer hover:bg-[#1A1A1A] transition-colors">
                <div
                  className="w-10 h-10 mb-6"
                  style={{ backgroundColor: v.color }}
                />
                <div className="text-[22px] font-bold text-[#F4EFE4] mb-1" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                  {v.name}
                </div>
                <div className="text-[12px] text-[#F4EFE4]/50 mb-4">{v.tagline}</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {v.categories.map(c => (
                    <span key={c} className="text-[10px] font-semibold tracking-[0.15em] uppercase border border-[#444] text-[#F4EFE4]/60 px-2 py-0.5">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#F4EFE4]/40">
                  <span>{v.origin}</span>
                  <span className="text-[#D42B0A] font-bold">{v.productCount} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function VendorRow({
  vendor,
  expanded,
  onToggle,
  idx,
}: {
  vendor: Vendor;
  expanded: boolean;
  onToggle: () => void;
  idx: number;
}) {
  return (
    <>
      <div
        className={`grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center py-5 border-t-2 border-[#0A0A0A]/10 cursor-pointer group transition-colors ${expanded ? "bg-[#0A0A0A] text-[#F4EFE4]" : "hover:bg-[#E8E2D4]"}`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-8 h-8 flex-shrink-0"
            style={{ backgroundColor: vendor.color }}
          />
          <div>
            <div className="text-[16px] font-bold tracking-[-0.01em]" style={{ fontFamily: "'Libre Baskerville', serif" }}>
              {vendor.name}
            </div>
            <div className={`text-[11px] mt-0.5 ${expanded ? "text-[#F4EFE4]/60" : "text-[#5A5045]"}`}>{vendor.tagline}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {vendor.categories.map(c => (
            <span key={c} className={`text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 ${expanded ? "bg-[#333] text-[#F4EFE4]/70" : "bg-[#E0D9CC] text-[#5A5045]"}`}>
              {c}
            </span>
          ))}
        </div>
        <div className="text-[12px] font-semibold tracking-[0.1em]">
          {vendor.gender.join(" · ")}
        </div>
        <div className={`text-[12px] font-medium ${expanded ? "text-[#F4EFE4]/60" : "text-[#5A5045]"}`}>{vendor.origin}</div>
        <div className="text-[14px] font-bold text-[#D42B0A]">{vendor.priceRange}</div>
        <div className="flex items-center gap-3">
          <span className={`text-[12px] font-semibold ${expanded ? "text-[#F4EFE4]/60" : "text-[#5A5045]"}`}>{vendor.productCount}</span>
          <span className={`text-[18px] font-light transition-transform duration-200 ${expanded ? "rotate-180 text-[#F4EFE4]" : ""}`}>↓</span>
        </div>
      </div>
      {expanded && (
        <div className="bg-[#1A1A1A] border-t border-[#333] px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#F4EFE4]/30 mb-3">About</div>
            <p className="text-[13px] text-[#F4EFE4]/70 leading-relaxed">
              {vendor.name} is a {vendor.origin}-based label specializing in {vendor.categories.join(" and ").toLowerCase()}.
              Known for quality craftsmanship and a distinct design perspective.
            </p>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#F4EFE4]/30 mb-3">Categories</div>
            <div className="flex flex-wrap gap-2">
              {vendor.categories.map(c => (
                <span key={c} className="text-[11px] font-semibold tracking-[0.15em] uppercase border border-[#444] text-[#F4EFE4]/60 px-3 py-1">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#F4EFE4]/30 mb-3">Details</div>
            <div className="space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#F4EFE4]/40">Gender</span>
                <span className="text-[#F4EFE4]/80">{vendor.gender.join(", ")}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#F4EFE4]/40">Price Range</span>
                <span className="text-[#D42B0A] font-bold">{vendor.priceRange}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#F4EFE4]/40">Items</span>
                <span className="text-[#F4EFE4]/80">{vendor.productCount}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#F4EFE4]/40">Origin</span>
                <span className="text-[#F4EFE4]/80">{vendor.origin}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
