// src/components/Sidebar.tsx
'use client';
import Link from "next/link";
import React from "react";

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-blue-900 text-white p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">Menu</h2>
      <nav className="flex flex-col space-y-4">
        <Link href="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
          Login
        </Link>
        <Link href="/register" className="hover:bg-blue-700 px-3 py-2 rounded">
          Register
        </Link>
        <Link href="/recommendation" className="hover:bg-blue-700 px-3 py-2 rounded">
          Recommendation
        </Link>
      </nav>
    </aside>
  );
}
