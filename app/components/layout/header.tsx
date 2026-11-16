"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { GitHub, Menu, X, Search } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#developers", label: "Developers" },
  { href: "#open-source", label: "Open source" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b",
        scrolled ? "bg-[#09090B]/90 backdrop-blur-xl border-[#27272A]" : "bg-transparent border-transparent"
      )}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-lg shadow-[#6366F1]/20 group-hover:shadow-[#6366F1]/30 transition-shadow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">LinkScope</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[#A1A1AA] transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Badge variant="secondary" className="bg-[#18181B] text-[#A1A1AA] border-[#27272A] font-medium">
            <GitHub className="mr-1.5 h-3.5 w-3.5" />
            Open source
          </Badge>
          <Link href="https://github.com/FaizyabHussain07/linkscope" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="border-[#27272A] text-white hover:bg-[#18181B] hover:text-white">
              <GitHub className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </Link>
          <Link href="/inspect">
            <Button size="sm" className="bg-white text-[#09090B] hover:bg-[#FAFAFA] font-medium">
              Try LinkScope
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-[#A1A1AA] lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#27272A] bg-[#09090B] px-4 py-4 sm:px-6 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-3 text-base font-medium text-[#A1A1AA] transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="https://github.com/FaizyabHussain07/linkscope" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-[#27272A] justify-start text-white hover:bg-[#18181B]">
                <GitHub className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </Link>
            <Link href="/inspect">
              <Button className="w-full bg-white text-[#09090B] hover:bg-[#FAFAFA]">
                Try LinkScope
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
