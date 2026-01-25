"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "../shared";
import { PricingCard } from "./PricingCard";

type BillingPeriod = "monthly" | "annual";

const freeFeatures = [
  { name: "Immersive, Play & Explore modes", included: true },
  { name: "3 harmony types", included: true },
  { name: "Basic exports (CSS, JSON)", included: true },
  { name: "WCAG AA contrast checker", included: true },
  { name: "URL sharing", included: true },
  { name: "5 saved palettes", included: true },
  { name: "3 image extractions/session", included: true },
  { name: "Context, Mood & Gradient modes", included: false },
  { name: "Ad-free experience", included: false },
];

const proFeatures = [
  { name: "All 6 palette modes", included: true },
  { name: "All 6 harmony types", included: true },
  { name: "All 9 export formats", included: true },
  { name: "WCAG AAA + 5 blindness modes", included: true },
  { name: "URL sharing", included: true },
  { name: "Unlimited saved palettes", included: true },
  { name: "Unlimited image extractions", included: true },
  { name: "AI-powered generation", included: true },
  { name: "Ad-free experience", included: true },
];

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("annual");

  const monthlyPrice = "$5";
  const annualPrice = "$3";
  const annualTotal = "$36";

  return (
    <SectionWrapper id="pricing" className="bg-card/30">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Simple,{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              transparent pricing.
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Start free, upgrade when you&apos;re ready.
          </motion.p>
        </div>

        {/* Billing toggle */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 p-1 rounded-full bg-secondary">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingPeriod === "monthly"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annual")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                billingPeriod === "annual"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                Save 40%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <PricingCard
            name="Free"
            description="Perfect for trying out HueGo and casual use."
            price={null}
            features={freeFeatures}
            ctaText="Start Free"
            ctaHref="/immersive"
            index={0}
          />
          <PricingCard
            name="Pro"
            description="For designers and developers who need the full toolkit."
            price={billingPeriod === "monthly" ? monthlyPrice : annualPrice}
            priceNote={
              billingPeriod === "annual"
                ? `Billed ${annualTotal}/year. Save $24!`
                : undefined
            }
            features={proFeatures}
            ctaText="Go Pro"
            ctaHref="/immersive"
            highlighted
            index={1}
          />
        </div>

        {/* Trust note */}
        <motion.p
          className="text-center text-sm text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Secure payment via Stripe. Cancel anytime.
        </motion.p>
      </div>
    </SectionWrapper>
  );
}
