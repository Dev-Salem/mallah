'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  getStagesForPath,
  getTopicsForStage,
} from '../../actions/admin-content-actions'
import type { AdminPath, AdminStage, AdminTopic } from '../../types'

interface TopicsBrowserProps {
  paths: AdminPath[]
}

export function TopicsBrowser({ paths }: TopicsBrowserProps) {
  const t = useTranslations('Admin.Content.Topics')
  
  const [selectedPath, setSelectedPath] = useState<string>('')
  const [selectedStage, setSelectedStage] = useState<string>('')
  const [stages, setStages] = useState<AdminStage[]>([])
  const [topics, setTopics] = useState<AdminTopic[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedPath) { setStages([]); setSelectedStage(''); setTopics([]); return }
    setLoading(true)
    getStagesForPath(selectedPath).then(data => {
      setStages(data)
      setSelectedStage('')
      setTopics([])
      setLoading(false)
    })
  }, [selectedPath])

  useEffect(() => {
    if (!selectedStage) { setTopics([]); return }
    setLoading(true)
    getTopicsForStage(selectedStage).then(data => {
      setTopics(data)
      setLoading(false)
    })
  }, [selectedStage])

  const selectedPathName = paths.find(p => p.path_id === selectedPath)?.name || ''
  const selectedStageName = stages.find((s) => s.stage_id === selectedStage)?.title || ''

  return (
    <div className="space-y-6">
      {/* Path/Stage Selectors */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={selectedPath}
          onChange={(e) => setSelectedPath(e.target.value)}
          className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-zinc-700 cursor-pointer"
        >
          <option value="">{t('selectPath')}</option>
          {paths.map((p) => (
            <option key={p.path_id} value={p.path_id}>{p.name}</option>
          ))}
        </select>

        {stages.length > 0 && (
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-zinc-700 cursor-pointer"
          >
            <option value="">{t('selectStage')}</option>
            {stages.map((s) => (
              <option key={s.stage_id} value={s.stage_id}>
                {s.order_index}. {s.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Breadcrumb */}
      {selectedPath && (
        <div className="flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] bg-zinc-900/50 px-4 py-1.5 rounded-xl border border-zinc-800/50 w-fit backdrop-blur-sm grayscale group hover:grayscale-0 transition-all duration-500">
          <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors uppercase italic">{selectedPathName}</span>
          {selectedStageName && (
            <>
              <span className="text-zinc-800 font-mono">/</span>
              <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors uppercase italic">{selectedStageName}</span>
            </>
          )}
          {selectedStage && (
            <>
              <span className="text-zinc-800 font-mono">/</span>
              <span className="text-blue-500/80 font-black animate-pulse uppercase italic">{t('title')}</span>
            </>
          )}
        </div>
      )}

      {/* Topics Table */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-1 overflow-hidden bg-zinc-800 rounded-full">
            <div className="w-full h-full bg-blue-500 animate-slide-right-to-left" />
          </div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] animate-pulse italic">
            Retrieving Content Ledger...
          </p>
        </div>
      )}

      {!loading && topics.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
                  <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic font-serif">#</th>
                  <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('name')}</th>
                  <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('type')}</th>
                  <th className="text-right px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('estimated_time')}</th>
                  <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('difficulty')}</th>
                  <th className="text-center px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('mandatory')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {topics.map((topic) => (
                  <tr key={topic.topic_id} className="hover:bg-zinc-800/40 transition-all duration-300 group/row">
                    <td className="px-6 py-4.5 text-zinc-600 font-mono text-xs tabular-nums">{topic.order_index}</td>
                    <td className="px-6 py-4.5">
                      <span className="text-zinc-100 font-black tracking-tight uppercase group-hover/row:text-blue-400 transition-colors">
                        {topic.title}
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-950/30 px-2.5 py-1 rounded-md border border-zinc-800/50 lowercase italic">
                        {topic.topic_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-right font-mono text-zinc-400 text-xs tabular-nums">
                      {topic.estimated_time_min ? `${topic.estimated_time_min}m` : '—'}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border border-zinc-800 px-2 py-0.5 rounded">
                        {topic.difficulty_level || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase rounded tracking-widest border ${
                          topic.is_mandatory 
                            ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' 
                            : 'bg-zinc-800/50 text-zinc-700 border-zinc-800/50'
                        }`}
                      >
                        {topic.is_mandatory ? t('yes') : t('no')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && selectedStage && topics.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl py-20 text-center shadow-xl">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] italic">
            {t('noTopics')}
          </p>
        </div>
      )}
    </div>
  )
}
