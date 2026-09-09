import React from 'react';

const Button = ({ children, onClick, type = "submit", variant = "primary", className = "", ...props }) => {
  const base = "w-full rounded-full py-4 px-6 font-headline-sm text-headline-sm transition-all duration-200 active:scale-95";
  const variants = {
    primary: "bg-primary text-on-primary hover:opacity-90 shadow-[0_4px_12px_rgba(23,100,141,0.2)]",
    secondary: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10",
    error: "bg-error text-on-error hover:opacity-90",
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;