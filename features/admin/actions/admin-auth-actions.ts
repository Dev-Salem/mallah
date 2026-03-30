'use server'

import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { logAdminEvent } from './audit-actions'
import type { AdminActionResult, AdminLevel } from '../types'
import { headers } from 'next/headers'

function getClientIp(headersList: Headers): string {
  return headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
    || headersList.get('x-real-ip')
    || 'unknown'
}

/**
 * Admin login — completely separate from learner login.
 * Validates that the user exists in the `admins` table and has role='admin' in learners.
 */
export async function adminLoginAction(
  email: string,
  password: string
): Promise<AdminActionResult> {
  const supabase = await createClient()
  const headersList = await headers()
  const ip = getClientIp(headersList)

  // 1. Attempt sign in via Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    // Log failed attempt (we don't know the admin_id so pass null)
    await logAdminEvent(
      '00000000-0000-0000-0000-000000000000', // placeholder for unknown
      'admin_login_failed',
      `Failed admin login attempt for email ${email} from IP ${ip}`,
      'admin',
      undefined,
      ip
    )
    return { success: false, error: 'Invalid credentials.' }
  }

  const userId = data.user.id

  // 2. Check that user has role='admin' in learners table
  const supabaseAdmin = getSupabaseAdmin()
  const { data: learner } = await supabaseAdmin
    .from('learners')
    .select('role, status')
    .eq('user_id', userId)
    .single()

  if (!learner || learner.role !== 'admin') {
    // Sign out — this person is not an admin
    await supabase.auth.signOut()
    return { success: false, error: 'Invalid credentials.' }
  }

  if (learner.status !== 'active') {
    await supabase.auth.signOut()
    return { success: false, error: 'Invalid credentials.' }
  }

  // 3. Verify they exist in admins table
  const { data: admin } = await supabaseAdmin
    .from('admins')
    .select('display_name, admin_level')
    .eq('user_id', userId)
    .single()

  if (!admin) {
    await supabase.auth.signOut()
    return { success: false, error: 'Invalid credentials.' }
  }

  // 4. Log successful login
  await logAdminEvent(
    userId,
    'admin_login',
    `Admin ${email} logged in from IP ${ip}`,
    'admin',
    userId,
    ip
  )

  return {
    success: true,
    data: {
      displayName: admin.display_name,
      adminLevel: admin.admin_level,
    },
  }
}

/**
 * Admin logout — signs out and logs the event.
 */
export async function adminLogoutAction(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await logAdminEvent(
      user.id,
      'admin_login', // reusing for logout tracking
      `Admin logged out`,
      'admin',
      user.id
    )
  }

  await supabase.auth.signOut()
}

/**
 * Get the current admin user info (called from layouts/components).
 */
export async function getCurrentAdmin(): Promise<{
  userId: string;
  email: string;
  displayName: string;
  adminLevel: AdminLevel;
} | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const supabaseAdmin = getSupabaseAdmin()
  const { data: admin } = await supabaseAdmin
    .from('admins')
    .select('display_name, admin_level')
    .eq('user_id', user.id)
    .single()

  if (!admin) return null

  return {
    userId: user.id,
    email: user.email || '',
    displayName: admin.display_name,
    adminLevel: admin.admin_level as AdminLevel,
  }
}
