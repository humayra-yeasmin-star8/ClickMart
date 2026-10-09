"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Form, TextField, Label, Input, Button } from "@heroui/react";

export default function ProfilePage() {
const { data: session, isPending } = authClient.useSession();

const [name, setName] = useState<string | null>(null);
const [updating, setUpdating] = useState(false);
const [signingOut, setSigningOut] = useState(false);

const router = useRouter();

// Fallback for cases where the client discovers an invalid session.
useEffect(() => {
if (!isPending && !session?.user) {
router.replace("/signin");
}
}, [isPending, session?.user, router]);

const displayName = name ?? session?.user?.name ?? "";

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

const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();


if (updating) return;

const trimmedName = displayName.trim();

if (!trimmedName) {
  alert("আপনার নাম লিখুন!");
  return;
}

setUpdating(true);

try {
  const { error } = await authClient.updateUser({
    name: trimmedName,
  });

  if (error) {
    alert("নাম আপডেট করা যায়নি! আবার চেষ্টা করুন।");
    return;
  }

  setName(trimmedName);
  alert("নাম সফলভাবে আপডেট করা হয়েছে!");
  router.refresh();
} catch (error) {
  console.error("Profile update error:", error);
  alert("আপডেট করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।");
} finally {
  setUpdating(false);
}


};

if (isPending || !session?.user) {
return ( <div className="min-h-screen bg-[#f2f7f4] flex justify-center items-center"> <div className="w-8 h-8 border-4 border-[#00a651] border-t-transparent rounded-full animate-spin" /> </div>
);
}

return ( <div className="min-h-screen bg-[#f2f7f4] py-10 px-4 sm:px-6 lg:px-8"> <div className="max-w-2xl mx-auto space-y-6"> <div> <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
আমার প্রোফাইল </h1> <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন। </p> </div>


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

    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-5">
      <h3 className="text-base font-bold text-gray-900">তথ্য</h3>

      <Form onSubmit={handleUpdate} className="space-y-4">
        <TextField name="name" isRequired className="space-y-1.5">
          <Label className="text-xs font-bold text-gray-800">
            নাম
          </Label>

          <Input
            value={displayName}
            onChange={(value) =>
              setName(typeof value === "string" ? value : "")
            }
            className="w-full px-4 py-3 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a651] focus:bg-white transition-all"
          />
        </TextField>

        <Button
          type="submit"
          isDisabled={updating}
          className="w-full bg-[#00a651] hover:bg-[#008f45] text-white font-bold py-3 px-4 rounded-xl shadow-2xs transition-all duration-200 disabled:opacity-50"
        >
          {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
        </Button>
      </Form>
    </div>
  </div>
</div>


);
}
