"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Calendar,
  User,
  Building2,
  Droplets,
  Clock,
  FileText,
} from "lucide-react"
import type { Screen, Appointment } from "@/app/page"

interface BookAppointmentProps {
  appointments: Appointment[]
  setAppointments: (appointments: Appointment[]) => void
  setScreen: (screen: Screen) => void
  showNotification: (message: string) => void
}

export function BookAppointment({
  appointments,
  setAppointments,
  setScreen,
  showNotification,
}: BookAppointmentProps) {
  const [patientName, setPatientName] = useState("")
  const [ward, setWard] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [age, setAge] = useState("")
  const [complaint, setComplaint] = useState("")

  const handleSubmit = () => {
    if (!patientName || !ward || !complaint) {
      showNotification("Please fill in all required fields")
      return
    }

    const newAppointment: Appointment = {
      id: Date.now(),
      patientName,
      ward,
      bloodGroup,
      age,
      complaint,
      status: "pending",
    }

    setAppointments([...appointments, newAppointment])
    showNotification("Appointment booked successfully!")
    setScreen("dashboard")
  }

  const wards = [
    { value: "general", label: "General Medicine" },
    { value: "cardiology", label: "Cardiology" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "neurology", label: "Neurology" },
    { value: "dermatology", label: "Dermatology" },
  ]

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src="/images/patient-care.jpg"
          alt="Book appointment"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary/90" />
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setScreen("dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Book Appointment
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 -mt-6 relative z-10 pb-8">
        <Card className="border-0 shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Patient Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-card-foreground">
                <User className="h-4 w-4 text-primary" />
                Patient Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Ward Selection */}
            <div className="space-y-2">
              <Label htmlFor="ward" className="flex items-center gap-2 text-card-foreground">
                <Building2 className="h-4 w-4 text-primary" />
                Department <span className="text-destructive">*</span>
              </Label>
              <Select value={ward} onValueChange={setWard}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((w) => (
                    <SelectItem key={w.value} value={w.label}>
                      {w.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Blood Group & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blood" className="flex items-center gap-2 text-card-foreground">
                  <Droplets className="h-4 w-4 text-primary" />
                  Blood Group
                </Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2 text-card-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            {/* Complaint */}
            <div className="space-y-2">
              <Label htmlFor="complaint" className="flex items-center gap-2 text-card-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Chief Complaint <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="complaint"
                placeholder="Describe your symptoms or reason for visit..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="min-h-24 resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              className="w-full h-14 text-lg font-medium mt-4"
              onClick={handleSubmit}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Confirm Appointment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
