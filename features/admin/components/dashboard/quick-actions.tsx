'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { PlusCircle, Search, ShieldCheck, History } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuickActionsProps {
  adminBasePath: string
  isSuperAdmin: boolean
}

export function QuickActions({ adminBasePath, isSuperAdmin }: QuickActionsProps) {
  const t = useTranslations('Admin.Dashboard.QuickActions')

  const actions = [
    {
      label: t('addTopic'),
      href: `/${adminBasePath}/content/topics/new`,
      icon: PlusCircle,
    },
    {
      label: t('addSkill'),
      href: `/${adminBasePath}/content/skills`,
      icon: Search,
    },
    {
      label: t('reviewSkills'),
      href: `/${adminBasePath}/content/skills?filter=pending`,
      icon: ShieldCheck,
    },
    ...(isSuperAdmin
      ? [
          {
            label: t('viewAudit'),
            href: `/${adminBasePath}/audit`,
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
