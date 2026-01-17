import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input className={className} {...props} />
      {error && <span>{error}</span>}
    </div>
  );
};



