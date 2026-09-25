// src/components/Button.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  onClick,
  type = 'submit',
  variant = 'primary',
  className = '',
  to,                          // NEW: if provided, renders as <Link>
  icon,                        // NEW: optional Material Symbol name
  iconPosition = 'left',       // NEW: 'left' | 'right'
  fullWidth = true,            // NEW: defaults to old behaviour (w-full)
  ...props
}) => {
  const base = [
    'rounded-full py-4 px-6 font-headline-sm text-headline-sm',
    'transition-all duration-200 active:scale-95',
    'inline-flex items-center justify-center gap-2',
    fullWidth ? 'w-full' : 'w-auto',
  ].join(' ');

  const variants = {
    primary:   'bg-primary text-on-primary hover:opacity-90 shadow-[0_4px_12px_rgba(23,100,141,0.2)]',
    secondary: 'border-2 border-primary bg-transparent text-primary hover:bg-primary/10',
    error:     'bg-error text-on-error hover:opacity-90 shadow-[0_4px_12px_rgba(186,26,26,0.2)]',
  };

  const cls = `${base} ${variants[variant] || variants.primary} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls} {...props}>
      {content}
    </button>
  );
};

export default Button;