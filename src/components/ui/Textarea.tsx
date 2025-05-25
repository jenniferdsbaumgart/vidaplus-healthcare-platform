import React from 'react';
import { twMerge } from 'tailwind-merge';
import Label from './Label';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  optional?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    label,
    error,
    helperText,
    className,
    fullWidth = false,
    required,
    optional,
    ...props 
  }, ref) => {
    return (
      <div className={twMerge(fullWidth ? 'w-full' : '', 'space-y-1')}>
        {label && (
          <Label required={required} optional={optional}>
            {label}
          </Label>
        )}
        <textarea
          ref={ref}
          className={twMerge(
            'block rounded-lg border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm',
            error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-200 focus:border-accent focus:ring-accent',
            fullWidth ? 'w-full' : 'w-80',
            'p-2.5 min-h-[100px] resize-y',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={twMerge(
            'text-sm',
            error ? 'text-red-600' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;