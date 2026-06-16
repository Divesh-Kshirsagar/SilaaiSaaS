import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        applyTheme(next);
      },
    }),
    { name: 'silaai-ui' }
  )
);

export const applyTheme = (theme: 'dark' | 'light') => {
  const html = document.documentElement;
  if (theme === 'light') {
    html.classList.add('ion-palette-light');
    html.classList.remove('ion-palette-dark');
  } else {
    html.classList.add('ion-palette-dark');
    html.classList.remove('ion-palette-light');
  }
};
