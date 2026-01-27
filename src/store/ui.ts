import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PaletteLayout = "columns" | "strips";

interface UIState {
  // Hide global command center (e.g., when mood editor is open)
  hideCommandCenter: boolean;
  setHideCommandCenter: (hide: boolean) => void;

  // Palette layout preference (vertical columns vs horizontal strips)
  paletteLayout: PaletteLayout;
  setPaletteLayout: (layout: PaletteLayout) => void;
  togglePaletteLayout: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      hideCommandCenter: false,
      setHideCommandCenter: (hide) => set({ hideCommandCenter: hide }),

      paletteLayout: "columns",
      setPaletteLayout: (layout) => set({ paletteLayout: layout }),
      togglePaletteLayout: () =>
        set((state) => ({
          paletteLayout: state.paletteLayout === "columns" ? "strips" : "columns",
        })),
    }),
    {
      name: "huego-ui",
      partialize: (state) => ({ paletteLayout: state.paletteLayout }),
    }
  )
);

// Selector hooks
export const usePaletteLayout = () => useUIStore((state) => state.paletteLayout);
