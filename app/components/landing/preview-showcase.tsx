"use client"

import { useState } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"

const PLATFORMS = [
  {
    id: "telegram",
    label: "Telegram",
    icon: "T",
    color: "#2CABFF",
    bgLight: "#FFFFFF",
    bgDark: "#1C1C1C",
    borderColor: "#E8E8E8",
    borderColorDark: "#2E2E2E",
    hostnameColor: "#999999",
    titleColor: "#2CABFF",
    descColor: "#999999",
  },
  {
    id: "discord",
    label: "Discord",
    icon: "D",
    color: "#5865F2",
    bgLight: "#2B2B2B",
    bgDark: "#2B2B2B",
    borderColor: "#313338",
    borderColorDark: "#313338",
    hostnameColor: "#949BA4",
    titleColor: "#00A8FC",
    descColor: "#B5BAC1",
  },
  {
    id: "slack",
    label: "Slack",
    icon: "S",
    color: "#1D9BD1",
    bgLight: "#F8F8F8",
    bgDark: "#1D1D1D",
    borderColor: "#1D9BD1",
    borderColorDark: "#1D9BD1",
    hostnameColor: "#616061",
    titleColor: "#1D9BD1",
    descColor: "#616061",
  },
  {
    id: "x",
    label: "X",
    icon: "X",
    color: "#1D9BF0",
    bgLight: "#FFFFFF",
    bgDark: "#000000",
    borderColor: "#CFD9DE",
    borderColorDark: "#2F3336",
    hostnameColor: "#536471",
    titleColor: "#0F1419",
    titleColorDark: "#F7F9F9",
    descColor: "#536471",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "F",
    color: "#1877F2",
    bgLight: "#F0F2F5",
    bgDark: "#18191A",
    borderColor: "#DADDE1",
    borderColorDark: "#3E4042",
    hostnameColor: "#606770",
    titleColor: "#1C1E21",
    titleColorDark: "#E4E6EB",
    descColor: "#606770",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "L",
    color: "#0A66C2",
    bgLight: "#FFFFFF",
    bgDark: "#1A1A2E",
    borderColor: "#CFD9DE",
    borderColorDark: "#38444F",
    hostnameColor: "rgba(0,0,0,0.6)",
    hostnameColorDark: "rgba(255,255,255,0.6)",
    titleColor: "rgba(0,0,0,0.9)",
    titleColorDark: "#FFFFFF",
    descColor: "rgba(0,0,0,0.6)",
    descColorDark: "rgba(255,255,255,0.6)",
  },
]

const DEMO_URL = "https://example.com/article"

export function PreviewShowcase() {
  const [activePlatform, setActivePlatform] = useState("telegram")

  const platform = PLATFORMS.find((p) => p.id === activePlatform)

  return (
    <div className="mx-auto max-w-4xl">
      <Tabs value={activePlatform} onValueChange={setActivePlatform}>
        <TabsList className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-6">
          {PLATFORMS.map((p) => (
            <TabsTrigger
              key={p.id}
              value={p.id}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all data-[state=active]:bg-[#18181B] data-[state=active]:text-white",
                "data-[state=inactive]:text-[#A1A1AA] data-[state=inactive]:hover:text-white"
              )}
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold uppercase"
                style={{ backgroundColor: p.color }}
              >
                {p.icon}
              </span>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PLATFORMS.map((p) => (
          <TabsContent key={p.id} value={p.id} className="mt-6">
            <Card className="border-[#27272A] bg-[#111113] overflow-hidden">
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative aspect-[1.91/1] bg-[#18181B] overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111113]/60 to-transparent" />
                </div>

                {/* Content */}
                <div
                  className="px-4 py-3"
                  style={{ backgroundColor: p.bgDark || "#F0F2F5" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[10px] uppercase tracking-wider truncate"
                        style={{ color: p.hostnameColor || "#606770" }}
                      >
                        {DEMO_URL.replace(/^https?:\/\//, "")}
                      </p>
                      <h3
                        className="text-sm font-semibold leading-tight line-clamp-2 mt-1"
                        style={{
                          color: p.titleColorDark || p.titleColor || "#1C1E21",
                        }}
                      >
                        Build faster with modern developer tools
                      </h3>
                      <p
                        className="text-xs leading-relaxed line-clamp-2 mt-1"
                        style={{
                          color: p.descColorDark || p.descColor || "#606770",
                        }}
                      >
                        Discover the best tools, platforms and resources to accelerate your workflow and ship products faster than ever.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="border-t border-[#27272A] bg-[#111113] px-4 py-2">
                  <p className="text-[10px] text-[#52525B]">
                    {p.label} preview — simulated representation. Actual platform rendering may vary.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
