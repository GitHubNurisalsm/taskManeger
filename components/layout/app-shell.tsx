"use client"

import * as React from "react"
import {
  LayoutDashboard,
  KanbanSquare,
  Table2,
  ClipboardList,
  AlertTriangle,
  CalendarRange,
  Send,
  Target,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { formatDate } from "@/lib/task-utils"

import { DashboardView } from "@/components/dashboard/dashboard-view"
import { BoardView } from "@/components/tasks/board-view"
import { TableView } from "@/components/tasks/table-view"
import { ReportsView } from "@/components/reports/reports-view"
import { RisksView } from "@/components/risks/risks-view"
import { SprintView } from "@/components/sprint/sprint-view"
import { TeamMessageView } from "@/components/team/team-message-view"

type ViewId = "dashboard" | "board" | "table" | "reports" | "risks" | "sprint" | "team"

const NAV: { id: ViewId; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Дашборд", icon: LayoutDashboard },
  { id: "board", label: "Доска задач", icon: KanbanSquare },
  { id: "table", label: "Таблица задач", icon: Table2 },
  { id: "reports", label: "Ежедневные отчёты", icon: ClipboardList },
  { id: "risks", label: "Риски", icon: AlertTriangle },
  { id: "sprint", label: "План спринта", icon: CalendarRange },
  { id: "team", label: "Сообщение команде", icon: Send },
]

const TITLES: Record<ViewId, string> = {
  dashboard: "Дашборд",
  board: "Доска задач",
  table: "Таблица задач",
  reports: "Ежедневные отчёты",
  risks: "Риски проекта",
  sprint: "План спринта",
  team: "Сообщение команде",
}

export function AppShell() {
  const [view, setView] = React.useState<ViewId>("dashboard")
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const go = (id: ViewId) => {
    setView(id)
    setMobileOpen(false)
  }

  return (
    <div className="flex min-h-svh bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Target className="size-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Career Task Control</span>
            <span className="text-xs text-muted-foreground">Team Lead workspace</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Закрыть меню"
          >
            <X />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = view === item.id
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent/50 p-3 text-xs">
            <p className="font-medium text-sidebar-accent-foreground">Проект Career</p>
            <p className="mt-1 text-muted-foreground">Sprint 1 · Релиз {formatDate("2026-07-31")}</p>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu />
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold">{TITLES[view]}</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Career · Дедлайн релиза: 31 июля 2026
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs sm:flex">
              <span className="text-muted-foreground">Сегодня</span>
              <span className="font-medium">9 июля</span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {view === "dashboard" && <DashboardView onNavigate={(v) => setView(v as ViewId)} />}
          {view === "board" && <BoardView />}
          {view === "table" && <TableView />}
          {view === "reports" && <ReportsView />}
          {view === "risks" && <RisksView />}
          {view === "sprint" && <SprintView />}
          {view === "team" && <TeamMessageView />}
        </main>
      </div>
    </div>
  )
}
