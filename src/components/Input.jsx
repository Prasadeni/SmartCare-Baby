import React from 'react';

const Input = ({ id, label, className = "", ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="sr-only">{label}</label>}
      <input
        id={id}
        className={`w-full rounded-full border border-outline-variant bg-surface-container-lowest px-6 py-4 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-0 input-glow transition-all duration-200 soft-shadow ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;