"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { STATUSES, PRIORITIES } from "@/lib/task-utils"
import { Search, X } from "lucide-react"

export interface Filters {
  search: string
  assignee: string
  priority: string
  epic: string
  status: string
  deadline: string
}

export const emptyFilters: Filters = {
  search: "",
  assignee: "all",
  priority: "all",
  epic: "all",
  status: "all",
  deadline: "all",
}

export function TaskFilters({
  filters,
  onChange,
  assignees,
  epics,
  showStatus = true,
}: {
  filters: Filters
  onChange: (f: Filters) => void
  assignees: string[]
  epics: string[]
  showStatus?: boolean
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })
  const hasActive =
    filters.search !== "" ||
    filters.assignee !== "all" ||
    filters.priority !== "all" ||
    filters.epic !== "all" ||
    filters.status !== "all" ||
    filters.deadline !== "all"

  return (
    <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center">
      <div className="relative min-w-0 sm:min-w-[180px] sm:flex-1 sm:max-w-64">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Поиск по названию / ID"
          className="h-9 pl-8 sm:h-8"
        />
      </div>

      <FilterSelect
        value={filters.assignee}
        onValueChange={(v) => set({ assignee: v })}
        placeholder="Исполнитель"
        allLabel="Все исполнители"
        options={assignees}
      />
      <FilterSelect
        value={filters.priority}
        onValueChange={(v) => set({ priority: v })}
        placeholder="Приоритет"
        allLabel="Все приоритеты"
        options={PRIORITIES}
      />
      <FilterSelect
        value={filters.epic}
        onValueChange={(v) => set({ epic: v })}
        placeholder="Epic"
        allLabel="Все Epic"
        options={epics}
      />
      {showStatus && (
        <FilterSelect
          value={filters.status}
          onValueChange={(v) => set({ status: v })}
          placeholder="Статус"
          allLabel="Все статусы"
          options={STATUSES}
        />
      )}
      <FilterSelect
        value={filters.deadline}
        onValueChange={(v) => set({ deadline: v })}
        placeholder="Дедлайн"
        allLabel="Любой дедлайн"
        options={[
          { value: "overdue", label: "Просрочен" },
          { value: "today", label: "Сегодня" },
          { value: "soon", label: "Ближайшие 3 дня" },
        ]}
      />

      {hasActive && (
        <Button variant="ghost" size="sm" className="justify-center sm:justify-start" onClick={() => onChange(emptyFilters)}>
          <X data-icon="inline-start" /> Сбросить
        </Button>
      )}
    </div>
  )
}

function FilterSelect({
  value,
  onValueChange,
  placeholder,
  allLabel,
  options,
}: {
  value: string
  onValueChange: (v: string) => void
  placeholder: string
  allLabel: string
  options: (string | { value: string; label: string })[]
}) {
  return (
    <Select value={value} onValueChange={(v) => onValueChange(v ?? "all")}>
      <SelectTrigger size="sm" className="w-full min-w-0 sm:w-auto sm:min-w-[130px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map((o) => {
            const val = typeof o === "string" ? o : o.value
            const label = typeof o === "string" ? o : o.label
            return (
              <SelectItem key={val} value={val}>
                {label}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
