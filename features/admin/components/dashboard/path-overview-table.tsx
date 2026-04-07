'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function PathOverviewTable({
  paths,
}: {
  paths: { path_id: string; name: string; learner_count: number; avg_completion: number; active_this_week: number }[]
}) {
  const t = useTranslations('Admin.Dashboard.PathOverview')

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">{t('name')}</TableHead>
              <TableHead className="text-right">{t('learners')}</TableHead>
              <TableHead className="text-right">{t('avgCompletion')}</TableHead>
              <TableHead className="text-right pr-6">{t('active')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paths.map((path) => (
              <TableRow key={path.path_id}>
                <TableCell className="pl-6 font-medium text-foreground">
                  {path.name}
                </TableCell>
                <TableCell className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                  {path.learner_count}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="text-success border-success/20 bg-success/5 tabular-nums">
                    {path.avg_completion}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6 font-mono text-xs text-muted-foreground tabular-nums">
                  {path.active_this_week}
                </TableCell>
              </TableRow>
            ))}
            {paths.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {t('noPaths')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
