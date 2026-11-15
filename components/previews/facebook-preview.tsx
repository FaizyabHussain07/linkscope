import { ExtractedMetadata } from '@/types';
import { cn } from '@/lib/utils';

interface FacebookPreviewProps {
  metadata: ExtractedMetadata;
  url: string;
  className?: string;
}

export function FacebookPreview({ metadata, url, className }: FacebookPreviewProps) {
  const siteName = metadata.ogSiteName || new URL(url).hostname;
  
  return (
    <div className={cn('flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm border border-gray-200 max-w-md', className)}>
      {metadata.ogImage && (
        <div className="aspect-[1.91/1] overflow-hidden rounded-lg bg-gray-100">
          <img
            src={metadata.ogImage}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{siteName}</span>
        {metadata.ogUrl && (
          <span className="truncate max-w-[200px]">{metadata.ogUrl}</span>
        )}
      </div>
      
      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2">
        {metadata.ogTitle || metadata.title || 'No title available'}
      </h3>
      
      <p className="text-[13px] text-gray-700 leading-snug line-clamp-2">
        {metadata.ogDescription || metadata.description || 'No description available'}
      </p>
    </div>
  );
}
