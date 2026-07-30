"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import IntroScene from "./introscene";

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
    <motion.div className="relative min-h-screen">
      <IntroScene />

      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white tracking-widest">
          MARKETERA AI
        </h1>
      </div>

      <button
        onClick={onFinish}
        className="absolute bottom-8 right-8 rounded-lg border border-white/30 bg-black/30 px-5 py-2 text-white backdrop-blur-md hover:bg-white hover:text-black transition"
      >
        Skip Intro
      </button>
    </motion.div>
  );
}