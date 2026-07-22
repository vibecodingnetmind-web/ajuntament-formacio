export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Ajuntament de Vilafictícia</h3>
            {/* TODO: Afegir adreça i contacte reals */}
            <p className="text-gray-400 text-sm">
              Plaça de la Vila, 1<br />
              08001 Vilafictícia
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Enllaços</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Avís legal</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibilitat</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Protecció de dades</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contacte</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">Tel. 93 XXX XX XX</li>
              <li className="text-gray-400">info@vilaficticia.cat</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-sm text-gray-400 font-semibold">
            Aquest lloc web és un entorn de formació. Totes les dades són fictícies i no corresponen a cap ajuntament real.
          </p>
        </div>
      </div>
    </footer>
  );
}
