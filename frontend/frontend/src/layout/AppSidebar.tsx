'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";

const menuItems = [
  { name: "Dashboard", href: "/feedback-dashboard", icon: "📊" },
  { name: "Tables", href: "/feedback-table", icon: "📋" }, // Nouvel item
  { name: "Recommandation", href: "/recommendation", icon: "💡" },
  { name: "Login", href: "/login", icon: "🔐" },
  { name: "Register", href: "/register", icon: "👤" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { isExpanded, isHovered, isMobileOpen, setIsHovered } = useSidebar();

  const showText = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out dark:bg-gray-900 dark:border-gray-800 ${
        isMobileOpen ? "w-72" : 
        isExpanded ? "w-72" : 
        isHovered ? "w-72" : "w-20"
      } ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
          {showText ? (
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Menu</h2>
          ) : (
            <span className="text-2xl">📱</span>
          )}
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {showText && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}