import { ExtractedMetadata } from "@/types";

interface TwitterMetadataProps {
  metadata: ExtractedMetadata;
}

export function TwitterMetadata({ metadata }: TwitterMetadataProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Twitter Card Metadata</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Twitter Card Type</label>
          <p className="text-sm text-muted-foreground font-mono">
            {metadata.twitterCard || "Not specified"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Twitter Title</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.twitterTitle || "Not found"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Twitter Description</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.twitterDescription || "Not found"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Twitter Image</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.twitterImage || "Not found"}
          </p>
        </div>
      </div>
    </div>
  );
}
