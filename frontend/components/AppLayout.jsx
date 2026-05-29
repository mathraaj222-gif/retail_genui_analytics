"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-lato antialiased flex flex-col">
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-[#f5f5f7]/95 backdrop-blur-md border-b border-[#e5e5e7] px-6 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <img 
              src="/Slide1-removebg-preview.png" 
              alt="AtliQ Mart Logo" 
              className="h-10 sm:h-12 w-auto object-contain" 
            />
          </Link>

          {/* Navigation Links - Minimalist Lato */}
          <nav className="flex items-center gap-8 font-lato">
            <NavItem label="Home" href="/" active={pathname === "/"} />
            <NavItem label="Analytics" href="/analytics" active={pathname === "/analytics" || pathname.startsWith("/analytics")} />
            <NavItem label="About" href="/about" active={pathname === "/about"} />
          </nav>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-8 py-8 flex flex-col">
        {children}
      </main>
    </div>
  );
}

function NavItem({ label, href, active }) {
  return (
    <Link 
      href={href}
      className={`
        relative py-1 text-sm font-medium transition-all duration-200 font-lato tracking-wide
        ${active 
          ? "text-blue-600 font-bold" 
          : "text-[#515154] hover:text-blue-600"
        }
      `}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
      )}
    </Link>
  );
}
