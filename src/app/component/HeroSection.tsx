"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

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

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="h-32 bg-gray-100 animate-pulse rounded-2xl border border-gray-200/60"
      />
    ))}
  </div>
);

const ProductGrid = ({
  products,
  isIncrease,
}: {
  products: Product[];
  isIncrease: boolean;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {products.map((product) => {
      const displayUnit =
        unitMap[product.unit] || `প্রতি ${product.unit}`;

      const icon = product.image || product.categoryIcon || "📦";

      return (
        <div
          key={product.id}
          className="bg-[#f8fbf9] border border-gray-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-sm transition-shadow duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl bg-white p-2 rounded-xl border border-gray-100 shadow-2xs">
              {icon}
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-base">
                {product.nameBn}
              </h3>

              <p className="text-xs text-gray-500 font-medium">
                {displayUnit}
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between pt-4 mt-2 border-t border-gray-200/40">
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
                isIncrease
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <span>{isIncrease ? "▲" : "▼"}</span>

              <span>
                {toBengaliNumeral(Math.abs(product.change?.pct || 0))}%
              </span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

const HeroSection = () => {
  const [date, setDate] = useState("");
  const [increasedProducts, setIncreasedProducts] = useState<Product[]>([]);
  const [decreasedProducts, setDecreasedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const formattedDate = new Date().toLocaleDateString("bn-BD", {
      dateStyle: "full",
    });

    setDate(formattedDate);

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products"
        );

        const data = await res.json();

        const items: Product[] = Array.isArray(data)
          ? data
          : data.data || [];

        const increased = items.filter(
          (p) => p.change?.dir === "up" || p.change?.pct > 0
        );

        const decreased = items.filter(
          (p) => p.change?.dir === "down" || p.change?.pct < 0
        );

        setIncreasedProducts(increased);
        setDecreasedProducts(decreased);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="bg-[#f2f7f4] rounded-3xl p-6 sm:p-10 flex flex-col-reverse md:flex-row items-center justify-between gap-8 border border-gray-100">
        <div className="space-y-4 max-w-2xl text-left">
          <div className="inline-block bg-[#e2f0e8] text-[#16A34A] text-xs font-semibold px-3 py-1.5 rounded-full">
            {date || "বৃহস্পতিবার, ৮ অক্টোবর, ২০২৬"}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-block bg-[#00a651] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-[#008f45] transition-all duration-200"
            >
              সব পণ্য দেখুন
            </Link>
          </div>
        </div>

        <div className="text-8xl sm:text-9xl select-none flex-shrink-0">
          🧺
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <span className="text-red-600 text-lg">▲</span>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            আজ দাম বেড়েছে
          </h2>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : (
          <ProductGrid
            products={increasedProducts}
            isIncrease={true}
          />
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
          <ProductGrid
            products={decreasedProducts}
            isIncrease={false}
          />
        )}
      </div>
    </section>
  );
};

export default HeroSection;