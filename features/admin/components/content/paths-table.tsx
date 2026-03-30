'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { updatePath, createPath } from '../../actions/admin-content-actions'
import type { AdminPath } from '../../types'

interface PathsTableProps {
  initialPaths: AdminPath[]
}

export function PathsTable({ initialPaths }: PathsTableProps) {
  const t = useTranslations('Admin.Content.Paths')
  const tc = useTranslations('Admin.Common')
  
  const [paths] = useState(initialPaths)
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingPath, setEditingPath] = useState<AdminPath | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    path_id: '',
    is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => {
    setEditingPath(null)
    setFormData({ name: '', short_description: '', path_id: '', is_active: true })
    setShowDrawer(true)
  }

  const openEdit = (path: AdminPath) => {
    setEditingPath(path)
    setFormData({
      name: path.name,
      short_description: path.short_description,
      path_id: path.path_id,
      is_active: path.is_active,
    })
    setShowDrawer(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (editingPath) {
        const result = await updatePath(editingPath.path_id, {
          name: formData.name,
          short_description: formData.short_description,
          is_active: formData.is_active,
        })
        if (!result.success) setError(result.error || 'Failed to update')
        else setShowDrawer(false)
      } else {
        const slug = formData.path_id || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const result = await createPath({
          ...formData,
          path_id: slug,
        })
        if (!result.success) setError(result.error || 'Failed to create')
        else setShowDrawer(false)
      }
    } catch {
      setError('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async (path: AdminPath) => {
    const confirmed = window.confirm(
      `${path.learner_count} learners are currently enrolled in this path. Deactivating prevents new enrollments but does not remove existing learner progress. Continue?`
    )
    if (!confirmed) return

    await updatePath(path.path_id, { is_active: false })
  }

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="px-6 py-2.5 bg-zinc-200 text-zinc-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-xl shadow-white/5 active:scale-95"
        >
          + {t('add')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
                <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('name')}</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{tc('status')}</th>
                <th className="text-right px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('stages')}</th>
                <th className="text-right px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('learners')}</th>
                <th className="text-right px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{tc('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {paths.map((path) => (
                <tr key={path.path_id} className="hover:bg-zinc-800/40 transition-all duration-300 group/row">
                  <td className="px-6 py-4.5">
                    <div className="flex flex-col">
                      <span className="text-zinc-100 font-black tracking-tight uppercase group-hover/row:text-blue-400 transition-colors">
                        {path.name}
                      </span>
                      <span className="text-[10px] text-zinc-600 font-mono italic lowercase">{path.path_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase rounded tracking-widest border ${
                        path.is_active
                          ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.05)]'
                          : 'bg-zinc-800/50 text-zinc-600 border-zinc-700/50'
                      }`}
                    >
                      {path.is_active ? tc('active') : tc('inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-4.5 text-right font-mono text-zinc-400 text-xs tabular-nums">{path.stage_count}</td>
                  <td className="px-6 py-4.5 text-right font-mono text-zinc-400 text-xs tabular-nums">{path.learner_count}</td>
                  <td className="px-6 py-4.5 text-right space-x-4">
                    <button
                      onClick={() => openEdit(path)}
                      className="text-[10px] font-black uppercase text-zinc-500 hover:text-zinc-200 transition-all tracking-widest"
                    >
                      {tc('edit')}
                    </button>
                    {path.is_active && (
                      <button
                        onClick={() => handleDeactivate(path)}
                        className="text-[10px] font-black uppercase text-amber-500/60 hover:text-amber-400 transition-all tracking-widest"
                      >
                        {tc('deactivate')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Drawer */}
      {showDrawer && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] transition-all duration-500" onClick={() => setShowDrawer(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-[70] overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500 ease-out">
            <div className="p-10 space-y-10">
              <div className="flex items-center justify-between border-b border-zinc-800/50 pb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-white tracking-tightest uppercase italic">
                    {editingPath ? t('edit') : t('add')}
                  </h2>
                  <div className="h-1 w-12 bg-blue-600/50 rounded-full" />
                </div>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('name')}</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all placeholder:text-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{t('description_label')}</label>
                  <textarea
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    rows={4}
                    className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40 transition-all resize-none placeholder:text-zinc-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                    {t('slug')} {editingPath && <span className="text-zinc-700">(Read-Only)</span>}
                  </label>
                  <input
                    value={formData.path_id}
                    onChange={(e) => setFormData({ ...formData, path_id: e.target.value })}
                    disabled={!!editingPath}
                    className="w-full px-5 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-mono"
                    placeholder="auto-generated-slug"
                  />
                </div>

                <div className="flex items-center justify-between p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                  <div className="space-y-0.5">
                    <label className="text-xs font-black text-zinc-200 uppercase tracking-widest">{tc('active')}</label>
                    <p className="text-[10px] text-zinc-600 italic tracking-wider uppercase">Visible to all navigators</p>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                      formData.is_active ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-zinc-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                        formData.is_active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-center">
                  <p className="text-xs text-red-500 font-black uppercase tracking-widest italic">⚠️ {error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.name}
                  className="flex-1 py-4.5 bg-zinc-100 text-zinc-950 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all shadow-2xl shadow-white/5 active:scale-[0.98] disabled:opacity-30"
                >
                  {saving ? tc('saving') : tc('confirm')}
                </button>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="px-6 py-4.5 bg-zinc-900 text-zinc-500 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-800 hover:text-zinc-200 transition-all border border-zinc-800"
                >
                  {tc('cancel')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
