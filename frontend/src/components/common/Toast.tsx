import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { message, type, visible } = useToastStore();

  if (!message) return null;

  const bgColors = {
    error: 'bg-[#DC2626]', // Red
    success: 'bg-[#0D9488]', // Teal
    info: 'bg-[#FF7E36]', // Carrot Orange
  };

  const Icon = type === 'error' ? AlertCircle : type === 'success' ? CheckCircle : Info;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-[380px] 
      transition-all duration-300 ease-in-out transform
      ${visible ? 'translate-y-0 opacity-100' : '-translate-y-[20px] opacity-0 pointer-events-none'}`}
    >
      <div className={`${bgColors[type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
        <Icon size={20} className="shrink-0" />
        <span className="text-[14px] font-medium leading-tight">{message}</span>
      </div>
    </div>
  );
};
