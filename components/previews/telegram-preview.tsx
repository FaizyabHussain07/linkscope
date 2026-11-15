import { ExtractedMetadata } from '@/types';
import { cn } from '@/lib/utils';

interface TelegramPreviewProps {
  metadata: ExtractedMetadata;
  url: string;
  className?: string;
}

export function TelegramPreview({ metadata, url, className }: TelegramPreviewProps) {
  const siteName = metadata.ogSiteName || new URL(url).hostname;
  
  return (
    <div className={cn('flex gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm', className)}>
      {metadata.ogImage && (
        <div className="mr-3 overflow-hidden rounded border border-gray-200 bg-gray-100" style={{ aspectRatio: '1.91/1', width: '120px' }}>
          <img
            src={metadata.ogImage}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="mb-1">
          <span className="text-xs font-bold text-gray-900">{siteName}</span>
        </div>
        
        <h3 className="line-clamp-2 font-semibold text-[15px] leading-snug text-gray-900">
          {metadata.ogTitle || metadata.title || 'No title available'}
        </h3>
        
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-gray-700">
          {metadata.ogDescription || metadata.description || 'No description available'}
        </p>
        
        <div className="mt-1 text-[12px] text-gray-500">
          <span className="font-bold">{new URL(url).hostname}</span>
          <span className="text-gray-400"> · {url}
</span>
        </div>
      </div>
    </div>
  );
}
