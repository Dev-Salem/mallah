'use client'

import { useTranslations } from 'next-intl'
import type { AdminUserProject } from '../../types'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface UserProjectsTableProps {
  submissions: AdminUserProject[]
}

const statusColors: Record<string, string> = {
  completed: 'bg-success/10 text-success border-success/20',
  waiting: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
}

const reviewStatusColors: Record<string, string> = {
  complete: 'bg-success/10 text-success border-success/20',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
  none: 'bg-muted text-muted-foreground',
}

const mockSubmissions: AdminUserProject[] = [
  {
    id: 'mock-1',
    user_id: 'mock-u1',
    project_id: 'mock-p1',
    status: 'completed',
    started_at: '2026-04-20T10:00:00Z',
    completed_at: '2026-04-28T14:30:00Z',
    github_url: 'https://github.com/sara-dev/personal-profile',
    demo_url: 'https://sara-profile.netlify.app',
    project_name: 'Personal Profile Page',
    tech_stack: ['HTML', 'CSS', 'JavaScript'],
    review_status: 'complete',
    learner_name: 'Sara Ahmed',
    learner_email: 'sara.ahmed@example.com',
    project_title: 'PROJECT: Personal Profile Page',
    stage_title: 'Web Foundations',
  },
  {
    id: 'mock-2',
    user_id: 'mock-u2',
    project_id: 'mock-p2',
    status: 'waiting',
    started_at: '2026-04-25T09:00:00Z',
    completed_at: '2026-05-05T16:00:00Z',
    github_url: 'https://github.com/omar-coder/quiz-app',
    demo_url: null,
    project_name: 'Interactive Quiz App',
    tech_stack: ['React', 'TypeScript', 'Tailwind CSS'],
    review_status: 'pending',
    learner_name: 'Omar Khalil',
    learner_email: 'omar.khalil@example.com',
    project_title: 'PROJECT: Interactive Quiz App',
    stage_title: 'Frontend Essentials',
  },
  {
    id: 'mock-3',
    user_id: 'mock-u3',
    project_id: 'mock-p3',
    status: 'completed',
    started_at: '2026-04-18T08:00:00Z',
    completed_at: '2026-04-30T12:00:00Z',
    github_url: 'https://github.com/layla-js/landing-page',
    demo_url: 'https://layla-landing.vercel.app',
    project_name: 'Responsive Landing Page',
    tech_stack: ['HTML', 'CSS', 'Flexbox'],
    review_status: 'failed',
    learner_name: 'Layla Nasser',
    learner_email: 'layla.nasser@example.com',
    project_title: 'PROJECT: Responsive Landing Page',
    stage_title: 'Web Foundations',
  },
  {
    id: 'mock-4',
    user_id: 'mock-u4',
    project_id: 'mock-p4',
    status: 'in_progress',
    started_at: '2026-05-01T11:00:00Z',
    completed_at: null,
    github_url: null,
    demo_url: null,
    project_name: 'Task Manager App',
    tech_stack: ['React', 'Node.js'],
    review_status: 'none',
    learner_name: 'Youssef Ali',
    learner_email: 'youssef.ali@example.com',
    project_title: 'PROJECT: Task Manager App',
    stage_title: 'Frontend Proficiency',
  },
  {
    id: 'mock-5',
    user_id: 'mock-u5',
    project_id: 'mock-p5',
    status: 'completed',
    started_at: '2026-03-10T10:00:00Z',
    completed_at: '2026-03-25T09:00:00Z',
    github_url: 'https://github.com/fatima-dev/rest-api',
    demo_url: null,
    project_name: 'REST API Server',
    tech_stack: ['Node.js', 'Express', 'PostgreSQL'],
    review_status: 'complete',
    learner_name: 'Fatima Hassan',
    learner_email: 'fatima.hassan@example.com',
    project_title: 'PROJECT: REST API Server',
    stage_title: 'Backend Basics',
  },
]

export function UserProjectsTable({ submissions }: UserProjectsTableProps) {
  const t = useTranslations('Admin.Projects')

  const data = submissions.length > 0 ? submissions : mockSubmissions
  const isMock = submissions.length === 0

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {isMock && (
        <div className="px-4 py-2 bg-muted/50 border-b text-xs text-muted-foreground text-center">
          {t('mockDataNotice')}
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('learner')}</TableHead>
            <TableHead>{t('projectTitle')}</TableHead>
            <TableHead>{t('submissionStatus')}</TableHead>
            <TableHead>{t('reviewStatus')}</TableHead>
            <TableHead>{t('stage')}</TableHead>
            <TableHead>Links</TableHead>
            <TableHead className="text-right">{t('submittedAt')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-foreground text-sm">{sub.learner_name}</p>
                  <p className="text-muted-foreground font-mono text-xs">{sub.learner_email}</p>
                </div>
              </TableCell>
              <TableCell className="text-sm">{sub.project_name || sub.project_title}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`text-xs ${statusColors[sub.status] || ''}`}>
                  {t(`status_${sub.status}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`text-xs ${reviewStatusColors[sub.review_status || 'none']}`}>
                  {t(`review_${sub.review_status || 'none'}`)}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{sub.stage_title || '—'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {sub.github_url && (
                    <a href={sub.github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                      GitHub
                    </a>
                  )}
                  {sub.demo_url && (
                    <a href={sub.demo_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                      Demo
                    </a>
                  )}
                  {!sub.github_url && !sub.demo_url && <span className="text-xs text-muted-foreground">—</span>}
                </div>
              </TableCell>
              <TableCell className="text-right text-xs text-muted-foreground font-mono">
                {sub.completed_at ? new Date(sub.completed_at).toLocaleDateString() : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
