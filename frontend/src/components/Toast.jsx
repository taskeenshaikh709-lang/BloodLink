import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-950',
    error: 'border-red-200 bg-red-50/90 text-red-950',
    info: 'border-blue-200 bg-blue-50/90 text-blue-950'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-xl shadow-xl border flex items-start space-x-3 backdrop-blur-md ${borders[toast.type] || borders.info}`}>
        {icons[toast.type] || icons.info}
        <div className="flex-1 text-xs font-medium leading-relaxed">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
