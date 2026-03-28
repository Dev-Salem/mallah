'use client'

import { useTranslations } from 'next-intl'

export function PathOverviewTable({
  paths,
}: {
  paths: { path_id: string; name: string; learner_count: number; avg_completion: number; active_this_week: number }[]
}) {
  const t = useTranslations('Admin.Dashboard.PathOverview')

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('title')}</h2>
        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/20">
              <th className="text-left px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                {t('name')}
              </th>
              <th className="text-right px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                {t('learners')}
              </th>
              <th className="text-right px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                {t('avgCompletion')}
              </th>
              <th className="text-right px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                {t('active')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {paths.map((path) => (
              <tr key={path.path_id} className="hover:bg-zinc-800/40 transition-all duration-300 group/row">
                <td className="px-6 py-4 text-zinc-200 font-bold uppercase tracking-tight group-hover/row:text-blue-400 transition-colors">
                  {path.name}
                </td>
                <td className="px-6 py-4 text-zinc-400 text-right font-mono text-xs tabular-nums">
                  {path.learner_count}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs font-black text-emerald-400/90 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 tabular-nums">
                    {path.avg_completion}%
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-zinc-400 font-mono text-xs tabular-nums">{path.active_this_week}</span>
                    <div className={`h-1 w-1 rounded-full ${path.active_this_week > 0 ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                  </div>
                </td>
              </tr>
            ))}
            {paths.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">
                    {t('noPaths')}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
