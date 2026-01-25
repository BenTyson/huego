"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "../shared";
import { PromptDemo } from "./PromptDemo";

export function AIFeature() {
  return (
    <SectionWrapper className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Describe it.{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Generate it.
            </span>
          </motion.h2>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Tell HueGo what you&apos;re building, and get a perfect palette in
            seconds. From &quot;cozy coffee shop&quot; to &quot;futuristic
            SaaS&quot;, we&apos;ve got you covered.
          </motion.p>
        </div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <PromptDemo />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
