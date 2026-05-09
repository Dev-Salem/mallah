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
  Sun,
  Moon,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { AdminLevel } from '../../types'

interface AdminSidebarProps {
  displayName: string
  adminLevel: AdminLevel
}

interface NavItem {
  id: string
  labelKey: string
  href: string
  icon: React.ElementType
  superOnly?: boolean
  children?: { id: string; labelKey: string; href: string; icon: React.ElementType }[]
}

export function AdminSidebar({ displayName, adminLevel }: AdminSidebarProps) {
  const t = useTranslations('Admin.Sidebar')
  const locale = useLocale()
  const pathname = usePathname()
  const [contentOpen, setContentOpen] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const base = `/${locale}/admin`

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
    window.location.href = `${base}/login`
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header with Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border">
        <Logo size={28} />
        <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
          {t('title')}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          if (item.superOnly && adminLevel !== 'super') return null

          if (item.children) {
            return (
              <div key={item.id}>
                <button
                  onClick={() => setContentOpen(!contentOpen)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors cursor-pointer"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{t(item.labelKey)}</span>
                  {contentOpen ? (
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                  )}
                </button>
                {contentOpen && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href}
                        className={`flex items-center gap-3 px-3 py-1.5 text-sm rounded-md transition-colors ${
                          isActive(child.href)
                            ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
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
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.href)
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${isActive(item.href) ? 'text-sidebar-primary' : ''}`} />
              <span>{t(item.labelKey)}</span>
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Footer: Admin info + Theme Toggle + Sign Out */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="overflow-hidden pr-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{displayName}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize">
              {t(adminLevel as any)}
            </p>
          </div>
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="shrink-0 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{t('signOut')}</span>
        </Button>
      </div>
    </aside>
  )
}
