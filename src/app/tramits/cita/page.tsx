import Link from 'next/link';

export default function CitaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="text-gencat-red hover:underline text-sm mb-8 inline-block">
        &larr; Tornar a Inici
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Demana Cita Prèvia
      </h1>

      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <p className="text-gray-600 mb-4">
          Sol·licita una cita amb l&apos;oficina d&apos;atenció ciutadana per a qualsevol tràmit municipal.
        </p>

        <div className="bg-gray-50 border-l-4 border-gencat-red p-4 mb-6">
          <p className="text-sm text-gray-600 font-semibold">
            Aquest és un entorn de formació. No envieu dades reals.
          </p>
        </div>

        {/* TODO: Implementar formulari de sol·licitud de cita */}
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Formulari en construcció</p>
          <p className="text-sm mt-2">Aquí es crearà el formulari de sol·licitud de cita prèvia</p>
        </div>
      </div>
    </div>
  );
}
