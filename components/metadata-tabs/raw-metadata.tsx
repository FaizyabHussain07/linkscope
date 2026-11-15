import { ExtractedMetadata } from "@/types";

interface RawMetadataProps {
  metadata: ExtractedMetadata;
}

export function RawMetadata({ metadata }: RawMetadataProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Raw Meta Tags</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium">Meta Tags ({metadata.rawMetaTags.length})</label>
        <div className="max-h-64 overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {metadata.rawMetaTags.length > 0 ? (
            <pre className="text-muted-foreground">
              {JSON.stringify(metadata.rawMetaTags, null, 2)}
            </pre>
          ) : (
            <p className="text-muted-foreground">No meta tags found</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Link Tags ({metadata.rawLinkTags.length})</label>
        <div className="max-h-64 overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">
          {metadata.rawLinkTags.length > 0 ? (
            <pre className="text-muted-foreground">
              {JSON.stringify(metadata.rawLinkTags, null, 2)}
            </pre>
          ) : (
            <p className="text-muted-foreground">No link tags found</p>
          )}
        </div>
      </div>
    </div>
  );
}
