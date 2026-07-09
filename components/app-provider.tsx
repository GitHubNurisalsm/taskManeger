"use client"

import * as React from "react"
import type { Task, Status, DailyReport, Risk } from "@/types/task"
import { mockTasks, mockReports, mockRisks } from "@/data/mockData"

interface AppState {
  tasks: Task[]
  reports: DailyReport[]
  risks: Risk[]
  setTaskStatus: (id: string, status: Status) => void
  toggleBlocked: (id: string, reason?: string) => void
  addComment: (id: string, text: string) => void
  toggleDod: (taskId: string, dodId: string) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  archiveTask: (id: string) => void
  addReport: (report: Omit<DailyReport, "id">) => void
  addRisk: (risk: Omit<Risk, "id">) => void
}

const AppContext = React.createContext<AppState | null>(null)

function today() {
  return "2026-07-09"
}

function progressForStatus(status: Status): number {
  switch (status) {
    case "To Do":
      return 0
    case "In Progress":
      return 40
    case "Code Review":
      return 70
    case "Testing":
      return 85
    case "Done":
      return 100
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = React.useState<Task[]>(mockTasks)
  const [reports, setReports] = React.useState<DailyReport[]>(mockReports)
  const [risks, setRisks] = React.useState<Risk[]>(mockRisks)

  const setTaskStatus = React.useCallback((id: string, status: Status) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              progress: progressForStatus(status),
              history: [
                { id: `h-${Date.now()}`, text: `Статус изменён на «${status}»`, date: today() },
                ...t.history,
              ],
            }
          : t,
      ),
    )
  }, [])

  const toggleBlocked = React.useCallback((id: string, reason?: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const nextBlocked = !t.blocked
        return {
          ...t,
          blocked: nextBlocked,
          blockerReason: nextBlocked ? reason || t.blockerReason || "Блокер отмечен тимлидом" : undefined,
          history: [
            {
              id: `h-${Date.now()}`,
              text: nextBlocked ? "Отмечена как заблокированная" : "Блокер снят",
              date: today(),
            },
            ...t.history,
          ],
        }
      }),
    )
  }, [])

  const addComment = React.useCallback((id: string, text: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              comments: [
                ...t.comments,
                { id: `c-${Date.now()}`, author: "Team Lead", text, date: today() },
              ],
            }
          : t,
      ),
    )
  }, [])

  const toggleDod = React.useCallback((taskId: string, dodId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              definitionOfDone: t.definitionOfDone.map((d) =>
                d.id === dodId ? { ...d, done: !d.done } : d,
              ),
            }
          : t,
      ),
    )
  }, [])

  const updateTask = React.useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }, [])

  const archiveTask = React.useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, archived: true } : t)))
  }, [])

  const addReport = React.useCallback((report: Omit<DailyReport, "id">) => {
    setReports((prev) => [{ ...report, id: `REP-${Date.now()}` }, ...prev])
  }, [])

  const addRisk = React.useCallback((risk: Omit<Risk, "id">) => {
    setRisks((prev) => [{ ...risk, id: `RISK-${Date.now()}` }, ...prev])
  }, [])

  const value = React.useMemo<AppState>(
    () => ({
      tasks,
      reports,
      risks,
      setTaskStatus,
      toggleBlocked,
      addComment,
      toggleDod,
      updateTask,
      archiveTask,
      addReport,
      addRisk,
    }),
    [tasks, reports, risks, setTaskStatus, toggleBlocked, addComment, toggleDod, updateTask, archiveTask, addReport, addRisk],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = React.useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
