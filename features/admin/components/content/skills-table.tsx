'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { verifySkill, rejectSkill, createSkill } from '../../actions/admin-content-actions'
import type { AdminSkill } from '../../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'

const CATEGORIES = ['fundamentals', 'language', 'framework_library', 'tool', 'platform_service', 'practice', 'other'] as const

export function SkillsTable({ initialSkills }: { initialSkills: AdminSkill[] }) {
  const t = useTranslations('Admin.Skills')
  const tc = useTranslations('Admin.Common')
  
  const [skills] = useState(initialSkills)
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [newSkill, setNewSkill] = useState({ skill_id: '', name: '', category: 'fundamentals' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const filtered = skills.filter((s) => {
    if (filter === 'verified' && !s.is_verified) return false
    if (filter === 'pending' && s.is_verified) return false
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false
    return true
  })

  const handleVerify = async (skillId: string) => {
    await verifySkill(skillId)
  }

  const handleReject = async (skillId: string) => {
    const confirmed = window.confirm(tc('confirm'))
    if (!confirmed) return
    await rejectSkill(skillId)
  }

  const handleCreateSkill = async () => {
    setSaving(true)
    setError('')
    const id = newSkill.skill_id || newSkill.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    const result = await createSkill({ skill_id: id, name: newSkill.name, category: newSkill.category })
    if (!result.success) setError(result.error || 'Failed')
    else {
      setShowCreate(false)
      setNewSkill({ skill_id: '', name: '', category: 'fundamentals' })
    }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'verified' | 'pending')}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="verified">{t('verified')}</option>
            <option value="pending">{t('pending')}</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`categories.${c}`)}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={() => setShowCreate(true)}>
          + {t('add')}
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name')}</TableHead>
              <TableHead>{t('category')}</TableHead>
              <TableHead>{tc('status')}</TableHead>
              <TableHead className="text-right">{tc('actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((skill) => (
              <TableRow key={skill.skill_id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {skill.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">{skill.skill_id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {t(`categories.${skill.category as any}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={skill.is_verified ? 'default' : 'secondary'}
                    className={skill.is_verified
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-warning/10 text-warning border-warning/20'
                    }
                  >
                    {skill.is_verified ? t('verified') : t('pending')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {!skill.is_verified ? (
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="xs" onClick={() => handleVerify(skill.skill_id)}
                        className="text-success hover:text-success"
                      >
                        {t('verify')}
                      </Button>
                      <Button variant="ghost" size="xs" onClick={() => handleReject(skill.skill_id)}
                        className="text-destructive hover:text-destructive"
                      >
                        {t('reject')}
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-sm text-muted-foreground">
                  {filter === 'pending' ? t('noPending') : t('noSkills')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Drawer */}
      <Sheet open={showCreate} onOpenChange={setShowCreate}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t('add')}</SheetTitle>
            <SheetDescription>
              Admin-created skills are verified by default.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="skill-name">{t('name')}</Label>
              <Input
                id="skill-name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g. Advanced TypeScript"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-category">{t('category')}</Label>
              <select
                id="skill-category"
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{t(`categories.${c}`)}</option>
                ))}
              </select>
            </div>

            <div className="rounded-md border border-input bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                New skills will be created as <span className="text-success font-medium">Verified</span> by default.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md mb-4">
              <p className="text-xs font-medium text-destructive text-center">{error}</p>
            </div>
          )}

          <SheetFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              {tc('cancel')}
            </Button>
            <Button onClick={handleCreateSkill} disabled={saving || !newSkill.name}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? tc('saving') : tc('confirm')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
