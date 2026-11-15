import { ExtractedMetadata, AuditResult } from "@/types";

interface ScoreDisplayProps {
  metadata: ExtractedMetadata;
}

export function ScoreDisplay({ metadata }: ScoreDisplayProps) {
  // Calculate a simple score based on available metadata
  let score = 0;
  let maxScore = 100;

  // Basic checks (20 points)
  if (metadata.title) score += 5;
  if (metadata.description) score += 5;
  if (metadata.canonical) score += 5;
  if (metadata.language) score += 5;

  // OG checks (40 points)
  if (metadata.ogTitle) score += 10;
  if (metadata.ogDescription) score += 10;
  if (metadata.ogImage) score += 15;
  if (metadata.ogUrl) score += 5;

  // Twitter checks (20 points)
  if (metadata.twitterCard) score += 5;
  if (metadata.twitterTitle) score += 5;
  if (metadata.twitterDescription) score += 5;
  if (metadata.twitterImage) score += 5;

  // Technical checks (20 points)
  if (metadata.viewport) score += 5;
  if (metadata.charset) score += 5;
  if (metadata.favicon) score += 5;
  if (metadata.robots) score += 5;

  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white text-4xl font-bold shadow-lg"
          style={{ fontSize: "2rem" }}
        >
          {percentage}
        </div>
        <div>
          <h3 className="text-xl font-semibold">Metadata Score</h3>
          <p className="text-muted-foreground">
            Your website&apos;s social media preview quality
          </p>
        </div>
      </div>

      <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-brand-500">{score}</div>
          <div className="text-sm text-muted-foreground">out of {maxScore}</div>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold">
            {percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : percentage >= 40 ? "Fair" : "Needs Work"}
          </div>
          <div className="text-sm text-muted-foreground">Rating</div>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold">{percentage}%</div>
          <div className="text-sm text-muted-foreground">Completion</div>
        </div>
      </div>

      {metadata.missingRequired && metadata.missingRequired.length > 0 && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <h4 className="font-medium text-destructive mb-2">Missing Required Tags</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {metadata.missingRequired.map((tag, i) => (
              <li key={i}>- {tag}</li>
            ))}
          </ul>
        </div>
      )}

      {metadata.warnings && metadata.warnings.length > 0 && (
        <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
          <h4 className="font-medium text-warning mb-2">Warnings</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {metadata.warnings.slice(0, 5).map((warning, i) => (
              <li key={i}>- {warning.message}</li>
            ))}
            {metadata.warnings.length > 5 && (
              <li className="text-muted-foreground">... and {metadata.warnings.length - 5} more</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
