"use client";

import { useEffect, useState } from "react";

export default function DateBadge() {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("bn-BD", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  if (!date) return null;

  return (
    <div className="inline-block bg-[#e2f0e8] text-[#16A34A] text-xs font-semibold px-3 py-1.5 rounded-full">
       {date}
    </div>
  );
}