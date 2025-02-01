/**
 * Utility functions for the layer system
 */

export function calculateBoundingBox(point1: Point, point2: Point) {
  return {
    x: Math.min(point1.x, point2.x),
    y: Math.min(point1.y, point2.y),
    width: Math.abs(point2.x - point1.x),
    height: Math.abs(point2.y - point1.y),
  };
}

export function isPointInBounds(point: Point, bounds: { x: number; y: number; width: number; height: number }) {
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
} 