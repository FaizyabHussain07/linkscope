import { ExtractedMetadata } from '@/types';
import { Check, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BasicMetadataProps {
  metadata: ExtractedMetadata;
}

export function BasicMetadata({ metadata }: BasicMetadataProps) {
  const getStatus = (value?: string | number | null) => {
    if (!value) return { icon: X, color: 'text-red-500', label: 'Missing' };
    if (typeof value === 'string' && value.trim() === '') return { icon: AlertTriangle, color: 'text-yellow-500', label: 'Empty' };
    return { icon: Check, color: 'text-green-500', label: 'Present' };
  };
  const StatusIcon = ({ value }: { value?: string | number | null }) => {
    const { icon: Icon, color } = getStatus(value);
    return <Icon className={cn('w-4 h-4', color)} />;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Basic Metadata</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Page Title</label>
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <StatusIcon value={metadata.title} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-mono break-all">
                {metadata.title || '—'}
              </p>
              <p className="text-xs text-muted-foreground">{getStatus(metadata.title).label}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Meta Description</label>
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <StatusIcon value={metadata.description} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-mono break-all">
                {metadata.description || '—'}
              </p>
              <p className="text-xs text-muted-foreground">{getStatus(metadata.description).label}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Canonical URL</label>
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <StatusIcon value={metadata.canonical} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-mono break-all">
                {metadata.canonical || '—'}
              </p>
              <p className="text-xs text-muted-foreground">{getStatus(metadata.canonical).label}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <StatusIcon value={metadata.language} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-mono">
                {metadata.language || '—'}
              </p>
              <p className="text-xs text-muted-foreground">{getStatus(metadata.language).label}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Viewport</label>
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <StatusIcon value={metadata.viewport} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-mono break-all">
                {metadata.viewport || '—'}
              </p>
              <p className="text-xs text-muted-foreground">{getStatus(metadata.viewport).label}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Charset</label>
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <StatusIcon value={metadata.charset} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-mono">
                {metadata.charset || '—'}
              </p>
              <p className="text-xs text-muted-foreground">{getStatus(metadata.charset).label}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
