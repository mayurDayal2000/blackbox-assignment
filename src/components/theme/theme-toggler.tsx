"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? (resolvedTheme ?? "light") : theme;
  const isDark = currentTheme === "dark";

  const handleToggle = () => {
    const newTheme = (theme === "system" ? resolvedTheme : theme) === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const nextTheme = isDark ? "light" : "dark";

  if (!mounted) {
    return <Button disabled size="icon" variant="ghost" />;
  }

  return (
    <Button
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={isDark}
      className="relative group cursor-pointer"
      onClick={handleToggle}
      role="switch"
      size="icon"
      type="button"
      variant="ghost"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-[transform,opacity] duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-[transform,opacity] duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
