"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImpactBadge } from "@/components/shared/badges"
import { useApp } from "@/components/app-provider"
import { useTaskFacets } from "@/lib/use-filtered-tasks"
import { formatDate, deadlineTone } from "@/lib/task-utils"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { RiskImpact, RiskStatus } from "@/types/task"
import { Plus, ShieldCheck, User, CalendarClock, AlertTriangle } from "lucide-react"

const statusConfig: Record<RiskStatus, string> = {
  Open: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  Mitigating: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Resolved: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
}

export function RisksView() {
  const { risks, addRisk, tasks } = useApp()
  const { assignees } = useTaskFacets(tasks)

  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [impact, setImpact] = React.useState<RiskImpact>("Medium")
  const [owner, setOwner] = React.useState(assignees[0] ?? "")
  const [status, setStatus] = React.useState<RiskStatus>("Open")
  const [mitigation, setMitigation] = React.useState("")
  const [deadline, setDeadline] = React.useState("2026-07-16")

  const reset = () => {
    setTitle("")
    setDescription("")
    setImpact("Medium")
    setStatus("Open")
    setMitigation("")
    setDeadline("2026-07-16")
  }

  const submit = () => {
    if (!title.trim()) {
      toast.error("Укажите название риска")
      return
    }
    addRisk({ title, description, impact, owner, status, mitigation, deadline })
    reset()
    setOpen(false)
    toast.success("Риск добавлен")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 sm:flex sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Всего рисков: {risks.length}</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm" className="w-full sm:w-auto" />}>
            <Plus data-icon="inline-start" /> Добавить риск
          </DialogTrigger>
          <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Новый риск</DialogTitle>
              <DialogDescription>Опишите риск проекта и план его снижения.</DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="risk-title">Название</FieldLabel>
                <Input
                  id="risk-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: зависимость от внешнего API"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="risk-desc">Описание</FieldLabel>
                <Textarea
                  id="risk-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Impact</FieldLabel>
                  <Select value={impact} onValueChange={(v) => setImpact(v as RiskImpact)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {(["Low", "Medium", "High", "Critical"] as RiskImpact[]).map((i) => (
                          <SelectItem key={i} value={i}>
                            {i}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Owner</FieldLabel>
                  <Select value={owner} onValueChange={(v) => setOwner(v ?? "")}>
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
                  <FieldLabel>Status</FieldLabel>
                  <Select value={status} onValueChange={(v) => setStatus(v as RiskStatus)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {(["Open", "Mitigating", "Resolved"] as RiskStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="risk-deadline">Deadline</FieldLabel>
                  <Input
                    id="risk-deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="risk-mit">Mitigation plan</FieldLabel>
                <Textarea
                  id="risk-mit"
                  value={mitigation}
                  onChange={(e) => setMitigation(e.target.value)}
                  rows={2}
                  placeholder="Как снижаем риск..."
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>Отмена</DialogClose>
              <Button onClick={submit}>Сохранить риск</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {risks.map((r) => (
          <Card key={r.id} className={cn(r.impact === "Critical" && "border-red-500/30")}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ImpactBadge impact={r.impact} />
                <Badge variant="outline" className={cn("font-medium", statusConfig[r.status])}>
                  {r.status}
                </Badge>
              </div>
              <CardTitle className="flex items-start gap-2 text-base leading-snug">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="text-balance">{r.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground text-pretty">{r.description}</p>
              <Separator />
              <div className="flex flex-col gap-1.5 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="size-4" /> План снижения
                </span>
                <p className="text-pretty">{r.mitigation}</p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <User className="size-3" /> {r.owner}
                </span>
                <span className={cn("inline-flex items-center gap-1", deadlineTone(r.deadline))}>
                  <CalendarClock className="size-3" /> {formatDate(r.deadline)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
