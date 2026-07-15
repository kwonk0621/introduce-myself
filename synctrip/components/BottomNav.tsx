"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, MessageCircle, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "매칭",
      href: "/dashboard",
      icon: Sparkles,
      active: pathname === "/dashboard"
    },
    {
      label: "채팅",
      href: "/chat",
      icon: MessageCircle,
      active: pathname.startsWith("/chat")
    },
    {
      label: "내 모험",
      href: "/profile",
      icon: User,
      active: pathname === "/profile"
    }
  ];

  return (
    <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around z-40 px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Link
            key={idx}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors duration-150 ${
              item.active ? "text-primary" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 ${item.active ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
