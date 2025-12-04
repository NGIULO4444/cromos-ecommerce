export default function TrustBadges() {
  const badges = [
    {
      icon: '🚚',
      title: 'Spedizione Gratuita',
      description: 'Su ordini superiori a €29'
    },
    {
      icon: '🔒',
      title: 'Pagamenti Sicuri',
      description: 'SSL e crittografia avanzata'
    },
    {
      icon: '↩️',
      title: 'Reso Facile',
      description: '30 giorni per il reso'
    },
    {
      icon: '⭐',
      title: 'Qualità Garantita',
      description: 'Prodotti testati e certificati'
    },
    {
      icon: '📞',
      title: 'Supporto 24/7',
      description: 'Assistenza sempre disponibile'
    },
    {
      icon: '🇮🇹',
      title: 'Made in Italy',
      description: 'Qualità italiana garantita'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Perché scegliere Cromos?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{badge.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {badge.title}
              </h3>
              <p className="text-gray-600">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
