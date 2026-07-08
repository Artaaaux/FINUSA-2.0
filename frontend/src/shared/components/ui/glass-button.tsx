import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const glassButtonVariants = cva(
  "relative isolate inline-flex min-h-11 cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-lg border text-sm font-semibold shadow-sm backdrop-blur-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "border-blue-400/30 bg-primary text-white shadow-[0_16px_35px_rgba(37,99,235,0.28)] hover:bg-blue-500",
        secondary:
          "border-accent-cyan/50 bg-transparent text-accent-cyan shadow-none hover:bg-accent-cyan/10",
        ghost:
          "border-transparent bg-transparent text-white shadow-none hover:border-white/15 hover:bg-white/10 hover:text-blue-300",
      },
      size: {
        sm: "h-9 min-h-9 px-3",
        default: "h-11 px-5 py-2",
        lg: "h-12 px-6 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean;
}

const   GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
