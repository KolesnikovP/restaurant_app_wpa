import { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function Card({ title, subtitle, onClose, children, onClick, className }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors ${className ?? ''}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
    >
      {(title || subtitle || onClose) && (
        <div className="flex items-start justify-between mb-2">
          <div>
            {title && <div className="font-semibold text-white">{title}</div>}
            {subtitle && <div className="text-xs opacity-70">{subtitle}</div>}
          </div>
          {onClose && (
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20"
            >
              Close
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

