"use client"

import { CheckCircle } from "lucide-react"

interface NotificationProps {
  message: string
}

export function Notification({ message }: NotificationProps) {
  if (!message) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent text-accent-foreground shadow-lg">
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  )
}
