import { ExtractedMetadata } from '@/types';
import { cn } from '@/lib/utils';

interface SlackPreviewProps {
  metadata: ExtractedMetadata;
  url: string;
  className?: string;
}

export function SlackPreview({ metadata, url, className }: SlackPreviewProps) {
  const siteName = metadata.ogSiteName || new URL(url).hostname;
  
  return (
    <div className={cn('flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm', className)}>
      {metadata.ogImage && (
        <div className="overflow-hidden rounded border border-gray-200 bg-gray-100" style={{ aspectRatio: '1.91/1', maxHeight: '100px' }}>
          <img
            src={metadata.ogImage}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{siteName}</span>
      </div>
      
      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2">
        {metadata.ogTitle || metadata.title || 'No title available'}
      </h3>
      
      <p className="text-[13px] text-gray-600 leading-snug line-clamp-2">
        {metadata.ogDescription || metadata.description || 'No description available'}
      </p>
    </div>
  );
}
