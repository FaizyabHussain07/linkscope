import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-[#111113] p-6 transition-all duration-300",
        "border-[#27272A] hover:border-[#3F3F46] hover:bg-[#18181B]",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow effect on hover */}
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-300",
          hovered && "opacity-20"
        )}
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
        }}
      />

      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
            hovered ? "bg-[#6366F1]/20" : "bg-[#18181B]"
          )}
        >
          {React.cloneElement(icon as React.ReactElement, {
            className: cn(
              "h-5 w-5 transition-colors",
              hovered ? "text-[#6366F1]" : "text-[#A1A1AA]"
            ),
          })}
        </div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-[#A1A1AA]">{description}</p>
    </div>
  )
}
