import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-w-0 rounded-[28px] border border-line bg-surface p-4 sm:p-5", className)}
      {...props}
    />
  );
}
