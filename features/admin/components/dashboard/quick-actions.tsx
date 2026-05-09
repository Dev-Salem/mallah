'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/routing'
import { PlusCircle, Search, ShieldCheck, History } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuickActionsProps {
  isSuperAdmin: boolean
}

export function QuickActions({ isSuperAdmin }: QuickActionsProps) {
  const t = useTranslations('Admin.Dashboard.QuickActions')

  const actions = [
    {
      label: t('addTopic'),
      href: `/admin/content/topics/new`,
      icon: PlusCircle,
    },
    {
      label: t('addSkill'),
      href: `/admin/content/skills`,
      icon: Search,
    },
    {
      label: t('reviewSkills'),
      href: `/admin/content/skills?filter=pending`,
      icon: ShieldCheck,
    },
    ...(isSuperAdmin
      ? [
          {
            label: t('viewAudit'),
            href: `/admin/audit`,
            icon: History,
          },
        ]
      : []),
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button key={action.label} variant="outline" size="sm" asChild>
          <Link href={action.href}>
            <action.icon className="h-3.5 w-3.5" />
            {action.label}
          </Link>
        </Button>
      ))}
    </div>
  )
}
