import { MetaData } from "@/hooks/use-metadata"

export interface PreviewProps {
  metadata: MetaData
  url: string
}

export type Platform = "telegram" | "discord" | "slack" | "x" | "facebook" | "linkedin" | "whatsapp"

export interface PlatformInfo {
  id: Platform
  name: string
  icon: string
  color: string
  bgColor: string
}
