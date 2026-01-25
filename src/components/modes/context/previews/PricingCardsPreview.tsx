"use client";

import { motion } from "framer-motion";
import type { Color } from "@/lib/types";
import type { PreviewTheme } from "../PreviewTypeSelector";
import { getPreviewColors } from "../previewUtils";

interface PricingCardsPreviewProps {
  colors: Color[];
  theme: PreviewTheme;
}

export function PricingCardsPreview({ colors, theme }: PricingCardsPreviewProps) {
  const {
    primary,
    secondary,
    accent,
    background,
    surface,
    textPrimary,
    textSecondary,
    surfaceText,
    surfaceTextMuted,
    border,
  } = getPreviewColors(colors, theme);

  const plans = [
    {
      name: "Basic",
      price: "$9",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Up to 5 projects",
        "Basic analytics",
        "24/7 support",
        "1GB storage",
      ],
      highlighted: false,
      buttonColor: secondary,
      buttonText: "Get Started",
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Best for professionals",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "10GB storage",
        "API access",
        "Custom domains",
      ],
      highlighted: true,
      buttonColor: primary,
      buttonText: "Start Free Trial",
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "SSO integration",
        "Dedicated support",
        "Custom contracts",
      ],
      highlighted: false,
      buttonColor: accent,
      buttonText: "Contact Sales",
    },
  ];

  return (
    <motion.div
      className="w-full h-full rounded-xl overflow-auto shadow-2xl p-6 md:p-8"
      style={{ backgroundColor: background }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: textPrimary }}>
          Choose Your Plan
        </h2>
        <p className="text-base" style={{ color: textSecondary }}>
          Start free, upgrade when you need
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            className="relative rounded-2xl overflow-hidden"
            style={{
              backgroundColor: surface,
              border: plan.highlighted ? `2px solid ${primary}` : `1px solid ${border}`,
              transform: plan.highlighted ? "scale(1.02)" : "scale(1)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            {/* Badge */}
            {plan.badge && (
              <div
                className="absolute top-0 right-0 px-3 py-1 text-xs font-semibold text-white rounded-bl-lg"
                style={{ backgroundColor: primary }}
              >
                {plan.badge}
              </div>
            )}

            <div className="p-6">
              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1" style={{ color: surfaceText }}>
                  {plan.name}
                </h3>
                <p className="text-sm" style={{ color: surfaceTextMuted }}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: surfaceText }}>
                  {plan.price}
                </span>
                <span className="text-sm" style={{ color: surfaceTextMuted }}>
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={plan.buttonColor}
                      strokeWidth="2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span style={{ color: surfaceText }}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className="w-full py-3 rounded-lg font-medium text-white transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: plan.buttonColor }}
              >
                {plan.buttonText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <motion.p
        className="text-center text-sm mt-8"
        style={{ color: textSecondary }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        All plans include 14-day free trial. No credit card required.
      </motion.p>
    </motion.div>
  );
}
