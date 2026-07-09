"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TEAM_MESSAGE } from "@/data/mockData"
import { toast } from "sonner"
import { Copy, Check, Send } from "lucide-react"

export function TeamMessageView() {
  const [copied, setCopied] = React.useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(TEAM_MESSAGE)
      setCopied(true)
      toast.success("Сообщение скопировано")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Не удалось скопировать")
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Send className="size-4 text-primary" /> Сообщение команде
              </CardTitle>
              <CardDescription>Готовый текст для отправки в чат команды</CardDescription>
            </div>
            <Button onClick={copy}>
              {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
              {copied ? "Скопировано" : "Копировать"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap rounded-lg border border-border bg-muted p-4 font-sans text-sm leading-relaxed">
            {TEAM_MESSAGE}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
