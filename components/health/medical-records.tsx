"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  FileText,
  User,
  Stethoscope,
  Pill,
  MessageSquare,
  Plus,
  ChevronRight,
  Search,
} from "lucide-react"
import type { Screen, Patient } from "@/app/page"

interface MedicalRecordsProps {
  patients: Patient[]
  setPatients: (patients: Patient[]) => void
  setSelectedPatient: (patient: Patient) => void
  setScreen: (screen: Screen) => void
  showNotification: (message: string) => void
}

export function MedicalRecords({
  patients,
  setPatients,
  setSelectedPatient,
  setScreen,
  showNotification,
}: MedicalRecordsProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [patientName, setPatientName] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [drugs, setDrugs] = useState("")
  const [notes, setNotes] = useState("")

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSave = () => {
    if (!patientName || !diagnosis) {
      showNotification("Please fill in required fields")
      return
    }

    const newPatient: Patient = {
      id: Date.now(),
      name: patientName,
      diagnosis,
      drugs,
      notes,
      chat: [],
    }

    setPatients([...patients, newPatient])
    setPatientName("")
    setDiagnosis("")
    setDrugs("")
    setNotes("")
    setIsAdding(false)
    showNotification("Medical record saved successfully")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src="/images/medical-records.jpg"
          alt="Medical records"
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Medical Records
            </h1>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsAdding(!isAdding)}
            >
              <Plus className="h-4 w-4 mr-1" />
              {isAdding ? "Cancel" : "New"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4 relative z-10 pb-8">
        {/* Add New Record Form */}
        {isAdding && (
          <Card className="border-0 shadow-xl mb-6 bg-card">
            <CardHeader>
              <CardTitle className="text-lg text-card-foreground">New Patient Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-card-foreground">
                  <User className="h-4 w-4 text-primary" />
                  Patient Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Enter patient name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-card-foreground">
                  <Stethoscope className="h-4 w-4 text-primary" />
                  Diagnosis <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Enter diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-card-foreground">
                  <Pill className="h-4 w-4 text-primary" />
                  Prescribed Medications
                </Label>
                <Input
                  placeholder="Enter medications (comma separated)"
                  value={drugs}
                  onChange={(e) => setDrugs(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-card-foreground">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Additional Notes
                </Label>
                <Textarea
                  placeholder="Enter any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-20 resize-none"
                />
              </div>
              <Button className="w-full h-12" onClick={handleSave}>
                Save Medical Record
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Patient List */}
        <Card className="border-0 shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">
              Patient Records ({patients.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {patients.length === 0
                    ? "No patient records yet"
                    : "No matching records found"}
                </p>
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  type="button"
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left"
                  onClick={() => {
                    setSelectedPatient(patient)
                    setScreen("chat")
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.diagnosis}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
