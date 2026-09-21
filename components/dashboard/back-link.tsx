import Link from "next/link";
import type { ReactNode } from "react";
import { dashMutedLink } from "@/lib/dashboard/classes";

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <p className="text-sm">
      <Link href={href} className={dashMutedLink}>
        {children}
      </Link>
    </p>
  );
}
