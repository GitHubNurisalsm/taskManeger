import * as React from "react"
import type { Task } from "@/types/task"
import type { Filters } from "@/components/tasks/task-filters"
import { daysUntil } from "@/lib/task-utils"

export function useFilteredTasks(tasks: Task[], filters: Filters) {
  return React.useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return tasks
      .filter((t) => !t.archived)
      .filter((t) => {
        if (q && !t.title.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false
        if (filters.assignee !== "all" && t.assignee !== filters.assignee) return false
        if (filters.priority !== "all" && t.priority !== filters.priority) return false
        if (filters.epic !== "all" && t.epic !== filters.epic) return false
        if (filters.status !== "all" && t.status !== filters.status) return false
        if (filters.deadline !== "all") {
          const d = daysUntil(t.deadline)
          if (filters.deadline === "overdue" && d >= 0) return false
          if (filters.deadline === "today" && d !== 0) return false
          if (filters.deadline === "soon" && (d < 0 || d > 3)) return false
        }
        return true
      })
  }, [tasks, filters])
}

export function useTaskFacets(tasks: Task[]) {
  return React.useMemo(() => {
    const assignees = Array.from(new Set(tasks.map((t) => t.assignee))).sort()
    const epics = Array.from(new Set(tasks.map((t) => t.epic))).sort()
    return { assignees, epics }
  }, [tasks])
}
