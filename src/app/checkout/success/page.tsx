"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubscriptionStore } from "@/store/subscription";
import { motion } from "framer-motion";

const BRAND_COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { setSubscription } = useSubscriptionStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    async function verifySubscription() {
      try {
        const response = await fetch(`/api/subscription?session_id=${sessionId}`);
        const data = await response.json();

        if (response.ok && data.isPremium) {
          setSubscription({
            isPremium: true,
            status: data.status,
            subscriptionId: data.subscriptionId,
            customerId: data.customerId,
            currentPeriodEnd: data.currentPeriodEnd,
          });
          setStatus("success");
          setTimeout(() => router.push("/immersive"), 3000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Failed to verify subscription:", error);
        setStatus("error");
      }
    }

    verifySubscription();
  }, [sessionId, setSubscription, router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full text-center"
      >
        {status === "loading" && (
          <>
            <div className="flex gap-1 justify-center mb-8">
              {BRAND_COLORS.map((color, i) => (
                <motion.div
                  key={i}
                  className="w-8 h-16 rounded-lg"
                  style={{ backgroundColor: color }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
            <p className="text-zinc-400">Activating your account...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex gap-1 justify-center mb-8">
              {BRAND_COLORS.map((color, i) => (
                <motion.div
                  key={i}
                  className="w-8 h-16 rounded-lg"
                  style={{ backgroundColor: color }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", delay: i * 0.08 }}
                />
              ))}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              You&apos;re all set
            </h1>
            <p className="text-zinc-400 mb-8">
              Unlimited saves. All exports. No ads.
            </p>
            <motion.button
              onClick={() => router.push("/immersive")}
              className="px-6 py-3 bg-white text-zinc-900 rounded-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start creating
            </motion.button>
            <p className="text-xs text-zinc-600 mt-4">
              Redirecting automatically...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex gap-1 justify-center mb-8 opacity-30">
              {BRAND_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="w-8 h-16 rounded-lg"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-zinc-400 mb-6">
              We couldn&apos;t verify your subscription. Contact support if you were charged.
            </p>
            <motion.button
              onClick={() => router.push("/immersive")}
              className="px-6 py-3 bg-zinc-800 text-white rounded-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Return to HueGo
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="flex gap-1">
        {BRAND_COLORS.map((color, i) => (
          <div
            key={i}
            className="w-8 h-16 rounded-lg animate-pulse"
            style={{ backgroundColor: color, opacity: 0.4 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
