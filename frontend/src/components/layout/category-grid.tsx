'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { medusaClient } from '@/lib/medusa-client';

interface Category {
  id: string;
  name: string;
  description: string;
  handle: string;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { product_categories } = await medusaClient.productCategories.list();
        setCategories(product_categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback categories for demo
        setCategories([
          {
            id: '1',
            name: 'Cover iPhone',
            description: 'Protezione elegante per il tuo iPhone',
            handle: 'cover-iphone'
          },
          {
            id: '2',
            name: 'Cover Samsung',
            description: 'Cover resistenti per dispositivi Samsung',
            handle: 'cover-samsung'
          },
          {
            id: '3',
            name: 'Caricabatterie',
            description: 'Caricabatterie rapidi e wireless',
            handle: 'caricabatterie'
          },
          {
            id: '4',
            name: 'Auricolari',
            description: 'Audio di qualità per ogni momento',
            handle: 'auricolari'
          },
          {
            id: '5',
            name: 'Pellicole Protettive',
            description: 'Protezione schermo ultra-resistente',
            handle: 'pellicole'
          },
          {
            id: '6',
            name: 'Supporti Auto',
            description: 'Supporti sicuri per la guida',
            handle: 'supporti-auto'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoryIcons = {
    'cover-iphone': '📱',
    'cover-samsung': '📲',
    'caricabatterie': '🔌',
    'auricolari': '🎧',
    'pellicole': '🛡️',
    'supporti-auto': '🚗'
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Esplora per Categoria</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 text-center animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Esplora per Categoria</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.handle}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 text-center group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {categoryIcons[category.handle as keyof typeof categoryIcons] || '📦'}
              </div>
              
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              
              <p className="text-gray-600 text-sm">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            Vedi Tutte le Categorie
          </Link>
        </div>
      </div>
    </section>
  );
}
