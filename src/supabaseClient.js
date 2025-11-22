import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://lqczpzglmvxaqekkctih.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY3pwemdsbXZ4YXFla2tjdGloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3NzI4ODUsImV4cCI6MjA3OTM0ODg4NX0.rjEgTFlNz4M_TKpktVpi8cdesJ3Eaparub3VWMDJ5YM'
)
