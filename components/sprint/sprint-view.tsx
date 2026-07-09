"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PriorityBadge, StatusBadge } from "@/components/shared/badges"
import { useApp } from "@/components/app-provider"
import { mockSprintRoles } from "@/data/mockData"
import { formatDate, deadlineTone } from "@/lib/task-utils"
import { cn } from "@/lib/utils"
import { CalendarRange, Target, Rocket, TrendingUp } from "lucide-react"

function initials(name: string) {
  return name.split(/[\s#]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase()
}

export function SprintView() {
  const { tasks } = useApp()
  const active = tasks.filter((t) => !t.archived)
  const done = active.filter((t) => t.status === "Done").length
  const progress = active.length > 0 ? Math.round((done / active.length) * 100) : 0

  const byId = React.useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks])

  return (
    <div className="flex flex-col gap-6">
      {/* Sprint overview */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="size-4 text-primary" /> Цель спринта
            </CardTitle>
            <CardDescription>Sprint 1</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              Закрыть критичный функционал Education (когорты, каталог), Employment/Resume
              (модели и UI) и подготовить инфраструктуру Live Learning к релизу.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarRange className="size-4 text-primary" /> Период
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-xl font-semibold sm:text-2xl">9–16 июля</span>
            <span className="text-xs text-muted-foreground">Длительность 7 дней</span>
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Rocket className="size-4 text-primary" /> Release deadline
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            <span className="text-xl font-semibold sm:text-2xl">31 июля</span>
            <span className="text-xs text-muted-foreground">Продакшн-релиз Career</span>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="size-4 text-primary" /> Прогресс спринта
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Progress value={progress} className="h-3" />
            <span className="w-12 text-right text-sm font-medium">{progress}%</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {done} из {active.length} задач завершено
          </p>
        </CardContent>
      </Card>

      {/* Tasks by role */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">Задачи по ролям</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mockSprintRoles.map((role) => {
            const roleTasks = role.taskIds.map((id) => byId.get(id)).filter(Boolean)
            const roleDone = roleTasks.filter((t) => t!.status === "Done").length
            const rolePct = roleTasks.length > 0 ? Math.round((roleDone / roleTasks.length) * 100) : 0
            return (
              <Card key={role.role}>
                <CardHeader>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{initials(role.role)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-base">{role.role}</CardTitle>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {roleDone}/{roleTasks.length} · {rolePct}%
                    </span>
                  </div>
                  <Progress value={rolePct} className="mt-1 h-1.5" />
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {roleTasks.map((t) => (
                    <div key={t!.id} className="rounded-lg border border-border p-2.5">
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{t!.id}</span>
                        <span className="min-w-0 flex-1 text-sm font-medium leading-snug">{t!.title}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <PriorityBadge priority={t!.priority} />
                        <StatusBadge status={t!.status} />
                        <span className={cn("text-xs", deadlineTone(t!.deadline))}>{formatDate(t!.deadline)}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
