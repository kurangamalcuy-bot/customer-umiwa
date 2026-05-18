import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fsnynildvbkvtmdsuboe.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbnluaWxkdmJrdnRtZHN1Ym9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MTU2ODEsImV4cCI6MjA5MTk5MTY4MX0.F_WK-G9Y7BRLi6N129LluyliVyyYhE3Pd_Rj_KXIrRU'

export const supabase = createClient(supabaseUrl, supabaseKey)