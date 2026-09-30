import React from 'react';

// Brand mark: a rounded teal square with an "L" stroke (matches the favicon).
export const LogoMark = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <rect width="32" height="32" rx="9" className="fill-accent-600" />
    <path d="M11 9v14h11" stroke="white" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Logo = ({ suffix = 'Learn', className = '' }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <LogoMark className="w-8 h-8 shrink-0" />
    <span className="text-[17px] tracking-tight text-slate-900">
      <span className="font-semibold">Lyntrix</span>{' '}
      <span className="font-medium text-slate-500">{suffix}</span>
    </span>
  </span>
);
