import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={className}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
};



