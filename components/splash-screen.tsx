'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const visited = localStorage.getItem('marketera_intro');

    if (visited) {
      onFinish();
      return;
    }

    localStorage.setItem('marketera_intro', 'true');

    let value = 0;

    const interval = setInterval(() => {
      value += Math.floor(Math.random() * 12) + 4;

      if (value >= 100) {
        value = 100;
        clearInterval(interval);

        setTimeout(() => {
          onFinish();
        }, 700);
      }

      setProgress(value);
    }, 120);

    return () => clearInterval(interval);
  }, [onFinish]);

  const getMessage = () => {
    if (progress < 30) return 'Initializing AI...';
    if (progress < 70) return 'Preparing Marketing Engine...';
    return 'Launching Marketera AI...';
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2563eb22,transparent_70%)]" />

        <motion.div
          className="text-center"
          initial={{ scale: .7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: .8 }}
        >
          <motion.div
            animate={{
              rotate: [0, 8, -8, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: 2
            }}
            className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 text-5xl font-black text-white shadow-[0_0_60px_#2563eb]"
          >
            M
          </motion.div>

          <motion.h1
            initial={{ opacity:0,y:20 }}
            animate={{ opacity:1,y:0 }}
            className="mb-3 text-5xl font-black text-white"
          >
            Welcome to
          </motion.h1>

          <motion.h2
            initial={{ opacity:0,y:20 }}
            animate={{ opacity:1,y:0 }}
            transition={{ delay:.2 }}
            className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-6xl font-black text-transparent"
          >
            Marketera AI
          </motion.h2>

          <motion.p
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:.5 }}
            className="mt-5 text-lg text-gray-400"
          >
            {getMessage()}
          </motion.p>

          <div className="mx-auto mt-10 h-3 w-80 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"
              animate={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-4 text-sm text-gray-500">
            {progress}%
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}