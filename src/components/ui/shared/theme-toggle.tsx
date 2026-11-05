"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme, mounted } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={`rounded-full w-9 h-9 ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Icon is chosen with CSS so it matches the pre-hydration theme too. */}
      <Sun className="hidden dark:block w-4 h-4 text-yellow-400" />
      <Moon className="block dark:hidden w-4 h-4" />
    </Button>
  );
}
