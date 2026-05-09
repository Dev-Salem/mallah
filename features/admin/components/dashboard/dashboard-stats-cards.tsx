'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n/routing'
import { Users, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { DashboardStats } from '../../types'

interface DashboardStatsCardsProps {
  stats: DashboardStats
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  const t = useTranslations('Admin.Dashboard.Stats')

  const cards = [
    {
      label: t('totalLearners'),
      value: stats.totalLearners.toLocaleString(),
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      href: `/admin/learners`,
    },
    {
      label: t('activeThisWeek'),
      value: stats.activeThisWeek.toLocaleString(),
      icon: Lightbulb,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: t('topicsCompleted'),
      value: stats.topicsCompletedLast30Days.toLocaleString(),
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: t('pendingSkills'),
      value: stats.pendingSkillReviews.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-info',
      bgColor: 'bg-info/10',
      href: `/admin/skills?filter=pending`,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const content = (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">
                {card.label}
              </span>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{card.value}</p>
          </>
        )

        if (card.href) {
          return (
            <Link key={card.label} href={card.href}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer py-4">
                <CardContent className="pb-0">{content}</CardContent>
              </Card>
            </Link>
          )
        }

        return (
          <Card key={card.label} className="py-4">
            <CardContent className="pb-0">{content}</CardContent>
          </Card>
        )
      })}
    </div>
  )
}
