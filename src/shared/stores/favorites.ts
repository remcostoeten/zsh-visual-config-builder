import { create } from 'zustand';
import { storage } from '../services/storage';

type FavoritesStore = {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

export const useFavorites = create<FavoritesStore>((set, get) => ({
  favorites: storage.getFavorites(),
  
  addFavorite: (id: string) => 
    set(state => {
      const newFavorites = [...state.favorites, id];
      storage.setFavorites(newFavorites);
      return { favorites: newFavorites };
    }),
    
  removeFavorite: (id: string) => 
    set(state => {
      const newFavorites = state.favorites.filter(fav => fav !== id);
      storage.setFavorites(newFavorites);
      return { favorites: newFavorites };
    }),
    
  toggleFavorite: (id: string) => {
    const state = get();
    if (state.favorites.includes(id)) {
      state.removeFavorite(id);
    } else {
      state.addFavorite(id);
    }
  }
}));