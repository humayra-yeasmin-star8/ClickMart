"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session?.user, router]);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();
      if (error) {
        alert("সাইন আউট করতে সমস্যা হয়েছে!");
        setSigningOut(false);
        return;
      }
      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign-out error:", error);
      alert("সাইন আউট করতে সমস্যা হয়েছে!");
      setSigningOut(false);
    }
  };

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen bg-[#f2f7f4] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#00a651] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f7f4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center font-bold text-gray-600 text-xl border border-gray-200 flex-shrink-0">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                session.user.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {session.user.name || "ইউজার"}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {session.user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-2 border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors self-stretch sm:self-auto justify-center disabled:opacity-50"
          >
            <span>↩</span>
            {signingOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">তথ্য পরিবর্তন করুন</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              আপনার নাম আপডেট করতে নিচের বাটনে ক্লিক করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/profile/update")}
            className="bg-[#00a651] hover:bg-[#008f45] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs"
          >
            আপডেট করুন
          </button>
        </div>
      </div>
    </div>
  );
}