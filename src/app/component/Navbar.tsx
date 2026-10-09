"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "/logo-icon.png";
import NavLinks from "./NavLinks";
import PriceTicker from "./PriceTicker";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [date, setDate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
          router.refresh();
        },
      },
    });
  };

  useEffect(() => {
    const updateDate = () => {
      const currentDate = new Date().toLocaleDateString("bn-BD", {
        dateStyle: "full",
      });
      setDate(currentDate);
    };

    updateDate();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
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

          {/* User Auth Section */}
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            {isPending ? (
              <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-xl" />
            ) : session?.user ? (
              <div className="relative">
               
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      session.user.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {session.user.name || "ইউজার"}
                  </span>
                  <span className="text-xs text-gray-500">▾</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="border-b border-gray-100 pb-3 mb-3">
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {session.user.email}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <span className="text-sm">👤</span>
                        আমার প্রোফাইল
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <span className="text-sm">↩</span>
                        সাইন আউট
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              
              <>
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
              </>
            )}
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