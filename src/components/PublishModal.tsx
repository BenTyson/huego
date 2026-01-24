"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useColors } from "@/store/palette";
import { useCommunityStore, usePublishCount } from "@/store/community";
import { useIsPremium } from "@/store/subscription";
import { getFingerprint, getAuthorDisplayName, setAuthorDisplayName } from "@/lib/fingerprint";
import { MOOD_TAGS } from "@/lib/community-types";
import { FREE_PUBLISH_LIMIT } from "@/lib/feature-limits";
import { LoadingSpinner } from "./ui/LoadingSpinner";
import { CloseButton } from "./ui/CloseButton";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
  onShowToast?: (message: string) => void;
}

export function PublishModal({ isOpen, onClose, onUpgradeClick, onShowToast }: PublishModalProps) {
  const colors = useColors();
  const isPremium = useIsPremium();
  const publishCount = usePublishCount();
  const { incrementPublishCount } = useCommunityStore();

  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState(getAuthorDisplayName() || "");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPublish = isPremium || publishCount < FREE_PUBLISH_LIMIT;
  const remainingPublishes = FREE_PUBLISH_LIMIT - publishCount;

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 5
        ? [...prev, tag]
        : prev
    );
  }, []);

  const handlePublish = useCallback(async () => {
    if (!canPublish) {
      onUpgradeClick?.();
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const fingerprint = getFingerprint();

      // Save author name if provided
      if (authorName.trim()) {
        setAuthorDisplayName(authorName.trim());
      }

      const response = await fetch("/api/community/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colors,
          title: title.trim() || null,
          author_display_name: authorName.trim() || null,
          mood_tags: selectedTags.length > 0 ? selectedTags : null,
          fingerprint,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to publish");
      }

      const data = await response.json();

      if (data.success) {
        incrementPublishCount();
        onShowToast?.("Palette published!");
        onClose();

        // Reset form
        setTitle("");
        setSelectedTags([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  }, [
    canPublish,
    colors,
    title,
    authorName,
    selectedTags,
    onUpgradeClick,
    onShowToast,
    onClose,
    incrementPublishCount,
  ]);

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
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Publish to Community</h2>
              <CloseButton onClick={onClose} />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Palette Preview */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Your Palette</label>
                <div className="h-16 rounded-xl overflow-hidden flex shadow-lg">
                  {colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 flex items-center justify-center"
                      style={{ backgroundColor: color.hex }}
                    >
                      <span
                        className="text-xs font-mono opacity-80"
                        style={{ color: color.contrastColor === "white" ? "#fff" : "#000" }}
                      >
                        {color.hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Name <span className="text-white/30">(optional)</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give your palette a name..."
                  maxLength={50}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              {/* Author Name Input */}
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Your Name <span className="text-white/30">(optional)</span>
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="How should we credit you?"
                  maxLength={30}
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Tags <span className="text-white/30">(up to 5)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOOD_TAGS.map((tag) => (
                    <button
                      key={tag}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-white text-zinc-900"
                          : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Publish limit warning for free users */}
              {!isPremium && (
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">
                      {canPublish
                        ? `${remainingPublishes} free ${remainingPublishes === 1 ? "publish" : "publishes"} remaining`
                        : "Free publish limit reached"}
                    </span>
                    {!canPublish && (
                      <button
                        className="text-sm font-medium text-white hover:underline"
                        onClick={onUpgradeClick}
                      >
                        Upgrade to Pro
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                className="px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                onClick={onClose}
              >
                Cancel
              </button>
              <motion.button
                className={`px-6 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  canPublish
                    ? "bg-white text-zinc-900 hover:bg-white/90"
                    : "bg-white/20 text-white"
                }`}
                onClick={handlePublish}
                disabled={isPublishing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isPublishing ? (
                  <>
                    <LoadingSpinner size="sm" variant="dark" />
                    Publishing...
                  </>
                ) : canPublish ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                    </svg>
                    Publish
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    Upgrade to Publish
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
