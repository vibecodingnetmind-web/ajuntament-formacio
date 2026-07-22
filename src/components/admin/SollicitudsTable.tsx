'use client';

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Sollicitud = {
  id: string;
  created_at: string;
  estat: string;
  nom: string;
  cognoms: string;
  dni_nie: string;
  data_naixement: string;
  adreca: string;
  municipi: string;
  telefon: string | null;
  email: string | null;
  observacions: string | null;
};

const ESTATS = ['pendent', 'en_revisio', 'aprovat', 'rebutjat'] as const;

function exportToCSV(data: Sollicitud[]) {
  const headers = ['ID', 'Data', 'Estat', 'Nom', 'Cognoms', 'DNI/NIE', 'Naixement', 'Adreça', 'Municipi', 'Telèfon', 'Email', 'Observacions'];
  const rows = data.map((r) => [
    r.id,
    r.created_at,
    r.estat,
    r.nom,
    r.cognoms,
    r.dni_nie,
    r.data_naixement,
    r.adreca,
    r.municipi,
    r.telefon || '',
    r.email || '',
    r.observacions || '',
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sollicituds_padro.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function SollicitudsTable() {
  const [data, setData] = useState<Sollicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterEstat, setFilterEstat] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');

    const supabase = createSupabaseBrowserClient();
    let query = supabase.from('sollicituds_padro').select('*').order('created_at', { ascending: false });

    if (filterEstat) {
      query = query.eq('estat', filterEstat);
    }

    const { data: result, error: err } = await query;

    if (err) {
      setError('No s\'han pogut carregar les sol·licituds.');
      setLoading(false);
      return;
    }

    setData(result as Sollicitud[]);
    setLoading(false);
  }, [filterEstat]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChangeEstat = async (id: string, nouEstat: string) => {
    const supabase = createSupabaseBrowserClient();
    const { error: err } = await supabase
      .from('sollicituds_padro')
      .update({ estat: nouEstat })
      .eq('id', id);

    if (err) {
      setError('No s\'ha pogut actualitzar l\'estat.');
      return;
    }

    setError('');
    fetchData();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <label htmlFor="filter-estat" className="text-sm font-semibold text-gray-700 mr-2">
            Filtrar per estat:
          </label>
          <select
            id="filter-estat"
            value={filterEstat}
            onChange={(e) => setFilterEstat(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gencat-red"
          >
            <option value="">Tots</option>
            {ESTATS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => exportToCSV(data)}
          className="text-sm bg-gray-800 text-white font-semibold py-1.5 px-4 rounded hover:bg-gray-700 transition"
        >
          Exportar CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-gencat-red rounded p-3 mb-4" role="alert">
          <p className="text-sm text-gencat-red font-semibold">{error}</p>
        </div>
      )}

      {loading && <p className="text-gray-500">Carregant...</p>}

      {!loading && data.length === 0 && (
        <p className="text-gray-500">No hi ha sol·licituds per mostrar.</p>
      )}

      {!loading && data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-3 py-2 font-semibold text-gray-700 border-b">Data</th>
                <th className="px-3 py-2 font-semibold text-gray-700 border-b">Nom</th>
                <th className="px-3 py-2 font-semibold text-gray-700 border-b">DNI/NIE</th>
                <th className="px-3 py-2 font-semibold text-gray-700 border-b">Municipi</th>
                <th className="px-3 py-2 font-semibold text-gray-700 border-b">Estat</th>
                <th className="px-3 py-2 font-semibold text-gray-700 border-b">Accions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 text-gray-600">
                    {new Date(row.created_at).toLocaleDateString('ca-ES')}
                  </td>
                  <td className="px-3 py-2 font-medium">{row.nom} {row.cognoms}</td>
                  <td className="px-3 py-2 text-gray-600">{row.dni_nie}</td>
                  <td className="px-3 py-2 text-gray-600">{row.municipi}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      row.estat === 'aprovat' ? 'bg-green-100 text-green-800' :
                      row.estat === 'rebutjat' ? 'bg-red-100 text-red-800' :
                      row.estat === 'en_revisio' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {row.estat}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) handleChangeEstat(row.id, e.target.value);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-gencat-red"
                    >
                      <option value="">Canviar estat...</option>
                      {ESTATS.filter((e) => e !== row.estat).map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
