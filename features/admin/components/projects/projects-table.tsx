'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { updateProject, createProject } from '../../actions/admin-content-actions'
import type { AdminProject } from '../../types'

interface ProjectsTableProps {
  initialProjects: AdminProject[]
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const t = useTranslations('Admin.Projects')
  const tc = useTranslations('Admin.Common')
  
  const [projects] = useState(initialProjects)
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty_level: 'beginner',
    is_active: true,
    is_public_default: true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openCreate = () => {
    setEditingProject(null)
    setFormData({ title: '', description: '', difficulty_level: 'beginner', is_active: true, is_public_default: true })
    setShowDrawer(true)
  }

  const openEdit = (project: AdminProject) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      difficulty_level: project.difficulty_level || 'beginner',
      is_active: project.is_active,
      is_public_default: project.is_public_default,
    })
    setShowDrawer(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      if (editingProject) {
        const result = await updateProject(editingProject.project_id, formData)
        if (!result.success) setError(result.error || 'Failed to update')
        else setShowDrawer(false)
      } else {
        const result = await createProject(formData)
        if (!result.success) setError(result.error || 'Failed to create')
        else setShowDrawer(false)
      }
    } catch {
      setError('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-zinc-200 text-zinc-900 text-sm font-bold rounded-lg hover:bg-white transition-all shadow-lg active:scale-95"
        >
          + {t('add')}
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="text-left px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('name')}</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{t('difficulty')}</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Source</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{tc('status')}</th>
              <th className="text-right px-5 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{tc('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
            {projects.map((project) => (
              <tr key={project.project_id} className="hover:bg-zinc-800/30 transition-all duration-200 group">
                <td className="px-5 py-4 text-zinc-200 font-semibold group-hover:text-blue-400 transition-colors">{project.title}</td>
                <td className="px-5 py-4">
                  <span className="text-xs text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded uppercase tracking-tighter">
                    {t(project.difficulty_level as any || 'beginner')}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 italic bg-zinc-950/20 px-2 py-0.5 rounded">
                    {project.source_type === 'roadmap' ? t('roadmapLinked') : t('standalone')}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                      project.is_active 
                        ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/5 text-red-500/80 border-red-500/20'
                    }`}
                  >
                    {project.is_active ? t('active') : t('hidden')}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => openEdit(project)}
                    className="text-[10px] font-bold uppercase text-zinc-500 hover:text-zinc-200 transition-colors tracking-widest"
                  >
                    {tc('edit')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDrawer && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setShowDrawer(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-zinc-900 border-l border-zinc-800 z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {editingProject ? t('edit') : t('add')}
                </h2>
                <button 
                  onClick={() => setShowDrawer(false)} 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{t('name')}</label>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{t('description')}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{t('difficulty')}</label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="beginner">{t('beginner')}</option>
                    <option value="intermediate">{t('intermediate')}</option>
                    <option value="advanced">{t('advanced')}</option>
                  </select>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
                    <div className="space-y-0.5">
                      <label className="text-sm font-semibold text-zinc-200">{t('active')}</label>
                      <p className="text-[10px] text-zinc-500 italic lowercase tracking-wider">Visible to all users</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded border-zinc-700 bg-zinc-800"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-xl border border-zinc-800">
                    <div className="space-y-0.5">
                      <label className="text-sm font-semibold text-zinc-200">{t('public')}</label>
                      <p className="text-[10px] text-zinc-500 italic lowercase tracking-wider">Shared with learners by default</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.is_public_default}
                      onChange={(e) => setFormData({ ...formData, is_public_default: e.target.checked })}
                      className="w-5 h-5 accent-emerald-500 rounded border-zinc-700 bg-zinc-800"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-500 font-medium italic">⚠️ {error}</p>}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.title}
                  className="flex-1 py-4 bg-blue-600 text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50 active:scale-[0.98]"
                >
                  {saving ? tc('saving') : t('save')}
                </button>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="px-6 py-4 bg-zinc-800 text-zinc-400 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-700 hover:text-zinc-200 transition-all"
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
