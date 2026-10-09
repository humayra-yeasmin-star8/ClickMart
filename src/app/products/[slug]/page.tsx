"use client";

import React, { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";

interface RawMarket {
  marketName?: string;
  market?: string;
  name?: string;
  division?: string;
  divisionBn?: string;
  minPrice?: number;
  min?: number;
  maxPrice?: number;
  max?: number;
  avgPrice?: number;
  avg?: number;
}

interface ProductDetail {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  unit: string;
  image?: string;
  today: number;
  yesterday: number;
  minPrice?: number;
  minPriceMarket?: string;
  maxPrice?: number;
  maxPriceMarket?: string;
  avgPrice?: number;
  change?: {
    dir?: "up" | "down" | "flat";
    pct?: number;
    diff?: number;
  };
  markets?: RawMarket[];
}

const toBengaliNumeral = (
  num: number | string | undefined | null
): string => {
  if (
    num === undefined ||
    num === null ||
    Number.isNaN(Number(num))
  ) {
    return "—";
  }

  const bengaliDigits = [
    "০",
    "১",
    "২",
    "৩",
    "৪",
    "৫",
    "৬",
    "৭",
    "৮",
    "৯",
  ];

  return num
    .toString()
    .replace(
      /\d/g,
      (digit) => bengaliDigits[parseInt(digit, 10)]
    );
};

const unitMap: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
};

function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDivision, setSelectedDivision] =
    useState<string>("all");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products"
        );

        const data = await res.json();

        const items: ProductDetail[] = Array.isArray(data)
          ? data
          : data.data || [];

        const found = items.find((p) => p.slug === slug);

        if (found) {
          setProduct(found);
        } else {
          setError("পণ্যটি পাওয়া যায়নি।");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("তথ্য লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 font-semibold text-lg">
          {error || "পণ্যটি পাওয়া যায়নি"}
        </p>

        <Link
          href="/"
          className="inline-block mt-4 text-sm bg-[#00a651] text-white px-5 py-2.5 rounded-xl font-medium"
        >
          হোমে ফিরে যান
        </Link>
      </div>
    );
  }

  const unitName = unitMap[product.unit] || product.unit;

  const isUp =
    product.change?.dir === "up" ||
    (product.change?.pct || 0) > 0;

  const isDown =
    product.change?.dir === "down" ||
    (product.change?.pct || 0) < 0;

  const priceDiff = Math.abs(
    product.change?.diff ||
      product.today - (product.yesterday || product.today)
  );

  const processedMarkets = (product.markets || [])
    .map((m) => {
      const marketName =
        m.marketName || m.market || m.name || "—";

      const division =
        m.divisionBn || m.division || "—";

      const minPrice = m.minPrice ?? m.min ?? 0;

      const maxPrice = m.maxPrice ?? m.max ?? 0;

      let avgPrice = m.avgPrice ?? m.avg;

      if (
        avgPrice === undefined ||
        avgPrice === null ||
        avgPrice === 0
      ) {
        if (minPrice > 0 && maxPrice > 0) {
          avgPrice = Math.round(
            (minPrice + maxPrice) / 2
          );
        } else {
          avgPrice = minPrice || maxPrice;
        }
      }

      return {
        marketName,
        division,
        minPrice,
        maxPrice,
        avgPrice,
      };
    })
    .sort((a, b) => {
      if (a.minPrice !== b.minPrice) {
        return a.minPrice - b.minPrice;
      }

      return a.maxPrice - b.maxPrice;
    });

  const filteredMarkets = processedMarkets.filter((m) =>
    selectedDivision === "all"
      ? true
      : m.division === selectedDivision
  );

  const validMinMarkets = processedMarkets.filter(
    (m) => m.minPrice > 0
  );

  const validMaxMarkets = processedMarkets.filter(
    (m) => m.maxPrice > 0
  );

  const lowestMarket = validMinMarkets.reduce(
    (lowest, current) =>
      current.minPrice < lowest.minPrice
        ? current
        : lowest,
    validMinMarkets[0]
  );

  const highestMarket = validMaxMarkets.reduce(
    (highest, current) =>
      current.maxPrice > highest.maxPrice
        ? current
        : highest,
    validMaxMarkets[0]
  );

  const overallAverage =
    processedMarkets.length > 0
      ? Math.round(
          processedMarkets.reduce(
            (sum, market) => sum + market.avgPrice,
            0
          ) / processedMarkets.length
        )
      : product.today;

  const divisions = Array.from(
    new Set(
      (product.markets || []).map(
        (m) => m.divisionBn || m.division || "—"
      )
    )
  );

  return (
    <div className="bg-[#f2f7f4] min-h-screen py-8">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link
            href="/"
            className="hover:text-gray-800 transition-colors"
          >
            হোম
          </Link>

          <span>&gt;</span>

          <span>
            {product.categoryNameBn || product.category}
          </span>

          <span>&gt;</span>

          <span className="text-gray-800">
            {product.nameBn}
          </span>
        </nav>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl border border-gray-100 shadow-2xs flex-shrink: 0">
              {product.image || "🍚"}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {product.nameBn}
              </h1>

              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                প্রতি {unitName} •{" "}
                {product.categoryNameBn ||
                  product.category}
              </p>

              <p className="text-xs text-gray-600 mt-2 font-medium">
                গতকাল্যের তুলনায় আজ{" "}
                <span
                  className={
                    isUp
                      ? "text-red-600 font-bold"
                      : isDown
                      ? "text-emerald-600 font-bold"
                      : "text-gray-700"
                  }
                >
                  {isUp
                    ? "বেড়েছে"
                    : isDown
                    ? "কমেছে"
                    : "অপরিবর্তিত"}
                </span>{" "}
                • {toBengaliNumeral(priceDiff)} টাকা
              </p>
            </div>
          </div>

          <div className="bg-[#f8fbf9] border border-gray-100 rounded-2xl p-4 text-center min-w-[160px] self-stretch sm:self-auto flex flex-col justify-center">
            <span className="text-xs text-gray-500 block font-semibold mb-1">
              আজকের দাম
            </span>

            <span className="text-3xl font-extrabold text-gray-900 block">
              {toBengaliNumeral(product.today)}
            </span>

            <span className="text-xs text-gray-500 font-medium block mt-0.5">
              টাকা / {unitName}
            </span>

            <div
              className={`inline-flex items-center justify-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mt-2 mx-auto ${
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
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-2xs space-y-1">
              <span className="text-xs text-gray-500 font-medium">
                সর্বনিম্ন দাম
              </span>

              <div className="text-2xl font-extrabold text-emerald-600">
                {toBengaliNumeral(
                  lowestMarket?.minPrice ??
                    product.minPrice ??
                    product.today
                )}{" "}
                <span className="text-sm font-medium text-gray-700">
                  টাকা
                </span>
              </div>

              <p className="text-xs text-gray-400 font-medium truncate">
                {lowestMarket?.marketName ||
                  product.minPriceMarket ||
                  "সবচেয়ে কম দামের বাজার"}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-2xs space-y-1">
              <span className="text-xs text-gray-500 font-medium">
                সর্বাধিক দাম
              </span>

              <div className="text-2xl font-extrabold text-red-600">
                {toBengaliNumeral(
                  highestMarket?.maxPrice ??
                    product.maxPrice ??
                    product.today
                )}{" "}
                <span className="text-sm font-medium text-gray-700">
                  টাকা
                </span>
              </div>

              <p className="text-xs text-gray-400 font-medium truncate">
                {highestMarket?.marketName ||
                  product.maxPriceMarket ||
                  "সবচেয়ে বেশি দামের বাজার"}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-2xs space-y-1">
              <span className="text-xs text-gray-500 font-medium">
                গড় দাম
              </span>

              <div className="text-2xl font-extrabold text-emerald-600">
                {toBengaliNumeral(
                  product.avgPrice ?? overallAverage
                )}{" "}
                <span className="text-sm font-medium text-gray-700">
                  টাকা
                </span>
              </div>

              <p className="text-xs text-gray-400 font-medium">
                প্রতি {unitName}-এর হিসাব
              </p>
            </div>
          </div>
        </div>

        {/* Outer Card Container with Shadow & Padding */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">
              বাজারভিত্তিক আজকের দাম
            </h2>

            {divisions.length > 0 && (
              <select
                value={selectedDivision}
                onChange={(e) =>
                  setSelectedDivision(e.target.value)
                }
                className="text-xs border border-gray-300 bg-gray-50 text-gray-700 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#00a651]"
              >
                <option value="all">
                  সকল বিভাগ (
                  {toBengaliNumeral(
                    product.markets?.length || 0
                  )}
                  )
                </option>

                {divisions.map((div, i) => (
                  <option key={i} value={div}>
                    {div}
                  </option>
                ))}
              </select>
            )}
          </div>

  
          <div className="overflow-x-auto rounded-2xl border border-gray-300/60 bg-white">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-400 text-gray-500 font-semibold text-xs pb-3">
                  <th className="py-3 px-3">বাজার</th>
                  <th className="py-3 px-3">বিভাগ</th>
                  <th className="py-3 px-3 text-right">সর্বনিম্ন</th>
                  <th className="py-3 px-3 text-right">সর্বাধিক</th>
                  <th className="py-3 px-3 text-right">গড়</th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-gray-800/80 font-medium text-gray-800">
                {filteredMarkets.length > 0 ? (
                  filteredMarkets.map((m, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-[#f2f5f3]"
                      } hover:bg-gray-200/60 transition-colors`}
                    >
                      <td className="py-3.5 px-3 font-bold text-gray-900">
                        {m.marketName}
                      </td>
                      <td className="py-3.5 px-3 text-gray-500">
                        {m.division}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {toBengaliNumeral(m.minPrice)} টাকা
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {toBengaliNumeral(m.maxPrice)} টাকা
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-gray-900">
                        {toBengaliNumeral(m.avgPrice)} টাকা
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-400 text-xs bg-white"
                    >
                      কোনো বাজার পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

const DetailSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 py-12 space-y-6 animate-pulse">
    <div className="h-6 w-48 bg-gray-200 rounded-md"></div>

    <div className="h-40 bg-gray-200/80 rounded-3xl"></div>

    <div className="h-28 bg-gray-200/80 rounded-2xl"></div>

    <div className="h-64 bg-gray-200/80 rounded-2xl"></div>
  </div>
);

export default function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ProductDetailContent params={props.params} />
    </Suspense>
  );
}