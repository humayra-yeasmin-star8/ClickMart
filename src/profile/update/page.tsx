"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Form, TextField, Label, Input, Button } from "@heroui/react";

export default function UpdateProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [name, setName] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fall back to session user name if local state hasn't been modified yet
  const currentName = name ?? session?.user?.name ?? "";

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (updating) return;

    const trimmedName = currentName.trim();
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

      alert("তথ্য সফলভাবে আপডেট করা হয়েছে!");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
      alert("আপডেট করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।");
    } finally {
      setUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f2f7f4] flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#00a651] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    router.replace("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f2f7f4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            তথ্য আপডেট করুন
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            আপনার নাম পরিবর্তন করে আপডেট করুন।
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-5">
          <Form onSubmit={handleUpdate} className="space-y-4">
            <TextField name="name" isRequired className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-800">নাম</Label>
              <Input
                value={currentName}
                onChange={(e: React.ChangeEvent<HTMLInputElement> | string) =>
                  setName(typeof e === "string" ? e : e.target.value)
                }
                placeholder="আপনার নাম লিখুন"
                className="w-full px-4 py-3 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a651] focus:bg-white transition-all"
              />
            </TextField>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={() => router.push("/profile")}
                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all"
              >
                বাতিল করুন
              </Button>
              <Button
                type="submit"
                isDisabled={updating}
                className="w-1/2 bg-[#00a651] hover:bg-[#008f45] text-white font-bold py-3 px-4 rounded-xl shadow-2xs transition-all duration-200 disabled:opacity-50"
              >
                {updating ? "আপডেট হচ্ছে..." : "Update Information"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}