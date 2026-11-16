import { ExtractedMetadata } from '@/types';
import { Check, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImagesMetadataProps {
  metadata: ExtractedMetadata;
}

export function ImagesMetadata({ metadata }: ImagesMetadataProps) {
  const getStatus = (value?: string | number | null) => {
    if (!value) return { icon: X, color: 'text-red-500', label: 'Missing' };
    if (typeof value === 'string' && value.trim() === '') return { icon: AlertTriangle, color: 'text-yellow-500', label: 'Empty' };
    return { icon: Check, color: 'text-green-500', label: 'Present' };
  };
  const StatusIcon = ({ value }: { value?: string | number | null }) => {
    const { icon: Icon, color } = getStatus(value);
    return <Icon className={cn('w-4 h-4', color)} />;
  };

  const imageFields = [
    { label: 'OG Image', value: metadata.ogImage, isUrl: true },
    { label: 'OG Image Alt', value: metadata.ogImageAlt },
    { label: 'OG Image Width', value: metadata.ogImageWidth, isNumber: true },
    { label: 'OG Image Height', value: metadata.ogImageHeight, isNumber: true },
    { label: 'Twitter Image', value: metadata.twitterImage, isUrl: true },
    { label: 'Twitter Image Alt', value: metadata.twitterImageAlt },
  ];

  const imageWidth = metadata.ogImageWidth;
  const imageHeight = metadata.ogImageHeight;
  const hasDimensions = typeof imageWidth === 'number' &&
    typeof imageHeight === 'number';
  const isValidSize = hasDimensions && imageWidth >= 1200 && imageHeight >= 630;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Image Metadata</h3>
      
      {metadata.ogImage && (
        <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
          <img
            src={metadata.ogImage}
            alt="OG Image"
            className="w-full h-auto object-cover max-h-64"
            loading="lazy"
          />
          {hasDimensions && (
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-sm">
              <span className="font-medium">Dimensions:</span>{' '}
              {metadata.ogImageWidth} × {metadata.ogImageHeight}px
              {isValidSize ? (
                <span className="text-green-600 ml-2">✓ Optimal</span>
              ) : (
                <span className="text-yellow-600 ml-2">
                  ⚠ Recommended: 1200×630px
                </span>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        {imageFields.map((field) => (
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
