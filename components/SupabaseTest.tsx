import React, { useEffect } from 'react';
import { Text } from 'react-native';

/**
 * Temporary component to verify Supabase connection and environment var access.
 * Usage: Import and render this component somewhere in your app (e.g. the welcome screen)
 * It will run a query `supabase.from('test').select('*')` and console.log the result.
 */
export default function SupabaseTest(): JSX.Element {
  useEffect(() => {
    (async () => {
      try {
        console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);

        // Dynamically import the supabase client so this file doesn't break if the client
        // isn't present yet at build time. Replace the path if your client is located elsewhere.
        const mod = await import('@/lib/supabase').catch((err) => {
          console.warn('Could not import @/lib/supabase (is it created?)', err?.message ?? err);
          return null as any;
        });

        if (!mod) return;

        // Support both default export and named export patterns
        const supabase = (mod as any).default ?? (mod as any).supabase ?? (mod as any).createClient ? (mod as any) : null;
        if (!supabase) {
          console.warn('Supabase client not found as default or named export in @/lib/supabase');
          return;
        }

        // Attempt a simple query against a `test` table
        const { data, error } = await (supabase as any).from('test').select('*');
        console.log('Supabase query (from test):', { data, error });
      } catch (e) {
        console.error('Supabase test failed:', e);
      }
    })();
  }, []);

  return <Text>Checking Supabase... check console</Text>;
}
