"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const NavLinks = () => {
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
      <div className="flex  items-center justify-between space-x-7 py-3 overflow-x-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-6 w-16 bg-gray-200 animate-pulse rounded-md"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-6 sm:space-x-8 overflow-x-auto py-3 scrollbar-none">
      {categories.map((n) => {
        const href = `/category/${n.slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={n.id || n.slug}
            href={href}
            className={`flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold transition-colors ${
              isActive
                ? "text-emerald-600 font-bold"
                : "text-gray-700 hover:text-emerald-600"
            }`}
          >
            <span className="text-base">{n.icon}</span>
            <span className="text-gray-900 font-medium">{n.nameBn}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks;