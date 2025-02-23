import * as React from "react"

import { cn } from "@/lib/utils"
function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.toString().replace(/\D/g, '');
  
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  
  if (!match) return '';
  
  const parts = [match[1], match[2], match[3]].filter(Boolean);
  
  if (parts.length === 0) return '';
  if (parts.length === 1) return `(${parts[0]}`;
  if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`;
  return `(${parts[0]}) ${parts[1]}-${parts[2]}`;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, formatPhoneNumber }
