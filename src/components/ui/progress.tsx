"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = () => (
  <ProgressPrimitive.Root className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
    <ProgressPrimitive.Indicator
      className="h-full bg-primary transition-all"
      style={{ transform: "translateX(-25%)" }} // 75% filled
    />
  </ProgressPrimitive.Root>
);
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
