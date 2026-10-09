"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from "@heroui/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signUp, signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const Signupage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড দুটি মিলছে না!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const name = String(formData.get("name") ?? "");
      const email = String(formData.get("email") ?? "");

      const { data, error } = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি!");
        return;
      }

      if (data) {
        toast.success("অ্যাকাউন্ট তৈরি সফল হয়েছে!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast.error("কিছু একটা সমস্যা হয়েছে! আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f4] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-gray-100/80">
        <Form onSubmit={onSubmit} className="space-y-5">
          <TextField isRequired name="name" className="space-y-1.5">
            <Label className="text-sm font-bold text-gray-800">নাম</Label>
            <Input
              placeholder="যেমন: রহিম উদ্দিন"
              className="w-full px-4 py-3 bg-gray-50/60 border border-gray-200 rounded-xl text-sm"
            />
            <FieldError className="text-xs text-red-500 font-medium" />
          </TextField>

          <TextField
            isRequired
            name="email"
            type="email"
            className="space-y-1.5"
          >
            <Label className="text-sm font-bold text-gray-800">
              ইমেইল
            </Label>
            <Input
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-gray-50/60 border border-gray-200 rounded-xl text-sm"
            />
            <FieldError className="text-xs text-red-500 font-medium" />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
            className="space-y-1.5"
            validate={(value) =>
              value.length < 8 ? "কমপক্ষে ৮ অক্ষরের হতে হবে" : null
            }
          >
            <Label className="text-sm font-bold text-gray-800">
              পাসওয়ার্ড
            </Label>
            <Input
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/60 border border-gray-200 rounded-xl text-sm"
            />
            <FieldError className="text-xs text-red-500 font-medium" />
          </TextField>

          <TextField
            isRequired
            name="confirmPassword"
            type="password"
            className="space-y-1.5"
          >
            <Label className="text-sm font-bold text-gray-800">
              পাসওয়ার্ড নিশ্চিত করুন
            </Label>
            <Input
              placeholder="আবার লিখুন"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/60 border border-gray-200 rounded-xl text-sm"
            />
            <FieldError className="text-xs text-red-500 font-medium" />
          </TextField>

          <Button
            type="submit"
            isDisabled={loading}
            className="w-full bg-[#00a651] hover:bg-[#008f45] text-white font-bold py-3.5 px-4 rounded-xl mt-2"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </Button>
        </Form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-xs text-gray-400 font-medium absolute">
            অথবা
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              signIn.social({ provider: "google", callbackURL: "/" })
            }
            className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700"
          >
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            type="button"
            onClick={() =>
              signIn.social({ provider: "github", callbackURL: "/" })
            }
            className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700"
          >
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <div className="text-center mt-6 text-xs text-gray-600 font-medium">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="text-[#00a651] font-bold hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-800 font-medium"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
};

export default Signupage;