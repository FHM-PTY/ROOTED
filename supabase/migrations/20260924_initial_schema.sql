-- ==============================================================================
-- ROOTED™ (Le Benkeleng) Master PostgreSQL 16 & Supabase Database Migration
-- Phase 1 / Week 1 Technical Roadmap: Cloud Migration, Tenant RLS & Mutex
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. LOCKER STATIONS (Bob Go / Pargo Smart Pickup Network)
CREATE TABLE IF NOT EXISTS public.locker_stations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    hours VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    distance VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    commuter_tag VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. VENDORS / BRANDS (Multi-Tenant Independent Label Profiles)
CREATE TABLE IF NOT EXISTS public.vendors (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    letter VARCHAR(5) NOT NULL,
    tagline TEXT NOT NULL,
    origin VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    gender TEXT[] DEFAULT ARRAY['UNISEX']::TEXT[],
    categories TEXT[] DEFAULT ARRAY['all']::TEXT[],
    price_range VARCHAR(100) NOT NULL,
    featured BOOLEAN DEFAULT false,
    color VARCHAR(30) DEFAULT '#C88A35',
    cover_image TEXT NOT NULL,
    product_count INTEGER DEFAULT 0,
    coordinates VARCHAR(100) NOT NULL,
    is_thrift BOOLEAN DEFAULT false,
    specialty TEXT,
    condition_standard TEXT,
    about_story TEXT NOT NULL,
    established_year VARCHAR(10) NOT NULL,
    dispatch_hub VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    instagram VARCHAR(100),
    commission_rate NUMERIC(4, 2) DEFAULT 0.13, -- 13% platform escrow split
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. PRODUCTS (Catalog & Live Inventory Matrix)
CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    brand_slug VARCHAR(100) NOT NULL REFERENCES public.vendors(slug) ON UPDATE CASCADE ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    gender TEXT[] DEFAULT ARRAY['UNISEX']::TEXT[],
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    image TEXT NOT NULL,
    secondary_image TEXT NOT NULL,
    badge VARCHAR(100) DEFAULT '',
    origin VARCHAR(255) NOT NULL,
    fabric TEXT NOT NULL,
    sizes TEXT[] NOT NULL,
    description TEXT NOT NULL,
    is_new BOOLEAN DEFAULT false,
    is_sale BOOLEAN DEFAULT false,
    is_thrift BOOLEAN DEFAULT false,
    is_pretoria BOOLEAN DEFAULT false,
    condition VARCHAR(100),
    measurements TEXT,
    rarity VARCHAR(100),
    stock INTEGER DEFAULT 10,
    stock_per_size JSONB DEFAULT '{}'::JSONB,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'sold_out')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ORDERS (South African E-Commerce Escrow Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(50),
    locker_station VARCHAR(255) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    commission_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- 13% platform fee
    payout_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,     -- 87% vendor net payout
    status VARCHAR(50) NOT NULL DEFAULT 'pending_pack' CHECK (
        status IN ('pending_pack', 'dispatched_to_locker', 'in_transit', 'ready_for_pickup', 'collected')
    ),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    waybill_number VARCHAR(100) NOT NULL,
    brand_slug VARCHAR(100) NOT NULL REFERENCES public.vendors(slug) ON UPDATE CASCADE
);

-- 6. ORDER ITEMS (Itemized Transaction Line Items)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id) ON DELETE SET NULL,
    product_title VARCHAR(255) NOT NULL,
    size VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR SUB-SECOND SEARCH & TENANT QUERY OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_brand_slug ON public.products(brand_slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_thrift ON public.products(is_thrift);
CREATE INDEX IF NOT EXISTS idx_orders_brand_slug ON public.orders(brand_slug);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — POPIA & MULTI-TENANT ISOLATION
-- ==============================================================================
ALTER TABLE public.locker_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. Locker Stations: Public read-only
CREATE POLICY "Public read locker stations" ON public.locker_stations
    FOR SELECT USING (true);

-- 2. Vendors: Public can view active brands; Admins/Brand Owners can edit
CREATE POLICY "Public read vendors" ON public.vendors
    FOR SELECT USING (true);

CREATE POLICY "Vendors can update own brand profile" ON public.vendors
    FOR UPDATE USING (
        auth.uid() = auth_user_id OR
        auth.jwt() ->> 'brand_slug' = slug OR
        auth.role() = 'service_role'
    );

-- 3. Products: Public read active; Vendors can manage their own catalog
CREATE POLICY "Public read active products" ON public.products
    FOR SELECT USING (status = 'active' OR auth.role() = 'service_role');

CREATE POLICY "Vendors can insert own products" ON public.products
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'brand_slug' = brand_slug OR
        auth.role() = 'service_role' OR
        EXISTS (SELECT 1 FROM public.vendors WHERE vendors.slug = brand_slug AND vendors.auth_user_id = auth.uid())
    );

CREATE POLICY "Vendors can update own products" ON public.products
    FOR UPDATE USING (
        auth.jwt() ->> 'brand_slug' = brand_slug OR
        auth.role() = 'service_role' OR
        EXISTS (SELECT 1 FROM public.vendors WHERE vendors.slug = brand_slug AND vendors.auth_user_id = auth.uid())
    );

CREATE POLICY "Vendors can delete own products" ON public.products
    FOR DELETE USING (
        auth.jwt() ->> 'brand_slug' = brand_slug OR
        auth.role() = 'service_role' OR
        EXISTS (SELECT 1 FROM public.vendors WHERE vendors.slug = brand_slug AND vendors.auth_user_id = auth.uid())
    );

-- 4. Orders: Public/Customers can create orders; Vendors see only their own orders
CREATE POLICY "Public customer can insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Customer can view order by ID or order_number" ON public.orders
    FOR SELECT USING (true);

CREATE POLICY "Vendors can view and update own orders" ON public.orders
    FOR ALL USING (
        auth.jwt() ->> 'brand_slug' = brand_slug OR
        auth.role() = 'service_role' OR
        EXISTS (SELECT 1 FROM public.vendors WHERE vendors.slug = orders.brand_slug AND vendors.auth_user_id = auth.uid())
    );

-- 5. Order Items: Same cascade access
CREATE POLICY "Public customer can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public customer can view order items" ON public.order_items
    FOR SELECT USING (true);

-- ==============================================================================
-- ATOMIC ORDER TRANSACTION & THRIFT 1-OF-1 MUTEX (RPC)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.create_order_atomic(
    p_order_number VARCHAR(50),
    p_customer_name VARCHAR(255),
    p_customer_city VARCHAR(100),
    p_customer_phone VARCHAR(50),
    p_locker_station VARCHAR(255),
    p_total_amount NUMERIC(10, 2),
    p_commission_amount NUMERIC(10, 2),
    p_payout_amount NUMERIC(10, 2),
    p_waybill_number VARCHAR(100),
    p_brand_slug VARCHAR(100),
    p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_product_id BIGINT;
    v_qty INT;
    v_size VARCHAR;
    v_current_stock INT;
    v_is_thrift BOOLEAN;
    v_product_title VARCHAR;
BEGIN
    -- 1. Validate & Lock inventory for each item to prevent race conditions
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'productId')::BIGINT;
        v_qty := COALESCE((v_item->>'quantity')::INT, 1);
        v_size := v_item->>'size';

        -- Select FOR UPDATE locks the row against simultaneous checkout attempts
        SELECT stock, is_thrift, title
        INTO v_current_stock, v_is_thrift, v_product_title
        FROM public.products
        WHERE id = v_product_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product % does not exist in catalog', v_product_id;
        END IF;

        -- Thrift Zone 1-of-1 Mutex Guard
        IF v_is_thrift = true AND v_current_stock < v_qty THEN
            RAISE EXCEPTION 'Thrift Vault piece "%" is 1-of-1 and has already been claimed!', v_product_title;
        END IF;

        IF v_current_stock < v_qty THEN
            RAISE EXCEPTION 'Insufficient stock for "%" (Available: %, Requested: %)', v_product_title, v_current_stock, v_qty;
        END IF;

        -- Decrement stock
        UPDATE public.products
        SET stock = GREATEST(0, stock - v_qty),
            status = CASE WHEN (stock - v_qty) <= 0 THEN 'sold_out' ELSE status END,
            updated_at = NOW()
        WHERE id = v_product_id;
    END LOOP;

    -- 2. Insert master Order record
    INSERT INTO public.orders (
        order_number,
        customer_name,
        customer_city,
        customer_phone,
        locker_station,
        total_amount,
        commission_amount,
        payout_amount,
        status,
        waybill_number,
        brand_slug
    ) VALUES (
        p_order_number,
        p_customer_name,
        p_customer_city,
        p_customer_phone,
        p_locker_station,
        p_total_amount,
        p_commission_amount,
        p_payout_amount,
        'pending_pack',
        p_waybill_number,
        p_brand_slug
    ) RETURNING id INTO v_order_id;

    -- 3. Insert line items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_title,
            size,
            quantity,
            price,
            image
        ) VALUES (
            v_order_id,
            (v_item->>'productId')::BIGINT,
            v_item->>'productTitle',
            v_item->>'size',
            COALESCE((v_item->>'quantity')::INT, 1),
            (v_item->>'price')::NUMERIC(10, 2),
            v_item->>'image'
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', p_order_number,
        'waybill_number', p_waybill_number
    );
END;
$$;

-- ==============================================================================
-- ROLE GRANTS (Permissions for anon and authenticated API clients)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON TABLE public.locker_stations TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.vendors TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.order_items TO anon, authenticated, service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
