"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  User,
  Building2,
  Droplets,
  Calendar,
  FileText,
} from "lucide-react"
import type { Screen, Appointment } from "@/app/page"

interface AppointmentListProps {
  screen: Screen
  appointments: Appointment[]
  setAppointments: (appointments: Appointment[]) => void
  setScreen: (screen: Screen) => void
  showNotification: (message: string) => void
}

export function AppointmentList({
  screen,
  appointments,
  setAppointments,
  setScreen,
  showNotification,
}: AppointmentListProps) {
  const filteredAppointments = appointments.filter(
    (a) => a.status === screen
  )

  const screenConfig = {
    pending: {
      title: "Pending Appointments",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    active: {
      title: "Active Consultations",
      icon: AlertCircle,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    seen: {
      title: "Completed Appointments",
      icon: CheckCircle,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    rescheduled: {
      title: "Rescheduled Appointments",
      icon: RefreshCw,
      color: "text-muted-foreground",
      bg: "bg-muted",
    },
  }

  const config = screenConfig[screen as keyof typeof screenConfig]

  const handleStatusChange = (
    id: number,
    newStatus: "active" | "seen" | "rescheduled"
  ) => {
    setAppointments(
      appointments.map((a) =>
        a.id === id ? { ...a, status: newStatus } : a
      )
    )
    const statusMessages = {
      active: "Patient moved to active consultations",
      seen: "Consultation marked as complete",
      rescheduled: "Appointment rescheduled",
    }
    showNotification(statusMessages[newStatus])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`${config.bg} px-4 py-6`}>
        <div className="container mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => setScreen("dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl ${config.bg} flex items-center justify-center`}>
              <config.icon className={`h-6 w-6 ${config.color}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{config.title}</h1>
              <p className="text-muted-foreground text-sm">
                {filteredAppointments.length} appointment
                {filteredAppointments.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="container mx-auto px-4 py-6 space-y-4">
        {filteredAppointments.length === 0 ? (
          <Card className="border-0 shadow-lg bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className={`h-16 w-16 rounded-full ${config.bg} flex items-center justify-center mb-4`}>
                <Calendar className={`h-8 w-8 ${config.color}`} />
              </div>
              <h3 className="text-lg font-medium text-card-foreground mb-1">
                No {screen} appointments
              </h3>
              <p className="text-muted-foreground text-sm text-center">
                There are no appointments with this status at the moment
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((apt) => (
            <Card key={apt.id} className="border-0 shadow-lg overflow-hidden bg-card">
              <CardHeader className={`${config.bg} pb-3`}>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className={`h-5 w-5 ${config.color}`} />
                    <span className="text-card-foreground">{apt.patientName}</span>
                  </div>
                  <Badge variant="secondary" className={`${config.color} ${config.bg}`}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
                    <Building2 className="h-4 w-4 text-primary mb-1" />
                    <span className="text-muted-foreground text-xs">Ward</span>
                    <span className="font-medium text-card-foreground text-center">{apt.ward}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
                    <Droplets className="h-4 w-4 text-primary mb-1" />
                    <span className="text-muted-foreground text-xs">Blood</span>
                    <span className="font-medium text-card-foreground">{apt.bloodGroup || "N/A"}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
                    <Clock className="h-4 w-4 text-primary mb-1" />
                    <span className="text-muted-foreground text-xs">Age</span>
                    <span className="font-medium text-card-foreground">{apt.age || "N/A"}</span>
                  </div>
                </div>

                {apt.complaint && (
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-card-foreground">Chief Complaint</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{apt.complaint}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {screen === "pending" && (
                    <Button
                      className="flex-1"
                      onClick={() => handleStatusChange(apt.id, "active")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Acknowledge
                    </Button>
                  )}
                  {screen === "active" && (
                    <>
                      <Button
                        className="flex-1"
                        onClick={() => handleStatusChange(apt.id, "seen")}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Seen
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleStatusChange(apt.id, "rescheduled")}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reschedule
                      </Button>
                    </>
                  )}
                  {screen === "rescheduled" && (
                    <Button
                      className="flex-1"
                      onClick={() => handleStatusChange(apt.id, "active")}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Reactivate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
