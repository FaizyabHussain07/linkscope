import { ExtractedMetadata } from '@/types';
import { Check, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OpenGraphMetadataProps {
  metadata: ExtractedMetadata;
}

export function OpenGraphMetadata({ metadata }: OpenGraphMetadataProps) {
  const getStatus = (value?: string | number | null) => {
    if (!value) return { icon: X, color: 'text-red-500', label: 'Missing' };
    if (typeof value === 'string' && value.trim() === '') return { icon: AlertTriangle, color: 'text-yellow-500', label: 'Empty' };
    return { icon: Check, color: 'text-green-500', label: 'Present' };
  };
  const StatusIcon = ({ value }: { value?: string | number | null }) => {
    const { icon: Icon, color } = getStatus(value);
    return <Icon className={cn('w-4 h-4', color)} />;
  };

  const fields = [
    { label: 'OG Title', value: metadata.ogTitle },
    { label: 'OG Description', value: metadata.ogDescription },
    { label: 'OG Image', value: metadata.ogImage, isUrl: true },
    { label: 'OG URL', value: metadata.ogUrl, isUrl: true },
    { label: 'OG Type', value: metadata.ogType },
    { label: 'OG Site Name', value: metadata.ogSiteName },
    { label: 'OG Locale', value: metadata.ogLocale },
    { label: 'OG Image Width', value: metadata.ogImageWidth, isNumber: true },
    { label: 'OG Image Height', value: metadata.ogImageHeight, isNumber: true },
    { label: 'OG Image Alt', value: metadata.ogImageAlt },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Open Graph Metadata</h3>
        <div className="text-sm text-muted-foreground">
          {fields.filter(f => f.value).length} of {fields.length} tags present
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="space-y-2">
            <label className="text-sm font-medium">{field.label}</label>
            <div className="flex items-start gap-2">
              <div className="mt-0.5">
                <StatusIcon value={field.value as string | number | undefined} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-mono break-all">
                  {field.value !== undefined && field.value !== null
                    ? field.isNumber
                      ? field.value
                      : field.isUrl
                      ? field.value
                      : field.value
                    : '—'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getStatus(field.value as string | number | null).label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
