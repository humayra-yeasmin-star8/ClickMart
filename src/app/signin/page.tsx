"use client";

import React, { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
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

const Signinpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading || socialLoading) return;

    if (!email.trim() || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড লিখুন!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn.email({
        email: email.trim(),
        password,
        rememberMe: true,
        callbackURL: "/",
      });

    if (error) {
  const code = error.code?.toUpperCase() ?? "";

  if (code === "INVALID_EMAIL") {
    toast.error("সঠিক ইমেইল ঠিকানা লিখুন!");
  } else if (code === "INVALID_PASSWORD") {
    toast.error("পাসওয়ার্ড ভুল হয়েছে!");
  } else if (code === "INVALID_EMAIL_OR_PASSWORD") {
    toast.error("ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে!");
  } else {
    toast.error("সাইন ইন করতে সমস্যা হয়েছে!");
  }

  return;
}

      toast.success("সফলভাবে সাইন ইন হয়েছে!");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign-in error:", error);
      toast.error("সাইন ইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন!");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    if (loading || socialLoading) return;

    setSocialLoading(provider);

    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          provider === "google"
            ? "Google দিয়ে সাইন ইন করা যায়নি!"
            : "GitHub দিয়ে সাইন ইন করা যায়নি!"
        );
        setSocialLoading("");
      }
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      toast.error("সাইন ইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন!");
      setSocialLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f4] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        closeOnClick
        pauseOnHover
      />

      <div className="text-center mb-8 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          সাইন ইন
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-gray-100/80">
        <Form onSubmit={onSubmit} className="space-y-5">
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
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a651] focus:bg-white transition-all"
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
              type="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00a651] focus:bg-white transition-all"
            />
            <FieldError className="text-xs text-red-500 font-medium" />
          </TextField>

          <Button
            type="submit"
            isDisabled={loading || !!socialLoading}
            className="w-full bg-[#00a651] hover:bg-[#008f45] text-white font-bold py-3.5 px-4 rounded-xl shadow-xs transition-all duration-200 mt-2"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
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
            disabled={loading || !!socialLoading}
            onClick={() => handleSocialSignIn("google")}
            className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors disabled:opacity-50"
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
            {socialLoading === "google" ? "অপেক্ষা করুন..." : "Google"}
          </button>

          <button
            type="button"
            disabled={loading || !!socialLoading}
            onClick={() => handleSocialSignIn("github")}
            className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0 fill-gray-900" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {socialLoading === "github" ? "অপেক্ষা করুন..." : "GitHub"}
          </button>
        </div>

        <div className="text-center mt-6 text-xs text-gray-600 font-medium">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="text-[#00a651] font-bold hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
};

export default Signinpage;