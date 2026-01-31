"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationGuardContextValue {
  setGuard: (condition: () => boolean, message: string) => void;
  clearGuard: () => void;
  requestNavigation: (href: string) => void;
}

const NavigationGuardContext = createContext<NavigationGuardContextValue | null>(
  null
);

export function useNavigationGuard() {
  const ctx = useContext(NavigationGuardContext);
  if (!ctx) {
    throw new Error(
      "useNavigationGuard must be used within NavigationGuardProvider"
    );
  }
  return ctx;
}

export function useNavigationGuardSafe() {
  return useContext(NavigationGuardContext);
}

export function NavigationGuardProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const conditionRef = useRef<(() => boolean) | null>(null);
  const messageRef = useRef<string>("");

  const [showModal, setShowModal] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [guardMessage, setGuardMessage] = useState("");

  const setGuard = useCallback(
    (condition: () => boolean, message: string) => {
      conditionRef.current = condition;
      messageRef.current = message;
    },
    []
  );

  const clearGuard = useCallback(() => {
    conditionRef.current = null;
    messageRef.current = "";
  }, []);

  const requestNavigation = useCallback(
    (href: string) => {
      if (conditionRef.current && conditionRef.current()) {
        setPendingHref(href);
        setGuardMessage(messageRef.current);
        setShowModal(true);
      } else {
        router.push(href);
      }
    },
    [router]
  );

  const handleLeave = useCallback(() => {
    setShowModal(false);
    clearGuard();
    if (pendingHref) {
      router.push(pendingHref);
      setPendingHref(null);
    }
  }, [pendingHref, router, clearGuard]);

  const handleStay = useCallback(() => {
    setShowModal(false);
    setPendingHref(null);
  }, []);

  return (
    <NavigationGuardContext.Provider
      value={{ setGuard, clearGuard, requestNavigation }}
    >
      {children}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleStay}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[400px] bg-zinc-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              {/* Header */}
              <div className="p-6 pb-2">
                <h2 className="text-lg font-semibold text-white">
                  Unsaved Changes
                </h2>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <p className="text-sm text-zinc-400">{guardMessage}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
                <button
                  onClick={handleStay}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Stay
                </button>
                <button
                  onClick={handleLeave}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-zinc-900 hover:bg-zinc-200 transition-colors"
                >
                  Leave
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </NavigationGuardContext.Provider>
  );
}
