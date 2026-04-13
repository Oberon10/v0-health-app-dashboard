"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  User,
  Stethoscope,
  Pill,
  FileText,
  Send,
  MessageSquare,
} from "lucide-react"
import type { Screen, Patient } from "@/app/page"

interface PatientChatProps {
  selectedPatient: Patient
  patients: Patient[]
  setPatients: (patients: Patient[]) => void
  setScreen: (screen: Screen) => void
}

export function PatientChat({
  selectedPatient,
  patients,
  setPatients,
  setScreen,
}: PatientChatProps) {
  const [message, setMessage] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedPatient.chat])

  const handleSend = () => {
    if (!message.trim()) return

    const updated = patients.map((p) =>
      p.id === selectedPatient.id
        ? { ...p, chat: [...p.chat, `Dr: ${message}`] }
        : p
    )
    setPatients(updated)
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary/10 px-4 py-4">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="mb-3"
            onClick={() => setScreen("records")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Records
          </Button>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{selectedPatient.name}</h1>
              <Badge variant="secondary" className="mt-1">
                {selectedPatient.diagnosis}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Details */}
      <div className="container mx-auto px-4 py-4">
        <Card className="border-0 shadow-md bg-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Stethoscope className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground">Diagnosis</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {selectedPatient.diagnosis}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Pill className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground">Medications</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {selectedPatient.drugs || "None prescribed"}
                  </p>
                </div>
              </div>
            </div>
            {selectedPatient.notes && (
              <div className="flex items-start gap-2 mt-4 pt-4 border-t border-border">
                <FileText className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="text-sm text-card-foreground">{selectedPatient.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 container mx-auto px-4 overflow-y-auto">
        <Card className="border-0 shadow-md h-full bg-card">
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2 text-card-foreground">
              <MessageSquare className="h-4 w-4 text-primary" />
              Consultation Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
            {selectedPatient.chat.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  No consultation notes yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Start typing to add notes
                </p>
              </div>
            ) : (
              selectedPatient.chat.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl max-w-[85%] ${
                    msg.startsWith("Dr:")
                      ? "bg-primary/10 ml-auto text-right"
                      : "bg-secondary"
                  }`}
                >
                  <p className="text-sm text-card-foreground">
                    {msg.replace(/^Dr: /, "")}
                  </p>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </CardContent>
        </Card>
      </div>

      {/* Message Input */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add consultation note..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-12 flex-1"
          />
          <Button size="icon" className="h-12 w-12" onClick={handleSend}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
