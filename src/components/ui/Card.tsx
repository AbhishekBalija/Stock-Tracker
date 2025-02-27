import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div
    className={cn(
      "bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div
    className={cn("px-6 py-4 border-b border-gray-100", className)}
    {...props}
  >
    {children}
  </div>
);

export const CardContent: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div className={cn("px-6 py-4", className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div
    className={cn("px-6 py-4 border-t border-gray-100", className)}
    {...props}
  >
    {children}
  </div>
);