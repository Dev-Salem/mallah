import { getSupabaseAdmin } from './lib/supabase/admin.js'

async function checkLearners() {
  const db = getSupabaseAdmin()
  const { data, error, count } = await db
    .from('learners')
    .select('*', { count: 'exact' })
  
  if (error) {
    console.error('Error fetching learners:', error)
  } else {
    console.log('Total learners in table:', count)
    if (data && data.length > 0) {
      console.log('Sample learner roles:', data.slice(0, 5).map(l => l.role))
      console.log('Sample learner statuses:', data.slice(0, 5).map(l => l.status))
    } else {
      console.log('Learners table is empty.')
    }
  }
}

checkLearners()
