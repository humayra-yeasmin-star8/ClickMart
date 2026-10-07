"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/logo-icon.png";
import NavLinks from "./NavLinks";
import PriceTicker from "./PriceTicker";

const Navbar = () => {
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const dt = new Date().toLocaleDateString("bn-BD", {
      dateStyle: "full",
    });
    setDate(dt);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-[#16A34A] p-2.5 rounded-2xl flex items-center justify-center shadow-sm">
              <Image
                src={logo}
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
                alt="Logo"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-black leading-tight">
                বাজার দর
              </span>
              <span className="text-xs text-gray-500">{date}</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="text-sm font-semibold text-gray-800 hover:text-gray-900 transition-colors"
            >
              সাইন ইন
            </Link>
            <Link
              href="/signup"
              className="bg-[#00a651] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:bg-[#008f45] transition-all duration-200"
            >
              সাইন আপ
            </Link>
          </div>
        </div>
      </div>

    
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavLinks />
        </div>
      </div>


      <PriceTicker />
    </header>
  );
};

export default Navbar;