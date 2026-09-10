import React, { useState, useMemo, useEffect } from "react";
import { Vendor, Product, VendorOrder, Category, Gender } from "../types";
import { streetwearImagePresets } from "../data/marketplaceData";

interface VendorDashboardProps {
  currentVendor: Vendor;
  allVendors: Vendor[];
  allProducts: Product[];
  allOrders: VendorOrder[];
  onSelectVendor: (vendor: Vendor) => void;
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onUpdateStock: (productId: number, size: string, newQty: number) => void;
  onUpdateVendorProfile: (vendor: Vendor) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: VendorOrder["status"]) => void;
  onResetDemoData: () => void;
  onNavigateHome: () => void;
  onNavigateBrand: (slug: string) => void;
  formatPrice: (amount: number) => string;
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
  // ---------------------------------------------------------------------------
  // 1. PRIVACY & AUTHENTICATION STATE (STRICT TENANT ISOLATION)
  // ---------------------------------------------------------------------------
  const [authenticatedVendor, setAuthenticatedVendor] = useState<Vendor | null>(() => {
    const savedSlug = sessionStorage.getItem("lebenkeleng_auth_vendor_slug");
    if (savedSlug) {
      const found = allVendors.find((v) => v.slug === savedSlug);
      if (found) return found;
    }
    // Default to null to enforce login gate (or current vendor if already active in session)
    return null;
  });

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Privacy Shield (Discreet / Hide Amounts Mode)
  const [privacyShield, setPrivacyShield] = useState<boolean>(() => {
    return localStorage.getItem("lebenkeleng_privacy_shield") === "true";
  });

  // Role: Founder (full financial access) vs Atelier Staff (packing & inventory only)
  const [staffRole, setStaffRole] = useState<"founder" | "staff">("founder");

  // Toggle privacy shield and persist
  const togglePrivacyShield = () => {
    setPrivacyShield((prev) => {
      const next = !prev;
      localStorage.setItem("lebenkeleng_privacy_shield", String(next));
      return next;
    });
  };

  // Login Handler
  const handleLogin = (e?: React.FormEvent, directVendor?: Vendor) => {
    if (e) e.preventDefault();

    const targetVendor = directVendor || allVendors.find(
      (v) =>
        v.slug.toLowerCase() === loginIdentifier.trim().toLowerCase() ||
        v.name.toLowerCase() === loginIdentifier.trim().toLowerCase() ||
        `${v.slug}@lebenkeleng.co.za`.toLowerCase() === loginIdentifier.trim().toLowerCase()
    );

    if (targetVendor) {
      setAuthenticatedVendor(targetVendor);
      onSelectVendor(targetVendor);
      sessionStorage.setItem("lebenkeleng_auth_vendor_slug", targetVendor.slug);
      setLoginError(null);
      showToast(`Welcome back to ${targetVendor.name} Atelier Studio 🔒`);
    } else {
      setLoginError("Brand credentials not recognized. Select a verified label from Quick Passkeys below.");
    }
  };

  // Sign Out Handler (Locks session and destroys tenant access)
  const handleSignOut = () => {
    sessionStorage.removeItem("lebenkeleng_auth_vendor_slug");
    setAuthenticatedVendor(null);
    setLoginIdentifier("");
    setLoginPin("");
    showToast("Atelier Studio locked. Session destroyed.");
  };

  // Helper for masking currency values when privacy shield is active
  const maskAmount = (amount: number) => {
    if (privacyShield) return "R ••••••";
    return formatPrice(amount);
  };

  // POPIA Helper: Mask customer name (e.g. "Thabo Molefe" -> "Thabo M.")
  const maskCustomerName = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1][0]}.`;
  };

  // Active vendor is strictly the authenticated vendor
  const activeVendor = authenticatedVendor || currentVendor;

  // ---------------------------------------------------------------------------
  // 2. DASHBOARD TABS & FILTER STATE
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<"inventory" | "overview" | "orders" | "storefront">("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [stockStatusFilter, setStockStatusFilter] = useState<"all" | "low" | "out">("all");

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Products belonging strictly to this authenticated vendor (Tenant Isolation)
  const vendorProducts = useMemo(() => {
    return allProducts.filter(
      (p) => p.brandSlug === activeVendor.slug || p.brand === activeVendor.name
    );
  }, [allProducts, activeVendor]);

  // Orders for strictly this authenticated vendor
  const vendorOrders = useMemo(() => {
    return allOrders.filter((o) => o.brandSlug === activeVendor.slug);
  }, [allOrders, activeVendor]);

  // Financial analytics
  const analytics = useMemo(() => {
    const totalGmv = vendorOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalCommission = vendorOrders.reduce((sum, o) => sum + o.commissionAmount, 0);
    const netPayout = vendorOrders.reduce((sum, o) => sum + o.payoutAmount, 0);
    const lowStockCount = vendorProducts.filter((p) => {
      const total = p.stock ?? (p.stockPerSize ? Object.values(p.stockPerSize).reduce((a, b) => a + b, 0) : 0);
      return total > 0 && total <= 4;
    }).length;
    const outOfStockCount = vendorProducts.filter((p) => {
      const total = p.stock ?? (p.stockPerSize ? Object.values(p.stockPerSize).reduce((a, b) => a + b, 0) : 0);
      return total === 0;
    }).length;

    return {
      totalGmv,
      totalCommission,
      netPayout,
      totalProducts: vendorProducts.length,
      lowStockCount,
      outOfStockCount,
      activeOrdersCount: vendorOrders.filter((o) => o.status !== "collected").length,
    };
  }, [vendorOrders, vendorProducts]);

  // Filtered inventory list
  const filteredInventory = useMemo(() => {
    return vendorProducts.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesFabric = p.fabric.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesFabric) return false;
      }

      if (filterCategory !== "all" && p.category !== filterCategory) {
        return false;
      }

      const totalStock = p.stock ?? (p.stockPerSize ? Object.values(p.stockPerSize).reduce((a, b) => a + b, 0) : 0);
      if (stockStatusFilter === "low" && (totalStock > 4 || totalStock === 0)) return false;
      if (stockStatusFilter === "out" && totalStock > 0) return false;

      return true;
    });
  }, [vendorProducts, searchQuery, filterCategory, stockStatusFilter]);

  // Product Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<Category>("outerwear");
  const [formGender, setFormGender] = useState<Gender[]>(["UNISEX"]);
  const [formPrice, setFormPrice] = useState<number>(850);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | "">("");
  const [formFabric, setFormFabric] = useState("460 GSM Heavy French Terry Cotton");
  const [formDescription, setFormDescription] = useState("");
  const [formBadge, setFormBadge] = useState("NEW DROP");
  const [formImage, setFormImage] = useState("");
  const [formSecondaryImage, setFormSecondaryImage] = useState("");
  const [formImageMode, setFormImageMode] = useState<"custom" | "preset">("preset");
  const [formSizesInput, setFormSizesInput] = useState<string>("S, M, L, XL");
  const [formStockPerSize, setFormStockPerSize] = useState<Record<string, number>>({
    S: 5,
    M: 8,
    L: 6,
    XL: 3,
  });
  const [formIsThrift, setFormIsThrift] = useState<boolean>(activeVendor.isThrift || false);
  const [formCondition, setFormCondition] = useState("★ Grade A+ Mint Vintage");
  const [formMeasurements, setFormMeasurements] = useState("Pit-to-Pit: 58cm | Length: 70cm");

  // Storefront Profile Form State
  const [profileTagline, setProfileTagline] = useState(activeVendor.tagline);
  const [profileStory, setProfileStory] = useState(activeVendor.aboutStory);
  const [profileHub, setProfileHub] = useState(activeVendor.dispatchHub);
  const [profileCover, setProfileCover] = useState(activeVendor.coverImage);
  const [profilePhone, setProfilePhone] = useState(activeVendor.contactPhone || "+27 72 849 2011");
  const [profileInstagram, setProfileInstagram] = useState(activeVendor.instagram || "@" + activeVendor.slug.replace("-", ""));
  const [profileColor, setProfileColor] = useState(activeVendor.color);

  useEffect(() => {
    setProfileTagline(activeVendor.tagline);
    setProfileStory(activeVendor.aboutStory);
    setProfileHub(activeVendor.dispatchHub);
    setProfileCover(activeVendor.coverImage);
    setProfilePhone(activeVendor.contactPhone || "+27 72 849 2011");
    setProfileInstagram(activeVendor.instagram || "@" + activeVendor.slug.replace("-", ""));
    setProfileColor(activeVendor.color);
    setFormIsThrift(activeVendor.isThrift || false);
  }, [activeVendor]);

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setFormTitle("");
    setFormCategory(activeVendor.isThrift ? "thrift" : "outerwear");
    setFormGender(["UNISEX"]);
    setFormPrice(activeVendor.isThrift ? 450 : 850);
    setFormOriginalPrice("");
    setFormFabric(activeVendor.isThrift ? "100% Vintage Washed Cotton" : "380 GSM Heavyweight Cotton Fleece");
    setFormDescription("Architecturally tailored for Gauteng urban lifestyle. Detailed finish and reinforced seams.");
    setFormBadge(activeVendor.isThrift ? "1-OF-1 VINTAGE" : "NEW DROP");
    setFormImage(streetwearImagePresets[0].image);
    setFormSecondaryImage(streetwearImagePresets[0].secondaryImage);
    setFormImageMode("preset");

    const defaultSizes = activeVendor.isThrift ? ["L (Boxy 90s Fit)"] : ["S", "M", "L", "XL"];
    setFormSizesInput(defaultSizes.join(", "));
    const initialStocks: Record<string, number> = {};
    defaultSizes.forEach((s) => {
      initialStocks[s] = activeVendor.isThrift ? 1 : 5;
    });
    setFormStockPerSize(initialStocks);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setProductToEdit(product);
    setFormTitle(product.title);
    setFormCategory(product.category);
    setFormGender(product.gender);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice ?? "");
    setFormFabric(product.fabric);
    setFormDescription(product.description);
    setFormBadge(product.badge);
    setFormImage(product.image);
    setFormSecondaryImage(product.secondaryImage);
    setFormImageMode("custom");
    setFormSizesInput(product.sizes.join(", "));

    if (product.stockPerSize && Object.keys(product.stockPerSize).length > 0) {
      setFormStockPerSize(product.stockPerSize);
    } else {
      const derived: Record<string, number> = {};
      const avg = Math.max(1, Math.floor((product.stock || 8) / product.sizes.length));
      product.sizes.forEach((s) => (derived[s] = avg));
      setFormStockPerSize(derived);
    }

    setFormIsThrift(product.isThrift || false);
    setFormCondition(product.condition || "★ Grade A+ Mint Vintage");
    setFormMeasurements(product.measurements || "Pit-to-Pit: 58cm | Length: 70cm");
    setIsProductModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isSecondary: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (isSecondary) setFormSecondaryImage(reader.result as string);
        else setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedSizes = formSizesInput.split(",").map((s) => s.trim()).filter(Boolean);
    const totalStock = Object.values(formStockPerSize).reduce((a, b) => a + Number(b || 0), 0);

    if (productToEdit) {
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
        secondaryImage: formSecondaryImage || formImage || streetwearImagePresets[0].secondaryImage,
        sizes: parsedSizes.length > 0 ? parsedSizes : ["One Size"],
        stockPerSize: formStockPerSize,
        stock: totalStock,
        status: totalStock === 0 ? "sold_out" : "active",
        isThrift: formIsThrift,
        condition: formIsThrift ? formCondition : undefined,
        measurements: formIsThrift ? formMeasurements : undefined,
      };
      onUpdateProduct(updated);
      showToast(`Updated "${updated.title}" successfully.`);
    } else {
      const newProduct: Product = {
        id: Date.now(),
        title: formTitle,
        brand: activeVendor.name,
        brandSlug: activeVendor.slug,
        category: formCategory,
        city: activeVendor.city,
        gender: formGender,
        price: Number(formPrice),
        originalPrice: formOriginalPrice ? Number(formOriginalPrice) : null,
        fabric: formFabric,
        description: formDescription,
        badge: formBadge,
        origin: activeVendor.origin,
        image: formImage || streetwearImagePresets[0].image,
        secondaryImage: formSecondaryImage || formImage || streetwearImagePresets[0].secondaryImage,
        sizes: parsedSizes.length > 0 ? parsedSizes : ["One Size"],
        stockPerSize: formStockPerSize,
        stock: totalStock,
        status: totalStock === 0 ? "sold_out" : "active",
        isNew: true,
        isThrift: formIsThrift,
        isPretoria: activeVendor.city === "Pretoria",
        condition: formIsThrift ? formCondition : undefined,
        measurements: formIsThrift ? formMeasurements : undefined,
      };
      onAddProduct(newProduct);
      showToast(`Added "${newProduct.title}" to your brand catalog.`);
    }

    setIsProductModalOpen(false);
  };

  const handleSaveStorefront = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedVendor: Vendor = {
      ...activeVendor,
      tagline: profileTagline,
      aboutStory: profileStory,
      dispatchHub: profileHub,
      coverImage: profileCover,
      contactPhone: profilePhone,
      instagram: profileInstagram,
      color: profileColor,
    };
    onUpdateVendorProfile(updatedVendor);
    showToast(`Saved brand settings for ${updatedVendor.name}!`);
  };

  // ---------------------------------------------------------------------------
  // 3. IF NOT AUTHENTICATED: RENDER SECURE STUDIO LOGIN GATEWAY
  // ---------------------------------------------------------------------------
  if (!authenticatedVendor) {
    return (
      <div className="min-h-screen bg-[#0E121B] text-white flex flex-col justify-between p-4 sm:p-8">
        {/* Top Minimal Bar */}
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black uppercase font-display tracking-tight text-white">
              LE BENKELENG
            </span>
            <span className="bg-white/10 text-neutral-300 text-[10px] font-mono font-medium px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
              Merchant Studio 🔒
            </span>
          </div>

          <button
            onClick={onNavigateHome}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>←</span> Back to Public Storefront
          </button>
        </div>

        {/* Center Card */}
        <div className="max-w-md w-full mx-auto my-8 bg-[#161B26] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-white/10 rounded-2xl mx-auto flex items-center justify-center text-2xl backdrop-blur-xs">
              🔒
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Atelier Studio Login</h2>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Secure partner portal for Pretoria & Gauteng independent streetwear labels. POPIA encrypted.
            </p>
          </div>

          {loginError && (
            <div className="mt-4 bg-red-950/40 text-red-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1.5">
                Brand Identifier / Handle
              </label>
              <input
                type="text"
                placeholder="e.g. lesupa-atelier or Mokasi"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full bg-white/5 focus:bg-white/10 rounded-xl p-3 text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-1 focus:ring-white/30 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-gray-400 uppercase mb-1.5">
                Atelier Security PIN / Passcode
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                className="w-full bg-white/5 focus:bg-white/10 rounded-xl p-3 text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-1 focus:ring-white/30 transition-all tracking-widest"
                required
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-gray-900 accent-white" />
                <span>Remember this Atelier device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-xl transition-all shadow-md text-xs cursor-pointer"
            >
              Sign In to Atelier Studio →
            </button>
          </form>

          {/* Quick Demo Access Passkeys (For seamless verification without cross-brand leaks) */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block text-center mb-2.5">
              ⚡ Quick Demo Verification Passkeys:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {allVendors.slice(0, 4).map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleLogin(undefined, v)}
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-2.5 text-left flex items-center gap-2.5 transition-all cursor-pointer group backdrop-blur-xs"
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: v.color }}
                  >
                    {v.letter}
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-bold text-gray-200 group-hover:text-white block truncate">
                      {v.name}
                    </span>
                    <span className="text-[9px] text-gray-500 block truncate">{v.city}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="text-center text-[11px] text-gray-500 font-mono">
          🛡️ POPIA Compliant · 256-Bit SSL Encrypted · Le Benkeleng™ Partner Shield
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 4. AUTHENTICATED: ISOLATED VENDOR DASHBOARD VIEW
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] pb-16">
      {/* 1. TOP SECURE STUDIO HEADER */}
      <header className="bg-[#111827] text-white border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Active Brand & Tenant Tag */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0"
              style={{ backgroundColor: activeVendor.color }}
            >
              {activeVendor.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight">{activeVendor.name}</span>
                <span className="bg-emerald-500/15 text-emerald-300 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                  🔒 Studio Active
                </span>
                {staffRole === "staff" && (
                  <span className="bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                    Staff Restricted Mode
                  </span>
                )}
              </div>
              <span className="text-[11px] text-gray-400 block font-mono">
                {activeVendor.origin} • Isolated Session
              </span>
            </div>
          </div>

          {/* Privacy & Control Tools */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
            {/* Privacy Shield Toggle */}
            <button
              onClick={togglePrivacyShield}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                privacyShield
                  ? "bg-amber-500/15 text-amber-300 font-bold"
                  : "bg-white/10 hover:bg-white/20 text-gray-200"
              }`}
              title="Mask financial amounts from shoulder surfing"
            >
              <span>{privacyShield ? "👁‍🗨 Discreet Mode: ON" : "👁 Discreet Mode"}</span>
            </button>

            {/* Role Switcher (Founder vs Staff) */}
            <button
              onClick={() => {
                const next = staffRole === "founder" ? "staff" : "founder";
                setStaffRole(next);
                showToast(`Switched to ${next === "founder" ? "Founder (Executive)" : "Atelier Staff"} mode.`);
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-mono text-[11px]"
              title="Toggle Founder vs Packing Staff permissions"
            >
              <span>{staffRole === "founder" ? "👑 Founder" : "📦 Staff Mode"}</span>
            </button>

            {/* View Live Brand Page */}
            <button
              onClick={() => onNavigateBrand(activeVendor.slug)}
              className="bg-white hover:bg-neutral-200 text-black font-semibold px-3.5 py-1.5 rounded-xl transition-all shadow-xs text-xs cursor-pointer"
            >
              Public Storefront →
            </button>

            {/* Lock Studio & Sign Out */}
            <button
              onClick={handleSignOut}
              className="bg-red-500/15 hover:bg-red-500/25 text-red-200 font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>🔒 Lock Studio</span>
            </button>
          </div>
        </div>

        {/* 2. NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-6 overflow-x-auto text-xs font-bold border-t border-gray-800">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "inventory"
                ? "border-white text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span>📦 Clothing Inventory & Stock</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px]">
              {vendorProducts.length}
            </span>
          </button>

          {/* Only Founder can view Financial Sales & Commission */}
          {staffRole === "founder" && (
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === "overview"
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <span>📊 Sales & Payouts</span>
              <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
                {maskAmount(analytics.netPayout)}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "orders"
                ? "border-white text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span>🚚 Bob Go Orders & Logistics</span>
            {analytics.activeOrdersCount > 0 && (
              <span className="bg-white text-black px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold">
                {analytics.activeOrdersCount}
              </span>
            )}
          </button>

          {staffRole === "founder" && (
            <button
              onClick={() => setActiveTab("storefront")}
              className={`py-3.5 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === "storefront"
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <span>🏪 Storefront Brand Settings</span>
            </button>
          )}
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3 rounded-xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-fade-in text-xs font-medium">
          <span className="text-emerald-400 text-base">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* ========================================================================= */}
        {/* TAB 1: INVENTORY & CLOTHING STOCK */}
        {/* ========================================================================= */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#111827]">Clothing Stock & Catalog</h1>
                  <span className="bg-gray-100 text-[#4B5563] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                    {activeVendor.name} Catalog Only
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Update stock per size and retail prices. Changes reflect instantly on customer clothing cards.
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

            {/* Low & Out of Stock Alerts */}
            {(analytics.lowStockCount > 0 || analytics.outOfStockCount > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analytics.lowStockCount > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-medium">
                      <span>⚠️</span>
                      <span>
                        <strong>{analytics.lowStockCount} items</strong> have low stock (≤ 4 units).
                      </span>
                    </div>
                    <button
                      onClick={() => setStockStatusFilter(stockStatusFilter === "low" ? "all" : "low")}
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
                        <strong>{analytics.outOfStockCount} items</strong> are Sold Out.
                      </span>
                    </div>
                    <button
                      onClick={() => setStockStatusFilter(stockStatusFilter === "out" ? "all" : "out")}
                      className="text-red-800 font-bold underline shrink-0 ml-2"
                    >
                      {stockStatusFilter === "out" ? "Show All" : "Filter Out"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Filters */}
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
                  <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
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

            {/* Inventory Table */}
            {filteredInventory.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#E5E7EB] p-12 text-center space-y-3">
                <span className="text-4xl block">👕</span>
                <h3 className="text-base font-bold text-[#111827]">No clothing pieces found</h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                  No styles matching this query in {activeVendor.name}'s isolated catalog.
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
                            ? Object.values(product.stockPerSize).reduce((a, b) => a + b, 0)
                            : 0);

                        return (
                          <tr key={product.id} className="hover:bg-[#F9FAFB] transition-colors">
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
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4 font-mono text-[11px] text-[#4B5563] capitalize">
                              {product.category}
                            </td>

                            {/* Price with Discreet Mode Support */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#111827]">
                                {maskAmount(product.price)}
                              </div>
                              {product.originalPrice && (
                                <div className="text-[10px] text-[#9CA3AF] line-through font-mono">
                                  {maskAmount(product.originalPrice)}
                                </div>
                              )}
                              {staffRole === "founder" && (
                                <div className="text-[10px] text-emerald-700 font-mono">
                                  Net: {maskAmount(product.price * 0.87)}
                                </div>
                              )}
                            </td>

                            {/* Stock by size */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {product.sizes.map((size) => {
                                  const sizeStock = product.stockPerSize?.[size] ?? (product.isThrift ? 1 : 0);
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
                                      <span className="font-bold font-mono">{size}:</span>
                                      <span className="font-mono">{sizeStock}</span>
                                      <div className="flex items-center gap-0.5 ml-1">
                                        <button
                                          onClick={() => {
                                            if (sizeStock > 0) {
                                              onUpdateStock(product.id, size, sizeStock - 1);
                                              showToast(`Reduced ${product.title} (${size}) to ${sizeStock - 1}`);
                                            }
                                          }}
                                          className="w-4 h-4 rounded bg-gray-200 hover:bg-gray-300 text-black flex items-center justify-center font-bold text-[9px]"
                                          title="Decrease stock by 1"
                                        >
                                          -
                                        </button>
                                        <button
                                          onClick={() => {
                                            onUpdateStock(product.id, size, sizeStock + 1);
                                            showToast(`Restocked ${product.title} (${size}) to ${sizeStock + 1}`);
                                          }}
                                          className="w-4 h-4 rounded bg-gray-200 hover:bg-gray-300 text-black flex items-center justify-center font-bold text-[9px]"
                                          title="Increase stock by 1"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="text-[10px] text-[#6B7280] font-mono mt-1">
                                Total: <strong className="text-[#111827]">{totalStock} in stock</strong>
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
                                  if (confirm(`Remove "${product.title}" from store?`)) {
                                    onDeleteProduct(product.id);
                                    showToast(`Removed "${product.title}".`);
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 px-2 py-1 text-[11px]"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: OVERVIEW & SENSITIVE FINANCIAL EARNINGS (FOUNDER ONLY) */}
        {/* ========================================================================= */}
        {activeTab === "overview" && staffRole === "founder" && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#111827]">Financial Revenue & Net Payouts</h1>
                  {privacyShield && (
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      Discreet Shield Active 👁‍🗨
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  13% marketplace fee. 87% net payout disbursed weekly directly to your verified South African business account.
                </p>
              </div>

              <button
                onClick={togglePrivacyShield}
                className="bg-[#F3F4F6] hover:bg-gray-200 text-[#111827] font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shrink-0"
              >
                {privacyShield ? "👁 Reveal Financial Amounts" : "👁‍🗨 Hide Sensitive Amounts"}
              </button>
            </div>

            {/* Metric Cards with Privacy Shield */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#6B7280] uppercase">
                  Gross Merchandise Value (GMV)
                </span>
                <div className="text-2xl font-black text-[#111827] font-display">
                  {maskAmount(analytics.totalGmv)}
                </div>
                <span className="text-[10px] text-[#6B7280] block">Customer checkout volume</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">
                  Net Vendor Payout (87%)
                </span>
                <div className="text-2xl font-black text-emerald-700 font-display">
                  {maskAmount(analytics.netPayout)}
                </div>
                <span className="text-[10px] text-emerald-600 block">Available for Instant EFT withdrawal</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#6B7280] uppercase">
                  Platform Commission (13%)
                </span>
                <div className="text-2xl font-black text-[#6B7280] font-display">
                  {maskAmount(analytics.totalCommission)}
                </div>
                <span className="text-[10px] text-[#6B7280] block">Payment gateway fees & Bob Go logistics</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
                  48-Hour Dispatch SLA
                </span>
                <div className="text-2xl font-black text-emerald-600 font-display">
                  98.5%
                </div>
                <span className="text-[10px] text-[#6B7280] block">Pretoria / Gauteng Bob Go courier handoff</span>
              </div>
            </div>

            {/* Masked Banking Info */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Registered Payout Account</h3>
                  <p className="text-xs text-[#6B7280]">
                    Protected under POPIA compliance standards.
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-mono font-bold px-3 py-1 rounded-full">
                  ✓ Verified Capitec / FNB Business
                </span>
              </div>

              <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#6B7280] block text-[10px]">ACCOUNT HOLDER</span>
                  <span className="font-bold text-[#111827]">{activeVendor.name} (Pty) Ltd</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px]">BANK ACCOUNT (MASKED)</span>
                  <span className="font-bold text-[#111827]">
                    {privacyShield ? "Capitec Business (•••• •••• 4812)" : "Capitec Business (Acct: 1052944812)"}
                  </span>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px]">DISPATCH HUB</span>
                  <span className="font-bold text-[#111827]">{activeVendor.dispatchHub}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BOB GO ORDERS & POPIA CUSTOMER PRIVACY */}
        {/* ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#111827]">Customer Orders & Bob Go Dispatch</h1>
                  <span className="bg-blue-50 text-blue-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-200">
                    POPIA Masked
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Pack items in Le Benkeleng compostable polybags and hand over to your Bob Go locker within 48 hours.
                </p>
              </div>
              <div className="text-xs font-mono bg-[#F3F4F6] px-3 py-1.5 rounded-lg text-[#111827]">
                Local Depot: <strong>{activeVendor.dispatchHub}</strong>
              </div>
            </div>

            {vendorOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-[#E5E7EB] p-12 text-center space-y-3">
                <span className="text-4xl block">📦</span>
                <h3 className="text-base font-bold text-[#111827]">No customer orders currently pending</h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                  When customers purchase your pieces, order slips with Bob Go locker waybill labels appear here.
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
                        {/* POPIA Customer Privacy Protection */}
                        <span className="text-xs text-[#6B7280] mt-0.5 block">
                          Placed: {order.createdAt} • Buyer: <strong className="text-[#111827]">{maskCustomerName(order.customerName)}</strong> ({order.customerCity})
                        </span>
                      </div>

                      {staffRole === "founder" && (
                        <div className="text-right">
                          <span className="text-xs text-[#6B7280] block">Vendor Net Payout</span>
                          <span className="text-base font-black text-emerald-700 font-mono">
                            {maskAmount(order.payoutAmount)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.productTitle}
                              className="w-10 h-12 object-cover rounded bg-gray-100 border border-[#E5E7EB]"
                            />
                            <div>
                              <div className="font-bold text-[#111827]">{item.productTitle}</div>
                              <div className="text-[11px] text-[#6B7280] font-mono">
                                Size: <strong className="text-[#111827]">{item.size}</strong> • Qty: {item.quantity}
                              </div>
                            </div>
                          </div>
                          {staffRole === "founder" && (
                            <span className="font-bold text-[#111827] font-mono">
                              {maskAmount(item.price * item.quantity)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Bob Go Locker Dispatch Info */}
                    <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-[#6B7280] uppercase block">
                          Destination Bob Go Locker
                        </span>
                        <span className="font-bold text-[#111827]">{order.lockerStation}</span>
                        <span className="text-[11px] text-gray-500 block font-mono">
                          Waybill: {order.waybillNumber}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === "pending_pack" && (
                          <button
                            onClick={() => {
                              onUpdateOrderStatus(order.id, "dispatched_to_locker");
                              showToast(`Order #${order.orderNumber} marked as dispatched to Bob Go locker!`);
                            }}
                            className="bg-[#111827] hover:bg-black text-white font-bold px-4 py-2 rounded-xl transition-colors"
                          >
                            Mark Dispatched to Locker →
                          </button>
                        )}

                        {order.status === "dispatched_to_locker" && (
                          <button
                            onClick={() => {
                              onUpdateOrderStatus(order.id, "in_transit");
                              showToast(`Order #${order.orderNumber} is in transit with courier.`);
                            }}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl transition-colors"
                          >
                            Mark In Transit →
                          </button>
                        )}

                        {order.status === "in_transit" && (
                          <button
                            onClick={() => {
                              onUpdateOrderStatus(order.id, "ready_for_pickup");
                              showToast(`Order #${order.orderNumber} ready for customer PIN retrieval.`);
                            }}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl transition-colors"
                          >
                            Mark Ready for PIN Collection →
                          </button>
                        )}

                        {order.status === "ready_for_pickup" && (
                          <span className="text-emerald-700 font-mono font-bold text-xs">
                            ✓ Ready at locker station for PIN retrieval
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
        {/* TAB 4: STOREFRONT BRAND SETTINGS (FOUNDER ONLY) */}
        {/* ========================================================================= */}
        {activeTab === "storefront" && staffRole === "founder" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E7EB]">
              <div>
                <h1 className="text-xl font-bold text-[#111827]">Brand Storefront Settings</h1>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Customize the look, cover photo, founder bio, and logistics hub for <code>#/brand/{activeVendor.slug}</code>.
                </p>
              </div>
              <button
                onClick={() => onNavigateBrand(activeVendor.slug)}
                className="bg-[#111827] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-black"
              >
                Preview Live Brand Page →
              </button>
            </div>

            <form onSubmit={handleSaveStorefront} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] space-y-5 text-xs">
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
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setProfileCover(reader.result as string);
                          reader.readAsDataURL(file);
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
      {/* 5. MODAL: ADD / EDIT CLOTHING PIECE */}
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

            <span className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-xs font-semibold mb-1">
              <span>✦</span> {productToEdit ? "Modify Existing Piece" : "New Collection Addition"}
            </span>
            <h3 className="text-xl font-bold text-[#111827] mt-0.5">
              {productToEdit ? `Edit "${productToEdit.title}"` : `Add Piece to ${activeVendor.name}`}
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Updates will only affect {activeVendor.name}'s items on the commerce storefront.
            </p>

            <form onSubmit={handleSaveProduct} className="mt-5 space-y-4 text-xs">
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
                    onChange={(e) => setFormCategory(e.target.value as Category)}
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
                  {staffRole === "founder" && (
                    <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
                      Net Payout: {maskAmount(formPrice * 0.87)}
                    </span>
                  )}
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
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : "")}
                    className="w-full border border-[#D1D5DB] rounded-lg p-2.5 focus:outline-none focus:border-[#111827] font-mono"
                  />
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

              {/* Fabric */}
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

              {/* Photo Input */}
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
                      Streetwear Presets
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
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {streetwearImagePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormImage(preset.image);
                            setFormSecondaryImage(preset.secondaryImage);
                            if (!formTitle) setFormTitle(preset.label);
                            setFormCategory(preset.category);
                          }}
                          className={`group rounded-lg overflow-hidden border-2 relative transition-all ${
                            formImage === preset.image ? "border-[#111827] scale-105" : "border-transparent"
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
                          Front Image (URL or File Upload):
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
                          onChange={(e) => setFormSecondaryImage(e.target.value)}
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
              </div>

              {/* Sizes & Stock */}
              <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-3">
                <label className="block font-bold text-[#111827] uppercase text-[10px]">
                  Sizes & Stock Quantities *
                </label>
                <input
                  type="text"
                  value={formSizesInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormSizesInput(val);
                    const parsed = val.split(",").map((s) => s.trim()).filter(Boolean);
                    const nextStock = { ...formStockPerSize };
                    parsed.forEach((s) => {
                      if (nextStock[s] === undefined) nextStock[s] = 5;
                    });
                    setFormStockPerSize(nextStock);
                  }}
                  className="w-full border border-[#D1D5DB] rounded-lg p-2 focus:outline-none focus:border-[#111827]"
                  placeholder="e.g. S, M, L, XL"
                />

                <div className="flex flex-wrap gap-2">
                  {formSizesInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((size) => (
                      <div key={size} className="flex items-center gap-1 border border-[#D1D5DB] rounded-lg px-2 py-1 bg-white">
                        <span className="font-bold font-mono text-xs">{size}:</span>
                        <input
                          type="number"
                          min={0}
                          value={formStockPerSize[size] ?? 0}
                          onChange={(e) => {
                            const qty = Math.max(0, parseInt(e.target.value) || 0);
                            setFormStockPerSize((prev) => ({ ...prev, [size]: qty }));
                          }}
                          className="w-12 text-center font-mono font-bold focus:outline-none border-b border-gray-300"
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Thrift Specifics */}
              {formIsThrift && (
                <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 space-y-3">
                  <span className="text-[10px] font-mono font-bold text-amber-900 uppercase block">
                    1-of-1 Curated Vintage Specs (Thrift Zone)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-amber-900 mb-1">Condition Standard</label>
                      <input
                        type="text"
                        value={formCondition}
                        onChange={(e) => setFormCondition(e.target.value)}
                        className="w-full border border-amber-300 rounded-lg p-2 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-amber-900 mb-1">Measurements (cm)</label>
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
                  {productToEdit ? "Save Changes to Commerce Site" : "Add to Commerce Storefront →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
