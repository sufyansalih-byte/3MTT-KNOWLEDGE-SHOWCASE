interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className = '' }: LoadingDotsProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
      <span className="w-2 h-2 rounded-full bg-current animate-pulse [animation-delay:150ms]" />
      <span className="w-2 h-2 rounded-full bg-current animate-pulse [animation-delay:300ms]" />
    </span>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-primary-600 mx-auto" />
        <p className="mt-4 text-secondary-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className = '' }: LoadingCardProps) {
  return (
    <div className={`bg-white rounded-2xl border border-secondary-100 p-6 animate-pulse ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-secondary-200" />
        <div className="flex-1">
          <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-secondary-200 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-secondary-200 rounded w-full" />
        <div className="h-3 bg-secondary-200 rounded w-5/6" />
        <div className="h-3 bg-secondary-200 rounded w-4/6" />
      </div>
    </div>
  );
}

interface LoadingTableProps {
  rows?: number;
}

export function LoadingTable({ rows = 5 }: LoadingTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-secondary-100">
        <div className="flex gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-secondary-200 rounded flex-1" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 border-b border-secondary-100 last:border-0">
          <div className="flex gap-6 items-center">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-4 bg-secondary-200 rounded flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
