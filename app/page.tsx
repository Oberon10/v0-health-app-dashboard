"use client"

import { useState, useEffect } from "react"
import { RoleSelection } from "@/components/health/role-selection"
import { LoginScreen } from "@/components/health/login-screen"
import { ForgotPassword } from "@/components/health/forgot-password"
import { PatientDashboard } from "@/components/health/patient-dashboard"
import { DoctorDashboard } from "@/components/health/doctor-dashboard"
import { BookAppointment } from "@/components/health/book-appointment"
import { AppointmentList } from "@/components/health/appointment-list"
import { MedicalRecords } from "@/components/health/medical-records"
import { PatientChat } from "@/components/health/patient-chat"
import { AIAssistant } from "@/components/health/ai-assistant"
import { Notification } from "@/components/health/notification"
import { Footer } from "@/components/health/footer"
import { AdminDashboard } from "@/components/health/admin-dashboard"
import { RegisterPatient } from "@/components/health/register-patient"
import { RegisterDoctor } from "@/components/health/register-doctor"

export type Screen =
  | "role"
  | "login"
  | "forgot"
  | "dashboard"
  | "book"
  | "pending"
  | "active"
  | "seen"
  | "rescheduled"
  | "records"
  | "chat"
  | "ai"
  | "admin-dashboard"
  | "register-patient"
  | "register-doctor"

export type Role = "doctor" | "user" | "admin" | ""

export interface RegisteredPatient {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  bloodGroup: string
  genotype: string
  department: string
  ward: string
  complaint: string
  username: string
  password: string
  createdAt: string
}

export interface RegisteredDoctor {
  id: string
  firstName: string
  lastName: string
  email: string
  age: string
  bloodGroup: string
  genotype: string
  username: string
  password: string
  createdAt: string
}

export interface Appointment {
  id: number
  patientName: string
  ward: string
  bloodGroup: string
  age: string
  complaint: string
  status: "pending" | "active" | "seen" | "rescheduled"
}

export interface Patient {
  id: number
  name: string
  diagnosis: string
  drugs: string
  notes: string
  chat: string[]
}

export default function SmartHealthApp() {
  const [screen, setScreen] = useState<Screen>("role")
  const [role, setRole] = useState<Role>("")
  const [username, setUsername] = useState("")
  const [notification, setNotification] = useState("")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [registeredPatients, setRegisteredPatients] = useState<RegisteredPatient[]>([])
  const [registeredDoctors, setRegisteredDoctors] = useState<RegisteredDoctor[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("smarthealth_appointments")
    if (saved) setAppointments(JSON.parse(saved))
    const savedPatients = localStorage.getItem("smarthealth_patients")
    if (savedPatients) setPatients(JSON.parse(savedPatients))
    const savedRegisteredPatients = localStorage.getItem("smarthealth_registered_patients")
    if (savedRegisteredPatients) setRegisteredPatients(JSON.parse(savedRegisteredPatients))
    const savedRegisteredDoctors = localStorage.getItem("smarthealth_registered_doctors")
    if (savedRegisteredDoctors) setRegisteredDoctors(JSON.parse(savedRegisteredDoctors))
  }, [])

  useEffect(() => {
    localStorage.setItem("smarthealth_appointments", JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    localStorage.setItem("smarthealth_patients", JSON.stringify(patients))
  }, [patients])

  useEffect(() => {
    localStorage.setItem("smarthealth_registered_patients", JSON.stringify(registeredPatients))
  }, [registeredPatients])

  useEffect(() => {
    localStorage.setItem("smarthealth_registered_doctors", JSON.stringify(registeredDoctors))
  }, [registeredDoctors])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const pending = appointments.filter((a) => a.status === "pending").length
  const active = appointments.filter((a) => a.status === "active").length
  const seen = appointments.filter((a) => a.status === "seen").length
  const rescheduled = appointments.filter((a) => a.status === "rescheduled").length

  return (
    <div className="min-h-screen bg-background">
      <Notification message={notification} />

      {screen === "role" && (
        <RoleSelection setRole={setRole} setScreen={setScreen} />
      )}

      {screen === "login" && (
        <LoginScreen
          role={role}
          username={username}
          setUsername={setUsername}
          setScreen={setScreen}
          registeredPatients={registeredPatients}
          registeredDoctors={registeredDoctors}
          showNotification={showNotification}
        />
      )}

      {screen === "forgot" && <ForgotPassword setScreen={setScreen} />}

      {screen === "dashboard" && role === "user" && (
        <PatientDashboard
          username={username}
          appointments={appointments}
          setScreen={setScreen}
        />
      )}

      {screen === "dashboard" && role === "doctor" && (
        <DoctorDashboard
          username={username}
          pending={pending}
          active={active}
          seen={seen}
          rescheduled={rescheduled}
          setScreen={setScreen}
        />
      )}

      {screen === "book" && (
        <BookAppointment
          appointments={appointments}
          setAppointments={setAppointments}
          setScreen={setScreen}
          showNotification={showNotification}
        />
      )}

      {(screen === "pending" ||
        screen === "active" ||
        screen === "seen" ||
        screen === "rescheduled") && (
          <AppointmentList
            screen={screen}
            appointments={appointments}
            setAppointments={setAppointments}
            setScreen={setScreen}
            showNotification={showNotification}
          />
        )}

      {screen === "records" && (
        <MedicalRecords
          patients={patients}
          setPatients={setPatients}
          setSelectedPatient={setSelectedPatient}
          setScreen={setScreen}
          showNotification={showNotification}
        />
      )}

      {screen === "chat" && selectedPatient && (
        <PatientChat
          selectedPatient={selectedPatient}
          patients={patients}
          setPatients={setPatients}
          setScreen={setScreen}
        />
      )}

      {screen === "ai" && <AIAssistant setScreen={setScreen} />}

      {screen === "admin-dashboard" && (
        <AdminDashboard
          username={username}
          registeredPatients={registeredPatients}
          registeredDoctors={registeredDoctors}
          setScreen={setScreen}
        />
      )}

      {screen === "register-patient" && (
        <RegisterPatient
          registeredPatients={registeredPatients}
          setRegisteredPatients={setRegisteredPatients}
          setScreen={setScreen}
          showNotification={showNotification}
        />
      )}

      {screen === "register-doctor" && (
        <RegisterDoctor
          registeredDoctors={registeredDoctors}
          setRegisteredDoctors={setRegisteredDoctors}
          setScreen={setScreen}
          showNotification={showNotification}
        />
      )}

      <Footer />
    </div>
  )
}
