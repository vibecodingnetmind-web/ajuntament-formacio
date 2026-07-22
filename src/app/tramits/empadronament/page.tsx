import Link from 'next/link';
import EmpadronamentForm from '@/components/EmpadronamentForm';

export default function EmpadronamentPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/" className="text-gencat-red hover:underline text-sm mb-8 inline-block">
        &larr; Tornar a Inici
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Sol·licitud d&apos;Empadronament
      </h1>
      <p className="text-gray-600 mb-8">
        Omple el formulari per sol·licitar l&apos;alta, baixa o modificació al padró municipal d&apos;habitants.
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <p className="text-sm text-yellow-800 font-semibold">
          Aquest és un entorn de formació. No hi envieu dades reals.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm">
        <EmpadronamentForm />
      </div>
    </div>
  );
}
