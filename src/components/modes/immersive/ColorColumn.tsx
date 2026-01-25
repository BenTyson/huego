"use client";

import { useState, useCallback, useRef, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import type { Color } from "@/lib/types";
import { ShadePopover } from "@/components/ui/ShadePopover";
import { MIN_PALETTE_SIZE } from "@/lib/feature-limits";

interface ColorColumnProps {
  color: Color;
  index: number;
  isLocked: boolean;
  isSaved: boolean;
  totalColors: number;
  onToggleLock: () => void;
  onToggleSave: () => void;
  onRemove: () => void;
  onColorChange: (hex: string) => void;
  onShowInfo?: () => void;
  onReorder: (toIndex: number) => void;
  isActive: boolean;
}

export const ColorColumn = memo(function ColorColumn({
  color,
  index,
  isLocked,
  isSaved,
  totalColors,
  onToggleLock,
  onToggleSave,
  onRemove,
  onColorChange,
  onShowInfo,
  onReorder,
  isActive,
}: ColorColumnProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShades, setShowShades] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(color.hex);
      setCopied(true);
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [color.hex]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    colorInputRef.current?.click();
  }, []);

  const handleColorInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onColorChange(e.target.value);
    },
    [onColorChange]
  );

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (totalColors > MIN_PALETTE_SIZE) {
        onRemove();
      }
    },
    [onRemove, totalColors]
  );

  const handleToggleSave = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleSave();
    },
    [onToggleSave]
  );

  const handleShowShades = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShades((prev) => !prev);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      setIsDragging(false);

      // Calculate which column to swap with based on drag distance
      const columnWidth = columnRef.current?.offsetWidth || 200;
      const offsetColumns = Math.round(info.offset.x / columnWidth);

      if (offsetColumns !== 0) {
        const newIndex = Math.max(0, Math.min(totalColors - 1, index + offsetColumns));
        if (newIndex !== index) {
          onReorder(newIndex);
        }
      }
    },
    [index, totalColors, onReorder]
  );

  // Memoize text colors based on contrast color
  const { textColor, textColorMuted, bgHover, bgActive } = useMemo(
    () => ({
      textColor: color.contrastColor === "white" ? "#ffffff" : "#000000",
      textColorMuted:
        color.contrastColor === "white" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
      bgHover:
        color.contrastColor === "white" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
      bgActive:
        color.contrastColor === "white" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)",
    }),
    [color.contrastColor]
  );

  const canRemove = totalColors > MIN_PALETTE_SIZE;

  return (
    <motion.div
      ref={columnRef}
      className="relative flex-1 flex flex-col items-center justify-center cursor-pointer no-select"
      style={{ backgroundColor: color.hex }}
      layout
      layoutId={`color-column-${color.hex}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: isDragging ? 1.02 : 1,
        zIndex: isDragging ? 10 : 1,
        boxShadow: isDragging
          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          : "0 0 0 0 rgba(0, 0, 0, 0)",
        transition: { delay: index * 0.05, duration: 0.3 },
      }}
      drag="x"
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: isDragging ? 1.02 : 1.01 }}
      whileTap={{ scale: 0.99 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowShades(false);
      }}
      onClick={handleEditClick}
    >
      {/* Hidden color input */}
      <input
        ref={colorInputRef}
        type="color"
        value={color.hex}
        onChange={handleColorInput}
        className="sr-only"
        aria-label={`Edit color ${index + 1}`}
      />

      {/* Lock indicator - top right, always visible when locked */}
      <motion.div
        className="absolute top-16 right-4 md:top-20 md:right-6"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isLocked ? 0.9 : isHovered ? 0.4 : 0.15,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.button
          className="p-1.5 rounded-md transition-all"
          style={{
            backgroundColor: isLocked ? bgActive : isHovered ? bgHover : "transparent",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isLocked ? "Unlock color" : "Lock color"}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={textColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isLocked ? (
              <>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </>
            ) : (
              <>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </>
            )}
          </svg>
        </motion.button>
      </motion.div>

      {/* Color info - center content */}
      <motion.div
        className="flex flex-col items-center gap-2 md:gap-3"
        initial={false}
        animate={{
          opacity: isHovered || isActive ? 1 : 0.8,
          y: isHovered ? -5 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Hex code */}
        <motion.button
          className="text-lg md:text-2xl font-mono font-semibold tracking-wider px-3 py-1 rounded-lg transition-colors"
          style={{
            color: textColor,
            backgroundColor: isHovered ? bgHover : "transparent",
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? "Copied!" : color.hex}
        </motion.button>

        {/* Color name */}
        <motion.span
          className="text-xs md:text-sm font-medium opacity-70"
          style={{ color: textColorMuted }}
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0.6 }}
        >
          {color.name}
        </motion.span>

        {/* RGB values on hover */}
        <motion.div
          className="hidden md:flex gap-3 text-xs font-mono"
          style={{ color: textColorMuted }}
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isHovered ? 0.8 : 0,
            height: isHovered ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <span>R {color.rgb.r}</span>
          <span>G {color.rgb.g}</span>
          <span>B {color.rgb.b}</span>
        </motion.div>
      </motion.div>

      {/* Contextual Action Pill - appears on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute bottom-16 md:bottom-20 left-1/2 flex items-center gap-1 px-2 py-1.5 rounded-full backdrop-blur-xl border"
            style={{
              backgroundColor:
                color.contrastColor === "white"
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.08)",
              borderColor:
                color.contrastColor === "white"
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.1)",
            }}
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Remove color */}
            <ActionButton
              onClick={handleRemove}
              title={canRemove ? "Remove color" : "Minimum 2 colors"}
              disabled={!canRemove}
              textColor={textColor}
              bgHover={bgHover}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: canRemove ? 1 : 0.4 }}
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </ActionButton>

            {/* View shades */}
            <ActionButton
              onClick={handleShowShades}
              title="View shade scale"
              active={showShades}
              textColor={textColor}
              bgHover={bgHover}
              bgActive={bgActive}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" fillOpacity="0.3" />
              </svg>
            </ActionButton>

            {/* Save/favorite */}
            <ActionButton
              onClick={handleToggleSave}
              title={isSaved ? "Remove from saved" : "Save color"}
              active={isSaved}
              textColor={textColor}
              bgHover={bgHover}
              bgActive={bgActive}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={isSaved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </ActionButton>

            {/* Drag handle */}
            <motion.button
              className="p-1.5 rounded-md transition-all"
              style={{
                color: textColor,
                backgroundColor: "transparent",
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                dragControls.start(e);
              }}
              whileHover={{ scale: 1.1, backgroundColor: bgHover }}
              whileTap={{ scale: 0.95 }}
              title="Drag to reorder"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <circle cx="8" cy="6" r="2" />
                <circle cx="16" cy="6" r="2" />
                <circle cx="8" cy="12" r="2" />
                <circle cx="16" cy="12" r="2" />
                <circle cx="8" cy="18" r="2" />
                <circle cx="16" cy="18" r="2" />
              </svg>
            </motion.button>

            {/* Copy hex */}
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              title="Copy hex code"
              textColor={textColor}
              bgHover={bgHover}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </ActionButton>

            {/* Info */}
            {onShowInfo && (
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  onShowInfo();
                }}
                title="Color psychology info"
                textColor={textColor}
                bgHover={bgHover}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </ActionButton>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shade Popover */}
      <ShadePopover
        isOpen={showShades}
        onClose={() => setShowShades(false)}
        baseHex={color.hex}
        onSelectShade={(hex) => {
          onColorChange(hex);
          setShowShades(false);
        }}
      />

      {/* Bottom index indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono"
        style={{ color: textColorMuted }}
        initial={false}
        animate={{ opacity: isHovered ? 0.6 : 0.3 }}
      >
        {index + 1}
      </motion.div>
    </motion.div>
  );
});

// Action button subcomponent
interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  children: React.ReactNode;
  textColor: string;
  bgHover: string;
  bgActive?: string;
  active?: boolean;
  disabled?: boolean;
}

function ActionButton({
  onClick,
  title,
  children,
  textColor,
  bgHover,
  bgActive,
  active = false,
  disabled = false,
}: ActionButtonProps) {
  return (
    <motion.button
      className="p-1.5 rounded-md transition-all"
      style={{
        color: textColor,
        backgroundColor: active ? bgActive || bgHover : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.1, backgroundColor: disabled ? undefined : bgHover }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      title={title}
    >
      {children}
    </motion.button>
  );
}
