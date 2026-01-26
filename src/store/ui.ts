import { create } from "zustand";

interface UIState {
  // Hide global command center (e.g., when mood editor is open)
  hideCommandCenter: boolean;
  setHideCommandCenter: (hide: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  hideCommandCenter: false,
  setHideCommandCenter: (hide) => set({ hideCommandCenter: hide }),
}));
