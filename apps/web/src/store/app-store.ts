import { create } from "zustand";
type AppState = Record<never, never>;
export const useAppStore = create<AppState>(() => ({}));
