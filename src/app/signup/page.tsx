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

  const LOGIN = async () => {
    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google sign-in failed!");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google দিয়ে সাইন ইন করা যায়নি!");
    }
  };

  const LOG = async () => {
    try {
      const { error } = await signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (error) {
        console.error("GitHub sign-in error:", error);
        toast.error(error.message || "GitHub sign-in failed!");
      }
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      toast.error("GitHub দিয়ে সাইন ইন করা যায়নি!");
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
  onClick={LOGIN}
  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700"
>
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>

  Google দিয়ে চালিয়ে যান
</button>

         
<button
  type="button"
  onClick={LOG}
  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700"
>
  <svg
    className="w-4 h-4 shrink-0"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.455-1.157-1.11-1.466-1.11-1.466-.908-.621.069-.609.069-.609 1.004.07 1.532 1.031 1.532 1.031.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.684-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.823a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.203 2.393.1 2.646.64.7 1.028 1.593 1.028 2.684 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.337-.012 2.416-.012 2.744 0 .267.18.579.688.481A10.003 10.003 0 0 0 22 12c0-5.523-4.477-10-10-10Z"
    />
  </svg>

  GitHub দিয়ে চালিয়ে যান
</button>

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
    </div>
  );
};

export default Signupage;