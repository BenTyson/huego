"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseButton } from "./CloseButton";

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Modal width class, e.g., "md:w-[600px]" */
  width?: string;
  /** Max height class, e.g., "md:max-h-[80vh]" */
  maxHeight?: string;
}

export function ModalBase({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = "md:w-[600px]",
  maxHeight = "md:max-h-[80vh]",
}: ModalBaseProps) {
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
            className={`fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 ${width} ${maxHeight} bg-zinc-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                {subtitle && (
                  <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
                )}
              </div>
              <CloseButton onClick={onClose} />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Common button styles for modal footers
export function ModalCancelButton({
  onClick,
  children = "Cancel",
}: {
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
    >
      {children}
    </button>
  );
}

export function ModalPrimaryButton({
  onClick,
  disabled = false,
  children,
  icon,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-zinc-900 hover:bg-zinc-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon}
      {children}
    </button>
  );
}
