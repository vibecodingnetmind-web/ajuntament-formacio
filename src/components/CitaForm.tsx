'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { citaSchema, type CitaFormData } from '@/lib/schemas/cita';
import { MOTIUS_CITA } from '@/lib/constants/cita';

type FranjaRow = {
  id: string;
  data: string;
  hora_inici: string;
  hora_fi: string;
  capacitat: number;
  ocupades: number;
};

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; id: string; data_cita: string; franja_horaria: string }
  | { status: 'error'; message: string };

function ErrorMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-gencat-red" role="alert">
      {message}
    </p>
  );
}

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  const fieldId = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return (
    <div className="mb-5">
      <label htmlFor={fieldId} className="block text-sm font-semibold text-gray-800 mb-1">
        {label}{required && <span className="text-gencat-red ml-1">*</span>}
      </label>
      {children}
      <ErrorMessage id={`${fieldId}-error`} message={error} />
    </div>
  );
}

function fieldId(label: string) {
  return label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function CitaForm() {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });
  const [selectedDate, setSelectedDate] = useState('');
  const [franges, setFranges] = useState<FranjaRow[]>([]);
  const [frangesLoading, setFrangesLoading] = useState(false);
  const [frangesError, setFrangesError] = useState('');
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setMinDate(d.toISOString().split('T')[0]);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: {
      nom: '',
      cognoms: '',
      dni_nie: '',
      telefon: '',
      email: '',
      motiu: '',
      data_cita: '',
      franja_id: '',
      franja_horaria: '',
    },
  });

  const selectedFranjaId = watch('franja_id');

  const loadFranges = useCallback(async (date: string) => {
    if (!date) return;
    setFrangesLoading(true);
    setFrangesError('');
    setFranges([]);
    setValue('franja_id', '');
    setValue('franja_horaria', '');

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const res = await fetch(
        `${url}/rest/v1/franges_disponibles?data=eq.${date}&order=hora_inici.asc`,
        {
          headers: {
            apikey: anonKey!,
            Authorization: `Bearer ${anonKey!}`,
          },
        }
      );

      if (!res.ok) {
        setFrangesError('No s\'han pogut carregar les franges disponibles.');
        return;
      }

      const data = (await res.json()) as FranjaRow[];
      setFranges(data.filter((f) => f.ocupades < f.capacitat));
    } catch {
      setFrangesError('Error de connexió en carregar les franges.');
    } finally {
      setFrangesLoading(false);
    }
  }, [setValue]);

  useEffect(() => {
    if (selectedDate) {
      loadFranges(selectedDate);
    }
  }, [selectedDate, loadFranges]);

  const onSubmit = async (data: CitaFormData) => {
    setSubmitState({ status: 'submitting' });

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const res = await fetch(
        `${url}/rest/v1/rpc/crear_cita`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: anonKey!,
            Authorization: `Bearer ${anonKey!}`,
          },
          body: JSON.stringify({
            p_nom: data.nom,
            p_cognoms: data.cognoms,
            p_dni_nie: data.dni_nie,
            p_motiu: data.motiu,
            p_data_cita: data.data_cita,
            p_franja_horaria: data.franja_horaria,
            p_franja_id: data.franja_id,
            p_telefon: data.telefon || null,
            p_email: data.email || null,
          }),
        }
      );

      if (!res.ok) {
        const errBody = await res.text();
        setSubmitState({
          status: 'error',
          message: errBody.includes('completa')
            ? 'La franja seleccionada s\'ha omplert. Tria\'n una altra.'
            : 'No s\'ha pogut crear la cita. Torna-ho a provar.',
        });
        return;
      }

      const result = (await res.json()) as { id: string; data_cita: string; franja_horaria: string };
      setSubmitState({
        status: 'success',
        id: result.id,
        data_cita: result.data_cita,
        franja_horaria: result.franja_horaria,
      });
    } catch {
      setSubmitState({
        status: 'error',
        message: 'Error de connexió. Torna-ho a provar.',
      });
    }
  };

  if (submitState.status === 'success') {
    return (
      <div className="bg-white border border-green-500 rounded-lg p-8 shadow-sm text-center">
        <div className="text-5xl mb-4">📅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Cita sol·licitada correctament
        </h2>
        <div className="bg-gray-50 rounded-lg p-6 mb-6 inline-block text-left">
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Núm. de referència:</span>
          </p>
          <p className="text-xl font-mono font-bold text-gencat-red mb-4">
            {submitState.id}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Data:</span>{' '}
            {new Date(submitState.data_cita + 'T00:00:00').toLocaleDateString('ca-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Hora:</span> {submitState.franja_horaria}
          </p>
        </div>
        <p className="text-gray-600">
          L&apos;Ajuntament de Vilafictícia confirmarà la cita properament.
        </p>
        <a
          href="/"
          className="inline-block mt-6 text-gencat-red hover:underline font-semibold"
        >
          &larr; Tornar a Inici
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1">
      <FormField label="Motiu de la cita" error={errors.motiu?.message} required>
        <select
          id={fieldId('motiu de la cita')}
          {...register('motiu')}
          aria-invalid={!!errors.motiu}
          aria-describedby={errors.motiu ? `${fieldId('motiu de la cita')}-error` : undefined}
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition bg-white"
        >
          <option value="">Selecciona un motiu...</option>
          {MOTIUS_CITA.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-x-6">
        <FormField label="Nom" error={errors.nom?.message} required>
          <input
            id={fieldId('nom')}
            type="text"
            {...register('nom')}
            aria-invalid={!!errors.nom}
            aria-describedby={errors.nom ? `${fieldId('nom')}-error` : undefined}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
          />
        </FormField>

        <FormField label="Cognoms" error={errors.cognoms?.message} required>
          <input
            id={fieldId('cognoms')}
            type="text"
            {...register('cognoms')}
            aria-invalid={!!errors.cognoms}
            aria-describedby={errors.cognoms ? `${fieldId('cognoms')}-error` : undefined}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-x-6">
        <FormField label="DNI/NIE" error={errors.dni_nie?.message} required>
          <input
            id={fieldId('dni/nie')}
            type="text"
            {...register('dni_nie')}
            aria-invalid={!!errors.dni_nie}
            aria-describedby={errors.dni_nie ? `${fieldId('dni/nie')}-error` : undefined}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
            placeholder="12345678A"
          />
        </FormField>

        <FormField label="Telèfon" error={errors.telefon?.message} required>
          <input
            id={fieldId('telèfon')}
            type="tel"
            {...register('telefon')}
            aria-invalid={!!errors.telefon}
            aria-describedby={errors.telefon ? `${fieldId('telèfon')}-error` : undefined}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
          />
        </FormField>
      </div>

      <FormField label="Email" error={errors.email?.message} required>
        <input
          id={fieldId('email')}
          type="email"
          {...register('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${fieldId('email')}-error` : undefined}
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
        />
      </FormField>

      <FormField label="Dia de la cita" error={errors.data_cita?.message} required>
        <input
          id={fieldId('dia de la cita')}
          type="date"
          min={minDate}
          {...register('data_cita', {
            onChange: (e) => setSelectedDate(e.target.value),
          })}
          aria-invalid={!!errors.data_cita}
          aria-describedby={errors.data_cita ? `${fieldId('dia de la cita')}-error` : undefined}
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
        />
      </FormField>

      {selectedDate && (
        <FormField label="Franja horària" error={errors.franja_id?.message} required>
          {frangesLoading && (
            <p className="text-gray-500 text-sm">Carregant franges disponibles...</p>
          )}
          {frangesError && (
            <p className="text-gencat-red text-sm">{frangesError}</p>
          )}
          {!frangesLoading && !frangesError && franges.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
              <p className="text-yellow-800 text-sm font-semibold">
                No hi ha franges disponibles per aquest dia. Prova amb una altra data.
              </p>
            </div>
          )}
          {!frangesLoading && franges.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {franges.map((f) => {
                const label = `${f.hora_inici.slice(0, 5)} - ${f.hora_fi.slice(0, 5)}`;
                const placesLeft = f.capacitat - f.ocupades;
                return (
                  <label
                    key={f.id}
                    className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition text-center ${
                      selectedFranjaId === f.id
                        ? 'border-gencat-red bg-gencat-red-10 ring-2 ring-gencat-red'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      value={f.id}
                      {...register('franja_id')}
                      onChange={() => {
                        setValue('franja_id', f.id);
                        setValue('franja_horaria', label);
                      }}
                      className="sr-only"
                    />
                    <span className="text-sm font-semibold text-gray-800">{label}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {placesLeft} plaça{placesLeft !== 1 ? 's' : ''}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </FormField>
      )}

      {submitState.status === 'error' && (
        <div className="bg-red-50 border border-gencat-red rounded p-4" role="alert">
          <p className="text-sm text-gencat-red font-semibold">{submitState.message}</p>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={submitState.status === 'submitting'}
          className="w-full md:w-auto bg-gencat-red text-white font-bold py-3 px-8 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitState.status === 'submitting' ? 'Enviant...' : 'Sol·licitar cita'}
        </button>
      </div>
    </form>
  );
}
