'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'
import type { EntityType, EventType } from '../types'

/**
 * Logs an admin action to the audit log.
 * Uses the admin (service role) client to bypass RLS,
 * since the audit log table is append-only with no direct insert policy.
 */
export async function logAdminEvent(
  adminId: string,
  eventType: EventType,
  description: string,
  entityType?: EntityType,
  entityId?: string,
  ipAddress?: string
): Promise<void> {
  const supabaseAdmin = getSupabaseAdmin()

  const { error } = await supabaseAdmin
    .from('admin_audit_log')
    .insert({
      admin_id: adminId,
      event_type: eventType,
      description,
      entity_type: entityType || null,
      entity_id: entityId || null,
      ip_address: ipAddress || null,
    })

  if (error) {
    console.error('Failed to log admin event:', error.message)
    // Audit logging failures should not block the operation
    // but should be logged for monitoring
  }
}
