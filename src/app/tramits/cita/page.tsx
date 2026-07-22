import Link from 'next/link';
import CitaForm from '@/components/CitaForm';

export default function CitaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="text-gencat-red hover:underline text-sm mb-8 inline-block">
        &larr; Tornar a Inici
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Demana Cita Prèvia
      </h1>
      <p className="text-gray-600 mb-8">
        Sol·licita una cita amb l&apos;oficina d&apos;atenció ciutadana per a qualsevol tràmit municipal.
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <p className="text-sm text-yellow-800 font-semibold">
          Aquest és un entorn de formació. No hi envieu dades reals.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
        <CitaForm />
      </div>
    </div>
  );
}
