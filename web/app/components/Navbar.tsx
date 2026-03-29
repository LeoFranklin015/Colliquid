"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ConnectWallet from "./ConnectWallet";
import TourButton from "./TourButton";

const links = [
  { href: "/dashboard", label: "Admin Portfolio" },
  { href: "/marketplace", label: "Market" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-mono text-[14px] font-bold tracking-tight text-foreground"
        >
          <Image src="/logo.svg" alt="Colliquid" width={24} height={24} />
          COLLIQUID
        </Link>

        <div className="flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`cursor-pointer text-[14px] transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <TourButton />
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
}
