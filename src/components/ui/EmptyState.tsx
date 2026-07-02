import { ReactNode } from 'react';
import { FileX, Search, FolderOpen, Inbox } from 'lucide-react';
import { Button } from './Button';

type EmptyStateVariant = 'default' | 'search' | 'folder' | 'inbox';

interface EmptyStateProps {
  icon?: ReactNode;
  variant?: EmptyStateVariant;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const variantIcons: Record<EmptyStateVariant, ReactNode> = {
  default: <FileX className="w-12 h-12" />,
  search: <Search className="w-12 h-12" />,
  folder: <FolderOpen className="w-12 h-12" />,
  inbox: <Inbox className="w-12 h-12" />,
};

export function EmptyState({
  icon,
  variant = 'default',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary-100 text-secondary-400 mb-4">
        {icon || variantIcons[variant]}
      </div>
      <h3 className="text-lg font-semibold text-secondary-800 mb-2">{title}</h3>
      {description && (
        <p className="text-secondary-500 max-w-sm mx-auto mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

interface EmptyStateCardProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyStateCard({ title, description, actionLabel, onAction }: EmptyStateCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-secondary-200 p-8 text-center">
      <EmptyState
        title={title}
        description={description}
        actionLabel={actionLabel}
        onAction={onAction}
      />
    </div>
  );
}
