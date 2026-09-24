import React, { useState, useEffect } from "react"
import { getSupabaseConfig } from "../lib/supabase"
import BackendConnectionModal from "./BackendConnectionModal"

interface BackendStatusBadgeProps {
  className?: string
  compact?: boolean
}

export default function BackendStatusBadge({
  className = "",
  compact = false,
}: BackendStatusBadgeProps) {
  const [config, setConfig] = useState(getSupabaseConfig())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const refreshConfig = () => {
    setConfig(getSupabaseConfig())
  }

  useEffect(() => {
    refreshConfig()
    const handleStorage = () => refreshConfig()
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-tight transition-all cursor-pointer border ${
          config.isConfigured
            ? "bg-[#ecfdf5] hover:bg-[#d1fae5] border-[#10b981]/40 text-[#065f46]"
            : "bg-[#fef3c7] hover:bg-[#fde68a] border-[#f59e0b]/40 text-[#92400e]"
        } ${className}`}
        title="Click to view and configure PostgreSQL / Supabase backend"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            config.isConfigured ? "bg-[#10b981] animate-pulse" : "bg-[#f59e0b]"
          }`}
        ></span>
        <span className="font-semibold">
          {config.isConfigured
            ? compact
              ? "PostgreSQL"
              : "Supabase PG"
            : compact
              ? "Sandbox"
              : "Backend: Sandbox"}
        </span>
        <span className="text-[9px] opacity-60">⚙</span>
      </button>

      <BackendConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={refreshConfig}
      />
    </>
  )
}
