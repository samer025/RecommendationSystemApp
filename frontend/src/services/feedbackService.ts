// src/services/feedbackService.ts
const API_BASE_URL ='/api';

export interface Feedback {
  id: number;
  client_id: string;
  offer: string;
  rating: number;
  comment: string;
  submitted_at: string;
}

export const feedbackService = {
  // Récupérer tous les feedbacks
  async getAllFeedbacks(): Promise<Feedback[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/feedbacks`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des feedbacks:', error);
      return [];
    }
  },
};