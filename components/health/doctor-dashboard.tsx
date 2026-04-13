"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  Brain,
  Heart,
  Bell,
  LogOut,
  ChevronRight,
  Users,
} from "lucide-react"
import type { Screen } from "@/app/page"

interface DoctorDashboardProps {
  username: string
  pending: number
  active: number
  seen: number
  rescheduled: number
  setScreen: (screen: Screen) => void
}

export function DoctorDashboard({
  username,
  pending,
  active,
  seen,
  rescheduled,
  setScreen,
}: DoctorDashboardProps) {
  const stats = [
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Active",
      value: active,
      icon: AlertCircle,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Seen",
      value: seen,
      icon: CheckCircle,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Rescheduled",
      value: rescheduled,
      icon: RefreshCw,
      color: "text-muted-foreground",
      bg: "bg-muted",
    },
  ]

  const menuItems = [
    {
      label: "Pending Appointments",
      screen: "pending" as Screen,
      icon: Clock,
      count: pending,
      color: "text-amber-500",
    },
    {
      label: "Active Consultations",
      screen: "active" as Screen,
      icon: AlertCircle,
      count: active,
      color: "text-primary",
    },
    {
      label: "Completed Today",
      screen: "seen" as Screen,
      icon: CheckCircle,
      count: seen,
      color: "text-accent",
    },
    {
      label: "Rescheduled",
      screen: "rescheduled" as Screen,
      icon: RefreshCw,
      count: rescheduled,
      color: "text-muted-foreground",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/images/hero-doctor.jpg"
          alt="Doctor dashboard"
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
            <p className="text-primary-foreground/80 text-sm">Good to see you,</p>
            <h1 className="text-3xl font-bold text-primary-foreground capitalize">
              Dr. {username || "Doctor"}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-8 pt-8">
        {/* Stats Grid */}
        <Card className="border-0 shadow-lg mb-6 bg-card mt-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl ${stat.bg}`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color} mb-1`} />
                  <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Menu */}
        <Card className="border-0 shadow-lg mb-6 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
              <Users className="h-5 w-5 text-primary" />
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.screen}
                type="button"
                className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left"
                onClick={() => setScreen(item.screen)}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl ${item.color === "text-primary" ? "bg-primary/10" : item.color === "text-accent" ? "bg-accent/10" : item.color === "text-amber-500" ? "bg-amber-500/10" : "bg-muted"} flex items-center justify-center`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <span className="font-medium text-card-foreground">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.count > 0 && (
                    <span className={`text-sm font-semibold ${item.color}`}>
                      {item.count}
                    </span>
                  )}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Tools Section */}
        <Card
          className="border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow bg-card"
          onClick={() => setScreen("records")}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">Medical Records</h3>
              <p className="text-sm text-muted-foreground">
                View & manage patient records
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
