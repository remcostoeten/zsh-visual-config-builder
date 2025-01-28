/**
 * @author Remco Stoeten
 * @description Storage service for managing favorite items in localStorage
 */

import type { Favorite } from '../types/favorite';

const FAVORITES_KEY = 'favorites';

export const favoritesStorage = {
  getFavorites: (): Favorite[] => {
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return [];
    }
  },

  setFavorites: (favorites: Favorite[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  },

  clearFavorites: () => {
    try {
      localStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Failed to clear favorites:', error);
    }
  }
}; 