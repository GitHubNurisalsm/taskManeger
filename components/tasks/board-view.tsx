"use client"

import * as React from "react"
import { TaskCard } from "@/components/tasks/task-card"
import { TaskDetailDialog } from "@/components/tasks/task-detail-dialog"
import { TaskFilters, emptyFilters, type Filters } from "@/components/tasks/task-filters"
import { useApp } from "@/components/app-provider"
import { useFilteredTasks, useTaskFacets } from "@/lib/use-filtered-tasks"
import { STATUSES, statusAccent } from "@/lib/task-utils"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"

export function BoardView() {
  const { tasks } = useApp()
  const [filters, setFilters] = React.useState<Filters>(emptyFilters)
  const [selected, setSelected] = React.useState<Task | null>(null)
  const [open, setOpen] = React.useState(false)

  const { assignees, epics } = useTaskFacets(tasks)
  const filtered = useFilteredTasks(tasks, filters)

  // keep selected task in sync with latest state
  const selectedLive = selected ? tasks.find((t) => t.id === selected.id) ?? null : null

  const openTask = (task: Task) => {
    setSelected(task)
    setOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <TaskFilters
        filters={filters}
        onChange={setFilters}
        assignees={assignees}
        epics={epics}
        showStatus={false}
      />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((status) => {
          const items = filtered.filter((t) => t.status === status)
          return (
            <div key={status} className="flex w-72 shrink-0 flex-col gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <span className={cn("size-2 rounded-full", statusAccent[status])} />
                <span className="text-sm font-medium">{status}</span>
                <span className="ml-auto rounded-full bg-muted px-2 text-xs font-medium text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {items.map((task) => (
                  <TaskCard key={task.id} task={task} onOpen={openTask} />
                ))}
                {items.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                    Нет задач
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <TaskDetailDialog task={selectedLive} open={open} onOpenChange={setOpen} />
    </div>
  )
}
