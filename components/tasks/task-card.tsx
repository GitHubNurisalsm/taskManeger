"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PriorityBadge } from "@/components/shared/badges"
import { useApp } from "@/components/app-provider"
import { STATUSES, formatDate, deadlineTone } from "@/lib/task-utils"
import { cn } from "@/lib/utils"
import type { Task, Status } from "@/types/task"
import {
  MoreVertical,
  CalendarClock,
  Link2,
  Ban,
  Layers,
  ArrowRightLeft,
  Eye,
  CheckSquare,
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

export function TaskCard({ task, onOpen }: { task: Task; onOpen: (task: Task) => void }) {
  const { setTaskStatus, toggleBlocked } = useApp()
  const doneCount = task.definitionOfDone.filter((d) => d.done).length

  return (
    <Card
      className={cn(
        "group cursor-pointer gap-0 p-3 transition-shadow hover:shadow-md",
        task.blocked && "border-red-500/40",
      )}
      onClick={() => onOpen(task)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-medium text-muted-foreground">{task.id}</span>
        <div className="flex items-center gap-1">
          <PriorityBadge priority={task.priority} />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Действия"
                />
              }
            >
              <MoreVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onOpen(task)}>
                <Eye data-icon="inline-start" /> Открыть
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleBlocked(task.id)}>
                <Ban data-icon="inline-start" />
                {task.blocked ? "Снять блокер" : "Отметить блокер"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Изменить статус</DropdownMenuLabel>
              <DropdownMenuGroup>
                {STATUSES.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    disabled={s === task.status}
                    onClick={() => setTaskStatus(task.id, s as Status)}
                  >
                    <ArrowRightLeft data-icon="inline-start" /> {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="mt-2 text-sm font-medium leading-snug text-balance">{task.title}</p>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Layers className="size-3" /> {task.epic}
        </span>
        {task.dependsOn.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <Link2 className="size-3" /> {task.dependsOn.join(", ")}
          </span>
        )}
      </div>

      {task.blocked && (
        <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
          <Ban className="size-3" /> Заблокировано
        </div>
      )}

      <div className="mt-2 flex items-center gap-2">
        <Progress value={task.progress} className="h-1.5" />
        <span className="w-8 text-right text-[10px] text-muted-foreground">{task.progress}%</span>
      </div>

      <div className="mt-3 grid gap-2 border-t border-border pt-2.5 sm:flex sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          <Avatar className="size-6">
            <AvatarFallback className="text-[10px]">{initials(task.assignee)}</AvatarFallback>
          </Avatar>
          <span className="truncate text-xs text-muted-foreground">{task.assignee}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <CheckSquare className="size-3" /> {doneCount}/{task.definitionOfDone.length}
          </span>
          <span className={cn("inline-flex items-center gap-1", deadlineTone(task.deadline))}>
            <CalendarClock className="size-3" /> {formatDate(task.deadline)}
          </span>
        </div>
      </div>
    </Card>
  )
}
