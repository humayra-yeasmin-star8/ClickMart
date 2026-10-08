import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#f8fbf9] border-t border-gray-200/80 py-6 text-xs sm:text-sm text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">

        <p className="font-medium">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

    
        <p className="text-gray-500">
          সকল দাম সম্ভাব্য; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
};

export default Footer;