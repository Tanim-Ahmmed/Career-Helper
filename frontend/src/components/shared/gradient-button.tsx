import * as React from "react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export const GradientButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "border border-white/10 bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-lg shadow-primary/20 hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90",
        className,
      )}
      {...props}
    />
  ),
);

GradientButton.displayName = "GradientButton";
