import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-base font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105",
        secondary: "bg-white/20 backdrop-blur-md text-gray-700 border border-white/30 hover:bg-white/30 shadow-lg hover:shadow-xl transform hover:scale-105",
        ghost: "hover:bg-white/10 hover:text-gray-900",
        outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200",
        option: "bg-white/80 backdrop-blur-md border border-white/40 text-gray-800 hover:bg-white/90 hover:border-blue-300 hover:shadow-lg transform hover:scale-102 transition-all duration-200",
        selected: "bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md border-2 border-blue-400 text-blue-700 shadow-lg scale-102"
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-xl px-3",
        lg: "h-14 rounded-2xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }