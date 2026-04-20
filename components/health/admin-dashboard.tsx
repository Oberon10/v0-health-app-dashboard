"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Settings,
  Users,
  Stethoscope,
  Plus,
  LogOut,
  Trash2,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  Building,
  Heart,
} from "lucide-react"
import type { Screen, RegisteredPatient, RegisteredDoctor } from "@/app/page"

interface AdminDashboardProps {
  username: string
  registeredPatients: RegisteredPatient[]
  setRegisteredPatients: (patients: RegisteredPatient[]) => void
  registeredDoctors: RegisteredDoctor[]
  setRegisteredDoctors: (doctors: RegisteredDoctor[]) => void
  setScreen: (screen: Screen) => void
  showNotification: (message: string) => void
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const genotypes = ["AA", "AS", "SS", "AC", "SC"]
const departments = [
  "General Medicine",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Gynecology",
  "Ophthalmology",
  "ENT",
  "Psychiatry",
  "Emergency",
  "Surgery",
  "Radiology",
  "Pathology",
]

export function AdminDashboard({
  username,
  registeredPatients,
  setRegisteredPatients,
  registeredDoctors,
  setRegisteredDoctors,
  setScreen,
  showNotification,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("patients")
  const [showPatientDialog, setShowPatientDialog] = useState(false)
  const [showDoctorDialog, setShowDoctorDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Patient form state
  const [patientForm, setPatientForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    genotype: "",
    bloodGroup: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    email: "",
  })

  // Doctor form state
  const [doctorForm, setDoctorForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    bloodGroup: "",
    department: "",
    email: "",
    dateOfBirth: "",
    phone: "",
  })

  const resetPatientForm = () => {
    setPatientForm({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      genotype: "",
      bloodGroup: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      email: "",
    })
  }

  const resetDoctorForm = () => {
    setDoctorForm({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      bloodGroup: "",
      department: "",
      email: "",
      dateOfBirth: "",
      phone: "",
    })
  }

  const handleCreatePatient = () => {
    // Validation
    if (
      !patientForm.firstName ||
      !patientForm.lastName ||
      !patientForm.username ||
      !patientForm.password ||
      !patientForm.genotype ||
      !patientForm.bloodGroup ||
      !patientForm.dateOfBirth ||
      !patientForm.phone ||
      !patientForm.email
    ) {
      showNotification("Please fill in all required fields")
      return
    }

    // Check for duplicate username
    if (registeredPatients.some((p) => p.username === patientForm.username)) {
      showNotification("Username already exists")
      return
    }

    const newPatient: RegisteredPatient = {
      id: Date.now().toString(),
      ...patientForm,
      createdAt: new Date().toISOString(),
    }

    setRegisteredPatients([...registeredPatients, newPatient])
    showNotification(`Patient ${patientForm.firstName} ${patientForm.lastName} created successfully`)
    resetPatientForm()
    setShowPatientDialog(false)
  }

  const handleCreateDoctor = () => {
    // Validation
    if (
      !doctorForm.firstName ||
      !doctorForm.lastName ||
      !doctorForm.username ||
      !doctorForm.password ||
      !doctorForm.bloodGroup ||
      !doctorForm.department ||
      !doctorForm.email ||
      !doctorForm.dateOfBirth
    ) {
      showNotification("Please fill in all required fields")
      return
    }

    // Check for duplicate username
    if (registeredDoctors.some((d) => d.username === doctorForm.username)) {
      showNotification("Username already exists")
      return
    }

    const newDoctor: RegisteredDoctor = {
      id: Date.now().toString(),
      ...doctorForm,
      createdAt: new Date().toISOString(),
    }

    setRegisteredDoctors([...registeredDoctors, newDoctor])
    showNotification(`Dr. ${doctorForm.firstName} ${doctorForm.lastName} created successfully`)
    resetDoctorForm()
    setShowDoctorDialog(false)
  }

  const handleDeletePatient = (id: string) => {
    setRegisteredPatients(registeredPatients.filter((p) => p.id !== id))
    showNotification("Patient deleted successfully")
  }

  const handleDeleteDoctor = (id: string) => {
    setRegisteredDoctors(registeredDoctors.filter((d) => d.id !== id))
    showNotification("Doctor deleted successfully")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-white/80">Welcome, {username || "Administrator"}</p>
            </div>
          </div>
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

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-md bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{registeredPatients.length}</p>
              <p className="text-xs text-muted-foreground">Registered Patients</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{registeredDoctors.length}</p>
              <p className="text-xs text-muted-foreground">Registered Doctors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="patients" className="gap-2">
              <Users className="h-4 w-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="doctors" className="gap-2">
              <Stethoscope className="h-4 w-4" />
              Doctors
            </TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients" className="mt-0">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Patient Management</CardTitle>
                  <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Patient
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Register New Patient</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>First Name *</Label>
                            <Input
                              placeholder="First name"
                              value={patientForm.firstName}
                              onChange={(e) =>
                                setPatientForm({ ...patientForm, firstName: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Last Name *</Label>
                            <Input
                              placeholder="Last name"
                              value={patientForm.lastName}
                              onChange={(e) =>
                                setPatientForm({ ...patientForm, lastName: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Username *</Label>
                          <Input
                            placeholder="Unique username for login"
                            value={patientForm.username}
                            onChange={(e) =>
                              setPatientForm({ ...patientForm, username: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Password *</Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create password"
                              value={patientForm.password}
                              onChange={(e) =>
                                setPatientForm({ ...patientForm, password: e.target.value })
                              }
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Genotype *</Label>
                            <Select
                              value={patientForm.genotype}
                              onValueChange={(value) =>
                                setPatientForm({ ...patientForm, genotype: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {genotypes.map((g) => (
                                  <SelectItem key={g} value={g}>
                                    {g}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Blood Group *</Label>
                            <Select
                              value={patientForm.bloodGroup}
                              onValueChange={(value) =>
                                setPatientForm({ ...patientForm, bloodGroup: value })
                              }
                            >
                              <SelectTrigger>
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
                        </div>

                        <div className="space-y-2">
                          <Label>Date of Birth *</Label>
                          <Input
                            type="date"
                            value={patientForm.dateOfBirth}
                            onChange={(e) =>
                              setPatientForm({ ...patientForm, dateOfBirth: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Address</Label>
                          <Input
                            placeholder="Full address"
                            value={patientForm.address}
                            onChange={(e) =>
                              setPatientForm({ ...patientForm, address: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Phone Number *</Label>
                          <Input
                            type="tel"
                            placeholder="+1234567890"
                            value={patientForm.phone}
                            onChange={(e) =>
                              setPatientForm({ ...patientForm, phone: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Email Address *</Label>
                          <Input
                            type="email"
                            placeholder="patient@example.com"
                            value={patientForm.email}
                            onChange={(e) =>
                              setPatientForm({ ...patientForm, email: e.target.value })
                            }
                          />
                        </div>

                        <Button className="w-full" onClick={handleCreatePatient}>
                          Register Patient
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {registeredPatients.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No patients registered yet</p>
                    <p className="text-sm">Click &quot;Add Patient&quot; to register a new patient</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {registeredPatients.map((patient) => (
                        <Card key={patient.id} className="border shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-card-foreground">
                                    {patient.firstName} {patient.lastName}
                                  </h3>
                                  <p className="text-xs text-muted-foreground">@{patient.username}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                      <Droplet className="h-3 w-3 mr-1" />
                                      {patient.bloodGroup}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {patient.genotype}
                                    </Badge>
                                  </div>
                                  <div className="mt-2 text-xs text-muted-foreground space-y-1">
                                    <p className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" /> {patient.email}
                                    </p>
                                    <p className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" /> {patient.phone}
                                    </p>
                                    <p className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" /> {patient.dateOfBirth}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {patient.firstName} {patient.lastName}?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeletePatient(patient.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors" className="mt-0">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Doctor Management</CardTitle>
                  <Dialog open={showDoctorDialog} onOpenChange={setShowDoctorDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Doctor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Register New Doctor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>First Name *</Label>
                            <Input
                              placeholder="First name"
                              value={doctorForm.firstName}
                              onChange={(e) =>
                                setDoctorForm({ ...doctorForm, firstName: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Last Name *</Label>
                            <Input
                              placeholder="Last name"
                              value={doctorForm.lastName}
                              onChange={(e) =>
                                setDoctorForm({ ...doctorForm, lastName: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Username *</Label>
                          <Input
                            placeholder="Unique username for login"
                            value={doctorForm.username}
                            onChange={(e) =>
                              setDoctorForm({ ...doctorForm, username: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Password *</Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create password"
                              value={doctorForm.password}
                              onChange={(e) =>
                                setDoctorForm({ ...doctorForm, password: e.target.value })
                              }
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Department *</Label>
                          <Select
                            value={doctorForm.department}
                            onValueChange={(value) =>
                              setDoctorForm({ ...doctorForm, department: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Blood Group *</Label>
                          <Select
                            value={doctorForm.bloodGroup}
                            onValueChange={(value) =>
                              setDoctorForm({ ...doctorForm, bloodGroup: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
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
                          <Label>Date of Birth *</Label>
                          <Input
                            type="date"
                            value={doctorForm.dateOfBirth}
                            onChange={(e) =>
                              setDoctorForm({ ...doctorForm, dateOfBirth: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <Input
                            type="tel"
                            placeholder="+1234567890"
                            value={doctorForm.phone}
                            onChange={(e) =>
                              setDoctorForm({ ...doctorForm, phone: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Email Address *</Label>
                          <Input
                            type="email"
                            placeholder="doctor@hospital.com"
                            value={doctorForm.email}
                            onChange={(e) =>
                              setDoctorForm({ ...doctorForm, email: e.target.value })
                            }
                          />
                        </div>

                        <Button className="w-full" onClick={handleCreateDoctor}>
                          Register Doctor
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {registeredDoctors.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Stethoscope className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No doctors registered yet</p>
                    <p className="text-sm">Click &quot;Add Doctor&quot; to register a new doctor</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {registeredDoctors.map((doctor) => (
                        <Card key={doctor.id} className="border shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                                  <Stethoscope className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-card-foreground">
                                    Dr. {doctor.firstName} {doctor.lastName}
                                  </h3>
                                  <p className="text-xs text-muted-foreground">@{doctor.username}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge className="text-xs">
                                      <Building className="h-3 w-3 mr-1" />
                                      {doctor.department}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      <Droplet className="h-3 w-3 mr-1" />
                                      {doctor.bloodGroup}
                                    </Badge>
                                  </div>
                                  <div className="mt-2 text-xs text-muted-foreground space-y-1">
                                    <p className="flex items-center gap-1">
                                      <Mail className="h-3 w-3" /> {doctor.email}
                                    </p>
                                    {doctor.phone && (
                                      <p className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" /> {doctor.phone}
                                      </p>
                                    )}
                                    <p className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" /> {doctor.dateOfBirth}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete Dr. {doctor.firstName} {doctor.lastName}?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteDoctor(doctor.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Heart className="h-4 w-4 text-primary" />
          <span>SmartHealth Admin Panel</span>
        </div>
      </div>
    </div>
  )
}
