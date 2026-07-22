'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import SollicitudsTable from '@/components/admin/SollicitudsTable';
import CitesTable from '@/components/admin/CitesTable';

type Tab = 'sollicituds' | 'cites';

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('sollicituds');
  const [session, setSession] = useState<boolean | null>(null);
  const router = useRouter();

  const checkSession = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) {
      router.push('/admin/login');
      return;
    }
    setSession(true);
  }, [router]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  if (session === null) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Verificando sessió...</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'sollicituds', label: 'Sol·licituds de padró' },
    { key: 'cites', label: 'Cites' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panell d&apos;administració</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gencat-red transition-colors font-semibold"
        >
          Tancar sessió
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6" aria-label="Pestanyes">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-gencat-red text-gencat-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {tab === 'sollicituds' && <SollicitudsTable />}
      {tab === 'cites' && <CitesTable />}
    </div>
  );
}
