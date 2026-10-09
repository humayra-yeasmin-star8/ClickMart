"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const NavLinksContent = () => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/categories"
        );

        const data = await res.json();

        const items = Array.isArray(data) ? data : data.data || [];

        setCategories(items);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-3 overflow-x-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 bg-gray-200 animate-pulse rounded-full"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
      {categories.map((n) => {
        const href = `/category/${n.slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={n.id || n.slug}
            href={href}
            className={`group px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all duration-200 ${
              isActive
                ? "bg-[#00a651] text-white shadow-xs"
                : "bg-transparent text-gray-700 hover:bg-[#00a651] hover:text-white"
            }`}
          >
            <span className="text-sm">{n.icon}</span>

            <span
              className={
                isActive
                  ? "text-white"
                  : "text-gray-800 group-hover:text-white"
              }
            >
              {n.nameBn}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

const NavLinks = () => {
  return (
    <Suspense fallback={<div className="h-12" />}>
      <NavLinksContent />
    </Suspense>
  );
};

export default NavLinks;