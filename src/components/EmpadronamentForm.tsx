'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { empadronamentSchema, type EmpadronamentFormData } from '@/lib/schemas/empadronament';
import { capture } from '@/lib/posthog';

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; id: string }
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
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const fieldId = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="mb-5">
      <label htmlFor={fieldId} className="block text-sm font-semibold text-gray-800 mb-1">
        {label}
      </label>
      {children}
      <ErrorMessage id={`${fieldId}-error`} message={error} />
    </div>
  );
}

export default function EmpadronamentForm() {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });

  useEffect(() => {
    capture('tramit_iniciat', { tramit: 'empadronament' });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmpadronamentFormData>({
    resolver: zodResolver(empadronamentSchema),
    defaultValues: {
      nom: '',
      cognoms: '',
      dni_nie: '',
      data_naixement: '',
      adreca: '',
      municipi: '',
      telefon: '',
      email: '',
      observacions: '',
    },
  });

  const fieldId = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

  const onSubmit = async (data: EmpadronamentFormData) => {
    setSubmitState({ status: 'submitting' });

    const payload = {
      ...data,
      telefon: data.telefon || null,
      email: data.email || null,
      observacions: data.observacions || null,
      estat: 'pendent',
    };

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const response = await fetch(
      `${url}/rest/v1/sollicituds_padro?select=id`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: anonKey!,
          Authorization: `Bearer ${anonKey!}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      await response.text();
      capture('tramit_error', { tramit: 'empadronament', tipus: 'api_error' });
      setSubmitState({
        status: 'error',
        message: 'No s\'ha pogut enviar la sol·licitud. Revisa les dades o torna-ho a provar més tard.',
      });
      return;
    }

    const result = (await response.json()) as { id: string }[];

    if (!result || result.length === 0) {
      capture('tramit_error', { tramit: 'empadronament', tipus: 'no_reference' });
      setSubmitState({
        status: 'error',
        message: 'No s\'ha pogut obtenir el número de referència. Contacta amb l\'ajuntament.',
      });
      return;
    }

    capture('tramit_completat', { tramit: 'empadronament' });
    setSubmitState({ status: 'success', id: result[0].id });
  };

  if (submitState.status === 'success') {
    return (
      <div className="bg-white border border-green-500 rounded-lg p-8 shadow-sm text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Sol·licitud rebuda correctament
        </h2>
        <p className="text-gray-600 mb-2">
          El teu número de referència és:
        </p>
        <p className="text-2xl font-mono font-bold text-gencat-red mb-6">
          {submitState.id}
        </p>
        <p className="text-gray-600">
          L&apos;Ajuntament de Vilafictícia revisarà la teva sol·licitud i et notificarà la resolució.
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-x-6">
        <FormField label="Nom" error={errors.nom?.message}>
          <input
            id={fieldId('nom')}
            type="text"
            {...register('nom')}
            aria-invalid={!!errors.nom}
            aria-describedby={errors.nom ? `${fieldId('nom')}-error` : undefined}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
          />
        </FormField>

        <FormField label="Cognoms" error={errors.cognoms?.message}>
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
        <FormField label="DNI/NIE" error={errors.dni_nie?.message}>
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

        <FormField label="Data de naixement" error={errors.data_naixement?.message}>
          <input
            id={fieldId('data de naixement')}
            type="date"
            {...register('data_naixement')}
            aria-invalid={!!errors.data_naixement}
            aria-describedby={errors.data_naixement ? `${fieldId('data de naixement')}-error` : undefined}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
          />
        </FormField>
      </div>

      <FormField label="Adreça" error={errors.adreca?.message}>
        <input
          id={fieldId('adreça')}
          type="text"
          {...register('adreca')}
          aria-invalid={!!errors.adreca}
          aria-describedby={errors.adreca ? `${fieldId('adreça')}-error` : undefined}
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
        />
      </FormField>

      <FormField label="Municipi" error={errors.municipi?.message}>
        <input
          id={fieldId('municipi')}
          type="text"
          {...register('municipi')}
          aria-invalid={!!errors.municipi}
          aria-describedby={errors.municipi ? `${fieldId('municipi')}-error` : undefined}
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-x-6">
        <FormField label="Telèfon (opcional)" error={errors.telefon?.message}>
          <input
            id={fieldId('telèfon')}
            type="tel"
            {...register('telefon')}
            aria-invalid={!!errors.telefon}
            aria-describedby={errors.telefon ? `${fieldId('telèfon')}-error` : undefined}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
          />
        </FormField>

        <FormField label="Email (opcional)" error={errors.email?.message}>
          <input
            id={fieldId('email')}
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${fieldId('email')}-error` : undefined}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition"
          />
        </FormField>
      </div>

      <FormField label="Observacions (opcional)" error={errors.observacions?.message}>
        <textarea
          id={fieldId('observacions')}
          rows={4}
          {...register('observacions')}
          aria-invalid={!!errors.observacions}
          aria-describedby={errors.observacions ? `${fieldId('observacions')}-error` : undefined}
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gencat-red focus:border-transparent transition resize-y"
        />
      </FormField>

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
          {submitState.status === 'submitting' ? 'Enviant...' : 'Enviar sol·licitud'}
        </button>
      </div>
    </form>
  );
}
