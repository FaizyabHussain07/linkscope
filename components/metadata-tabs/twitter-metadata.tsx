import { ExtractedMetadata } from '@/types';
import { Check, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TwitterMetadataProps {
  metadata: ExtractedMetadata;
}

export function TwitterMetadata({ metadata }: TwitterMetadataProps) {
  const getStatus = (value?: string | null) => {
    if (!value) return { icon: X, color: 'text-red-500', label: 'Missing' };
    if (typeof value === 'string' && value.trim() === '') return { icon: AlertTriangle, color: 'text-yellow-500', label: 'Empty' };
    return { icon: Check, color: 'text-green-500', label: 'Present' };
  };
  const StatusIcon = ({ value }: { value?: string | null }) => {
    const { icon: Icon, color } = getStatus(value);
    return <Icon className={cn('w-4 h-4', color)} />;
  };

  const hasTwitterCard = !!metadata.twitterCard;
  const hasOG = !!(metadata.ogTitle || metadata.ogDescription || metadata.ogImage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Twitter Card Metadata</h3>
        <div className="text-sm text-muted-foreground">
          {hasTwitterCard ? 'Twitter Card configured' : 'No Twitter Card'}
        </div>
      </div>
      
      {!hasTwitterCard && hasOG && (
        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm">
          <p className="font-medium text-yellow-800">
            ⚠️ Twitter Card not configured
          </p>
          <p className="text-yellow-700 mt-1">
            Twitter will fall back to Open Graph metadata for link previews.
            Consider adding twitter:card, twitter:title, twitter:description, and twitter:image tags.
          </p>
        </div>
      )}
      
      {!hasTwitterCard && !hasOG && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm">
          <p className="font-medium text-red-800">
            ⚠️ No social metadata found
          </p>
          <p className="text-red-700 mt-1">
            Neither Twitter Card nor Open Graph metadata was found.
            Links shared to Twitter and other platforms will not display rich previews.
          </p>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { label: 'Twitter Card Type', value: metadata.twitterCard },
          { label: 'Twitter Title', value: metadata.twitterTitle },
          { label: 'Twitter Description', value: metadata.twitterDescription },
          { label: 'Twitter Image', value: metadata.twitterImage, isUrl: true },
          { label: 'Twitter Site', value: metadata.twitterSite },
          { label: 'Twitter Creator', value: metadata.twitterCreator },
        ].map((field) => (
          <div key={field.label} className="space-y-2">
            <label className="text-sm font-medium">{field.label}</label>
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                <StatusIcon value={field.value} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-mono break-all">
                  {field.value || '—'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getStatus(field.value).label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
