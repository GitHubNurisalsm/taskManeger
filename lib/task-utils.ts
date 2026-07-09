import type { Priority, Status, RiskImpact } from "@/types/task"

export const STATUSES: Status[] = ["To Do", "In Progress", "Code Review", "Testing", "Done"]
export const PRIORITIES: Priority[] = ["Critical", "High", "Medium", "Low"]

// Tailwind classes for priority badges/dots
export const priorityStyles: Record<Priority, string> = {
  Critical: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  High: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  Medium: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  Low: "bg-muted text-muted-foreground border-border",
}

export const priorityDot: Record<Priority, string> = {
  Critical: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-yellow-500",
  Low: "bg-muted-foreground",
}

export const statusStyles: Record<Status, string> = {
  "To Do": "bg-muted text-muted-foreground border-border",
  "In Progress": "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  "Code Review": "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
  Testing: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Done: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
}

export const statusAccent: Record<Status, string> = {
  "To Do": "bg-muted-foreground",
  "In Progress": "bg-blue-500",
  "Code Review": "bg-violet-500",
  Testing: "bg-amber-500",
  Done: "bg-green-500",
}

export const impactStyles: Record<RiskImpact, string> = {
  Critical: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  High: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  Medium: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  Low: "bg-muted text-muted-foreground border-border",
}

const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
]

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function daysUntil(iso: string): number {
  const d = new Date(iso)
  const now = new Date("2026-07-09")
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export function deadlineTone(iso: string): string {
  const days = daysUntil(iso)
  if (days < 0) return "text-red-600 dark:text-red-400"
  if (days <= 1) return "text-orange-600 dark:text-orange-400"
  return "text-muted-foreground"
}
