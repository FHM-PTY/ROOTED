import React, { useState, useEffect } from "react"
import {
  getSupabaseConfig,
  setSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  seedSupabaseDatabase,
} from "../lib/supabase"
import { marketplaceService } from "../services/marketplaceService"

interface BackendConnectionModalProps {
  isOpen: boolean
  onClose: () => void
  onStatusChange?: () => void
}

export default function BackendConnectionModal({
  isOpen,
  onClose,
  onStatusChange,
}: BackendConnectionModalProps) {
  const [config, setConfig] = useState(getSupabaseConfig())
  const [urlInput, setUrlInput] = useState(config.url)
  const [keyInput, setKeyInput] = useState(config.anonKey)
  const [isTesting, setIsTesting] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    latencyMs?: number
    schemaReady?: boolean
    recordCounts?: { lockers: number; vendors: number; products: number; orders: number }
  } | null>(null)
  const [seedResult, setSeedResult] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"connection" | "migration" | "seed">("connection")
  const [copiedSql, setCopiedSql] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const current = getSupabaseConfig()
      setConfig(current)
      setUrlInput(current.url)
      setKeyInput(current.anonKey)
      setSeedResult(null)
      // Auto-run test if configured
      if (current.isConfigured) {
        handleTest()
      }
    }
  }, [isOpen])

  const handleSave = () => {
    if (!urlInput.trim() || !keyInput.trim()) {
      alert("Please provide both Supabase Project URL and Anon API Key.")
      return
    }
    setSupabaseConfig(urlInput, keyInput)
    const updated = getSupabaseConfig()
    setConfig(updated)
    onStatusChange?.()
    handleTest()
  }

  const handleResetToSandbox = () => {
    clearSupabaseConfig()
    const updated = getSupabaseConfig()
    setConfig(updated)
    setUrlInput("")
    setKeyInput("")
    setTestResult(null)
    setSeedResult("Switched to Local Sandbox Engine (zero external dependencies).")
    onStatusChange?.()
  }

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)
    try {
      const res = await testSupabaseConnection()
      setTestResult(res)
    } finally {
      setIsTesting(false)
    }
  }

  const handleSeed = async () => {
    setIsSeeding(true)
    setSeedResult(null)
    try {
      const res = await seedSupabaseDatabase()
      setSeedResult(res.message)
      if (res.success) {
        onStatusChange?.()
        handleTest()
      }
    } catch (err: any) {
      setSeedResult(`Seeding failed: ${err.message}`)
    } finally {
      setIsSeeding(false)
    }
  }

  const copySqlMigration = () => {
    const sqlText = `-- ROOTED™ (Le Benkeleng) Master Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.locker_stations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    hours VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    distance VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    commuter_tag VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

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
    commission_rate NUMERIC(4,2) DEFAULT 0.13,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    brand_slug VARCHAR(100) NOT NULL REFERENCES public.vendors(slug) ON UPDATE CASCADE,
    category VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    gender TEXT[] DEFAULT ARRAY['UNISEX']::TEXT[],
    price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2),
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
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(50),
    locker_station VARCHAR(255) NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    commission_amount NUMERIC(10,2) DEFAULT 0.00,
    payout_amount NUMERIC(10,2) DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_pack',
    created_at TIMESTAMPTZ DEFAULT now(),
    waybill_number VARCHAR(100) NOT NULL,
    brand_slug VARCHAR(100) NOT NULL REFERENCES public.vendors(slug)
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES public.products(id),
    product_title VARCHAR(255) NOT NULL,
    size VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10,2) NOT NULL,
    image TEXT NOT NULL
);`
    navigator.clipboard.writeText(sqlText)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 2500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15140f]/75 backdrop-blur-xs">
      <div className="bg-[#fffdf8] max-w-2xl w-full rounded-2xl shadow-2xl p-6 sm:p-8 relative border border-[rgba(21,20,15,0.14)] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[rgba(21,20,15,0.5)] hover:text-[#15140f] cursor-pointer text-lg"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#15803d] animate-pulse"></span>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#a64b34] font-semibold">
            Phase 1/2 Architecture • Database Migration
          </span>
        </div>

        <h3 className="text-2xl font-serif text-[#15140f] mt-1 font-normal">
          PostgreSQL &amp; Supabase Backend Engine
        </h3>
        <p className="text-xs text-[rgba(21,20,15,0.65)] mt-1">
          Switch from browser localStorage state to production-grade PostgreSQL 16 on Supabase with Row-Level Security (RLS) and real-time inventory mutex.
        </p>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-[rgba(21,20,15,0.12)] mt-5 pb-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab("connection")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "connection"
                ? "bg-[#15140f] text-[#fffdf8] font-bold"
                : "text-[rgba(21,20,15,0.7)] hover:bg-[#efeee3]"
            }`}
          >
            1. Cloud Connection
          </button>
          <button
            onClick={() => setActiveTab("migration")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "migration"
                ? "bg-[#15140f] text-[#fffdf8] font-bold"
                : "text-[rgba(21,20,15,0.7)] hover:bg-[#efeee3]"
            }`}
          >
            2. SQL Schema (RLS)
          </button>
          <button
            onClick={() => setActiveTab("seed")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "seed"
                ? "bg-[#15140f] text-[#fffdf8] font-bold"
                : "text-[rgba(21,20,15,0.7)] hover:bg-[#efeee3]"
            }`}
          >
            3. Database Seeder
          </button>
        </div>

        {/* TAB 1: CONNECTION */}
        {activeTab === "connection" && (
          <div className="mt-5 space-y-4">
            <div className="p-3.5 bg-[#efeee3] rounded-xl border border-[rgba(21,20,15,0.08)] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[rgba(21,20,15,0.5)]">
                  Active Data Layer
                </div>
                <div className="text-xs font-bold text-[#15140f] mt-0.5 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      config.isConfigured ? "bg-[#15803d]" : "bg-[#d97706]"
                    }`}
                  ></span>
                  {config.isConfigured
                    ? "Live Supabase PostgreSQL 16"
                    : "Local Sandbox Engine (Offline Fallback Cache)"}
                </div>
              </div>
              <div className="text-[10px] font-mono bg-[#fffdf8] px-2.5 py-1 rounded-md border border-[rgba(21,20,15,0.1)] text-[#15140f]">
                {config.isConfigured ? "CONNECTED" : "SANDBOX MODE"}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[rgba(21,20,15,0.7)] mb-1">
                Supabase Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-[#efeee3] border border-[rgba(21,20,15,0.15)] rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-[#15140f]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[rgba(21,20,15,0.7)] mb-1">
                Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-[#efeee3] border border-[rgba(21,20,15,0.15)] rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-[#15140f]"
              />
            </div>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs font-mono ${
                  testResult.success
                    ? "bg-[#ecfdf5] border-[#10b981] text-[#065f46]"
                    : "bg-[#fff1f2] border-[#f43f5e] text-[#9f1239]"
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{testResult.success ? "✓ Connection Healthy" : "⚠ Diagnostic Error"}</span>
                  {testResult.latencyMs !== undefined && (
                    <span className="text-[10px] bg-white/70 px-2 py-0.5 rounded">
                      {testResult.latencyMs} ms
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[11px] leading-relaxed">{testResult.message}</div>
                {testResult.recordCounts && (
                  <div className="mt-2 pt-2 border-t border-current/20 grid grid-cols-4 gap-2 text-[10px]">
                    <div>Lockers: <b>{testResult.recordCounts.lockers}</b></div>
                    <div>Labels: <b>{testResult.recordCounts.vendors}</b></div>
                    <div>Products: <b>{testResult.recordCounts.products}</b></div>
                    <div>Orders: <b>{testResult.recordCounts.orders}</b></div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-[#15140f] hover:bg-[#2b291f] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Save &amp; Connect Cloud DB
              </button>

              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting}
                className="px-4 py-2 bg-[#efeee3] hover:bg-[#e4e2d5] text-[#15140f] rounded-xl text-xs font-semibold cursor-pointer border border-[rgba(21,20,15,0.15)] transition-colors disabled:opacity-50"
              >
                {isTesting ? "Testing Ping..." : "Test Connection"}
              </button>

              <button
                type="button"
                onClick={handleResetToSandbox}
                className="px-3 py-2 text-[rgba(21,20,15,0.6)] hover:text-[#15140f] rounded-xl text-xs font-medium cursor-pointer transition-colors ml-auto"
              >
                Reset to Local Sandbox
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SQL MIGRATION */}
        {activeTab === "migration" && (
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-[rgba(21,20,15,0.7)]">
                Copy and run in your <b>Supabase SQL Editor</b> to create tables, indexes, and RLS policies:
              </div>
              <button
                type="button"
                onClick={copySqlMigration}
                className="px-3 py-1 bg-[#15140f] hover:bg-[#2b291f] text-white rounded-lg text-xs font-mono font-semibold cursor-pointer"
              >
                {copiedSql ? "✓ Copied to Clipboard" : "Copy SQL Script"}
              </button>
            </div>

            <pre className="bg-[#15140f] text-[#efeee3] p-4 rounded-xl text-[10.5px] font-mono overflow-x-auto max-h-72 border border-[rgba(21,20,15,0.2)]">
              {`-- Full migration located in: supabase/migrations/20260924_initial_schema.sql
-- Includes:
-- 1. locker_stations (Bob Go hubs)
-- 2. vendors (Multi-tenant label profiles, 13% commission)
-- 3. products (Catalog & live size matrices)
-- 4. orders & order_items (Escrow settlement)
-- 5. Row-Level Security (POPIA compliance & tenant isolation)
-- 6. RPC: create_order_atomic (1-of-1 Thrift Vault mutex lock)`}
            </pre>
            <div className="text-[11px] text-[rgba(21,20,15,0.6)]">
              File reference: <code className="bg-[#efeee3] px-1.5 py-0.5 rounded text-[#15140f]">supabase/migrations/20260924_initial_schema.sql</code>
            </div>
          </div>
        )}

        {/* TAB 3: SEEDER */}
        {activeTab === "seed" && (
          <div className="mt-5 space-y-4">
            <div className="text-xs text-[rgba(21,20,15,0.7)] leading-relaxed">
              If your remote Supabase database was just provisioned and has empty tables, click below to automatically seed the entire curated ROOTED master dataset (6 smart lockers, 6 Pretoria/Gauteng labels, 30+ products, and initial test orders) in one click!
            </div>

            <button
              type="button"
              onClick={handleSeed}
              disabled={isSeeding || !config.isConfigured}
              className="w-full py-3 bg-[#15140f] hover:bg-[#2b291f] text-white rounded-xl text-xs font-bold font-mono tracking-wide cursor-pointer transition-colors disabled:opacity-40"
            >
              {isSeeding ? "Seeding Cloud Database..." : "⚡ 1-Click Seed Remote Database with Master Catalog"}
            </button>

            {seedResult && (
              <div className="p-3 bg-[#ecfdf5] border border-[#10b981] rounded-xl text-xs font-mono text-[#065f46]">
                {seedResult}
              </div>
            )}

            <div className="p-3.5 bg-[#efeee3] rounded-xl border border-[rgba(21,20,15,0.08)] text-[11px] font-mono text-[rgba(21,20,15,0.75)]">
              Alternative CLI option: run <code className="text-[#15140f] font-bold">cat supabase/seed.sql | psql $DATABASE_URL</code> in your terminal.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
