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
  UserPlus,
  User,
  Mail,
  Phone,
  Droplets,
  Building2,
  FileText,
  Key,
  Dna,
  Copy,
  CheckCircle,
} from "lucide-react"
import type { Screen, RegisteredPatient } from "@/app/page"

interface RegisterPatientProps {
  registeredPatients: RegisteredPatient[]
  setRegisteredPatients: (patients: RegisteredPatient[]) => void
  setScreen: (screen: Screen) => void
  showNotification: (message: string) => void
}

export function RegisterPatient({
  registeredPatients,
  setRegisteredPatients,
  setScreen,
  showNotification,
}: RegisterPatientProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [genotype, setGenotype] = useState("")
  const [department, setDepartment] = useState("")
  const [ward, setWard] = useState("")
  const [complaint, setComplaint] = useState("")
  const [showCredentials, setShowCredentials] = useState(false)
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    username: string
    password: string
  } | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const departments = [
    { value: "general", label: "General Medicine" },
    { value: "cardiology", label: "Cardiology" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "neurology", label: "Neurology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "gynecology", label: "Gynecology" },
    { value: "ophthalmology", label: "Ophthalmology" },
    { value: "ent", label: "ENT (Ear, Nose, Throat)" },
    { value: "psychiatry", label: "Psychiatry" },
  ]

  const wards = [
    { value: "ward-a", label: "Ward A - General" },
    { value: "ward-b", label: "Ward B - Intensive Care" },
    { value: "ward-c", label: "Ward C - Maternity" },
    { value: "ward-d", label: "Ward D - Pediatric" },
    { value: "ward-e", label: "Ward E - Surgical" },
    { value: "ward-f", label: "Ward F - Emergency" },
    { value: "outpatient", label: "Outpatient" },
  ]

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const genotypes = ["AA", "AS", "SS", "AC", "SC", "CC"]

  const generateUsername = () => {
    const prefix = "PT"
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 4).toUpperCase()
    return `${prefix}${timestamp}${random}`
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    let password = ""
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleSubmit = () => {
    if (!firstName || !lastName || !email || !phone || !department) {
      showNotification("Please fill in all required fields")
      return
    }

    // Check for duplicate email
    const emailExists = registeredPatients.some(
      (p) => p.email.toLowerCase() === email.toLowerCase()
    )
    if (emailExists) {
      showNotification("A patient with this email already exists")
      return
    }

    // Check for duplicate phone
    const phoneExists = registeredPatients.some((p) => p.phone === phone)
    if (phoneExists) {
      showNotification("A patient with this phone number already exists")
      return
    }

    const username = generateUsername()
    const password = generatePassword()

    const newPatient: RegisteredPatient = {
      id: username,
      firstName,
      lastName,
      email,
      phone,
      bloodGroup,
      genotype,
      department,
      ward,
      complaint,
      username,
      password,
      createdAt: new Date().toISOString(),
    }

    setRegisteredPatients([...registeredPatients, newPatient])
    setGeneratedCredentials({ username, password })
    setShowCredentials(true)
    showNotification("Patient registered successfully!")
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (showCredentials && generatedCredentials) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="relative h-40 overflow-hidden">
          <Image
            src="/images/hero-doctor.jpg"
            alt="Registration Complete"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-accent/70 to-accent/90" />
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div />
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Registration Complete
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-6 relative z-10 pb-8">
          <Card className="border-0 shadow-xl bg-card">
            <CardHeader className="text-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-xl text-card-foreground">
                Patient Credentials Generated
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                Please share these credentials with the patient securely
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Patient Info */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                <p className="font-semibold text-card-foreground">
                  {firstName} {lastName}
                </p>
              </div>

              {/* Username */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-muted-foreground">Username / Patient ID</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() => copyToClipboard(generatedCredentials.username, "username")}
                  >
                    {copiedField === "username" ? (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedField === "username" ? "Copied" : "Copy"}
                  </Button>
                </div>
                <p className="font-mono text-lg font-semibold text-primary">
                  {generatedCredentials.username}
                </p>
              </div>

              {/* Password */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-muted-foreground">Password</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2"
                    onClick={() => copyToClipboard(generatedCredentials.password, "password")}
                  >
                    {copiedField === "password" ? (
                      <CheckCircle className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedField === "password" ? "Copied" : "Copy"}
                  </Button>
                </div>
                <p className="font-mono text-lg font-semibold text-amber-600">
                  {generatedCredentials.password}
                </p>
              </div>

              {/* Warning */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-700">
                  <strong>Important:</strong> Make sure to provide these credentials to the
                  patient. They will need them to log in to the patient portal.
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button
                  variant="outline"
                  className="h-12"
                  onClick={() => {
                    setShowCredentials(false)
                    setGeneratedCredentials(null)
                    setFirstName("")
                    setLastName("")
                    setEmail("")
                    setPhone("")
                    setBloodGroup("")
                    setGenotype("")
                    setDepartment("")
                    setWard("")
                    setComplaint("")
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register Another
                </Button>
                <Button
                  className="h-12 bg-amber-600 hover:bg-amber-700"
                  onClick={() => setScreen("admin-dashboard")}
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src="/images/hero-doctor.jpg"
          alt="Register patient"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/70 to-amber-600/90" />
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setScreen("admin-dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Register New Patient
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 -mt-6 relative z-10 pb-8">
        <Card className="border-0 shadow-xl bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Patient Information</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fill in the details below. A unique ID and password will be generated automatically.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2 text-card-foreground">
                  <User className="h-4 w-4 text-amber-600" />
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2 text-card-foreground">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-card-foreground">
                <Mail className="h-4 w-4 text-amber-600" />
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-card-foreground">
                <Phone className="h-4 w-4 text-amber-600" />
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Blood Group & Genotype */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup" className="flex items-center gap-2 text-card-foreground">
                  <Droplets className="h-4 w-4 text-amber-600" />
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
                <Label htmlFor="genotype" className="flex items-center gap-2 text-card-foreground">
                  <Dna className="h-4 w-4 text-amber-600" />
                  Genotype
                </Label>
                <Select value={genotype} onValueChange={setGenotype}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {genotypes.map((gt) => (
                      <SelectItem key={gt} value={gt}>
                        {gt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department" className="flex items-center gap-2 text-card-foreground">
                <Building2 className="h-4 w-4 text-amber-600" />
                Department <span className="text-destructive">*</span>
              </Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.label}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ward */}
            <div className="space-y-2">
              <Label htmlFor="ward" className="flex items-center gap-2 text-card-foreground">
                <Key className="h-4 w-4 text-amber-600" />
                Ward
              </Label>
              <Select value={ward} onValueChange={setWard}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select ward" />
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

            {/* Complaint */}
            <div className="space-y-2">
              <Label htmlFor="complaint" className="flex items-center gap-2 text-card-foreground">
                <FileText className="h-4 w-4 text-amber-600" />
                Chief Complaint
              </Label>
              <Textarea
                id="complaint"
                placeholder="Describe the patient's chief complaint or reason for visit..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="min-h-24 resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              className="w-full h-14 text-lg font-medium mt-4 bg-amber-600 hover:bg-amber-700"
              onClick={handleSubmit}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Register Patient & Generate Credentials
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
