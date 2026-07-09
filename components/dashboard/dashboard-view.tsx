"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PriorityBadge } from "@/components/shared/badges"
import { useApp } from "@/components/app-provider"
import { formatDate, deadlineTone, daysUntil } from "@/lib/task-utils"
import { cn } from "@/lib/utils"
import {
  ListTodo,
  ShieldAlert,
  Flame,
  Loader2,
  CheckCircle2,
  CalendarClock,
  AlertTriangle,
  Target,
  Ban,
  ArrowRight,
  Crosshair,
} from "lucide-react"

export function DashboardView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const { tasks, risks } = useApp()
  const active = tasks.filter((t) => !t.archived)

  const total = active.length
  const critical = active.filter((t) => t.priority === "Critical").length
  const high = active.filter((t) => t.priority === "High").length
  const inProgress = active.filter((t) => t.status === "In Progress").length
  const done = active.filter((t) => t.status === "Done").length
  const blocked = active.filter((t) => t.blocked)
  const projectProgress = total > 0 ? Math.round((done / total) * 100) : 0

  const upcoming = [...active]
    .filter((t) => t.status !== "Done")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4)

  const topRisk = [...risks].sort((a, b) => impactRank(b.impact) - impactRank(a.impact))[0]

  const focusToday = active
    .filter((t) => t.priority === "Critical" && daysUntil(t.deadline) <= 1 && t.status !== "Done")
    .slice(0, 4)

  const criticalOpen = active
    .filter((t) => t.priority === "Critical" && t.status === "To Do")
    .slice(0, 3)

  const stats = [
    { label: "Всего задач", value: total, icon: ListTodo, tone: "text-foreground", bg: "bg-muted" },
    { label: "Critical", value: critical, icon: Flame, tone: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
    { label: "High", value: high, icon: ShieldAlert, tone: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" },
    { label: "In Progress", value: inProgress, icon: Loader2, tone: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
    { label: "Done", value: done, icon: CheckCircle2, tone: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
    { label: "Заблокировано", value: blocked.length, icon: Ban, tone: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Progress hero + stat cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardDescription>Прогресс проекта</CardDescription>
            <CardTitle className="text-4xl">{projectProgress}%</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Progress value={projectProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {done} из {total} задач завершено · Sprint 1
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-2">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <Card key={s.label}>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className={cn("flex size-10 items-center justify-center rounded-lg", s.bg)}>
                    <Icon className={cn("size-5", s.tone)} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-semibold leading-none">{s.value}</span>
                    <span className="mt-1 text-xs text-muted-foreground">{s.label}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Sprint progress bar */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-4 text-primary" /> Прогресс спринта — Sprint 1
              </CardTitle>
              <CardDescription>9–16 июля · Релиз 31 июля</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate("sprint")}>
              План спринта <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Progress value={projectProgress} className="h-2.5" />
            <span className="w-10 text-right text-sm font-medium">{projectProgress}%</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
            <span>To Do: {active.filter((t) => t.status === "To Do").length}</span>
            <span>In Progress: {inProgress}</span>
            <span>Testing: {active.filter((t) => t.status === "Testing").length}</span>
            <span>Done: {done}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Focus today */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Crosshair className="size-4 text-primary" /> Сегодня в фокусе
            </CardTitle>
            <CardDescription>Critical с дедлайном сегодня/завтра</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {focusToday.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет срочных critical-задач.</p>
            ) : (
              focusToday.map((t) => (
                <div key={t.id} className="flex items-start gap-3">
                  <span className="mt-0.5 font-mono text-xs text-muted-foreground">{t.id}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-snug">{t.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.assignee} · {formatDate(t.deadline)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="size-4 text-primary" /> Ближайшие дедлайны
            </CardTitle>
            <CardDescription>Незавершённые задачи</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {upcoming.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">{t.id}</p>
                </div>
                <span className={cn("shrink-0 text-xs font-medium", deadlineTone(t.deadline))}>
                  {formatDate(t.deadline)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Main risk */}
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-red-500" /> Главный риск
            </CardTitle>
            <CardDescription>Наивысший impact</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {topRisk ? (
              <>
                <p className="text-sm font-medium leading-snug">{topRisk.title}</p>
                <p className="text-xs text-muted-foreground">{topRisk.description}</p>
                <Button variant="outline" size="sm" className="w-fit" onClick={() => onNavigate("risks")}>
                  Все риски <ArrowRight data-icon="inline-end" />
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Рисков нет.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Blocked */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Ban className="size-4 text-red-500" /> Что заблокировано
            </CardTitle>
          </CardHeader>
          <CardContent>
            {blocked.length === 0 ? (
              <p className="text-sm text-muted-foreground">Заблокированных задач нет — отлично.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {blocked.map((t) => (
                  <div key={t.id} className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                      <PriorityBadge priority={t.priority} />
                    </div>
                    <p className="mt-1 text-sm font-medium">{t.title}</p>
                    {t.blockerReason && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">{t.blockerReason}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next CTO action */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="size-4 text-primary" /> Следующее действие CTO
            </CardTitle>
            <CardDescription>Рекомендации на основе состояния спринта</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <NextAction
              n={1}
              text="Разблокировать цепочку Education: закрыть CAR-001 и CAR-002, чтобы стартовал CAR-003 (авто-подбор когорты)."
            />
            <NextAction
              n={2}
              text="Подтвердить контракт API моделей Resume (CAR-004), чтобы фронт (CAR-012) не простаивал."
            />
            <NextAction
              n={3}
              text="Проверить готовность инфраструктуры LiveKit и S3/MinIO к релизу 31 июля."
            />
            {criticalOpen.length > 0 && (
              <>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Открытые critical в To Do: {criticalOpen.map((t) => t.id).join(", ")}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NextAction({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {n}
      </span>
      <p className="text-sm leading-snug">{text}</p>
    </div>
  )
}

function impactRank(impact: string): number {
  return { Critical: 4, High: 3, Medium: 2, Low: 1 }[impact] ?? 0
}
