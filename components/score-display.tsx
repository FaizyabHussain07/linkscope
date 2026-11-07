"use client";

import { MetaData } from "@/hooks/use-metadata";
import { cn } from "@/lib/utils";
import { Check, AlertCircle, Info } from "lucide-react";
import { motion } from "motion/react";
import { performAudit, getScoreBreakdown } from "@/lib/analyzers";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScoreDisplayProps {
  metadata: MetaData | null;
  className?: string;
}

export function ScoreDisplay({ metadata, className }: ScoreDisplayProps) {
  if (!metadata) return null;

  // Create a minimal ExtractedMetadata from MetaData
  const extractedMetadata = {
    ...metadata,
    duplicates: [],
    emptyTags: [],
    missingRequired: [],
    warnings: [],
    rawMetaTags: [],
    rawLinkTags: [],
  };
  const audit = performAudit(extractedMetadata as any);
  const breakdown = getScoreBreakdown(audit);
  const score = audit.score;

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <TooltipProvider>
      <div className={cn("flex flex-col gap-6", className)}>
        <div className="flex items-center gap-8">
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
                  className={getScoreColor(score)}
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
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Metadata Score</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Overall quality score based on SEO, Open Graph, Twitter Card, and technical checks.
            </p>

            {/* Category scores */}
            <div className="grid grid-cols-2 gap-3">
              {breakdown.categories.map((cat) => (
                <div
                  key={cat.name}
                  className="p-3 rounded-lg border border-border/50 bg-card"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">{cat.name}</span>
                    <span className="text-xs font-medium">{cat.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Findings and Recommendations */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Issues */}
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              Findings ({audit.findings.length})
            </h4>
            {audit.findings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No issues found. Great job!</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {audit.findings.slice(0, 5).map((finding) => (
                  <div
                    key={finding.id}
                    className={cn(
                      "text-sm p-2 rounded bg-muted/50",
                      finding.type === "warning" && "border-l-2 border-yellow-500",
                      finding.type === "info" && "border-l-2 border-blue-500"
                    )}
                  >
                    <p className="font-medium">{finding.title}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {finding.description}
                    </p>
                  </div>
                ))}
                {audit.findings.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    +{audit.findings.length - 5} more findings
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-brand-500" />
              Recommendations ({audit.recommendations.length})
            </h4>
            {audit.recommendations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recommendations. Your metadata looks good!</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {audit.recommendations.slice(0, 5).map((rec, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "text-sm p-2 rounded bg-muted/50",
                      rec.priority === "high" && "border-l-2 border-red-500",
                      rec.priority === "medium" && "border-l-2 border-yellow-500",
                      rec.priority === "low" && "border-l-2 border-green-500"
                    )}
                  >
                    <p className="font-medium">{rec.title}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {rec.description}
                    </p>
                    {rec.codeExample && (
                      <pre className="mt-2 p-2 bg-background rounded text-xs font-mono overflow-x-auto">
                        <code>{rec.codeExample}</code>
                      </pre>
                    )}
                  </div>
                ))}
                {audit.recommendations.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    +{audit.recommendations.length - 5} more recommendations
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Passed checks summary */}
        <div className="flex flex-wrap gap-2">
          {audit.passed.slice(0, 8).map((check) => (
            <Tooltip key={check.id}>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs cursor-pointer">
                  <Check className="w-3 h-3" />
                  {check.name}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Weight: {check.weight} points</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {audit.passed.length > 8 && (
            <span className="text-xs text-muted-foreground self-center">
              +{audit.passed.length - 8} more passed
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
