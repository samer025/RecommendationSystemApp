'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api_url } from '@/api';

export default function FeedbackForm() {
  const params = useParams();
  const slug = params.slug as string;

  const [clientId, setClientId] = useState('');
  const [offer, setOffer] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (slug) {
      try {
        const [client, encodedOffer] = slug.split('--');
        if (!client || !encodedOffer) throw new Error('Invalid slug format');
        setClientId(client);
        setOffer(decodeURIComponent(encodedOffer).replace('_', '/'));
      } catch (error) {
        console.error('Error parsing slug:', error);
        setOffer('Erreur: Offre non valide');
      }
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${api_url}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          offer,
          rating,
          comment,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-800">Merci pour votre retour !</h2>
            <p className="text-sm text-gray-600">Votre feedback a été enregistré avec succès.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Formulaire de Feedback
        </h2>
        <p className="mb-6 text-center text-gray-600">
          Offre recommandée : <span className="font-medium">{offer}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Note (1 à 5)</label>
            <div className="flex gap-1">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onClick={() => setRating(starValue)}
                    className={`h-8 w-8 focus:outline-none transition-colors ${rating >= starValue ? 'text-yellow-500' : 'text-gray-300'}`}
                    onMouseEnter={() => setRating(starValue)}
                    onMouseLeave={() => setRating(rating)} // Réinitialise à la valeur sélectionnée
                  >
                    <svg
                      className="h-8 w-8"
                      fill="currentColor"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.843 1.416 8.258L12 18.927l-7.415 3.901 1.416-8.258-6.001-5.843 8.332-1.151z"
                      />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              Commentaire
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
              rows={5}
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Envoyer
            </button>
            <button
              type="button"
              onClick={() => {
                setRating(5);
                setComment('');
              }}
              className="rounded-lg bg-gray-200 px-6 py-2 text-gray-700 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}