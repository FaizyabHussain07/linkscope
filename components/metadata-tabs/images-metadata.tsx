import { ExtractedMetadata } from "@/types";

interface ImagesMetadataProps {
  metadata: ExtractedMetadata;
}

export function ImagesMetadata({ metadata }: ImagesMetadataProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Image Metadata</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">OG Image</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.ogImage || "Not found"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">OG Image Alt</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.ogImageAlt || "Not specified"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">OG Image Dimensions</label>
          <p className="text-sm text-muted-foreground font-mono">
            {metadata.ogImageWidth && metadata.ogImageHeight
              ? `${metadata.ogImageWidth} x ${metadata.ogImageHeight}`
              : "Not specified"}
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
