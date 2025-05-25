import React from 'react';
import { twMerge } from 'tailwind-merge';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
}

const Label = ({ children, className, required, optional, ...props }: LabelProps) => {
  return (
    <label
      className={twMerge(
        'block text-sm font-medium text-gray-700',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
      {optional && <span className="text-gray-400 ml-1">(opcional)</span>}
    </label>
  );
};

export default Label;