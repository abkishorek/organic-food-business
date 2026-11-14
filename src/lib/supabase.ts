import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Product } from '../types';

interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { user_id: string };
        Insert: { user_id: string };
        Update: { user_id?: string };
        Relationships: [];
      };
      site_content: {
        Row: { id: number; products: Product[]; whatsapp_number: string; updated_at: string };
        Insert: { id?: number; products: Product[]; whatsapp_number?: string; updated_at?: string };
        Update: { id?: number; products?: Product[]; whatsapp_number?: string; updated_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_site_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

let configError: string | null = null;
let client: SupabaseClient<Database> | null = null;

if (url && anonKey) {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(parsedUrl.hostname)) {
      throw new Error('Supabase URL must use HTTPS.');
    }
    client = createClient<Database>(url, anonKey);
  } catch (error) {
    configError = error instanceof Error ? error.message : 'Supabase configuration is invalid.';
  }
} else if (url || anonKey) {
  configError = 'Set both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable the admin backend.';
}

export const supabase = client;
export const supabaseConfigError = configError;
