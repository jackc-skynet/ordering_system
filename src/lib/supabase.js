import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ujyeyzxgyxomnvqhuzdy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqeWV5enhneXhvbW52cWh1emR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDYyMTYsImV4cCI6MjA4OTE4MjIxNn0.SHLgmznj6F6Ux01PLVRn71ZlRrrLeDIVqDi83i6u8zE'

export const supabase = createClient(supabaseUrl, supabaseKey)
