"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApp } from "@/components/app-provider"
import { useTaskFacets } from "@/lib/use-filtered-tasks"
import { formatDate } from "@/lib/task-utils"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { ReportRating } from "@/types/task"
import { Plus, CheckCircle2, AlertTriangle, Ban } from "lucide-react"

const ratingConfig: Record<ReportRating, { label: string; className: string; icon: React.ElementType }> = {
  Good: {
    label: "Good",
    className: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
    icon: CheckCircle2,
  },
  Risk: {
    label: "Risk",
    className: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    icon: AlertTriangle,
  },
  Blocked: {
    label: "Blocked",
    className: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
    icon: Ban,
  },
}

function initials(name: string) {
  return name.split(/[\s#]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase()
}

export function ReportsView() {
  const { reports, addReport, tasks } = useApp()
  const { assignees } = useTaskFacets(tasks)

  const [assignee, setAssignee] = React.useState(assignees[0] ?? "")
  const [date, setDate] = React.useState("2026-07-09")
  const [done, setDone] = React.useState("")
  const [blocking, setBlocking] = React.useState("")
  const [tomorrow, setTomorrow] = React.useState("")
  const [rating, setRating] = React.useState<ReportRating>("Good")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignee || !done.trim()) {
      toast.error("Укажите исполнителя и что сделано")
      return
    }
    addReport({ assignee, date, done, blocking, tomorrow, rating })
    setDone("")
    setBlocking("")
    setTomorrow("")
    setRating("Good")
    toast.success("Отчёт добавлен")
  }

  // group by date
  const byDate = React.useMemo(() => {
    const map = new Map<string, typeof reports>()
    for (const r of reports) {
      const arr = map.get(r.date) ?? []
      arr.push(r)
      map.set(r.date, arr)
    }
    return Array.from(map.entries()).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
  }, [reports])

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[380px_1fr]">
      {/* Form */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="size-4 text-primary" /> Новый ежедневный отчёт
          </CardTitle>
          <CardDescription>Заполняется каждым участником команды</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit}>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Исполнитель</FieldLabel>
                  <Select value={assignee} onValueChange={(v) => setAssignee(v ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {assignees.map((a) => (
                          <SelectItem key={a} value={a}>
                            {a}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="rep-date">Дата</FieldLabel>
                  <Input
                    id="rep-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="rep-done">Что сделал</FieldLabel>
                <Textarea
                  id="rep-done"
                  value={done}
                  onChange={(e) => setDone(e.target.value)}
                  placeholder="Завершил CAR-001, начал CAR-003..."
                  rows={3}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="rep-block">Что блокирует</FieldLabel>
                <Textarea
                  id="rep-block"
                  value={blocking}
                  onChange={(e) => setBlocking(e.target.value)}
                  placeholder="Жду ревью, нет доступа..."
                  rows={2}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="rep-tom">Что будет делать завтра</FieldLabel>
                <Textarea
                  id="rep-tom"
                  value={tomorrow}
                  onChange={(e) => setTomorrow(e.target.value)}
                  placeholder="Продолжу CAR-003, начну тесты..."
                  rows={2}
                />
              </Field>
              <Field>
                <FieldLabel>Оценка тимлида</FieldLabel>
                <Select value={rating} onValueChange={(v) => setRating(v as ReportRating)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Risk">Risk</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Button type="submit" className="w-full sm:w-fit">
                <Plus data-icon="inline-start" /> Добавить отчёт
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Reports list */}
      <div className="flex flex-col gap-6">
        {byDate.map(([day, items]) => (
          <div key={day} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold">{formatDate(day)}</h2>
              <span className="text-xs text-muted-foreground">{items.length} отчётов</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((r) => {
                const rc = ratingConfig[r.rating]
                const RIcon = rc.icon
                return (
                  <Card key={r.id}>
                    <CardContent className="flex flex-col gap-3 p-4">
                      <div className="grid gap-2 sm:flex sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-2">
                          <Avatar className="size-8">
                            <AvatarFallback className="text-xs">{initials(r.assignee)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate text-sm font-medium">{r.assignee}</span>
                        </div>
                        <Badge variant="outline" className={cn("font-medium", rc.className)}>
                          <RIcon className="size-3" /> {rc.label}
                        </Badge>
                      </div>
                      <ReportLine label="Сделал" value={r.done} />
                      {r.blocking && <ReportLine label="Блокирует" value={r.blocking} tone="risk" />}
                      {r.tomorrow && <ReportLine label="Завтра" value={r.tomorrow} />}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportLine({ label, value, tone }: { label: string; value: string; tone?: "risk" }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={cn(
          "text-xs font-medium",
          tone === "risk" ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      <p className="text-sm leading-snug">{value}</p>
    </div>
  )
}
