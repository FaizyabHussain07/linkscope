import { ExtractedMetadata } from '@/types';
import { cn } from '@/lib/utils';

interface LinkedInPreviewProps {
  metadata: ExtractedMetadata;
  url: string;
  className?: string;
}

export function LinkedInPreview({ metadata, url, className }: LinkedInPreviewProps) {
  const siteName = metadata.ogSiteName || new URL(url).hostname;
  
  return (
    <div className={cn('flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm border border-gray-200 max-w-md', className)}>
      {metadata.ogImage && (
        <div className="aspect-square overflow-hidden rounded border border-gray-200 bg-gray-100">
          <img
            src={metadata.ogImage}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="flex items-center gap-2 text-sm">
        <span className="text-xs text-gray-500">{siteName}</span>
      </div>
      
      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2">
        {metadata.ogTitle || metadata.title || 'No title available'}
      </h3>
      
      <p className="text-[13px] text-gray-600 leading-snug line-clamp-2">
        {metadata.ogDescription || metadata.description || 'No description available'}
      </p>
      
      <div className="text-xs text-gray-500">
        {new URL(url).hostname}
      </div>
    </div>
  );
}
