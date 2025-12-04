'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { medusaClient } from '@/lib/medusa-client';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products } = await medusaClient.products.list({ limit: 8 });
        setProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Prodotti in Evidenza</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Prodotti in Evidenza</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Nessun prodotto disponibile al momento.</p>
            <Link href="/products">
              <Button>Esplora il Catalogo</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Link href={`/products/${product.id || '#'}`}>
                  <div className="w-full h-48 relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.thumbnail || '/placeholder-product.jpg'}
                      alt={product.title || 'Prodotto'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/products/${product.id || '#'}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">
                      {product.title || 'Prodotto senza titolo'}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm mb-3 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                    {product.description || 'Nessuna descrizione disponibile'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-blue-600">
                      {product.variants?.[0]?.prices?.[0] 
                        ? formatPrice(
                            product.variants[0].prices[0].amount,
                            product.variants[0].prices[0].currency_code
                          )
                        : 'Prezzo non disponibile'
                      }
                    </div>
                    
                    <Link href={`/products/${product.id || '#'}`}>
                      <Button size="sm">
                        Dettagli
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" variant="outline">
              Vedi Tutti i Prodotti
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
