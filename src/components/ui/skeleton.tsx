import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
  shape?: "rounded" | "pill";
  style?: CSSProperties;
}

export function Skeleton({ className, shape = "rounded", style }: SkeletonProps) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn("animate-pulse-soft bg-skeleton", shape === "pill" ? "rounded-full" : "rounded-md", className)}
    />
  );
}
