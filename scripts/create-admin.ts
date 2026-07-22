/**
 * Script per crear un usuari administrador fictici a Supabase Auth.
 *
 * Ús:
 *   1. Al terminal, defineix la clau service_role:
 *        $env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."
 *   2. Executa:
 *        npx tsx scripts/create-admin.ts
 *
 * La clau service_role només existeix a la teva màquina local.
 * No es guarda al repositori ni es demana al xat.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

function loadEnvVar(key: string): string | undefined {
  const envPath = path.resolve(__dirname, '..', '.env.local');
  try {
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.split('\n').find((line) => line.startsWith(`${key}=`));
    if (match) {
      return match.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    }
  } catch {
    // .env.local pot no existir
  }
  return process.env[key];
}

const supabaseUrl = loadEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL no trobat a .env.local');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY no està definit al terminal.');
  console.error('');
  console.error('Executa al terminal:');
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."');
  console.error('I després:');
  console.error('  npx tsx scripts/create-admin.ts');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const email = 'admin@vilaficticia.cat';
  const password = 'Admin123!';

  console.log(`Creant usuari administrador: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: 'admin' },
    user_metadata: { full_name: 'Administrador Vilafictícia' },
  });

  if (error) {
    if (error.message?.includes('already exists')) {
      console.log('L\'usuari ja existeix. Actualitzant metadades...');

      const { data: users } = await supabase.auth.admin.listUsers();
      const existing = users?.users.find((u) => u.email === email);

      if (existing) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existing.id,
          {
            app_metadata: { role: 'admin' },
            user_metadata: { full_name: 'Administrador Vilafictícia' },
          }
        );

        if (updateError) {
          console.error('Error actualitzant l\'usuari:', updateError.message);
          process.exit(1);
        }

        console.log('Metadades actualitzades correctament.');
      }
    } else {
      console.error('Error creant l\'usuari:', error.message);
      process.exit(1);
    }
  } else {
    console.log('Usuari creat correctament!');
  }

  console.log('---');
  console.log('Email:    admin@vilaficticia.cat');
  console.log('Password: Admin123!');
  console.log('Rol:      admin (app_metadata)');
  console.log('---');
  console.log('Pots iniciar sessió a /admin/login');
}

main();
