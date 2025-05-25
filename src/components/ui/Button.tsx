import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    fullWidth = false,
    className, 
    disabled,
    ...props 
  }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantStyles = {
      primary: "bg-teal-900 text-white hover:bg-teal-700 focus:ring-teal-500",
      secondary: "bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500",
      accent: "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500",
      success: "bg-success-500 text-white hover:bg-success-600 focus:ring-success-500",
      warning: "bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500",
      error: "bg-error-500 text-white hover:bg-error-600 focus:ring-error-500",
      outline: "border-2 border-teal-700 text-teal-700 hover:bg-teal-50 focus:ring-teal-500",
      ghost: "text-gray-600 hover:bg-gray-200 focus:ring-accent-500",
    };
    
    const sizeStyles = {
      sm: "text-sm px-3 py-1.5",
      md: "text-base px-4 py-2",
      lg: "text-lg px-6 py-3",
    };
    
    const widthStyles = fullWidth ? "w-full" : "";
    
    const classes = twMerge(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      widthStyles,
      className
    );
    
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!isLoading && leftIcon && (
          <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;