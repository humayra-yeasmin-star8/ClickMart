
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
  console.log("Session user:", session?.user);
console.log("Profile image:", session?.user?.image);
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
      setDate(
        new Date().toLocaleDateString("bn-BD", {
          dateStyle: "full",
        })
      );
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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-2xl bg-[#16A34A] p-2.5 shadow-sm">
              <Image
                src={logo}
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
                alt="Logo"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-bold leading-tight text-black">
                বাজার দর
              </span>
              <span className="text-xs text-gray-500">{date}</span>
            </div>
          </Link>

          <div
            className="relative flex items-center gap-4"
            ref={dropdownRef}
          >
            {isPending ? (
              <div className="h-9 w-24 animate-pulse rounded-xl bg-gray-100" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-50 focus:outline-none"
                >
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-200 text-sm font-bold text-gray-600">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
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

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
                    <div className="mb-3 border-b border-gray-100 pb-3">
                      <p className="text-sm font-bold leading-tight text-gray-900">
                        {session.user.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {session.user.email}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <span className="text-sm">👤</span>
                        আমার প্রোফাইল
                      </Link>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
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
                  className="text-sm font-semibold text-gray-800 transition-colors hover:text-gray-900"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="rounded-xl bg-[#00a651] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#008f45]"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NavLinks />
        </div>
      </div>

      <PriceTicker />
    </header>
  );
};

export default Navbar;