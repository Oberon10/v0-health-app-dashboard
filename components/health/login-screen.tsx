"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowLeft, Eye, EyeOff, Stethoscope, User } from "lucide-react"
import type { Role, Screen } from "@/app/page"

interface LoginScreenProps {
  role: Role
  username: string
  setUsername: (username: string) => void
  setScreen: (screen: Screen) => void
}

export function LoginScreen({
  role,
  username,
  setUsername,
  setScreen,
}: LoginScreenProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const isDoctor = role === "doctor"

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image */}
      <div className="relative h-48 md:h-auto md:w-1/2 bg-primary">
        <Image
          src={isDoctor ? "/images/hero-doctor.jpg" : "/images/patient-care.jpg"}
          alt={isDoctor ? "Doctor portal" : "Patient portal"}
          fill
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <Heart className="h-12 w-12 text-primary-foreground mb-4" fill="currentColor" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            SmartHealth
          </h1>
          <p className="text-primary-foreground/90 text-sm md:text-base max-w-xs">
            {isDoctor
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
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                {isDoctor ? (
                  <Stethoscope className="h-8 w-8 text-primary" />
                ) : (
                  <User className="h-8 w-8 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl text-card-foreground">
                {isDoctor ? "Doctor Portal" : "Patient Portal"}
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Sign in to access your account
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-card-foreground">Username</Label>
                <Input
                  id="username"
                  placeholder={isDoctor ? "Enter your staff ID" : "Enter your username"}
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

              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setScreen("forgot")}
              >
                Forgot password?
              </button>

              <Button
                className="w-full h-12 text-base font-medium"
                onClick={() => setScreen("dashboard")}
              >
                Sign In
              </Button>

              {!isDoctor && (
                <p className="text-center text-sm text-muted-foreground">
                  {"Don't have an account? "}
                  <button type="button" className="text-primary hover:underline font-medium">
                    Register here
                  </button>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
