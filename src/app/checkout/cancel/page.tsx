"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-zinc-800 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Checkout Canceled
        </h1>
        <p className="text-zinc-400 mb-6">
          No worries! You can continue using HueGo for free, or upgrade to Premium anytime.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/immersive")}
            className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors"
          >
            Continue to HueGo
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}
