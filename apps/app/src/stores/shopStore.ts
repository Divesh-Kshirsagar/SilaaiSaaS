import { create } from 'zustand';

interface Shop {
  id: number;
  name: string;
  phone: string;
  address: string;
}

interface ShopState {
  shop: Shop | null;
  setShop: (shop: Shop) => void;
  clearShop: () => void;
}

export const useShopStore = create<ShopState>()((set) => ({
  shop: null,
  setShop: (shop) => set({ shop }),
  clearShop: () => set({ shop: null }),
}));
