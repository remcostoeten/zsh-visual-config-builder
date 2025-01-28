/**
 * @author Remco Stoeten
 * @description Type definitions for favorites functionality
 */

export type Favorite = {
    id: string;
    name: string;
    type: string;
    metadata?: string;
    createdAt: string;
}; 