import { ExtractedMetadata } from '@/types';
import { cn } from '@/lib/utils';

interface XPreviewProps {
  metadata: ExtractedMetadata;
  url: string;
  className?: string;
  size?: 'summary' | 'summary_large_image';
}

export function XPreview({ metadata, url, className, size = 'summary_large_image' }: XPreviewProps) {
  const tweetUrl = new URL(url);
  const domain = tweetUrl.hostname.replace('www.', '');
  
  const isLargeImage = size === 'summary_large_image';
  
  return (
    <div className={cn('flex gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm', className)}>
      {isLargeImage && metadata.ogImage && (
        <div className="mr-3 overflow-hidden rounded border border-gray-200 bg-gray-100" style={{ aspectRatio: '1.91/1', width: '160px' }}>
          <img
            src={metadata.ogImage}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        {!isLargeImage && metadata.ogImage && (
          <div className="mb-2 overflow-hidden rounded border border-gray-200 bg-gray-100" style={{ aspectRatio: '1/1', width: '75px', height: '75px' }}>
            <img
              src={metadata.ogImage}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="mb-1">
          <span className="text-[13px] font-bold text-gray-900">{domain}</span>
        </div>
        
        <h3 className={cn(
          'line-clamp-2 font-semibold text-[15px] leading-snug',
          isLargeImage ? 'text-gray-900' : 'text-gray-900 mt-1'
        )}>
          {metadata.twitterTitle || metadata.ogTitle || metadata.title || 'No title available'}
        </h3>
        
        <p className={cn(
          'line-clamp-2 text-[13px] leading-snug',
          isLargeImage ? 'text-gray-700 mt-1' : 'text-gray-700 mt-1'
        )}>
          {metadata.twitterDescription || metadata.ogDescription || metadata.description || 'No description available'}
        </p>
        
        <div className="mt-1 text-[12px] text-gray-500">
          {tweetUrl.href}
        </div>
      </div>
    </div>
  );
}
