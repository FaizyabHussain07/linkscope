"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItemProps {
  question: string
  answer: string
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-[#27272A]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-white pr-4">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-[#A1A1AA] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="px-4 pb-4 text-sm leading-relaxed text-[#A1A1AA]">{answer}</p>
      </div>
    </div>
  )
}
