// Zustand store for palette state management
// Persisted to localStorage for session continuity

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Color, Mode, Palette, HarmonyType } from "@/lib/types";
import { generatePalette, generatePaletteId } from "@/lib/generate";

const PALETTE_SIZE = 5;
const MAX_HISTORY = 50;
const MAX_SAVED_PALETTES = 10; // Free tier limit

interface PaletteState {
  // Current palette
  colors: Color[];
  locked: boolean[];
  mode: Mode;
  harmonyType: HarmonyType;

  // History for undo
  history: Palette[];
  historyIndex: number;

  // Saved palettes
  savedPalettes: Palette[];

  // Actions
  generate: () => void;
  toggleLock: (index: number) => void;
  setColor: (index: number, color: Color) => void;
  setColors: (colors: Color[]) => void;
  setMode: (mode: Mode) => void;
  setHarmonyType: (type: HarmonyType) => void;
  undo: () => void;
  redo: () => void;
  savePalette: () => Palette | null;
  deleteSavedPalette: (id: string) => void;
  loadPalette: (palette: Palette) => void;
  reorderColors: (fromIndex: number, toIndex: number) => void;
  reset: () => void;
}

// Generate initial palette
const initialColors = generatePalette("random", [], PALETTE_SIZE);
const initialLocked = Array(PALETTE_SIZE).fill(false);

export const usePaletteStore = create<PaletteState>()(
  persist(
    (set, get) => ({
      // Initial state
      colors: initialColors,
      locked: initialLocked,
      mode: "immersive",
      harmonyType: "random",
      history: [],
      historyIndex: -1,
      savedPalettes: [],

      // Generate new palette (respecting locks)
      generate: () => {
        const { colors, locked, harmonyType, history, historyIndex } = get();

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
        const newColors = generatePalette(harmonyType, lockedColors, PALETTE_SIZE);

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

      // Save current palette
      savePalette: () => {
        const { colors, locked, mode, savedPalettes } = get();

        if (savedPalettes.length >= MAX_SAVED_PALETTES) {
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

      // Reset to initial state
      reset: () => {
        const newColors = generatePalette("random", [], PALETTE_SIZE);
        set({
          colors: newColors,
          locked: Array(PALETTE_SIZE).fill(false),
          history: [],
          historyIndex: -1,
        });
      },
    }),
    {
      name: "huego-palette",
      partialize: (state) => ({
        colors: state.colors,
        locked: state.locked,
        mode: state.mode,
        harmonyType: state.harmonyType,
        savedPalettes: state.savedPalettes,
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
export const useSavedPalettes = () => usePaletteStore((state) => state.savedPalettes);
export const useCanUndo = () => usePaletteStore((state) => state.historyIndex >= 0);
export const useCanRedo = () =>
  usePaletteStore((state) => state.historyIndex < state.history.length - 1);
