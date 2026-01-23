"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsPremium, useSubscriptionStore } from "@/store/subscription";
import { redirectToCheckout } from "@/lib/stripe-client";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BillingPeriod = "monthly" | "annual";

const features = [
  { name: "Palette Modes", free: "2 (Immersive, Play)", premium: "All 4" },
  { name: "Harmony Types", free: "3 basic", premium: "All 6" },
  { name: "URL Sharing", free: true, premium: true },
  { name: "Save Palettes", free: "5 max", premium: "Unlimited" },
  { name: "Basic Exports (CSS, JSON)", free: true, premium: true },
  { name: "Pro Exports (SCSS, Tailwind, SVG, PNG)", free: false, premium: true },
  { name: "WCAG Contrast (AA)", free: true, premium: true },
  { name: "WCAG Contrast (AAA) + Full Blindness", free: false, premium: true },
  { name: "Image Color Extraction", free: "3/session", premium: "Unlimited" },
  { name: "Gradient Generation", free: false, premium: true },
  { name: "Ad-Free Experience", free: false, premium: true },
];

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const isPremium = useIsPremium();
  const { customerId } = useSubscriptionStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annual");

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingPeriod }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        redirectToCheckout(data.url);
      } else {
        setError(data.error || "Failed to start checkout");
      }
    } catch (err) {
      setError("Failed to connect to payment service");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!customerId) return;

    setLoading(true);
    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError("Failed to open subscription management");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[500px] md:max-h-[85vh] bg-zinc-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">
                {isPremium ? "Your Subscription" : "Upgrade to Premium"}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {isPremium ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    You&apos;re on Premium!
                  </h3>
                  <p className="text-zinc-400 mb-6">
                    Thanks for supporting HueGo. You have access to all features.
                  </p>
                  {customerId && (
                    <button
                      onClick={handleManageSubscription}
                      disabled={loading}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                    >
                      Manage Subscription
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Billing Period Toggle */}
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center gap-2 p-1 rounded-full bg-zinc-800">
                      <button
                        onClick={() => setBillingPeriod("monthly")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          billingPeriod === "monthly"
                            ? "bg-white text-zinc-900"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingPeriod("annual")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                          billingPeriod === "annual"
                            ? "bg-white text-zinc-900"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        Annual
                        <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                          Save 40%
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Pricing Card */}
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-6 mb-6 border border-amber-500/30">
                    <div className="flex items-baseline gap-1 mb-2">
                      {billingPeriod === "monthly" ? (
                        <>
                          <span className="text-4xl font-bold text-white">$5</span>
                          <span className="text-zinc-400">/month</span>
                        </>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-white">$36</span>
                          <span className="text-zinc-400">/year</span>
                          <span className="ml-2 text-sm text-green-400">($3/month)</span>
                        </>
                      )}
                    </div>
                    <p className="text-zinc-300 text-sm">
                      {billingPeriod === "annual"
                        ? "Best value! Save $24/year with annual billing."
                        : "Unlock all premium features and support indie development."}
                    </p>
                  </div>

                  {/* Feature Comparison */}
                  <div className="space-y-3">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
                      >
                        <span className="text-sm text-zinc-300">{feature.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-zinc-500 w-16 text-center">
                            {typeof feature.free === "boolean" ? (
                              feature.free ? (
                                <svg
                                  className="w-4 h-4 text-green-500 mx-auto"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg
                                  className="w-4 h-4 text-zinc-600 mx-auto"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              )
                            ) : (
                              feature.free
                            )}
                          </span>
                          <span className="text-xs text-amber-500 font-medium w-16 text-center">
                            {typeof feature.premium === "boolean" ? (
                              <svg
                                className="w-4 h-4 text-amber-500 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              feature.premium
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            {!isPremium && (
              <div className="p-4 border-t border-zinc-800">
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Upgrade to Premium
                    </>
                  )}
                </button>
                <p className="text-xs text-zinc-500 text-center mt-3">
                  Cancel anytime. Secure payment via Stripe.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
