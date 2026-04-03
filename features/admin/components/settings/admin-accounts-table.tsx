'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { deactivateAdmin } from '../../actions/admin-content-actions'
import type { AdminUser } from '../../types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface AdminAccountsTableProps {
  initialAdmins: AdminUser[]
}

export function AdminAccountsTable({ initialAdmins }: AdminAccountsTableProps) {
  const t = useTranslations('Admin.Settings')
  const tc = useTranslations('Admin.Common')
  
  const [admins, setAdmins] = useState(initialAdmins)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDeactivate = async (adminId: string) => {
    const confirmed = window.confirm(t('confirmDeactivate'))
    if (!confirmed) return

    setLoadingId(adminId)
    const result = await deactivateAdmin(adminId)
    if (result.success) {
      setAdmins(prev => prev.filter(a => a.user_id !== adminId))
    } else {
      alert(result.error)
    }
    setLoadingId(null)
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('displayName')}</TableHead>
            <TableHead>{t('level')}</TableHead>
            <TableHead>{t('created')}</TableHead>
            <TableHead className="text-right">{tc('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.user_id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {admin.display_name}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">{admin.email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={admin.admin_level === 'super' ? 'default' : 'outline'}>
                  {t(admin.admin_level as any)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">
                {new Date(admin.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {admin.admin_level !== 'super' ? (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDeactivate(admin.user_id)}
                    disabled={loadingId === admin.user_id}
                    className="text-destructive hover:text-destructive"
                  >
                    {t('deactivate')}
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {admins.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-sm text-muted-foreground">
                {t('noAdmins')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
