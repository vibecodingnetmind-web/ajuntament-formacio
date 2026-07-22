import Link from 'next/link';

const tramits = [
  {
    title: 'Sol·licitud d\'empadronament',
    description: 'Tramita la teva sol·licitud d\'alta, baixa o modificació al padró municipal d\'habitants.',
    href: '/tramits/padro',
    icon: '📋',
  },
  {
    title: 'Demana cita prèvia',
    description: 'Sol·licita una cita amb l\'oficina d\'atenció ciutadana per a qualsevol tràmit municipal.',
    href: '/tramits/cita',
    icon: '📅',
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Benvinguts a Vilafictícia
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Seu electrònica de l&apos;Ajuntament de Vilafictícia. Aquí pots gestionar els teus tràmits
          municipals de manera àgil i senzilla.
        </p>
      </section>

      <section aria-labelledby="tramits-destacats">
        <h2 id="tramits-destacats" className="sr-only">Tràmits destacats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {tramits.map((tramit) => (
            <Link
              key={tramit.href}
              href={tramit.href}
              className="group block p-8 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gencat-red transition-all"
            >
              <div className="text-4xl mb-4" aria-hidden="true">{tramit.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-gencat-red transition-colors mb-2">
                {tramit.title}
              </h3>
              <p className="text-gray-600">{tramit.description}</p>
              <span className="inline-block mt-4 text-gencat-red font-semibold text-sm group-hover:underline">
                Accedir al tràmit →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 text-center text-sm text-gray-500">
        <p>
          Aquest web és un entorn de formació. Les dades mostrades no són reals.
        </p>
      </section>
    </div>
  );
}
