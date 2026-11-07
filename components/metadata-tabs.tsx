"use client"

import { useState } from "react"
import { MetaData } from "@/hooks/use-metadata"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { copyToClipboard } from "@/lib/utils"
import { Copy, Check } from "lucide-react"
import {
  MetadataField,
  SectionCard,
  FaviconField,
  TextFieldWithCount,
  LinkField,
  StatusField,
  ImageField,
  ImagePreview,
  parseCanonicalUrl,
  getBaseUrl,
  TITLE_MAX_CHARS,
  DESCRIPTION_MAX_CHARS,
  OG_TITLE_MAX_CHARS,
  OG_DESCRIPTION_MAX_CHARS,
  TWITTER_TITLE_MAX_CHARS,
  TWITTER_DESCRIPTION_MAX_CHARS,
  generateHtmlMetaTags,
} from "@/components/metadata"

export function BasicMetadata({ metadata }: { metadata: MetaData }) {
  const titleLength = metadata.title?.length || 0
  const descriptionLength = metadata.description?.length || 0
  const canonicalUrl = parseCanonicalUrl(metadata.canonical)
  const baseUrl = canonicalUrl ? getBaseUrl(canonicalUrl) : null

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <SectionCard title="Essential">
        <MetadataField label="Favicon">
          <FaviconField favicon={metadata.favicon} />
        </MetadataField>
        <MetadataField label="Title">
          <TextFieldWithCount
            text={metadata.title}
            currentLength={titleLength}
            maxLength={TITLE_MAX_CHARS}
          />
        </MetadataField>
        <MetadataField label="Description">
          <TextFieldWithCount
            text={metadata.description}
            currentLength={descriptionLength}
            maxLength={DESCRIPTION_MAX_CHARS}
          />
        </MetadataField>
        <MetadataField label="Canonical">
          <LinkField url={canonicalUrl || undefined} italic />
        </MetadataField>
      </SectionCard>

      <SectionCard title="Technical">
        <MetadataField label="Language" value={metadata.language} />
        <MetadataField label="Charset" value={metadata.charset} />
        <MetadataField label="Viewport" value={metadata.viewport} />
        <MetadataField label="Robots" value={metadata.robots} />
      </SectionCard>

      <SectionCard title="SEO Files">
        <MetadataField label="robots.txt">
          <StatusField
            found={!!metadata.robotsFile}
            linkUrl={baseUrl ? `${baseUrl}/robots.txt` : undefined}
          />
        </MetadataField>
        <MetadataField label="sitemap.xml">
          <StatusField found={!!metadata.sitemap} linkUrl={metadata.sitemap} />
        </MetadataField>
      </SectionCard>
    </div>
  )
}

export function OpenGraphMetadata({ metadata }: { metadata: MetaData }) {
  const ogTitleLength = metadata.ogTitle?.length || 0
  const ogDescriptionLength = metadata.ogDescription?.length || 0

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <SectionCard title="Open Graph">
        <MetadataField label="Title">
          <TextFieldWithCount
            text={metadata.ogTitle}
            currentLength={ogTitleLength}
            maxLength={OG_TITLE_MAX_CHARS}
          />
        </MetadataField>
        <MetadataField label="Description">
          <TextFieldWithCount
            text={metadata.ogDescription}
            currentLength={ogDescriptionLength}
            maxLength={OG_DESCRIPTION_MAX_CHARS}
          />
        </MetadataField>
        <MetadataField label="Image">
          <ImageField imageUrl={metadata.ogImage} alt="Open Graph Image" />
        </MetadataField>
        <MetadataField label="Type" value={metadata.ogType} />
        <MetadataField label="URL">
          <LinkField url={metadata.ogUrl} />
        </MetadataField>
        <MetadataField label="Site Name" value={metadata.ogSiteName} />
        <MetadataField label="Locale" value={metadata.ogLocale} />
      </SectionCard>
    </div>
  )
}

export function TwitterMetadata({ metadata }: { metadata: MetaData }) {
  const twitterTitleLength = metadata.twitterTitle?.length || 0
  const twitterDescriptionLength = metadata.twitterDescription?.length || 0

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <SectionCard title="X Card">
        <MetadataField label="Card Type" value={metadata.twitterCard} />
        <MetadataField label="Title">
          <TextFieldWithCount
            text={metadata.twitterTitle}
            currentLength={twitterTitleLength}
            maxLength={TWITTER_TITLE_MAX_CHARS}
          />
        </MetadataField>
        <MetadataField label="Description">
          <TextFieldWithCount
            text={metadata.twitterDescription}
            currentLength={twitterDescriptionLength}
            maxLength={TWITTER_DESCRIPTION_MAX_CHARS}
          />
        </MetadataField>
        <MetadataField label="Image">
          <ImageField imageUrl={metadata.twitterImage || metadata.ogImage} alt="X Card Image" />
        </MetadataField>
        <MetadataField label="Site" value={metadata.twitterSite} />
        <MetadataField label="Creator" value={metadata.twitterCreator} />
      </SectionCard>
    </div>
  )
}

export function ImagesMetadata({ metadata }: { metadata: MetaData }) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ImagePreview
        label="OPEN GRAPH"
        url={metadata.ogImage}
        recommended="1200×630"
      />
      <ImagePreview
        label="X"
        url={metadata.twitterImage || metadata.ogImage}
        recommended="1200×628"
      />
      <ImagePreview
        label="FAVICON"
        url={metadata.favicon}
        isFavicon={true}
      />
    </div>
  )
}

export function RawMetadata({ metadata }: { metadata: MetaData }) {
  const [activeTab, setActiveTab] = useState("json")
  const [copied, setCopied] = useState(false)
  const jsonContent = JSON.stringify(metadata, null, 2)
  const htmlContent = generateHtmlMetaTags(metadata)

  const handleCopy = async () => {
    const content = activeTab === "json" ? jsonContent : htmlContent
    const success = await copyToClipboard(content)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Raw Metadata</h3>
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={copied}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy {activeTab === "json" ? "JSON" : "HTML"}
              </>
            )}
          </Button>
        </div>
        <Tabs defaultValue="json" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="json">
            <div className="bg-muted rounded-lg p-4 overflow-auto max-h-[600px]">
              <pre className="text-xs">{jsonContent}</pre>
            </div>
          </TabsContent>
          <TabsContent value="html">
            <div className="bg-muted rounded-lg p-4 overflow-auto max-h-[600px]">
              <pre className="text-xs">{htmlContent}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}
