import { DraggableItem } from '../types/canvas';

export class StorageService {
  private static instance: StorageService;
  
  private constructor() {}
  
  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  getFavorites(): string[] {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  }

  setFavorites(favorites: string[]): void {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  getCanvasItems(): DraggableItem[] {
    const items = localStorage.getItem('canvasItems');
    return items ? JSON.parse(items) : [];
  }

  setCanvasItems(items: DraggableItem[]): void {
    localStorage.setItem('canvasItems', JSON.stringify(items));
  }
}

export const storageService = StorageService.getInstance();