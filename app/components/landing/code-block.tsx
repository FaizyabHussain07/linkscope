import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  return (
    <div className={cn("rounded-xl border bg-[#111113] p-4 font-mono text-sm", className)}>
      {language && (
        <div className="mb-2 flex items-center justify-between text-xs text-[#52525B]">
          <span className="text-[#A1A1AA]">{language}</span>
          <CopyButton code={code} />
        </div>
      )}
      <pre className="overflow-x-auto text-[#A1A1AA]">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function CopyButton({ code }: { code: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1 rounded bg-[#18181B] px-2 py-1 text-[#52525B] transition-colors hover:text-[#A1A1AA]"
      onClick={() => navigator.clipboard.writeText(code)}
    >
      <CopyIcon className="h-3.5 w-3.5" />
      Copy
    </button>
  )
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}
