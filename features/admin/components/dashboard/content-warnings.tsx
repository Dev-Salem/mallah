'use client'

import { useTranslations } from 'next-intl'
import { AlertCircle } from 'lucide-react'
import type { ContentWarning } from '../../types'

export function ContentWarnings({ warnings }: { warnings: ContentWarning[] }) {
  const t = useTranslations('Admin.Dashboard')

  return (
    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
      <div className="flex items-center gap-2 text-warning mb-3">
        <AlertCircle className="w-4 h-4" />
        <h2 className="text-sm font-semibold">{t('HealthWarnings')}</h2>
      </div>
      <div className="space-y-2">
        {warnings.map((w, idx) => (
          <div key={idx} className="text-xs text-foreground/70 py-1 border-b border-warning/10 last:border-0 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-warning/50 shrink-0" />
            {w.message}
          </div>
        ))}
      </div>
    </div>
  )
}
