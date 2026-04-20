"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  UserCog,
  UserPlus,
  Users,
  LogOut,
  Bell,
  ChevronRight,
  Search,
  Heart,
  Stethoscope,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import type { Screen, RegisteredPatient, RegisteredDoctor } from "@/app/page"

interface AdminDashboardProps {
  username: string
  registeredPatients: RegisteredPatient[]
  setScreen: (screen: Screen) => void
}

export function AdminDashboard({
  username,
  registeredPatients,
  setScreen,
}: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = registeredPatients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src="/images/hero-doctor.jpg"
          alt="Admin Dashboard"
          fill
          className="object-cover brightness-105 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/70 via-amber-900/60 to-background" />
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-white drop-shadow-lg" fill="currentColor" />
              <span className="text-white font-semibold text-lg">SmartHealth</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setScreen("role")}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <UserCog className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Welcome back,</p>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                Admin {username || "User"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-8 pt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-0 shadow-lg bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {registeredPatients.length}
                </p>
                <p className="text-xs text-muted-foreground">Registered Patients</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">
                  {registeredPatients.filter(p => {
                    const today = new Date().toDateString()
                    return new Date(p.createdAt).toDateString() === today
                  }).length}
                </p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Register New Patient Button */}
        <Card className="border-0 shadow-lg mb-6 bg-card">
          <CardContent className="p-4">
            <Button
              className="w-full h-14 text-lg font-medium gap-3 bg-amber-600 hover:bg-amber-700"
              onClick={() => setScreen("register-patient")}
            >
              <UserPlus className="h-5 w-5" />
              Register New Patient
            </Button>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card className="border-0 shadow-lg bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-600" />
              Registered Patients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Patient List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {searchQuery ? "No patients found" : "No patients registered yet"}
                  </p>
                  {!searchQuery && (
                    <Button
                      variant="link"
                      className="text-amber-600"
                      onClick={() => setScreen("register-patient")}
                    >
                      Register your first patient
                    </Button>
                  )}
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <span className="text-amber-600 font-semibold">
                            {patient.firstName[0]}{patient.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {patient.username}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {patient.department}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {patient.bloodGroup}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {patient.genotype}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Password: {patient.password}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
