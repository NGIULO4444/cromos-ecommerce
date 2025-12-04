'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Grazie per l'iscrizione!
            </h3>
            <p className="text-gray-600">
              Riceverai presto le nostre migliori offerte via email.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-blue-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Resta aggiornato sulle nostre offerte
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          Iscriviti alla nostra newsletter e ricevi sconti esclusivi, 
          nuovi arrivi e offerte speciali direttamente nella tua casella email.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Inserisci la tua email"
            required
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 font-semibold"
          >
            {isLoading ? 'Iscrizione...' : 'Iscriviti'}
          </Button>
        </form>
        
        <p className="text-blue-200 text-sm mt-4">
          Non invieremo spam. Puoi annullare l'iscrizione in qualsiasi momento.
        </p>
      </div>
    </section>
  );
}
