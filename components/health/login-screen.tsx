"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowLeft, Eye, EyeOff, Stethoscope, User, UserCog } from "lucide-react"
import type { Role, Screen, RegisteredPatient, RegisteredDoctor } from "@/app/page"

interface LoginScreenProps {
  role: Role
  username: string
  setUsername: (username: string) => void
  setScreen: (screen: Screen) => void
  registeredPatients: RegisteredPatient[]
  registeredDoctors: RegisteredDoctor[]
  showNotification: (message: string) => void
}

export function LoginScreen({
  role,
  username,
  setUsername,
  setScreen,
  registeredPatients,
  registeredDoctors,
  showNotification,
}: LoginScreenProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const isDoctor = role === "doctor"
  const isAdmin = role === "admin"
  const isPatient = role === "user"

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      showNotification("Please enter username and password")
      return
    }

    if (isAdmin) {
      // Admin login - use fixed credentials for demo
      if (username === "admin" && password === "admin123") {
        setScreen("admin-dashboard")
      } else {
        showNotification("Invalid admin credentials")
      }
      return
    }

    if (isDoctor) {
      // Doctor login - must have registered credentials from admin
      const doctor = registeredDoctors.find(
        (d) => d.username === username && d.password === password
      )
      if (doctor) {
        setScreen("dashboard")
      } else {
        showNotification("Invalid credentials. Please contact admin to register.")
      }
      return
    }

    if (isPatient) {
      // Patient login - must have registered credentials from admin
      const patient = registeredPatients.find(
        (p) => p.username === username && p.password === password
      )
      if (patient) {
        setScreen("dashboard")
      } else {
        showNotification("Invalid credentials. Please contact admin to register.")
      }
      return
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image */}
      <div className="relative h-48 md:h-auto md:w-1/2">
        <Image
          src={isAdmin ? "/images/hero-doctor.jpg" : isDoctor ? "/images/hero-doctor.jpg" : "/images/patient-care.jpg"}
          alt={isAdmin ? "Admin portal" : isDoctor ? "Doctor portal" : "Patient portal"}
          fill
          className="object-cover brightness-105 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/75 via-slate-900/50 to-slate-900/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <Heart className="h-12 w-12 text-white mb-4 drop-shadow-lg" fill="currentColor" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            SmartHealth
          </h1>
          <p className="text-white/90 text-sm md:text-base max-w-xs drop-shadow-md">
            {isAdmin
              ? "System administration and patient registration"
              : isDoctor
              ? "Empower your practice with intelligent healthcare management"
              : "Your health journey starts here"}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={() => setScreen("role")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card className="border-0 shadow-xl bg-card">
            <CardHeader className="text-center pb-2">
              <div className={`mx-auto mb-4 h-16 w-16 rounded-full flex items-center justify-center ${
                isAdmin ? "bg-amber-500/10" : "bg-primary/10"
              }`}>
                {isAdmin ? (
                  <UserCog className="h-8 w-8 text-amber-600" />
                ) : isDoctor ? (
                  <Stethoscope className="h-8 w-8 text-primary" />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl text-card-foreground">
                {isAdmin ? "Admin Portal" : isDoctor ? "Doctor Portal" : "Patient Portal"}
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                {isAdmin 
                  ? "Sign in to manage patient registration" 
                  : "Sign in to access your account"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-card-foreground">Username</Label>
                <Input
                  id="username"
                  placeholder={isAdmin ? "Enter admin username" : isDoctor ? "Enter your staff ID" : "Enter your patient ID"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {!isAdmin && (
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setScreen("forgot")}
                >
                  Forgot password?
                </button>
              )}

              <Button
                className={`w-full h-12 text-base font-medium ${isAdmin ? "bg-amber-600 hover:bg-amber-700" : ""}`}
                onClick={handleLogin}
              >
                Sign In
              </Button>

              {(isPatient || isDoctor) && (
                <div className="p-3 rounded-lg bg-muted/50 border border-muted">
                  <p className="text-center text-sm text-muted-foreground">
                    {"Don't have an account? Contact the hospital admin to register and receive your login credentials."}
                  </p>
                </div>
              )}

              {isAdmin && (
                <p className="text-center text-xs text-muted-foreground">
                  Default: admin / admin123
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
