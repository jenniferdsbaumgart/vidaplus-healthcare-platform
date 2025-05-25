import React from 'react';
import { twMerge } from 'tailwind-merge';
import Label from './Label';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  required?: boolean;
  optional?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    id,
    required,
    optional,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    const baseInputStyles = "h-11 px-3 py-2 block rounded-lg border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 sm:text-sm";
    const errorInputStyles = "border-error-300 text-error-900 placeholder-error-300 focus:border-error-500 focus:ring-error-500";
    const defaultInputStyles = "border-gray-200 focus:border-accent-500 focus:ring-accent-500";
    const iconPaddingLeft = leftIcon ? "pl-10" : "";
    const iconPaddingRight = rightIcon ? "pr-10" : "";
    const widthStyles = fullWidth ? "w-full" : "w-80";
    
    const inputStyles = twMerge(
      baseInputStyles,
      error ? errorInputStyles : defaultInputStyles,
      iconPaddingLeft,
      iconPaddingRight,
      widthStyles,
      className
    );
    
    return (
      <div className={twMerge(fullWidth ? "w-full" : "", "relative")}>
        {label && (
          <Label
            htmlFor={inputId}
            required={required}
            optional={optional}
          >
            {label}
          </Label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={inputStyles}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p 
            className={twMerge(
              "mt-1 text-sm",
              error ? "text-error-600" : "text-gray-500"
            )}
            id={error ? `${inputId}-error` : `${inputId}-helper`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;