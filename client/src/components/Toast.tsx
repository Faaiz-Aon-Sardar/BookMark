import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types/bookmark';

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-5 right-3 sm:right-5 left-3 sm:left-auto z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-black shrink-0 stroke-[2.5]" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-white shrink-0 stroke-[2.5]" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-black shrink-0 stroke-[2.5]" />;
            case 'info':
            default:
              return <Info className="w-5 h-5 text-black shrink-0 stroke-[2.5]" />;
          }
        };

        const getBg = () => {
          switch (toast.type) {
            case 'error':
              return 'bg-rose-500 text-white border-2 border-black dark:border-white/40 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF]';
            case 'warning':
              return 'bg-amber-300 text-black border-2 border-black dark:border-white/40 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF]';
            case 'success':
              return 'bg-emerald-300 text-black border-2 border-black dark:border-white/40 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF]';
            case 'info':
            default:
              return 'bg-cyan-200 text-black border-2 border-black dark:border-white/40 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#FFF]';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl flex items-start gap-2.5 transition-all duration-150 animate-in fade-in slide-in-from-bottom-2 ${getBg()}`}
          >
            <div className="mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <h5 className="font-black text-xs sm:text-sm leading-tight truncate">{toast.title}</h5>
              {toast.description && (
                <p className="text-xs font-semibold opacity-90 mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="opacity-70 hover:opacity-100 p-1 rounded-lg hover:bg-black/10 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
