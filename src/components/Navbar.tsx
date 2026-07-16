"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("kwonk0621@naver.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = [
    { label: "Systems", href: isHome ? "#systems" : "/#systems" },
    { label: "Research", href: isHome ? "#research" : "/#research" },
    { label: "Demos", href: isHome ? "#demos" : "/#demos" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-[68px] bg-obsidian-bar flex items-center justify-between px-6 md:px-12 border-b border-frost/10 select-none">
      {/* Brand Logo */}
      <Link 
        href="/" 
        className="text-porcelain text-[15px] font-semibold tracking-[0.05em] uppercase hover:opacity-90 transition-opacity"
      >
        AIGRAVITY LAB
      </Link>

      {/* Center Links (Hidden on small screens) */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-porcelain/80 hover:text-porcelain text-[14px] font-medium transition-colors relative group py-2"
          >
            {link.label}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-porcelain scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </Link>
        ))}
      </div>

      {/* Right Side Links & CTA */}
      <div className="flex items-center gap-6">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-porcelain/80 hover:text-porcelain text-[14px] font-medium transition-colors hidden sm:inline-block"
        >
          GitHub
        </a>
        <a
          href="https://cosmos.so"
          target="_blank"
          rel="noopener noreferrer"
          className="text-porcelain/80 hover:text-porcelain text-[14px] font-medium transition-colors hidden sm:inline-block"
        >
          Cosmos
        </a>
        
        {/* Contact CTA Pill */}
        <div className="relative">
          <button
            onClick={handleCopyEmail}
            className="px-5 py-2 text-[13px] font-medium text-porcelain border border-frost/25 rounded-full bg-transparent hover:bg-porcelain hover:text-obsidian-bar hover:border-porcelain transition-all duration-300 cursor-pointer active:scale-95"
          >
            Contact
          </button>
          
          {/* Slick Email Copied Toast */}
          <div
            className={`absolute top-full right-0 mt-3 px-4 py-2 bg-porcelain text-obsidian-bar text-[12px] font-semibold rounded-xl shadow-xl border border-frost/10 transition-all duration-300 origin-top-right ${
              copied
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            }`}
          >
            kwonk0621@naver.com 복사됨!
          </div>
        </div>
      </div>
    </nav>
  );
}

