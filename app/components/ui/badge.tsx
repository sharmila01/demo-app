import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800",
        secondary: "bg-blue-100 text-blue-800",
        destructive: "bg-red-100 text-red-800",
        outline: "border border-gray-300",
        success: "bg-green-100 text-green-800", // custom
        warning: "bg-yellow-100 text-yellow-800", // custom
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
);

Badge.displayName = "Badge";
