import React from "react"
import { vendors as defaultVendors } from "../data/marketplaceData"

interface AtelierLoginPageProps {
  onSignInWithDummy: (customAccount?: any) => void
  onManualLogin: (e: React.FormEvent) => void
  loginEmail: string
  setLoginEmail: (val: string) => void
  loginPasskey: string
  setLoginPasskey: (val: string) => void
  loginError: string | null
}

export default function AtelierLoginPage({
  onSignInWithDummy,
  onManualLogin,
  loginEmail,
  setLoginEmail,
  loginPasskey,
  setLoginPasskey,
  loginError,
}: AtelierLoginPageProps) {
  return (
    <div className="min-h-screen bg-[#f7f6f1] text-[#15140f] font-sans selection:bg-[#d6a34c]/25 flex flex-col">
      {/* ---------------- STICKY TOPBAR ---------------- */}
      <header className="sticky top-0 z-40 bg-[#fffdf8]/90 backdrop-blur-md border-b border-[#e4e1d6] px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#15140f] text-[#e9c079] flex items-center justify-center font-serif font-bold text-base shadow-sm">
            RT
          </div>
          <div>
            <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#15140f] block leading-none">
              ROOTED <span className="text-[#d6a34c] font-normal">Atelier</span>
            </span>
            <span className="text-[10px] font-mono text-[#6b6960] tracking-wider uppercase block mt-0.5">
              Pretoria (012) · Brand Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#/"
            className="px-4 py-2 rounded-full bg-[#15140f] hover:bg-[#26231a] text-[#fffdf8] text-xs font-mono font-medium transition-all shadow-xs flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Storefront</span>
          </a>
        </div>
      </header>

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative pt-8 pb-16 px-6 sm:px-10 lg:px-16 max-w-[1360px] mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#faf1de] border border-[#ecdfba] text-[#a07a1f] text-[11px] font-mono font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#454e3d] animate-pulse" />
              <span>Dedicated Merchant Platform · 012 &amp; Gauteng</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-normal text-[#15140f] leading-[1.1] tracking-tight">
              Where Local Craft Meets{" "}
              <span className="italic underline decoration-[#d6a34c] decoration-2 underline-offset-4">
                Smart Commerce.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#6b6960] font-light leading-relaxed max-w-xl">
              An operating platform built exclusively for South African
              independent streetwear labels. Manage drops, access nationwide
              PUDO smart lockers with automated Bob Go dispatch, protect your
              margins under strict tenant isolation, and receive automated
              weekly payouts.
            </p>

            {/* 4 Trust Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 bg-white border border-[#e4e1d6] rounded-xl shadow-2xs">
                <span className="text-[10px] font-mono text-[#6b6960] uppercase block">
                  Fulfillment
                </span>
                <b className="font-serif text-base text-[#15140f] block mt-0.5">
                  48h SLA
                </b>
                <span className="text-[10px] font-mono text-[#454e3d]">
                  Bob Go Dispatched
                </span>
              </div>
              <div className="p-3.5 bg-white border border-[#e4e1d6] rounded-xl shadow-2xs">
                <span className="text-[10px] font-mono text-[#6b6960] uppercase block">
                  Smart Lockers
                </span>
                <b className="font-serif text-base text-[#15140f] block mt-0.5">
                  1,400+
                </b>
                <span className="text-[10px] font-mono text-[#454e3d]">
                  Nationwide PUDO
                </span>
              </div>
              <div className="p-3.5 bg-white border border-[#e4e1d6] rounded-xl shadow-2xs">
                <span className="text-[10px] font-mono text-[#6b6960] uppercase block">
                  Net Payout
                </span>
                <b className="font-serif text-base text-[#15140f] block mt-0.5">
                  87% Net
                </b>
                <span className="text-[10px] font-mono text-[#454e3d]">
                  Weekly Direct EFT
                </span>
              </div>
              <div className="p-3.5 bg-white border border-[#e4e1d6] rounded-xl shadow-2xs">
                <span className="text-[10px] font-mono text-[#6b6960] uppercase block">
                  Data Security
                </span>
                <b className="font-serif text-base text-[#15140f] block mt-0.5">
                  Isolated
                </b>
                <span className="text-[10px] font-mono text-[#454e3d]">
                  POPIA Protected
                </span>
              </div>
            </div>

            {/* Editorial Quote Card */}
            <div className="p-5 bg-white border-l-4 border-[#d6a34c] rounded-r-2xl border-y border-r border-[#e4e1d6] shadow-2xs">
              <p className="font-serif italic text-sm text-[#15140f] leading-relaxed">
                "ROOTED gives independent Pretoria and Gauteng streetwear labels
                the logistics backbone of a national retail empire without
                sacrificing creative autonomy."
              </p>
              <span className="block text-[11px] font-mono text-[#6b6960] mt-2">
                — Curated Independent Fashion Engine · Gauteng 🇿🇦
              </span>
            </div>
          </div>

          {/* Right Column: Brand Partner Login Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#15140f] text-white border border-[#2b291f] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-5">
              <div className="flex items-center justify-between border-b border-[#2b291f] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e9c079] to-[#a64b34] text-white font-serif font-bold text-sm flex items-center justify-center shadow-sm">
                    US
                  </div>
                  <div>
                    <b className="font-serif text-base text-white block">
                      Atelier Studio Access
                    </b>
                    <span className="text-[10px] font-mono text-[#b9b6aa] block">
                      Secure Brand Partner Gateway
                    </span>
                  </div>
                </div>
                <span className="text-[9.5px] font-mono text-[#5c6851] bg-[#454e3d]/40 border border-[#5c6851]/40 px-2.5 py-0.5 rounded-full font-bold">
                  🔒 Isolated
                </span>
              </div>

              {/* Quick Dummy Test Account Instant Button */}
              <div className="bg-[#211f18] border border-[#d6a34c]/35 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-[#e9c079] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#5c6851] animate-pulse" />
                    <span>Instant Testing Account</span>
                  </div>
                  <span className="text-[9.5px] text-[#b9b6aa]">
                    Pre-loaded Demo
                  </span>
                </div>
                <p className="text-[11px] text-[#c7c3b6] font-light leading-relaxed">
                  Sign in immediately with Urban Soul sample orders, stock
                  meters, and revenue analytics.
                </p>
                <button
                  onClick={() => onSignInWithDummy()}
                  className="w-full py-3 bg-[#d6a34c] hover:bg-[#e9c079] text-[#15140f] font-mono font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>⚡</span>
                  <span>Sign In with Dummy Account (Urban Soul)</span>
                </button>
              </div>

              {/* Manual Login Form */}
              <form onSubmit={onManualLogin} className="space-y-3.5 pt-1">
                <div className="flex items-center gap-2 text-[#7a7768] text-[10px] font-mono uppercase">
                  <div className="h-px bg-[#2b291f] flex-1" />
                  <span>Or enter atelier credentials</span>
                  <div className="h-px bg-[#2b291f] flex-1" />
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-[#a64b34]/20 border border-[#a64b34] text-[#e9c079] text-xs font-mono">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#9a9788] mb-1 font-bold">
                    Atelier Email / Identifier
                  </label>
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="tester@urbansoul.co.za"
                    className="w-full bg-[#1c1a14] border border-[#2b291f] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#d6a34c]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#9a9788] mb-1 font-bold">
                    Secret Passkey / PIN
                  </label>
                  <input
                    type="password"
                    value={loginPasskey}
                    onChange={(e) => setLoginPasskey(e.target.value)}
                    placeholder="test-pass-2026"
                    className="w-full bg-[#1c1a14] border border-[#2b291f] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#d6a34c]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2b291f] hover:bg-[#383528] text-white border border-[#3e3a2b] font-mono text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Sign In to Studio Workspace →
                </button>
              </form>

              {/* Label Selector for Tenant Isolation Testing */}
              <div className="pt-2 border-t border-[#2b291f]">
                <div className="text-[10px] font-mono text-[#7a7768] uppercase text-center mb-2">
                  Test tenant isolation across labels:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {defaultVendors.slice(0, 4).map((v) => (
                    <button
                      key={v.id}
                      onClick={() =>
                        onSignInWithDummy({
                          brandSlug: v.slug,
                          brandName: v.name,
                          founderName: `${v.name} Lead`,
                          email: `test@${v.slug}.co.za`,
                          city: v.origin,
                        })
                      }
                      className="px-2.5 py-1.5 bg-[#1c1a14] hover:bg-[#26231a] border border-[#2b291f] hover:border-[#d6a34c] rounded-lg text-left text-[11px] font-mono text-[#c7c3b6] truncate transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: v.color || "#454e3d" }}
                      />
                      <span className="truncate">{v.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4 PLATFORM PILLARS ---------------- */}
      <section className="bg-[#efeee3] border-y border-[#e4e1d6] py-14 px-6 sm:px-10 lg:px-16">
        <div className="max-w-[1360px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] font-mono text-[#a64b34] font-bold tracking-widest uppercase">
              End-to-End Infrastructure
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#15140f] font-normal">
              Built for the Reality of South African Fashion.
            </h2>
            <p className="text-xs sm:text-sm text-[#6b6960] font-light">
              We remove the friction of couriers, fraud, isolated payment
              systems, and tenant cross-contamination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1 */}
            <div className="bg-white border border-[#e4e1d6] rounded-2xl p-5 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#faf1de] text-[#a07a1f] flex items-center justify-center text-lg font-bold">
                📦
              </div>
              <h3 className="font-serif text-base text-[#15140f] font-semibold">
                Smart Locker Logistics
              </h3>
              <p className="text-xs text-[#6b6960] font-light leading-relaxed">
                Seamless dispatch via Bob Go across 1,400+ nationwide PUDO smart
                lockers. Automated SMS/WhatsApp PIN codes delivered directly to
                customers.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border border-[#e4e1d6] rounded-2xl p-5 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#eef1ec] text-[#454e3d] flex items-center justify-center text-lg font-bold">
                🔒
              </div>
              <h3 className="font-serif text-base text-[#15140f] font-semibold">
                Strict Tenant Isolation
              </h3>
              <p className="text-xs text-[#6b6960] font-light leading-relaxed">
                Zero cross-tenant leakage. Your turnover, customer addresses,
                and supplier costs remain locked in an isolated silo with
                built-in Discreet Mode.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border border-[#e4e1d6] rounded-2xl p-5 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#faf6ec] text-[#d6a34c] flex items-center justify-center text-lg font-bold">
                ⚡
              </div>
              <h3 className="font-serif text-base text-[#15140f] font-semibold">
                Live Drop Orchestration
              </h3>
              <p className="text-xs text-[#6b6960] font-light leading-relaxed">
                Adjust stock counters per silhouette in real-time. Request new
                garment listings on-demand with curator approval within 48
                hours.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white border border-[#e4e1d6] rounded-2xl p-5 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#faf1de] text-[#a64b34] flex items-center justify-center text-lg font-bold">
                💳
              </div>
              <h3 className="font-serif text-base text-[#15140f] font-semibold">
                Weekly Direct EFT Payouts
              </h3>
              <p className="text-xs text-[#6b6960] font-light leading-relaxed">
                Transparent 87% net disbursement paid directly into your
                verified South African business bank account every week with
                automated PDF statements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- EDITORIAL FOOTER ---------------- */}
      <footer className="border-t border-[#e4e1d6] bg-[#15140f] text-[#b9b6aa] py-10 px-6 sm:px-10 lg:px-16 text-xs font-mono">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <b className="font-serif text-sm text-white block mb-0.5">
              ROOTED™ Atelier Studio
            </b>
            <span>
              The merchant platform for South African independent streetwear
              labels.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a href="#/" className="hover:text-white transition-colors">
              Customer Storefront
            </a>
            <span>·</span>
            <span>Pretoria (012), South Africa 🇿🇦</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
