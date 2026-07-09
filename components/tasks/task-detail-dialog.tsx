"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PriorityBadge } from "@/components/shared/badges"
import { STATUSES, formatDate, deadlineTone } from "@/lib/task-utils"
import { useApp } from "@/components/app-provider"
import { cn } from "@/lib/utils"
import type { Task, Status } from "@/types/task"
import {
  CalendarClock,
  Layers,
  Timer,
  Link2,
  Ban,
  ShieldCheck,
  History,
  MessageSquare,
  Send,
} from "lucide-react"

function initials(name: string) {
  return name
    .split(/[\s#]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { setTaskStatus, toggleBlocked, toggleDod, addComment } = useApp()
  const [comment, setComment] = React.useState("")

  if (!task) return null

  const doneCount = task.definitionOfDone.filter((d) => d.done).length
  const dodProgress =
    task.definitionOfDone.length > 0
      ? Math.round((doneCount / task.definitionOfDone.length) * 100)
      : 0

  const submitComment = () => {
    const text = comment.trim()
    if (!text) return
    addComment(task.id, text)
    setComment("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border p-4 pb-4 text-left sm:p-6 sm:pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-muted-foreground">{task.id}</span>
            <PriorityBadge priority={task.priority} />
            {task.blocked && (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                <Ban className="size-3" /> Заблокировано
              </span>
            )}
          </div>
          <DialogTitle className="text-balance text-xl leading-tight">{task.title}</DialogTitle>
          <DialogDescription className="text-pretty">{task.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 p-4 sm:p-6">
          {/* Meta grid */}
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <MetaRow icon={Layers} label="Epic" value={task.epic} />
            <MetaRow
              icon={Timer}
              label="Оценка"
              value={task.estimate}
            />
            <div className="flex items-start gap-2.5">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">{initials(task.assignee)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Исполнитель</span>
                <span className="font-medium">{task.assignee}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CalendarClock className="mt-0.5 size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Дедлайн</span>
                <span className={cn("font-medium", deadlineTone(task.deadline))}>
                  {formatDate(task.deadline)}
                </span>
              </div>
            </div>
          </div>

          {/* Status control */}
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
            <div className="grid gap-2 sm:flex sm:items-center sm:justify-between sm:gap-3">
              <span className="text-sm font-medium">Статус</span>
              <Select value={task.status} onValueChange={(v) => setTaskStatus(task.id, v as Status)}>
                <SelectTrigger size="sm" className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={task.progress} className="h-2" />
              <span className="w-10 text-right text-xs font-medium text-muted-foreground">
                {task.progress}%
              </span>
            </div>
            <Button
              variant={task.blocked ? "secondary" : "outline"}
              size="sm"
              className="mt-1 w-full sm:w-fit"
              onClick={() => toggleBlocked(task.id)}
            >
              <Ban data-icon="inline-start" />
              {task.blocked ? "Снять блокер" : "Отметить блокер"}
            </Button>
            {task.blocked && task.blockerReason && (
              <p className="text-xs text-red-600 dark:text-red-400">{task.blockerReason}</p>
            )}
          </div>

          {/* Depends on */}
          {task.dependsOn.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Link2 className="size-4 text-muted-foreground" /> Зависит от
              </span>
              <div className="flex flex-wrap gap-2">
                {task.dependsOn.map((dep) => (
                  <span
                    key={dep}
                    className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Definition of Done */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <ShieldCheck className="size-4 text-muted-foreground" /> Definition of Done
              </span>
              <span className="text-xs text-muted-foreground">
                {doneCount}/{task.definitionOfDone.length} · {dodProgress}%
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {task.definitionOfDone.map((d) => (
                <label
                  key={d.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <Checkbox checked={d.done} onCheckedChange={() => toggleDod(task.id, d.id)} />
                  <span className={cn(d.done && "text-muted-foreground line-through")}>{d.text}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Comments */}
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <MessageSquare className="size-4 text-muted-foreground" /> Комментарии тимлида
            </span>
            {task.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Пока нет комментариев.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {task.comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="text-[10px]">TL</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-lg bg-muted p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{c.author}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(c.date)}</span>
                      </div>
                      <p className="mt-1 text-sm">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="grid gap-2 sm:flex sm:items-end">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Добавить комментарий..."
                className="min-h-10 resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing) {
                    e.preventDefault()
                    submitComment()
                  }
                }}
              />
              <Button className="sm:size-8" size="icon" onClick={submitComment} aria-label="Отправить комментарий">
                <Send />
              </Button>
            </div>
          </div>

          <Separator />

          {/* History */}
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <History className="size-4 text-muted-foreground" /> История изменений
            </span>
            <ol className="flex flex-col gap-2.5">
              {task.history.map((h) => (
                <li key={h.id} className="grid grid-cols-[auto_1fr] gap-x-2.5 gap-y-1 text-sm sm:flex sm:items-start">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="flex-1">{h.text}</span>
                  <span className="col-start-2 text-xs text-muted-foreground">{formatDate(h.date)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 text-muted-foreground" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    </div>
  )
}
