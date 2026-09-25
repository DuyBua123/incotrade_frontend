import * as React from "react";
import { cn } from "cn";

function FieldError({
  className,
  message,
  ...props
}: React.ComponentProps<"p"> & { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p
      data-slot="field-error"
      className={cn("mt-1.5 text-xs font-bold text-danger", className)}
      {...props}
    >
      {message}
    </p>
  );
}

export { FieldError };
