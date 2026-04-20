"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  Heart,
  FileText,
  Bell,
  LogOut,
  ChevronRight,
  User,
  Phone,
  Mail,
  Droplet,
  Brain,
  Sparkles,
} from "lucide-react"
import type { Screen, Appointment } from "@/app/page"

interface PatientDashboardProps {
  username: string
  appointments: Appointment[]
  setScreen: (screen: Screen) => void
}

export function PatientDashboard({
  username,
  appointments,
  setScreen,
}: PatientDashboardProps) {
  const userAppointments = appointments.filter(
    (a) => a.status === "pending" || a.status === "active"
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/images/patient-care.jpg"
          alt="Patient care"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary/90" />
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary-foreground" fill="currentColor" />
              <span className="font-semibold text-primary-foreground">SmartHealth</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setScreen("role")}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div>
            <p className="text-primary-foreground/80 text-sm">Welcome back,</p>
            <h1 className="text-3xl font-bold text-primary-foreground capitalize">
              {username || "Patient"}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-8 pt-6">
        {/* Quick Actions */}
        <Card className="border-0 shadow-lg mb-6 bg-card mt-4">
          <CardContent className="p-4 space-y-3">
            <Button
              className="w-full h-14 text-lg font-medium gap-3"
              onClick={() => setScreen("book")}
            >
              <Calendar className="h-5 w-5" />
              Book New Appointment
            </Button>
          </CardContent>
        </Card>

        {/* AI Health Assistant Card */}
        <Card 
          className="border-0 shadow-lg mb-6 bg-gradient-to-br from-primary/10 via-card to-accent/10 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={() => setScreen("ai")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Brain className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-card-foreground">AI Health Assistant</h3>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Describe your symptoms and get instant health guidance in your language
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Patient Information */}
        <Card className="border-0 shadow-lg mb-6 bg-card mt-8">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
              <User className="h-5 w-5 text-primary" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium text-card-foreground capitalize">
                  {username || "Patient"}
                </p>
              </div>

              {/* Email */}
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                  <Mail className="h-4 w-4" />
                  Email
                </p>
                <p className="font-medium text-card-foreground">
                  {username?.toLowerCase()}@health.com
                </p>
              </div>

              {/* Phone */}
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                  <Phone className="h-4 w-4" />
                  Phone
                </p>
                <p className="font-medium text-card-foreground">+1 (555) 000-0000</p>
              </div>

              {/* Blood Type */}
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                  <Droplet className="h-4 w-4" />
                  Blood Type
                </p>
                <p className="font-medium text-card-foreground">O+</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setScreen("records")}
            >
              View Medical Records
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="border-0 shadow-lg mb-6 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming appointments</p>
                <Button
                  variant="link"
                  className="mt-2"
                  onClick={() => setScreen("book")}
                >
                  Book your first appointment
                </Button>
              </div>
            ) : (
              userAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{apt.ward}</p>
                      <p className="text-sm text-muted-foreground">
                        Status:{" "}
                        <span
                          className={
                            apt.status === "active"
                              ? "text-accent font-medium"
                              : "text-primary font-medium"
                          }
                        >
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Health Tips */}
        <Card className="border-0 shadow-lg bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
              <Heart className="h-5 w-5 text-primary" />
              Health Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-40 rounded-xl overflow-hidden mb-4">
              <Image
                src="/images/ai-health.jpg"
                alt="Health tips"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-primary-foreground font-medium">
                  Stay hydrated and maintain a balanced diet
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Regular health checkups help detect potential health issues before
              they become serious. Book your next appointment today!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
