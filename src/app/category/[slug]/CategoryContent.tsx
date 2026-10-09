"use client";

import React, { useEffect, useMemo, useState } from "react";
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

export default function CategoryContent({ slug }: { slug: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products"
        );

        const data = await res.json();

        const items: Product[] = Array.isArray(data)
          ? data
          : data.data || [];

        const filtered = items.filter(
          (product) =>
            product.category.toLowerCase() === slug.toLowerCase()
        );

        setProducts(filtered);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [slug]);

  const categoryDetails = useMemo(() => {
    if (products.length > 0) {
      return {
        nameBn: products[0].categoryNameBn || products[0].category,
        icon: products[0].categoryIcon || products[0].image || "🍚",
      };
    }

    return {
      nameBn: "পণ্য তালিকা",
      icon: "🧺",
    };
  }, [products]);

  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sortOrder === "price-low") {
      list.sort((a, b) => a.today - b.today);
    }

    if (sortOrder === "price-high") {
      list.sort((a, b) => b.today - a.today);
    }

    return list;
  }, [products, sortOrder]);

  return (
    <div className="bg-[#f4f7f5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-2xs flex items-center gap-4">
          <div className="w-16 h-16 bg-[#f2f7f4] rounded-2xl flex items-center justify-center text-4xl border border-gray-100">
            {categoryDetails.icon}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {categoryDetails.nameBn}
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              {toBengaliNumeral(products.length)}টি পণ্যের আজকের দাম ও
              পরিবর্তন
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            মোট {toBengaliNumeral(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
          </span>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium hidden sm:inline">
              সাজান
            </label>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 focus:outline-none"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-low">কম দাম থেকে বেশি</option>
              <option value="price-high">বেশি দাম থেকে কম</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-36 bg-gray-200/60 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-white border border-gray-200/80 rounded-2xl px-6 py-16 text-center">
            <div className="text-5xl mb-4">🧺</div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
            </h2>

            <p className="text-sm text-gray-500 mt-2 mb-6">
              ক্যাটাগরিটি সঠিক কিনা যাচাই করে আবার চেষ্টা করুন।
            </p>

            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#00a651] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#008f45] transition-colors"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedProducts.map((product) => {
              const displayUnit =
                unitMap[product.unit] || `প্রতি ${product.unit}`;

              const icon =
                product.image || product.categoryIcon || "🍚";

              const isUp =
                product.change?.dir === "up" ||
                product.change?.pct > 0;

              const isDown =
                product.change?.dir === "down" ||
                product.change?.pct < 0;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white border border-gray-200/80 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl bg-[#f8fbf9] p-2 rounded-xl border border-gray-100">
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

                  <div className="flex items-end justify-between pt-4 mt-2 border-t border-gray-100">
                    <div>
                      <span className="text-[11px] text-gray-400 block font-medium">
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
                      <span>
                        {isUp ? "▲" : isDown ? "▼" : "—"}
                      </span>

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
        )}
      </div>
    </div>
  );
}

