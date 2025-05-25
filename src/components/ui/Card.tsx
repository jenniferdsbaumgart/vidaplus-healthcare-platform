import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div className={twMerge(
      "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: CardHeaderProps) => {
  return (
    <div className={twMerge("px-6 py-4 border-b border-gray-200", className)}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className }: CardTitleProps) => {
  return (
    <h3 className={twMerge("text-lg font-heading font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className }: CardDescriptionProps) => {
  return (
    <p className={twMerge("text-sm text-gray-500", className)}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className }: CardContentProps) => {
  return (
    <div className={twMerge("px-6 py-4", className)}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className }: CardFooterProps) => {
  return (
    <div className={twMerge("px-6 py-4 bg-gray-50 border-t border-gray-200", className)}>
      {children}
    </div>
  );
};