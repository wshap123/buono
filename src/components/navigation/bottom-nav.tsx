"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/",
    label: "Overview",
    icon: LayoutGrid,
    isActive: (pathname: string) =>
      pathname === "/" || pathname === "/overview",
  },
  {
    href: "/plan",
    label: "Plan",
    icon: CalendarDays,
    isActive: (pathname: string) => pathname === "/plan",
  },
  {
    href: "/recipes",
    label: "Recipes",
    icon: BookOpen,
    isActive: (pathname: string) => pathname.startsWith("/recipes"),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-lg items-stretch px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive(pathname);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-background/80 hover:text-foreground",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
