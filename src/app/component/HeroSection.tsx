"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import heroImg from "/bazar-hero.png";
import DateBadge from "./DateBadge";

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

const toBengaliNumeral = (num: number | string): string => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  return num
    .toString()
    .replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
};

const unitMap: Record<string, string> = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
};

const HeroSection = ({ date }: { date?: string }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products"
        );

        const data = await res.json();

        const items: Product[] = Array.isArray(data)
          ? data
          : data.data || [];

        setAllProducts(items);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const increasedProducts = useMemo(
    () =>
      allProducts.filter(
        (p) => p.change?.dir === "up" || p.change?.pct > 0
      ),
    [allProducts]
  );

  const decreasedProducts = useMemo(
    () =>
      allProducts.filter(
        (p) => p.change?.dir === "down" || p.change?.pct < 0
      ),
    [allProducts]
  );

  const categories = useMemo(() => {
    const map = new Map<
      string,
      { slug: string; nameBn: string; icon: string }
    >();

    allProducts.forEach((p) => {
      if (p.category && !map.has(p.category)) {
        map.set(p.category, {
          slug: p.category,
          nameBn: p.categoryNameBn || p.category,
          icon: p.categoryIcon || "🛒",
        });
      }
    });

    return Array.from(map.values());
  }, [allProducts]);

  const filteredAllProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      const matchesSearch = product.nameBn
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 flex flex-col-reverse md:flex-row items-center justify-between gap-8 border border-gray-100">
        <div className="space-y-4 max-w-2xl text-left">
         <DateBadge/>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <div className="pt-2">
            <a
              href="#sokol-ponno"
              className="inline-block bg-[#00a651] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-[#008f45] transition-all duration-200"
            >
              সব পণ্য দেখুন
            </a>
          </div>
        </div>

        <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0 flex items-center justify-center">
          <Image
            src={heroImg}
            alt="Market Basket"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-red-600 text-lg">▲</span>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            আজ দাম বেড়েছে
          </h2>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : (
          <ProductGrid products={increasedProducts} />
        )}
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 text-lg">▼</span>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            আজ দাম কমেছে
          </h2>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : (
          <ProductGrid products={decreasedProducts} />
        )}
      </div>

      <div
        id="sokol-ponno"
        className="space-y-6 pt-6 border-t border-gray-200/80"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-700 text-xl">🛒</span>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              সকল পণ্য ({toBengaliNumeral(filteredAllProducts.length)})
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
           <input
  type="text"
  placeholder="পণ্য খুঁজুন..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents page reload or accidental redirects
    }
  }}
  className="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#00a651] transition-colors"
/>

            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
              🔍
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-[#00a651] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            সব ({toBengaliNumeral(allProducts.length)})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? "bg-[#00a651] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.nameBn}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonGrid count={9} />
        ) : filteredAllProducts.length > 0 ? (
          <ProductGrid products={filteredAllProducts} />
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            কোনো পণ্য পাওয়া যায়নি।
          </div>
        )}
      </div>
    </section>
  );
};

const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="h-32 bg-gray-100 animate-pulse rounded-2xl border border-gray-200/60"
      />
    ))}
  </div>
);

const ProductGrid = ({ products }: { products: Product[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {products.map((product) => {
      const displayUnit =
        unitMap[product.unit] || `প্রতি ${product.unit}`;

      const icon = product.image || product.categoryIcon || "📦";

      const isUp =
        product.change?.dir === "up" || product.change?.pct > 0;

      const isDown =
        product.change?.dir === "down" || product.change?.pct < 0;

    
      const productHref = product.slug ? `/products/${product.slug}` : "#";

      return (
        <Link
          key={product.id || product.slug}
          href={productHref}
          className="bg-white border border-gray-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl bg-gray-50 p-2 rounded-xl border border-gray-100 shadow-2xs group-hover:scale-105 transition-transform">
              {icon}
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-[#00a651] transition-colors">
                {product.nameBn}
              </h3>

              <p className="text-xs text-gray-500 font-medium">
                {displayUnit}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between pt-4 mt-2 border-t border-gray-100">
            <div>
              <span className="text-[11px] text-gray-500 block font-medium">
                আজকের দাম
              </span>

              <span className="text-lg font-extrabold text-gray-900">
                {toBengaliNumeral(product.today)} টাকা
              </span>
            </div>

            <div
              className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-0.5 ${
                isUp
                  ? "bg-red-50 text-red-600"
                  : isDown
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span>{isUp ? "▲" : isDown ? "▼" : "—"}</span>

              <span>
                {toBengaliNumeral(
                  Math.abs(product.change?.pct || 0)
                )}
                %
              </span>
            </div>
          </div>
        </Link>
      );
    })}
  </div>
);

export default HeroSection;