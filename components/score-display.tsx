"use client"

import { MetaData } from "@/hooks/use-metadata"
import { cn } from "@/lib/utils"
import { Check, XCircle } from "lucide-react"
import { motion } from "motion/react"

interface ScoreDisplayProps {
  metadata: MetaData | null
  className?: string
}

interface Check {
  name: string
  passed: boolean
  weight: number
}

export function ScoreDisplay({ metadata, className }: ScoreDisplayProps) {
  if (!metadata) return null

  const checks: Check[] = [
    { name: "Title", passed: !!metadata.title, weight: 10 },
    { name: "Description", passed: !!metadata.description, weight: 10 },
    { name: "OG Title", passed: !!metadata.ogTitle, weight: 8 },
    { name: "OG Description", passed: !!metadata.ogDescription, weight: 8 },
    { name: "OG Image", passed: !!metadata.ogImage, weight: 12 },
    { name: "Favicon", passed: !!metadata.favicon, weight: 6 },
    { name: "Canonical", passed: !!metadata.canonical, weight: 6 },
    { name: "Viewport", passed: !!metadata.viewport, weight: 6 },
    { name: "Twitter Card", passed: !!metadata.twitterCard, weight: 8 },
    { name: "OG Type", passed: !!metadata.ogType, weight: 6 },
    { name: "OG Locale", passed: !!metadata.ogLocale, weight: 4 },
    { name: "robots.txt", passed: !!metadata.robotsFile, weight: 2 },
    { name: "sitemap.xml", passed: !!metadata.sitemap, weight: 2 },
    { name: "Title Length", passed: !!(metadata.title && metadata.title.length >= 30 && metadata.title.length <= 60), weight: 4 },
    { name: "Desc Length", passed: !!(metadata.description && metadata.description.length >= 120 && metadata.description.length <= 160), weight: 4 },
  ]

  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0)
  const earnedWeight = checks.filter((check) => check.passed).reduce((sum, check) => sum + check.weight, 0)
  const score = Math.round((earnedWeight / totalWeight) * 100)

  const circumference = 2 * Math.PI * 45
  const offset = circumference - (score / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("flex gap-8", className)}
    >
      <div className="shrink-0">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative w-32 h-32"
        >
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="text-green-500"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-3xl font-bold"
            >
              {score}
            </motion.span>
          </div>
        </motion.div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        {checks.map((check, index) => (
          <motion.div
            key={check.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.03 }}
            className={cn(
              "flex items-center gap-2",
              check.passed ? "text-green-500" : "text-red-500"
            )}
          >
            {check.passed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.6 + index * 0.03 }}
              >
                <Check className="w-4 h-4 shrink-0" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.6 + index * 0.03 }}
              >
                <XCircle className="w-4 h-4 shrink-0" />
              </motion.div>
            )}
            <span>{check.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
