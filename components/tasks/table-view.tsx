"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TaskDetailDialog } from "@/components/tasks/task-detail-dialog"
import { TaskFilters, emptyFilters, type Filters } from "@/components/tasks/task-filters"
import { PriorityBadge, StatusBadge } from "@/components/shared/badges"
import { useApp } from "@/components/app-provider"
import { useFilteredTasks, useTaskFacets } from "@/lib/use-filtered-tasks"
import { STATUSES, formatDate, deadlineTone } from "@/lib/task-utils"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Task, Status } from "@/types/task"
import {
  MoreVertical,
  Eye,
  Ban,
  ArrowRightLeft,
  Archive,
  Link2,
  Check,
} from "lucide-react"

export function TableView() {
  const { tasks, setTaskStatus, toggleBlocked, archiveTask } = useApp()
  const [filters, setFilters] = React.useState<Filters>(emptyFilters)
  const [selected, setSelected] = React.useState<Task | null>(null)
  const [open, setOpen] = React.useState(false)

  const { assignees, epics } = useTaskFacets(tasks)
  const filtered = useFilteredTasks(tasks, filters)
  const selectedLive = selected ? tasks.find((t) => t.id === selected.id) ?? null : null

  const openTask = (task: Task) => {
    setSelected(task)
    setOpen(true)
  }

  const handleArchive = (task: Task) => {
    archiveTask(task.id)
    toast.success(`${task.id} архивирована`)
  }

  return (
    <div className="flex flex-col gap-4">
      <TaskFilters filters={filters} onChange={setFilters} assignees={assignees} epics={epics} />

      <div className="grid gap-3 md:hidden">
        {filtered.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => openTask(task)}
            className="rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted-foreground">{task.id}</p>
                <p className="mt-1 text-sm font-medium leading-snug text-balance">{task.title}</p>
              </div>
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              {task.blocked && (
                <span className="inline-flex items-center gap-1 rounded-md bg-red-500/15 px-1.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                  <Ban className="size-3" /> Blocked
                </span>
              )}
            </div>
            <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate">{task.assignee}</span>
                <span className={cn("shrink-0", deadlineTone(task.deadline))}>{formatDate(task.deadline)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={task.progress} className="h-1.5" />
                <span className="w-8 text-right">{task.progress}%</span>
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            Задачи не найдены. Попробуйте изменить фильтры.
          </Card>
        )}
      </div>

      <Card className="hidden overflow-hidden p-0 md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead className="min-w-56">Название</TableHead>
                <TableHead>Epic</TableHead>
                <TableHead>Исполнитель</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Estimate</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Depends</TableHead>
                <TableHead>Blocked</TableHead>
                <TableHead className="min-w-32">Progress</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((task) => (
                <TableRow
                  key={task.id}
                  className="cursor-pointer"
                  onClick={() => openTask(task)}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">{task.id}</TableCell>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{task.epic}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{task.assignee}</TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{task.estimate}</TableCell>
                  <TableCell className={cn("text-sm whitespace-nowrap", deadlineTone(task.deadline))}>
                    {formatDate(task.deadline)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {task.dependsOn.length > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Link2 className="size-3" /> {task.dependsOn.join(", ")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {task.blocked ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-red-500/15 px-1.5 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                        <Ban className="size-3" /> Да
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Нет</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress} className="h-1.5 w-16" />
                      <span className="text-xs text-muted-foreground">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="size-7" aria-label="Действия" />
                        }
                      >
                        <MoreVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openTask(task)}>
                          <Eye data-icon="inline-start" /> Открыть детали
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleBlocked(task.id)}>
                          <Ban data-icon="inline-start" />
                          {task.blocked ? "Снять блокер" : "Отметить blocked"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchive(task)}>
                          <Archive data-icon="inline-start" /> Архивировать
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
                              {s === task.status ? (
                                <Check data-icon="inline-start" />
                              ) : (
                                <ArrowRightLeft data-icon="inline-start" />
                              )}
                              {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} className="h-24 text-center text-sm text-muted-foreground">
                    Задачи не найдены. Попробуйте изменить фильтры.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">Показано задач: {filtered.length}</p>

      <TaskDetailDialog task={selectedLive} open={open} onOpenChange={setOpen} />
    </div>
  )
}
