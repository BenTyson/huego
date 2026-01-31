"use client";

import { type MouseEvent, type ComponentProps } from "react";
import Link from "next/link";
import { useNavigationGuardSafe } from "@/contexts/NavigationGuardContext";

type GuardedLinkProps = ComponentProps<typeof Link>;

export function GuardedLink({ onClick, href, ...props }: GuardedLinkProps) {
  const guard = useNavigationGuardSafe();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (guard) {
      // Let the guard context decide whether to navigate
      e.preventDefault();
      guard.requestNavigation(typeof href === "string" ? href : href.toString());
    }

    // Call original onClick if provided
    onClick?.(e as never);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
