'use client';

import Link from 'next/link';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gencat-red rounded-full flex items-center justify-center text-white font-bold text-xl">
              V
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Ajuntament de Vilafictícia
              </h1>
              <p className="text-sm text-gray-600">Entorn de formació</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Navigation />
          </nav>

          <button
            type="button"
            className="md:hidden p-2 text-gray-600 hover:text-gray-800"
            aria-label="Menú de navegació"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
