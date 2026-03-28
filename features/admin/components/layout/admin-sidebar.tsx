'use client'

import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  LayoutDashboard,
  BookOpen,
  FolderKanban,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Route,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import type { AdminLevel } from '../../types'

interface AdminSidebarProps {
  displayName: string
  adminLevel: AdminLevel
  adminBasePath: string
}

interface NavItem {
  id: string
  labelKey: string
  href: string
  icon: React.ElementType
  superOnly?: boolean
  children?: { id: string; labelKey: string; href: string; icon: React.ElementType }[]
}

export function AdminSidebar({ displayName, adminLevel, adminBasePath }: AdminSidebarProps) {
  const t = useTranslations('Admin.Sidebar')
  const locale = useLocale()
  const pathname = usePathname()
  const [contentOpen, setContentOpen] = useState(true)

  const base = `/${locale}/${adminBasePath}`

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      labelKey: 'dashboard',
      href: `${base}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      id: 'content',
      labelKey: 'content',
      href: `${base}/content`,
      icon: BookOpen,
      children: [
        { id: 'paths', labelKey: 'paths', href: `${base}/content/paths`, icon: Route },
        { id: 'topics', labelKey: 'topics', href: `${base}/content/topics`, icon: Layers },
        { id: 'skills', labelKey: 'skills', href: `${base}/content/skills`, icon: Sparkles },
      ],
    },
    {
      id: 'projects',
      labelKey: 'projects',
      href: `${base}/projects`,
      icon: FolderKanban,
    },
    {
      id: 'learners',
      labelKey: 'learners',
      href: `${base}/learners`,
      icon: Users,
    },
    {
      id: 'audit',
      labelKey: 'auditLog',
      href: `${base}/audit`,
      icon: ClipboardList,
      superOnly: true,
    },
    {
      id: 'settings',
      labelKey: 'settings',
      href: `${base}/settings`,
      icon: Settings,
      superOnly: true,
    },
  ]

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const handleLogout = async () => {
    const { adminLogoutAction } = await import('../../actions/admin-auth-actions')
    await adminLogoutAction()
    // Manual redirect after server action to ensure absolute path works with localized routing
    window.location.href = `${base}/login`
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <span className="text-sm font-bold text-zinc-200 tracking-tight uppercase">
          {t('title')}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {navItems.map((item) => {
          if (item.superOnly && adminLevel !== 'super') return null

          if (item.children) {
            return (
              <div key={item.id}>
                <button
                  onClick={() => setContentOpen(!contentOpen)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-colors group"
                >
                  <item.icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-blue-400" />
                  <span className="flex-1 text-left">{t(item.labelKey)}</span>
                  {contentOpen ? (
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                  )}
                </button>
                {contentOpen && (
                  <div className="ml-4 mt-1.5 space-y-1 border-l border-zinc-800/50 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all ${
                          isActive(child.href)
                            ? 'bg-zinc-800/50 text-blue-400 font-medium'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                        }`}
                      >
                        <child.icon className="h-3.5 w-3.5 shrink-0" />
                        <span>{t(child.labelKey)}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all group ${
                isActive(item.href)
                  ? 'bg-zinc-900 text-blue-400 border border-zinc-800/50'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive(item.href) ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
              <span>{t(item.labelKey)}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer: Admin info + Sign Out */}
      <div className="border-t border-zinc-800 p-5 space-y-4">
        <div className="px-1">
          <p className="text-sm font-semibold text-zinc-200 truncate">{displayName}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            {t('clearance', { level: t(adminLevel as any) })}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-red-400/80 hover:text-red-400 hover:bg-red-500/5 border border-red-500/10 rounded-lg transition-all uppercase tracking-wider"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{t('signOut')}</span>
        </button>
      </div>
    </aside>
  )
}
