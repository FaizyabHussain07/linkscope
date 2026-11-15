import { ExtractedMetadata } from "@/types";

interface OpenGraphMetadataProps {
  metadata: ExtractedMetadata;
}

export function OpenGraphMetadata({ metadata }: OpenGraphMetadataProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Open Graph Metadata</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">OG Title</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.ogTitle || "Not found"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">OG Description</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.ogDescription || "Not found"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">OG Image</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.ogImage || "Not found"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">OG URL</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.ogUrl || "Not found"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">OG Type</label>
          <p className="text-sm text-muted-foreground font-mono">
            {metadata.ogType || "Not specified"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">OG Site Name</label>
          <p className="text-sm text-muted-foreground font-mono">
            {metadata.ogSiteName || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
}
