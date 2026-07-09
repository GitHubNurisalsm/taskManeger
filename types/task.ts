export type Priority = "Critical" | "High" | "Medium" | "Low"

export type Status = "To Do" | "In Progress" | "Code Review" | "Testing" | "Done"

export type RiskImpact = "Low" | "Medium" | "High" | "Critical"

export type RiskStatus = "Open" | "Mitigating" | "Resolved"

export type ReportRating = "Good" | "Risk" | "Blocked"

export interface DodItem {
  id: string
  text: string
  done: boolean
}

export interface Comment {
  id: string
  author: string
  text: string
  date: string
}

export interface HistoryEntry {
  id: string
  text: string
  date: string
}

export interface Task {
  id: string
  title: string
  description: string
  epic: string
  assignee: string
  priority: Priority
  status: Status
  estimate: string
  deadline: string
  dependsOn: string[]
  definitionOfDone: DodItem[]
  comments: Comment[]
  history: HistoryEntry[]
  blocked: boolean
  blockerReason?: string
  progress: number
  archived?: boolean
}

export interface DailyReport {
  id: string
  assignee: string
  date: string
  done: string
  blocking: string
  tomorrow: string
  rating: ReportRating
}

export interface Risk {
  id: string
  title: string
  description: string
  impact: RiskImpact
  owner: string
  status: RiskStatus
  mitigation: string
  deadline: string
}

export interface SprintRole {
  role: string
  assignee: string
  taskIds: string[]
}
