"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubscriptionStore } from "@/store/subscription";
import { motion } from "framer-motion";

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

    // Fetch subscription details from our API
    async function verifySubscription() {
      try {
        const response = await fetch(`/api/subscription?session_id=${sessionId}`);
        const data = await response.json();

        if (response.ok && data.isPremium) {
          // Update local subscription state
          setSubscription({
            isPremium: true,
            status: data.status,
            subscriptionId: data.subscriptionId,
            customerId: data.customerId,
            currentPeriodEnd: data.currentPeriodEnd,
          });
          setStatus("success");

          // Redirect to app after 3 seconds
          setTimeout(() => {
            router.push("/immersive");
          }, 3000);
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 text-center"
      >
        {status === "loading" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-zinc-800 animate-pulse" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Verifying your subscription...
            </h1>
            <p className="text-zinc-400">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to Premium!
            </h1>
            <p className="text-zinc-400 mb-6">
              Your subscription is now active. Enjoy unlimited saves, all export formats, and an ad-free experience.
            </p>
            <p className="text-sm text-zinc-500">
              Redirecting you back to HueGo...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-zinc-400 mb-6">
              We couldn&apos;t verify your subscription. Please contact support if you were charged.
            </p>
            <button
              onClick={() => router.push("/immersive")}
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors"
            >
              Return to HueGo
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-zinc-800 animate-pulse" />
        <h1 className="text-2xl font-bold text-white mb-2">Loading...</h1>
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
