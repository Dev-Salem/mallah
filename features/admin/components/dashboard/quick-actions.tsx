'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { PlusCircle, Search, ShieldCheck, History } from 'lucide-react'

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
        <Link
          key={action.label}
          href={action.href}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
        >
          <action.icon className="h-3.5 w-3.5" />
          <span>{action.label}</span>
        </Link>
      ))}
    </div>
  )
}
