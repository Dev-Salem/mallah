'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Users, CheckCircle2, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react'
import type { DashboardStats, ContentWarning } from '../../types'

interface DashboardStatsCardsProps {
  stats: DashboardStats
  adminBasePath: string
}

export function DashboardStatsCards({ stats, adminBasePath }: DashboardStatsCardsProps) {
  const t = useTranslations('Admin.Dashboard.Stats')

  const cards = [
    {
      label: t('totalLearners'),
      value: stats.totalLearners.toLocaleString(),
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      href: `/${adminBasePath}/learners`,
    },
    {
      label: t('activeThisWeek'),
      value: stats.activeThisWeek.toLocaleString(),
      icon: Lightbulb,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: t('topicsCompleted'),
      value: stats.topicsCompletedLast30Days.toLocaleString(),
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      label: t('pendingSkills'),
      value: stats.pendingSkillReviews.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      href: `/${adminBasePath}/skills?filter=pending`,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Wrapper = card.href ? Link : 'div'
        const wrapperProps = card.href ? { href: card.href } : {}

        return (
          <Wrapper
            key={card.label}
            {...(wrapperProps as any)}
            className={`bg-zinc-900 border border-zinc-800 rounded-xl p-5 ${
              card.href ? 'hover:border-zinc-700 cursor-pointer transition-colors' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-zinc-100">{card.value}</p>
          </Wrapper>
        )
      })}
    </div>
  )
}
