import { cn } from "@/lib/utils";

export function SectionSubtitle({
  className,
  children,
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg",
        className,
      )}
    >
      {children}
    </p>
  );
}
