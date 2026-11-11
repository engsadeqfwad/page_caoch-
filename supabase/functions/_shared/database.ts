import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.119.0';

export function database(url: string, key: string) {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, options?: RequestInit) => fetch(input, {
        ...options,
        signal: options?.signal
          ? AbortSignal.any([options.signal, AbortSignal.timeout(5_000)])
          : AbortSignal.timeout(5_000),
      }),
    },
  });
}
