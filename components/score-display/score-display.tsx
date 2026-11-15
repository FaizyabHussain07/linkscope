import { ExtractedMetadata, AuditResult } from '@/types';
import { Check, AlertTriangle, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  metadata: ExtractedMetadata;
  audit?: AuditResult;
}

export function ScoreDisplay({ metadata, audit }: ScoreDisplayProps) {
  // Calculate score if not provided
  let score = 0;
  let maxScore = 100;
  const categoryScores: { name: string; score: number; maxScore: number }[] = [];

  if (audit) {
    score = audit.score;
    maxScore = audit.maxScore;
    categoryScores.push(
      ...audit.categoryScores.map(cs => ({
        name: cs.name,
        score: cs.score,
        maxScore: cs.maxScore,
      }))
    );
  } else {
    // Simple scoring without full audit
    if (metadata.title) score += 5;
    if (metadata.description) score += 5;
    if (metadata.ogTitle) score += 5;
    if (metadata.ogDescription) score += 5;
    if (metadata.ogImage) score += 8;
    if (metadata.ogUrl) score += 3;
    if (metadata.ogType) score += 3;
    if (metadata.ogSiteName) score += 3;
    if (metadata.twitterCard) score += 4;
    if (metadata.twitterTitle) score += 4;
    if (metadata.twitterDescription) score += 4;
    if (metadata.twitterImage) score += 8;
    if (metadata.canonical) score += 5;
    if (metadata.language) score += 4;
    if (metadata.viewport) score += 4;
    if (metadata.charset) score += 3;
    if (metadata.favicon) score += 3;
    maxScore = 85;
  }

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const rating = percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : percentage >= 40 ? 'Fair' : 'Needs Work';
  const ratingColor = percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-blue-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={cn(
          'flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 텍스트-white text-4xl font-bold shadow-lg',
          'text-3xl'
        )} style={{ fontSize: '2rem' }}>
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
          className={cn(
            'h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500',
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold text-indigo-600">{score}</div>
          <div className="text-sm text-muted-foreground">out of {maxScore}</div>
        </div>
        <div className={cn('p-4 rounded-lg bg-muted/50', ratingColor)}>
          <div className="text-2xl font-bold">{rating}</div>
          <div className="text-sm text-muted-foreground">Rating</div>
        </div>
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-2xl font-bold">{percentage}%</div>
          <div className="text-sm text-muted-foreground">Completion</div>
        </div>
      </div>

      {metadata.missingRequired && metadata.missingRequired.length > 0 && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Missing Required Tags
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {metadata.missingRequired.map((tag, i) => (
              <li key={i} className="flex items-center gap-2">
                <X className="w-3 h-3" />
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {metadata.warnings && metadata.warnings.length > 0 && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Warnings
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {metadata.warnings.slice(0, 5).map((warning, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{warning.message}</span>
              </li>
            ))}
            {metadata.warnings.length > 5 && (
              <li className="text-yellow-600">
                ... and {metadata.warnings.length - 5} more warnings
              </li>
            )}
          </ul>
        </div>
      )}

      {audit && audit.recommendations.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Recommendations</h4>
          <div className="space-y-2">
            {audit.recommendations.slice(0, 5).map((rec, i) => (
              <div key={i} className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-indigo-800">{rec.title}</p>
                    <p className="text-sm text-indigo-700 mt-1">{rec.description}</p>
                    {rec.implementation && (
                      <pre className="mt-2 p-2 rounded bg-white border text-xs font-mono overflow-auto">
                        {rec.implementation}
                      </pre>
                    )}
                  </div>
                  <span className={cn(
                    'text-xs font-medium px-2 py-1 rounded',
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  )}>
                    {rec.priority}
                  </span>
                </div>
              </div>
            ))}
            {audit.recommendations.length > 5 && (
              <p className="text-sm text-muted-foreground">
                ... and {audit.recommendations.length - 5} more recommendations
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
