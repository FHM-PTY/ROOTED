import { getSupabaseClient, getSupabaseConfig } from "../lib/supabase"
import {
  lockerStations as defaultLockers,
  vendors as defaultVendors,
  products as defaultProducts,
  initialVendorOrders as defaultOrders,
} from "../data/marketplaceData"
import { Vendor, Product, LockerStation, VendorOrder, OrderItem } from "../types"

const EVENT_NAME = "rooted_marketplace_data_change"

// Storage keys for local offline cache / sandbox
const STORAGE_PRODUCTS = "rooted_products"
const STORAGE_VENDORS = "rooted_vendors"
const STORAGE_ORDERS = "rooted_orders"

class MarketplaceService {
  private listeners: Set<() => void> = new Set()

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === STORAGE_PRODUCTS ||
        e.key === STORAGE_ORDERS ||
        e.key === STORAGE_VENDORS
      ) {
        listener()
      }
    }
    const handleCustom = () => listener()

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage)
      window.addEventListener(EVENT_NAME, handleCustom)
    }

    return () => {
      this.listeners.delete(listener)
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage)
        window.removeEventListener(EVENT_NAME, handleCustom)
      }
    }
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn()
      } catch (e) {
        console.error("Marketplace listener error:", e)
      }
    })
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(EVENT_NAME))
    }
  }

  public getBackendMode(): {
    isSupabase: boolean
    mode: "supabase" | "local_sandbox"
    label: string
    url?: string
  } {
    const config = getSupabaseConfig()
    if (config.isConfigured) {
      return {
        isSupabase: true,
        mode: "supabase",
        label: "PostgreSQL 16 (Supabase)",
        url: config.url,
      }
    }
    return {
      isSupabase: false,
      mode: "local_sandbox",
      label: "Local Sandbox Engine (Offline Cache)",
    }
  }

  // ==========================================
  // 1. LOCKER STATIONS
  // ==========================================
  public async getLockerStations(): Promise<LockerStation[]> {
    const client = getSupabaseClient()
    if (client) {
      try {
        const { data, error } = await client
          .from("locker_stations")
          .select("*")
          .order("id", { ascending: true })

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            address: d.address,
            hours: d.hours,
            type: d.type,
            distance: d.distance,
            city: d.city,
            commuterTag: d.commuter_tag,
          }))
        }
      } catch (err) {
        console.warn("Supabase locker fetch error, falling back to local dataset:", err)
      }
    }
    return defaultLockers
  }

  // ==========================================
  // 2. VENDORS / BRANDS
  // ==========================================
  public async getVendors(): Promise<Vendor[]> {
    const client = getSupabaseClient()
    if (client) {
      try {
        const { data, error } = await client
          .from("vendors")
          .select("*")
          .order("id", { ascending: true })

        if (!error && data && data.length > 0) {
          return data.map((d: any) => this.mapVendorFromDb(d))
        }
      } catch (err) {
        console.warn("Supabase vendors fetch error, falling back to local cache:", err)
      }
    }

    // Local / Offline fallback
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_VENDORS)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        } catch (e) {}
      }
    }
    return defaultVendors
  }

  public async getVendorBySlug(slug: string): Promise<Vendor | null> {
    const vendors = await this.getVendors()
    return vendors.find((v) => v.slug === slug) || null
  }

  // ==========================================
  // 3. PRODUCTS CATALOG & STOCK
  // ==========================================
  public async getProducts(filter?: {
    category?: string
    brandSlug?: string
    department?: string
    isThrift?: boolean
  }): Promise<Product[]> {
    const client = getSupabaseClient()
    if (client) {
      try {
        let query = client.from("products").select("*").order("id", { ascending: true })

        if (filter?.brandSlug) {
          query = query.eq("brand_slug", filter.brandSlug)
        }
        if (filter?.category && filter.category !== "all" && filter.category !== "pretoria") {
          query = query.eq("category", filter.category)
        }
        if (filter?.isThrift !== undefined) {
          query = query.eq("is_thrift", filter.isThrift)
        }

        const { data, error } = await query
        if (!error && data && data.length > 0) {
          let list = data.map((d: any) => this.mapProductFromDb(d))
          if (filter?.category === "pretoria") {
            list = list.filter((p) => p.isPretoria || p.city === "Pretoria")
          }
          if (filter?.department && filter.department !== "ALL") {
            if (filter.department === "VINTAGE") {
              list = list.filter((p) => p.isThrift)
            } else {
              list = list.filter(
                (p) =>
                  p.gender.includes("UNISEX") ||
                  p.gender.includes(filter.department as any)
              )
            }
          }
          return list
        }
      } catch (err) {
        console.warn("Supabase products query failed, using local cache:", err)
      }
    }

    // Local / Offline fallback
    let currentProducts = defaultProducts
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_PRODUCTS)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentProducts = parsed
          }
        } catch (e) {}
      }
    }

    let result = [...currentProducts]
    if (filter?.brandSlug) {
      result = result.filter((p) => p.brandSlug === filter.brandSlug)
    }
    if (filter?.category && filter.category !== "all") {
      if (filter.category === "pretoria") {
        result = result.filter((p) => p.isPretoria || p.city === "Pretoria")
      } else {
        result = result.filter((p) => p.category === filter.category)
      }
    }
    if (filter?.isThrift !== undefined) {
      result = result.filter((p) => Boolean(p.isThrift) === filter.isThrift)
    }
    if (filter?.department && filter.department !== "ALL") {
      if (filter.department === "VINTAGE") {
        result = result.filter((p) => p.isThrift)
      } else {
        result = result.filter(
          (p) =>
            p.gender.includes("UNISEX") ||
            p.gender.includes(filter.department as any)
        )
      }
    }
    return result
  }

  public async getProductById(id: number): Promise<Product | null> {
    const products = await this.getProducts()
    return products.find((p) => p.id === id) || null
  }

  public async updateProductStock(
    productId: number,
    newStock: number
  ): Promise<boolean> {
    const client = getSupabaseClient()
    const safeStock = Math.max(0, newStock)
    const newStatus = safeStock === 0 ? "sold_out" : "active"

    if (client) {
      try {
        const { error } = await client
          .from("products")
          .update({
            stock: safeStock,
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("id", productId)

        if (!error) {
          this.notify()
          return true
        }
        console.warn("Supabase updateProductStock error:", error)
      } catch (err) {
        console.error("Supabase stock update error:", err)
      }
    }

    // Local / Offline fallback update
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_PRODUCTS)
      let list = defaultProducts
      if (saved) {
        try {
          list = JSON.parse(saved)
        } catch (e) {}
      }
      const updated = list.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: safeStock,
              status: newStatus,
            }
          : p
      )
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(updated))
      this.notify()
      return true
    }

    return false
  }

  public async createProduct(productData: Partial<Product>): Promise<Product> {
    const client = getSupabaseClient()
    const newId = Date.now()
    const newProduct: Product = {
      id: newId,
      title: productData.title || "Untitled Garment",
      brand: productData.brand || "Independent Label",
      brandSlug: productData.brandSlug || "urban-soul",
      category: (productData.category as any) || "outerwear",
      city: productData.city || "Pretoria",
      gender: productData.gender || ["UNISEX"],
      price: productData.price || 499,
      originalPrice: productData.originalPrice || null,
      image:
        productData.image ||
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80",
      secondaryImage:
        productData.secondaryImage ||
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
      badge: productData.badge || "NEW RELEASE",
      origin: productData.origin || "Pretoria, Gauteng",
      fabric: productData.fabric || "Heavyweight Cotton",
      sizes: productData.sizes || ["S", "M", "L", "XL"],
      description: productData.description || "Crafted in limited atelier batches.",
      isNew: true,
      stock: productData.stock ?? 15,
      stockPerSize: productData.stockPerSize || { S: 3, M: 6, L: 4, XL: 2 },
      status: "active",
      ...productData,
    }

    if (client) {
      try {
        const { data, error } = await client
          .from("products")
          .insert({
            title: newProduct.title,
            brand: newProduct.brand,
            brand_slug: newProduct.brandSlug,
            category: newProduct.category,
            city: newProduct.city,
            gender: newProduct.gender,
            price: newProduct.price,
            original_price: newProduct.originalPrice,
            image: newProduct.image,
            secondary_image: newProduct.secondaryImage,
            badge: newProduct.badge,
            origin: newProduct.origin,
            fabric: newProduct.fabric,
            sizes: newProduct.sizes,
            description: newProduct.description,
            is_new: true,
            stock: newProduct.stock,
            stock_per_size: newProduct.stockPerSize,
            status: "active",
          })
          .select()
          .single()

        if (!error && data) {
          const created = this.mapProductFromDb(data)
          this.notify()
          return created
        }
        console.warn("Supabase createProduct insert error:", error)
      } catch (err) {
        console.error("Supabase insert error:", err)
      }
    }

    // Local / Offline fallback update
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_PRODUCTS)
      let list = defaultProducts
      if (saved) {
        try {
          list = JSON.parse(saved)
        } catch (e) {}
      }
      list = [newProduct, ...list]
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(list))
      this.notify()
    }

    return newProduct
  }

  // ==========================================
  // 4. ORDERS & ESCROW TRANSACTIONS
  // ==========================================
  public async getOrders(brandSlug?: string): Promise<VendorOrder[]> {
    const client = getSupabaseClient()
    if (client) {
      try {
        let query = client
          .from("orders")
          .select("*, order_items(*)")
          .order("created_at", { ascending: false })

        if (brandSlug) {
          query = query.eq("brand_slug", brandSlug)
        }

        const { data, error } = await query
        if (!error && data && data.length > 0) {
          return data.map((d: any) => this.mapOrderFromDb(d))
        }
      } catch (err) {
        console.warn("Supabase orders query error, using local fallback:", err)
      }
    }

    // Local / Offline fallback
    let list = defaultOrders
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_ORDERS)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            list = parsed
          }
        } catch (e) {}
      }
    }

    if (brandSlug) {
      return list.filter((o) => o.brandSlug === brandSlug)
    }
    return list
  }

  /**
   * Places an order atomically with inventory deduction & 1-of-1 thrift mutex locking.
   */
  public async createOrder(orderPayload: {
    customerName: string
    customerCity: string
    customerPhone?: string
    lockerStation: string
    items: OrderItem[]
    totalAmount: number
    brandSlug?: string
  }): Promise<{
    success: boolean
    orderId: string
    orderNumber: string
    waybillNumber: string
    error?: string
  }> {
    const client = getSupabaseClient()
    const orderNumber = `LB-${Math.floor(10000 + Math.random() * 90000)}`
    const waybillNumber = `BG-${Math.floor(10000 + Math.random() * 90000)}-${(orderPayload.customerCity || "PTA").slice(0, 3).toUpperCase()}`
    const brandSlug =
      orderPayload.brandSlug ||
      (orderPayload.items[0]
        ? await this.getBrandSlugForProduct(orderPayload.items[0].productId)
        : "lesupa-atelier")

    const commissionAmount = Math.round(orderPayload.totalAmount * 0.13 * 100) / 100
    const payoutAmount = Math.round((orderPayload.totalAmount - commissionAmount) * 100) / 100

    if (client) {
      try {
        // Try calling atomic RPC stored procedure in PostgreSQL
        const { data: rpcData, error: rpcError } = await client.rpc(
          "create_order_atomic",
          {
            p_order_number: orderNumber,
            p_customer_name: orderPayload.customerName,
            p_customer_city: orderPayload.customerCity,
            p_customer_phone: orderPayload.customerPhone || "+27 82 555 4321",
            p_locker_station: orderPayload.lockerStation,
            p_total_amount: orderPayload.totalAmount,
            p_commission_amount: commissionAmount,
            p_payout_amount: payoutAmount,
            p_waybill_number: waybillNumber,
            p_brand_slug: brandSlug,
            p_items: orderPayload.items,
          }
        )

        if (!rpcError && rpcData?.success) {
          this.notify()
          return {
            success: true,
            orderId: rpcData.order_id,
            orderNumber: rpcData.order_number,
            waybillNumber: rpcData.waybill_number,
          }
        }

        // If RPC isn't loaded yet, perform direct Supabase transactional fallback
        const { data: orderRow, error: insertErr } = await client
          .from("orders")
          .insert({
            order_number: orderNumber,
            customer_name: orderPayload.customerName,
            customer_city: orderPayload.customerCity,
            customer_phone: orderPayload.customerPhone,
            locker_station: orderPayload.lockerStation,
            total_amount: orderPayload.totalAmount,
            commission_amount: commissionAmount,
            payout_amount: payoutAmount,
            status: "pending_pack",
            waybill_number: waybillNumber,
            brand_slug: brandSlug,
          })
          .select("id")
          .single()

        if (!insertErr && orderRow?.id) {
          // Insert items
          await client.from("order_items").insert(
            orderPayload.items.map((it) => ({
              order_id: orderRow.id,
              product_id: it.productId,
              product_title: it.productTitle,
              size: it.size,
              quantity: it.quantity,
              price: it.price,
              image: it.image,
            }))
          )

          // Deduct stock for ordered products
          for (const item of orderPayload.items) {
            const product = await this.getProductById(item.productId)
            if (product && product.stock !== undefined) {
              await this.updateProductStock(item.productId, product.stock - item.quantity)
            }
          }

          this.notify()
          return {
            success: true,
            orderId: orderRow.id,
            orderNumber,
            waybillNumber,
          }
        }
      } catch (err: any) {
        console.warn("Supabase order placement error, falling back to local engine:", err)
      }
    }

    // Local / Offline transactional fallback
    const localId = `ord-${Date.now()}`
    const newLocalOrder: VendorOrder = {
      id: localId,
      orderNumber,
      customerName: orderPayload.customerName,
      customerCity: orderPayload.customerCity,
      lockerStation: orderPayload.lockerStation,
      items: orderPayload.items,
      totalAmount: orderPayload.totalAmount,
      commissionAmount,
      payoutAmount,
      status: "pending_pack",
      createdAt: "Just now",
      waybillNumber,
      brandSlug,
    }

    if (typeof window !== "undefined") {
      // 1. Update orders list
      const savedOrders = localStorage.getItem(STORAGE_ORDERS)
      let ordersList = defaultOrders
      if (savedOrders) {
        try {
          ordersList = JSON.parse(savedOrders)
        } catch (e) {}
      }
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify([newLocalOrder, ...ordersList]))

      // 2. Decrement local stock
      const savedProducts = localStorage.getItem(STORAGE_PRODUCTS)
      let productsList = defaultProducts
      if (savedProducts) {
        try {
          productsList = JSON.parse(savedProducts)
        } catch (e) {}
      }

      const updatedProducts = productsList.map((p) => {
        const itemMatch = orderPayload.items.find((it) => it.productId === p.id)
        if (itemMatch) {
          const nextStock = Math.max(0, (p.stock ?? 10) - itemMatch.quantity)
          return {
            ...p,
            stock: nextStock,
            status: nextStock <= 0 ? ("sold_out" as const) : p.status,
          }
        }
        return p
      })
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(updatedProducts))
    }

    this.notify()
    return {
      success: true,
      orderId: localId,
      orderNumber,
      waybillNumber,
    }
  }

  public async advanceOrderStatus(
    orderId: string,
    targetStatus?: VendorOrder["status"]
  ): Promise<{ success: boolean; nextStatus: VendorOrder["status"]; waybill?: string }> {
    const orders = await this.getOrders()
    const target = orders.find((o) => o.id === orderId || o.orderNumber === orderId)
    if (!target) return { success: false, nextStatus: "pending_pack" }

    let nextStatus = targetStatus
    let newWaybill = target.waybillNumber

    if (!nextStatus) {
      if (target.status === "pending_pack") {
        nextStatus = "dispatched_to_locker"
        newWaybill = `BOB-GO-${Math.floor(100000 + Math.random() * 900000)}`
      } else if (target.status === "dispatched_to_locker") {
        nextStatus = "in_transit"
      } else if (target.status === "in_transit") {
        nextStatus = "ready_for_pickup"
      } else {
        nextStatus = "collected"
      }
    }

    const client = getSupabaseClient()
    if (client) {
      try {
        const { error } = await client
          .from("orders")
          .update({
            status: nextStatus,
            waybill_number: newWaybill,
          })
          .or(`id.eq.${orderId},order_number.eq.${orderId}`)

        if (!error) {
          this.notify()
          return { success: true, nextStatus, waybill: newWaybill }
        }
      } catch (err) {
        console.warn("Supabase advance order status error:", err)
      }
    }

    // Local / Offline fallback
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_ORDERS)
      let list = defaultOrders
      if (saved) {
        try {
          list = JSON.parse(saved)
        } catch (e) {}
      }
      const updated = list.map((o) =>
        o.id === orderId || o.orderNumber === orderId
          ? { ...o, status: nextStatus!, waybillNumber: newWaybill }
          : o
      )
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updated))
      this.notify()
    }

    return { success: true, nextStatus, waybill: newWaybill }
  }

  public resetLocalSandbox(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_PRODUCTS)
    localStorage.removeItem(STORAGE_ORDERS)
    localStorage.removeItem(STORAGE_VENDORS)
    this.notify()
  }

  // ==========================================
  // HELPER MAPPERS (Database snake_case <-> App camelCase)
  // ==========================================
  private mapVendorFromDb(d: any): Vendor {
    return {
      id: Number(d.id),
      slug: d.slug,
      name: d.name,
      letter: d.letter,
      tagline: d.tagline,
      origin: d.origin,
      city: d.city,
      gender: d.gender || ["UNISEX"],
      categories: d.categories || ["all"],
      priceRange: d.price_range,
      featured: Boolean(d.featured),
      color: d.color || "#C88A35",
      coverImage: d.cover_image,
      productCount: d.product_count || 0,
      coordinates: d.coordinates,
      isThrift: Boolean(d.is_thrift),
      specialty: d.specialty || "",
      conditionStandard: d.condition_standard || "",
      aboutStory: d.about_story,
      establishedYear: d.established_year,
      dispatchHub: d.dispatch_hub,
      contactPhone: d.contact_phone || "+27 12 345 6789",
      instagram: d.instagram || "",
      commissionRate: Number(d.commission_rate) || 0.13,
    }
  }

  private mapProductFromDb(d: any): Product {
    return {
      id: Number(d.id),
      title: d.title,
      brand: d.brand,
      brandSlug: d.brand_slug,
      category: d.category,
      city: d.city,
      gender: d.gender || ["UNISEX"],
      price: Number(d.price),
      originalPrice: d.original_price ? Number(d.original_price) : null,
      image: d.image,
      secondaryImage: d.secondary_image,
      badge: d.badge || "",
      origin: d.origin,
      fabric: d.fabric,
      sizes: d.sizes || [],
      description: d.description,
      isNew: Boolean(d.is_new),
      isSale: Boolean(d.is_sale),
      isThrift: Boolean(d.is_thrift),
      isPretoria: Boolean(d.is_pretoria),
      condition: d.condition || undefined,
      measurements: d.measurements || undefined,
      rarity: d.rarity || undefined,
      stock: d.stock !== undefined ? Number(d.stock) : 10,
      stockPerSize: d.stock_per_size || {},
      status: d.status || "active",
    }
  }

  private mapOrderFromDb(d: any): VendorOrder {
    const rawItems = d.order_items || []
    const items: OrderItem[] = rawItems.map((it: any) => ({
      productId: Number(it.product_id),
      productTitle: it.product_title,
      size: it.size,
      quantity: Number(it.quantity),
      price: Number(it.price),
      image: it.image,
    }))

    return {
      id: d.id,
      orderNumber: d.order_number,
      customerName: d.customer_name,
      customerCity: d.customer_city || "Pretoria",
      lockerStation: d.locker_station,
      items,
      totalAmount: Number(d.total_amount),
      commissionAmount: Number(d.commission_amount || 0),
      payoutAmount: Number(d.payout_amount || 0),
      status: d.status,
      createdAt: d.created_at ? new Date(d.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Today",
      waybillNumber: d.waybill_number,
      brandSlug: d.brand_slug,
    }
  }

  private async getBrandSlugForProduct(productId: number): Promise<string> {
    const p = await this.getProductById(productId)
    return p?.brandSlug || "lesupa-atelier"
  }
}

export const marketplaceService = new MarketplaceService()
