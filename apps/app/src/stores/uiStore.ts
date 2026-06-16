import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UiState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'light', // Hardcoded to light for now
      toggleTheme: () => {}, // Disabled
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'silaai-ui',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const applyTheme = () => {
  // Always apply light theme explicitly
  document.documentElement.classList.add('ion-palette-light');
  document.documentElement.classList.remove('ion-palette-dark');
};
