// Zustand store for palette state management
// Persisted to localStorage for session continuity

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Color, Mode, Palette, HarmonyType } from "@/lib/types";
import {
  DEFAULT_PALETTE_SIZE,
  MIN_PALETTE_SIZE,
  MAX_PALETTE_SIZE,
  getMaxPaletteSize,
  getSavedPalettesLimit,
  getSavedColorsLimit,
} from "@/lib/feature-limits";
import { generatePalette, generatePaletteId } from "@/lib/generate";
import { createColor, oklchToHex, forceInGamut } from "@/lib/colors";

const MAX_HISTORY = 50;

interface PaletteState {
  // Current palette
  colors: Color[];
  locked: boolean[];
  mode: Mode;
  harmonyType: HarmonyType;
  paletteSize: number;

  // History for undo
  history: Palette[];
  historyIndex: number;

  // Saved palettes
  savedPalettes: Palette[];

  // Saved colors (favorites)
  savedColors: Color[];

  // AI suggestions
  aiSuggestions: Color[] | null;
  aiLoading: boolean;
  aiError: string | null;

  // Actions
  generate: () => void;
  toggleLock: (index: number) => void;
  setColor: (index: number, color: Color) => void;
  setColors: (colors: Color[]) => void;
  setMode: (mode: Mode) => void;
  setHarmonyType: (type: HarmonyType) => void;
  setPaletteSize: (size: number) => void;
  addColor: (isPremium?: boolean) => void;
  removeColor: () => void;
  removeColorAt: (index: number) => void;
  undo: () => void;
  redo: () => void;
  savePalette: (isPremium?: boolean) => Palette | null;
  deleteSavedPalette: (id: string) => void;
  loadPalette: (palette: Palette) => void;
  reorderColors: (fromIndex: number, toIndex: number) => void;

  // Saved colors (favorites)
  toggleSaveColor: (color: Color, isPremium?: boolean) => boolean;
  isSavedColor: (hex: string) => boolean;
  deleteSavedColor: (hex: string) => void;
  reset: () => void;

  // Batch operations
  shuffle: () => void;
  invert: () => void;
  adjustChroma: (delta: number) => void; // +/- percentage
  adjustLightness: (delta: number) => void; // +/- percentage

  // AI actions
  generateAISuggestions: (prompt: string, isPremium: boolean) => Promise<void>;
  applySuggestion: () => void;
  clearSuggestions: () => void;
}

// Generate initial palette
const initialColors = generatePalette("random", [], DEFAULT_PALETTE_SIZE);
const initialLocked = Array(DEFAULT_PALETTE_SIZE).fill(false);

export const usePaletteStore = create<PaletteState>()(
  persist(
    (set, get) => ({
      // Initial state
      colors: initialColors,
      locked: initialLocked,
      mode: "immersive",
      harmonyType: "random",
      paletteSize: DEFAULT_PALETTE_SIZE,
      history: [],
      historyIndex: -1,
      savedPalettes: [],
      savedColors: [],

      // AI state
      aiSuggestions: null,
      aiLoading: false,
      aiError: null,

      // Generate new palette (respecting locks)
      generate: () => {
        const { colors, locked, harmonyType, paletteSize, history, historyIndex } = get();

        // Save current state to history
        const currentPalette: Palette = {
          id: generatePaletteId(),
          colors: [...colors],
          locked: [...locked],
          createdAt: Date.now(),
          mode: get().mode,
        };

        // Trim history if we're not at the end (discard redo states)
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentPalette);

        // Keep history under limit
        while (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }

        // Generate new colors with locked positions
        const lockedColors = colors.map((color, i) =>
          locked[i] ? color : null
        );
        const newColors = generatePalette(harmonyType, lockedColors, paletteSize);

        set({
          colors: newColors,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },

      // Toggle lock on a color
      toggleLock: (index: number) => {
        const { locked } = get();
        const newLocked = [...locked];
        newLocked[index] = !newLocked[index];
        set({ locked: newLocked });
      },

      // Set a specific color
      setColor: (index: number, color: Color) => {
        const { colors } = get();
        const newColors = [...colors];
        newColors[index] = color;
        set({ colors: newColors });
      },

      // Set all colors at once
      setColors: (colors: Color[]) => {
        set({ colors });
      },

      // Switch mode
      setMode: (mode: Mode) => {
        set({ mode });
      },

      // Change harmony type
      setHarmonyType: (harmonyType: HarmonyType) => {
        set({ harmonyType });
      },

      // Set palette size and regenerate colors
      setPaletteSize: (size: number) => {
        const { colors, locked, harmonyType } = get();
        const newSize = Math.max(MIN_PALETTE_SIZE, Math.min(MAX_PALETTE_SIZE, size));

        if (newSize === colors.length) return;

        let newColors: Color[];
        let newLocked: boolean[];

        if (newSize > colors.length) {
          // Adding colors - generate new ones for the new positions
          const lockedColors = [...colors.map((c, i) => locked[i] ? c : null)];
          // Pad with nulls for new positions
          while (lockedColors.length < newSize) {
            lockedColors.push(null);
          }
          newColors = generatePalette(harmonyType, lockedColors, newSize);
          newLocked = [...locked, ...Array(newSize - colors.length).fill(false)];
        } else {
          // Removing colors - keep existing ones
          newColors = colors.slice(0, newSize);
          newLocked = locked.slice(0, newSize);
        }

        set({
          colors: newColors,
          locked: newLocked,
          paletteSize: newSize,
        });
      },

      // Add a single color (premium status is checked by the calling component)
      addColor: (isPremium: boolean = false) => {
        const { colors, locked, harmonyType } = get();
        const maxSize = getMaxPaletteSize(isPremium);

        if (colors.length >= maxSize) return;

        const newSize = colors.length + 1;
        const lockedColors = [...colors.map((c, i) => locked[i] ? c : null), null];
        const newColors = generatePalette(harmonyType, lockedColors, newSize);

        set({
          colors: newColors,
          locked: [...locked, false],
          paletteSize: newSize,
        });
      },

      // Remove the last color
      removeColor: () => {
        const { colors, locked } = get();

        if (colors.length <= MIN_PALETTE_SIZE) return;

        set({
          colors: colors.slice(0, -1),
          locked: locked.slice(0, -1),
          paletteSize: colors.length - 1,
        });
      },

      // Remove a specific color at given index
      removeColorAt: (index: number) => {
        const { colors, locked } = get();

        if (colors.length <= MIN_PALETTE_SIZE) return;
        if (index < 0 || index >= colors.length) return;

        const newColors = [...colors];
        const newLocked = [...locked];

        newColors.splice(index, 1);
        newLocked.splice(index, 1);

        set({
          colors: newColors,
          locked: newLocked,
          paletteSize: newColors.length,
        });
      },

      // Undo to previous palette
      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < 0) return;

        const previousPalette = history[historyIndex];
        set({
          colors: previousPalette.colors,
          locked: previousPalette.locked,
          historyIndex: historyIndex - 1,
        });
      },

      // Redo (move forward in history)
      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex >= history.length - 1) return;

        const nextPalette = history[historyIndex + 1];
        set({
          colors: nextPalette.colors,
          locked: nextPalette.locked,
          historyIndex: historyIndex + 1,
        });
      },

      // Save current palette (premium status is checked by the calling component)
      savePalette: (isPremium: boolean = false) => {
        const { colors, locked, mode, savedPalettes } = get();

        // Get limit based on premium status
        const limit = getSavedPalettesLimit(isPremium);

        if (savedPalettes.length >= limit) {
          return null; // Premium feature needed
        }

        const palette: Palette = {
          id: generatePaletteId(),
          colors: [...colors],
          locked: [...locked],
          createdAt: Date.now(),
          mode,
        };

        set({
          savedPalettes: [...savedPalettes, palette],
        });

        return palette;
      },

      // Delete a saved palette
      deleteSavedPalette: (id: string) => {
        const { savedPalettes } = get();
        set({
          savedPalettes: savedPalettes.filter((p) => p.id !== id),
        });
      },

      // Load a palette
      loadPalette: (palette: Palette) => {
        set({
          colors: palette.colors,
          locked: palette.locked,
          paletteSize: palette.colors.length,
        });
      },

      // Reorder colors (drag and drop)
      reorderColors: (fromIndex: number, toIndex: number) => {
        const { colors, locked } = get();
        const newColors = [...colors];
        const newLocked = [...locked];

        const [movedColor] = newColors.splice(fromIndex, 1);
        const [movedLock] = newLocked.splice(fromIndex, 1);

        newColors.splice(toIndex, 0, movedColor);
        newLocked.splice(toIndex, 0, movedLock);

        set({ colors: newColors, locked: newLocked });
      },

      // Toggle a color as saved/favorite
      toggleSaveColor: (color: Color, isPremium: boolean = false) => {
        const { savedColors } = get();
        const normalizedHex = color.hex.toUpperCase();
        const existingIndex = savedColors.findIndex(
          (c) => c.hex.toUpperCase() === normalizedHex
        );

        if (existingIndex >= 0) {
          // Already saved - remove it
          const newSavedColors = savedColors.filter((_, i) => i !== existingIndex);
          set({ savedColors: newSavedColors });
          return false; // Was removed
        } else {
          // Not saved - add it if under limit
          const limit = getSavedColorsLimit(isPremium);
          if (savedColors.length >= limit) {
            return false; // At limit
          }
          set({ savedColors: [...savedColors, color] });
          return true; // Was added
        }
      },

      // Check if a color is saved
      isSavedColor: (hex: string) => {
        const { savedColors } = get();
        const normalizedHex = hex.toUpperCase();
        return savedColors.some((c) => c.hex.toUpperCase() === normalizedHex);
      },

      // Delete a saved color by hex
      deleteSavedColor: (hex: string) => {
        const { savedColors } = get();
        const normalizedHex = hex.toUpperCase();
        set({
          savedColors: savedColors.filter(
            (c) => c.hex.toUpperCase() !== normalizedHex
          ),
        });
      },

      // Reset to initial state
      reset: () => {
        const newColors = generatePalette("random", [], DEFAULT_PALETTE_SIZE);
        set({
          colors: newColors,
          locked: Array(DEFAULT_PALETTE_SIZE).fill(false),
          paletteSize: DEFAULT_PALETTE_SIZE,
          history: [],
          historyIndex: -1,
        });
      },

      // Shuffle colors randomly
      shuffle: () => {
        const { colors, locked } = get();
        const newColors = [...colors];
        const newLocked = [...locked];

        // Fisher-Yates shuffle
        for (let i = newColors.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newColors[i], newColors[j]] = [newColors[j], newColors[i]];
          [newLocked[i], newLocked[j]] = [newLocked[j], newLocked[i]];
        }

        set({ colors: newColors, locked: newLocked });
      },

      // Invert palette (swap light/dark)
      invert: () => {
        const { colors } = get();
        const newColors = colors.map((color) => {
          const oklch = color.oklch;
          // Invert lightness: 1 - l
          const invertedOklch = forceInGamut({
            l: 1 - oklch.l,
            c: oklch.c,
            h: oklch.h,
          });
          return createColor(oklchToHex(invertedOklch));
        });

        set({ colors: newColors });
      },

      // Adjust chroma (saturation) by percentage
      adjustChroma: (delta: number) => {
        const { colors } = get();
        const newColors = colors.map((color) => {
          const oklch = color.oklch;
          // Adjust chroma by delta percentage
          const newChroma = Math.max(0, Math.min(0.4, oklch.c * (1 + delta / 100)));
          const adjustedOklch = forceInGamut({
            ...oklch,
            c: newChroma,
          });
          return createColor(oklchToHex(adjustedOklch));
        });

        set({ colors: newColors });
      },

      // Adjust lightness by percentage
      adjustLightness: (delta: number) => {
        const { colors } = get();
        const newColors = colors.map((color) => {
          const oklch = color.oklch;
          // Adjust lightness by delta percentage
          const newLightness = Math.max(0, Math.min(1, oklch.l + delta / 100));
          const adjustedOklch = forceInGamut({
            ...oklch,
            l: newLightness,
          });
          return createColor(oklchToHex(adjustedOklch));
        });

        set({ colors: newColors });
      },

      // Generate AI suggestions
      generateAISuggestions: async (prompt: string, isPremium: boolean) => {
        const { paletteSize } = get();

        set({ aiLoading: true, aiError: null });

        try {
          // Import fingerprint dynamically to avoid SSR issues
          const { getFingerprint } = await import("@/lib/fingerprint");
          const fingerprint = getFingerprint();

          const response = await fetch("/api/ai/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt,
              colorCount: paletteSize,
              fingerprint,
              isPremium,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Failed to generate palette");
          }

          // Convert API response to Color objects
          const suggestions = data.colors.map(
            (c: { hex: string; name: string }) => createColor(c.hex, c.name)
          );

          set({ aiSuggestions: suggestions, aiLoading: false });
        } catch (error) {
          set({
            aiError: error instanceof Error ? error.message : "Failed to generate palette",
            aiLoading: false,
          });
        }
      },

      // Apply AI suggestions to the palette
      applySuggestion: () => {
        const { aiSuggestions, history, historyIndex, colors, locked, mode } = get();

        if (!aiSuggestions) return;

        // Save current state to history before applying
        const currentPalette: Palette = {
          id: generatePaletteId(),
          colors: [...colors],
          locked: [...locked],
          createdAt: Date.now(),
          mode,
        };

        // Trim history if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentPalette);

        // Keep history under limit
        while (newHistory.length > MAX_HISTORY) {
          newHistory.shift();
        }

        set({
          colors: aiSuggestions,
          locked: Array(aiSuggestions.length).fill(false),
          paletteSize: aiSuggestions.length,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          aiSuggestions: null,
        });
      },

      // Clear AI suggestions
      clearSuggestions: () => {
        set({ aiSuggestions: null, aiError: null });
      },
    }),
    {
      name: "huego-palette",
      partialize: (state) => ({
        colors: state.colors,
        locked: state.locked,
        mode: state.mode,
        harmonyType: state.harmonyType,
        paletteSize: state.paletteSize,
        savedPalettes: state.savedPalettes,
        savedColors: state.savedColors,
        // Don't persist history to keep localStorage small
      }),
    }
  )
);

// Selector hooks for optimized re-renders
export const useColors = () => usePaletteStore((state) => state.colors);
export const useLocked = () => usePaletteStore((state) => state.locked);
export const useMode = () => usePaletteStore((state) => state.mode);
export const useHarmonyType = () => usePaletteStore((state) => state.harmonyType);
export const usePaletteSize = () => usePaletteStore((state) => state.paletteSize);
export const useSavedPalettes = () => usePaletteStore((state) => state.savedPalettes);
export const useHistory = () => usePaletteStore((state) => state.history);
export const useHistoryIndex = () => usePaletteStore((state) => state.historyIndex);
export const useCanUndo = () => usePaletteStore((state) => state.historyIndex >= 0);
export const useCanRedo = () =>
  usePaletteStore((state) => state.historyIndex < state.history.length - 1);

// AI selector hooks
export const useAISuggestions = () => usePaletteStore((state) => state.aiSuggestions);
export const useAILoading = () => usePaletteStore((state) => state.aiLoading);
export const useAIError = () => usePaletteStore((state) => state.aiError);

// Saved colors selector hooks
export const useSavedColors = () => usePaletteStore((state) => state.savedColors);
