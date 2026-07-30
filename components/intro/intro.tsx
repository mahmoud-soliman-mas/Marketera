"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

interface IntroProps {
  onFinish: () => void;
}

export default function Intro({ onFinish }: IntroProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 8000); // 8 ثوانٍ

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
    >
      <h1 className="text-white text-5xl font-bold">
        Marketera AI
      </h1>

      <button
        onClick={onFinish}
        className="absolute bottom-10 right-10 rounded-lg border border-white px-5 py-2 text-white hover:bg-white hover:text-black transition"
      >
        Skip Intro
      </button>
    </motion.div>
  );
}