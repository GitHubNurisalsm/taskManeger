import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { priorityStyles, statusStyles, impactStyles } from "@/lib/task-utils"
import type { Priority, Status, RiskImpact } from "@/types/task"

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", priorityStyles[priority], className)}>
      {priority}
    </Badge>
  )
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", statusStyles[status], className)}>
      {status}
    </Badge>
  )
}

export function ImpactBadge({ impact, className }: { impact: RiskImpact; className?: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", impactStyles[impact], className)}>
      {impact}
    </Badge>
  )
}
