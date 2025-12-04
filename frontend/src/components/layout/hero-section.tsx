import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Benvenuto su <span className="text-yellow-400">Cromos</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Scopri la nostra collezione di accessori per smartphone di alta qualità
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Esplora Prodotti
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Vedi Categorie
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-400 opacity-20 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white opacity-15 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-yellow-400 opacity-25 rounded-full"></div>
      </div>
    </section>
  );
}
