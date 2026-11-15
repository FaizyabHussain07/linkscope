import { ExtractedMetadata } from "@/types";

interface BasicMetadataProps {
  metadata: ExtractedMetadata;
}

export function BasicMetadata({ metadata }: BasicMetadataProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Metadata</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.title || "Not found"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.description || "Not found"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Canonical URL</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.canonical || "Not found"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <p className="text-sm text-muted-foreground font-mono">
            {metadata.language || "Not specified"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Charset</label>
          <p className="text-sm text-muted-foreground font-mono">
            {metadata.charset || "Not specified"}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Viewport</label>
          <p className="text-sm text-muted-foreground font-mono break-all">
            {metadata.viewport || "Not found"}
          </p>
        </div>
      </div>
    </div>
  );
}
