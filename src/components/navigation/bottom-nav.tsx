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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex w-full max-w-lg items-stretch px-3 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isActive(pathname);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 px-2 py-2 transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-[1.125rem]" aria-hidden="true" />
              <span className="font-heading text-[0.8rem] font-semibold tracking-[0.04em]">
                {tab.label}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "h-px w-6 bg-primary transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
