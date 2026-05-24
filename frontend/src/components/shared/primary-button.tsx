import * as React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

export const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <Button ref={ref} variant="default" {...props} />,
);

PrimaryButton.displayName = "PrimaryButton";
