"use client";

import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

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
  kg: "কেজি",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

const PriceTicker = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickerProducts = async () => {
      try {
        const res = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products"
        );
        const data = await res.json();
        const items: Product[] = Array.isArray(data) ? data : data.data || [];
        setProducts(items.slice(0, 15));
      } catch (error) {
        console.error("Failed to fetch ticker products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickerProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border-t border-b border-gray-200 py-3 px-4">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-36 bg-gray-200 animate-pulse rounded-md shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-b border-gray-200">
      <Marquee pauseOnHover={true} speed={35} gradient={false}>
        <div className="flex items-center">
          {products.map((item) => {
            const isUp = item.change?.dir === "up";
            const isDown = item.change?.dir === "down";
            const displayUnit = unitMap[item.unit] || item.unit;
            const icon = item.categoryIcon || item.image || "🍚";
            const pctText = toBengaliNumeral(Math.abs(item.change?.pct || 0));

            return (
              <div
                key={item.id}
                className="inline-flex items-center gap-2 px-5 py-2.5 border-r border-gray-200 whitespace-nowrap text-sm"
              >
                <span className="text-base">{icon}</span>
                <span className="text-gray-900 font-bold">{item.nameBn}</span>
                <span className="text-gray-700 font-medium">
                  {toBengaliNumeral(item.today)} টাকা/{displayUnit}
                </span>

                <span
                  className={`font-bold flex items-center gap-0.5 ml-1 ${
                    isUp
                      ? "text-red-600"
                      : isDown
                      ? "text-emerald-600"
                      : "text-gray-500"
                  }`}
                >
                  {isUp && "▲"}
                  {isDown && "▼"}
                  {!isUp && !isDown && "—"}
                  {" "}{pctText}%
                </span>
              </div>
            );
          })}
        </div>
      </Marquee>
    </div>
  );
};

export default PriceTicker;