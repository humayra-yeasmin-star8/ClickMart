
import Link from "next/link";

const NotFound = () => {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f2f7f4] px-6 py-16 text-center">
      {/* Decorative background shapes */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#00a651]/5 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#00a651]/10 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        <p className="text-8xl font-black tracking-tight text-[#00a651] sm:text-9xl">
          404
        </p>

        <div className="my-6 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg shadow-green-900/5 sm:h-40 sm:w-40">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            className="h-20 w-20 text-[#00a651] sm:h-24 sm:w-24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 7H6"
            />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
            <path
              strokeLinecap="round"
              d="M11 10.5a1 1 0 0 1 2 0c0 1-1 1-1 2"
            />
            <circle cx="12" cy="14.5" r=".25" fill="currentColor" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
          দুঃখিত! আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে,
          ঠিকানা পরিবর্তন হয়েছে অথবা পেজটি আর উপলব্ধ নেই।
        </p>

        <div className="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00a651] px-7 py-3.5 font-bold text-white shadow-lg shadow-green-700/20 transition hover:-translate-y-0.5 hover:bg-[#008f45] sm:w-auto"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3 10 9-7 9 7M5 9v11h14V9M9 20v-6h6v6"
              />
            </svg>
            হোম পেজে ফিরে যান
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-green-200 bg-white px-7 py-3.5 font-bold text-[#008f45] transition hover:border-[#00a651] hover:bg-green-50"
          >
            কেনাকাটা চালিয়ে যান →
          </Link>
        </div>

        <p className="mt-10 text-xs font-medium tracking-wide text-gray-400">
          DAILY MART · আপনার প্রতিদিনের বাজার
        </p>
      </div>
    </main>
  );
};

export default NotFound;