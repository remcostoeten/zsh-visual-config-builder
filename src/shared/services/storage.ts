// Storage service using functional approach
function createStorageService() {
  function getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  }

  function setFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  function getCanvasItems() {
    const items = localStorage.getItem('canvasItems');
    return items ? JSON.parse(items) : [];
  }

  function setCanvasItems(items) {
    localStorage.setItem('canvasItems', JSON.stringify(items));
  }

  return {
    getFavorites,
    setFavorites,
    getCanvasItems,
    setCanvasItems,
  };
}

export const storage = createStorageService();