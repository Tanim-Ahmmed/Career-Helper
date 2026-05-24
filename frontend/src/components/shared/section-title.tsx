import { cn } from "@/lib/utils";

export function SectionTitle({
  className,
  children,
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}
