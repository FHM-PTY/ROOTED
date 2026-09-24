import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { lockerStations, vendors, products, initialVendorOrders } from "../data/marketplaceData"
import { Product, Vendor, LockerStation, VendorOrder } from "../types"

// LocalStorage keys for in-app configuration overrides
const STORAGE_KEY_URL = "rooted_supabase_url"
const STORAGE_KEY_KEY = "rooted_supabase_anon_key"

/**
 * Retrieves the currently active Supabase configuration,
 * prioritizing in-app runtime overrides over Vite env variables.
 */
export function getSupabaseConfig(): {
  url: string
  anonKey: string
  isCustom: boolean
  isConfigured: boolean
} {
  const envUrl = (
    import.meta.env.VITE_SUPABASE_URL ||
    (import.meta.env as any).SUPABASE_URL ||
    ""
  ).trim()
  const envKey = (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    (import.meta.env as any).SUPABASE_PUBLISHABLE_KEY ||
    (import.meta.env as any).VITE_SUPABASE_PUBLISHABLE_KEY ||
    ""
  ).trim()

  let customUrl = ""
  let customKey = ""

  if (typeof window !== "undefined") {
    customUrl = (localStorage.getItem(STORAGE_KEY_URL) || "").trim()
    customKey = (localStorage.getItem(STORAGE_KEY_KEY) || "").trim()
  }

  const activeUrl = customUrl || envUrl
  const activeKey = customKey || envKey

  const isConfigured = Boolean(
    activeUrl &&
    activeKey &&
    activeUrl.startsWith("http") &&
    !activeUrl.includes("your-project.supabase.co")
  )

  return {
    url: activeUrl,
    anonKey: activeKey,
    isCustom: Boolean(customUrl && customKey),
    isConfigured,
  }
}

let cachedClient: SupabaseClient | null = null
let lastConfigHash = ""

/**
 * Returns a configured Supabase client instance, or null if not yet configured.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig()
  const configHash = `${config.url}::${config.anonKey}`

  if (!config.isConfigured) {
    cachedClient = null
    lastConfigHash = ""
    return null
  }

  if (cachedClient && lastConfigHash === configHash) {
    return cachedClient
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
    lastConfigHash = configHash
    return cachedClient
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err)
    return null
  }
}

/**
 * Save custom Supabase credentials from the in-app connection manager
 */
export function setSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY_URL, url.trim())
  localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim())
  cachedClient = null
  lastConfigHash = ""
}

/**
 * Reset back to environment default
 */
export function clearSupabaseConfig(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY_URL)
  localStorage.removeItem(STORAGE_KEY_KEY)
  cachedClient = null
  lastConfigHash = ""
}

/**
 * Diagnostic health check to test connection with remote Supabase instance
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean
  message: string
  latencyMs?: number
  schemaReady?: boolean
  recordCounts?: { lockers: number; vendors: number; products: number; orders: number }
}> {
  const client = getSupabaseClient()
  if (!client) {
    return {
      success: false,
      message: "Supabase credentials are not configured or URL is invalid.",
    }
  }

  const startTime = performance.now()
  try {
    // 1. Test pinging the lockers table
    const { data: lockersData, error: lockersError } = await client
      .from("locker_stations")
      .select("id", { count: "exact" })
      .limit(1)

    const latencyMs = Math.round(performance.now() - startTime)

    if (lockersError) {
      // Table might not exist yet if migrations haven't run
      if (lockersError.code === "42P01" || lockersError.message.includes("relation") || lockersError.message.includes("does not exist")) {
        return {
          success: true,
          schemaReady: false,
          latencyMs,
          message: "Connected to Supabase project! PostgreSQL tables have not been created yet. Run the SQL Migration script in your Supabase SQL Editor.",
        }
      }
      return {
        success: false,
        latencyMs,
        message: `Database error: ${lockersError.message} (Code: ${lockersError.code})`,
      }
    }

    // 2. Fetch counts for quick diagnostic
    const [vendorsRes, productsRes, ordersRes] = await Promise.all([
      client.from("vendors").select("id", { count: "exact", head: true }),
      client.from("products").select("id", { count: "exact", head: true }),
      client.from("orders").select("id", { count: "exact", head: true }),
    ])

    return {
      success: true,
      schemaReady: true,
      latencyMs,
      message: `Successfully connected to PostgreSQL 16 at ${getSupabaseConfig().url}! Latency: ${latencyMs}ms.`,
      recordCounts: {
        lockers: lockersData?.length || 0,
        vendors: vendorsRes.count || 0,
        products: productsRes.count || 0,
        orders: ordersRes.count || 0,
      },
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to establish connection with Supabase backend.",
    }
  }
}

/**
 * 1-Click Database Seeder: Populates remote Supabase PostgreSQL database
 * directly from the curated ROOTED master dataset if tables are empty.
 */
export async function seedSupabaseDatabase(): Promise<{
  success: boolean
  message: string
  seeded?: { lockers: number; vendors: number; products: number; orders: number }
}> {
  const client = getSupabaseClient()
  if (!client) {
    return { success: false, message: "Supabase client not configured." }
  }

  try {
    // 1. Seed Locker Stations
    const { error: lockerErr } = await client.from("locker_stations").upsert(
      lockerStations.map((l) => ({
        id: l.id,
        name: l.name,
        address: l.address,
        hours: l.hours,
        type: l.type,
        distance: l.distance,
        city: l.city,
        commuter_tag: l.commuterTag,
      })),
      { onConflict: "id" }
    )
    if (lockerErr) throw new Error(`Locker seeding error: ${lockerErr.message}`)

    // 2. Seed Vendors
    const { error: vendorErr } = await client.from("vendors").upsert(
      vendors.map((v) => ({
        id: v.id,
        slug: v.slug,
        name: v.name,
        letter: v.letter,
        tagline: v.tagline,
        origin: v.origin,
        city: v.city,
        gender: v.gender,
        categories: v.categories,
        price_range: v.priceRange,
        featured: v.featured,
        color: v.color,
        cover_image: v.coverImage,
        product_count: v.productCount,
        coordinates: v.coordinates,
        is_thrift: Boolean(v.isThrift),
        specialty: v.specialty || "",
        condition_standard: v.conditionStandard || "",
        about_story: v.aboutStory,
        established_year: v.establishedYear,
        dispatch_hub: v.dispatchHub,
        contact_phone: v.contactPhone || "+27 12 345 6789",
        instagram: v.instagram || "",
        commission_rate: v.commissionRate || 0.13,
      })),
      { onConflict: "slug" }
    )
    if (vendorErr) throw new Error(`Vendor seeding error: ${vendorErr.message}`)

    // 3. Seed Products
    const { error: prodErr } = await client.from("products").upsert(
      products.map((p) => ({
        id: p.id,
        title: p.title,
        brand: p.brand,
        brand_slug: p.brandSlug,
        category: p.category,
        city: p.city,
        gender: p.gender,
        price: p.price,
        original_price: p.originalPrice || null,
        image: p.image,
        secondary_image: p.secondaryImage,
        badge: p.badge || "",
        origin: p.origin,
        fabric: p.fabric,
        sizes: p.sizes,
        description: p.description,
        is_new: Boolean(p.isNew),
        is_sale: Boolean(p.isSale),
        is_thrift: Boolean(p.isThrift),
        is_pretoria: Boolean(p.isPretoria),
        condition: p.condition || null,
        measurements: p.measurements || null,
        rarity: p.rarity || null,
        stock: p.stock ?? (p.isThrift ? 1 : 12),
        stock_per_size: p.stockPerSize || {},
        status: p.status || "active",
      })),
      { onConflict: "id" }
    )
    if (prodErr) throw new Error(`Product seeding error: ${prodErr.message}`)

    // 4. Seed Initial Vendor Orders
    for (const o of initialVendorOrders) {
      const { data: orderData, error: orderErr } = await client
        .from("orders")
        .upsert(
          {
            order_number: o.orderNumber,
            customer_name: o.customerName,
            customer_city: o.customerCity,
            locker_station: o.lockerStation,
            total_amount: o.totalAmount,
            commission_amount: o.commissionAmount,
            payout_amount: o.payoutAmount,
            status: o.status,
            waybill_number: o.waybillNumber,
            brand_slug: o.brandSlug,
          },
          { onConflict: "order_number" }
        )
        .select("id")
        .single()

      if (!orderErr && orderData?.id && o.items) {
        await client.from("order_items").upsert(
          o.items.map((item) => ({
            order_id: orderData.id,
            product_id: item.productId,
            product_title: item.productTitle,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          }))
        )
      }
    }

    return {
      success: true,
      message: `Successfully seeded remote database: ${lockerStations.length} Lockers, ${vendors.length} Labels, ${products.length} Products, and ${initialVendorOrders.length} Orders.`,
      seeded: {
        lockers: lockerStations.length,
        vendors: vendors.length,
        products: products.length,
        orders: initialVendorOrders.length,
      },
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to seed database.",
    }
  }
}
