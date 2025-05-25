import React from 'react';
import { twMerge } from 'tailwind-merge';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps {
  level?: HeadingLevel;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

const sizeClasses: Record<HeadingLevel, string> = {
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-bold',
  h3: 'text-xl font-bold',
  h4: 'text-lg font-semibold',
  h5: 'text-base font-semibold',
  h6: 'text-sm font-semibold',
};

const Heading = ({ level = 'h1', children, className, description }: HeadingProps) => {
  const Tag = level;
  const baseClasses = 'text-gray-900';
  const combinedClasses = twMerge(baseClasses, sizeClasses[level], className);

  return (
    <div className="space-y-1">
      <Tag className={combinedClasses}>{children}</Tag>
      {description && (
        <p className="text-gray-500 text-sm">{description}</p>
      )}
    </div>
  );
};

export default Heading;