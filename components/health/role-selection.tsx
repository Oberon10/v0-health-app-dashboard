"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Stethoscope, User, Heart, Shield, Clock } from "lucide-react"
import type { Role, Screen } from "@/app/page"

interface RoleSelectionProps {
  setRole: (role: Role) => void
  setScreen: (screen: Screen) => void
}

export function RoleSelection({ setRole, setScreen }: RoleSelectionProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src="/images/hero-doctor.jpg"
          alt="Healthcare professionals providing quality care"
          fill
          className="object-cover object-top brightness-105 contrast-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-10 w-10 text-white drop-shadow-lg" fill="currentColor" />
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
              SmartHealth
            </h1>
          </div>
          <p className="text-lg md:text-xl text-white/95 max-w-md drop-shadow-md">
            Your trusted digital healthcare companion for a healthier tomorrow
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-3 gap-4 mb-12">
          <Card className="border-0 shadow-lg bg-card">
            <CardContent className="flex flex-col items-center p-4 md:p-6">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <span className="text-xs md:text-sm font-medium text-center text-card-foreground">Secure Data</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-card">
            <CardContent className="flex flex-col items-center p-4 md:p-6">
              <Clock className="h-8 w-8 text-primary mb-2" />
              <span className="text-xs md:text-sm font-medium text-center text-card-foreground">24/7 Access</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-card">
            <CardContent className="flex flex-col items-center p-4 md:p-6">
              <Heart className="h-8 w-8 text-primary mb-2" />
              <span className="text-xs md:text-sm font-medium text-center text-card-foreground">AI Insights</span>
            </CardContent>
          </Card>
        </div>

        {/* Role Selection Cards */}
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-6 text-foreground">
            Select Your Role
          </h2>
          <div className="grid gap-4">
            <Card
              className="cursor-pointer border-2 border-transparent hover:border-primary transition-all duration-300 shadow-md hover:shadow-xl bg-card group"
              onClick={() => {
                setRole("doctor")
                setScreen("login")
              }}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground">Healthcare Provider</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage appointments, records & AI diagnostics
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-2 border-transparent hover:border-accent transition-all duration-300 shadow-md hover:shadow-xl bg-card group"
              onClick={() => {
                setRole("user")
                setScreen("login")
              }}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-16 w-16 rounded-2xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <User className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground">Patient</h3>
                  <p className="text-sm text-muted-foreground">
                    Book appointments & access your health records
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 mt-8">
          <p className="text-sm text-muted-foreground">
            Trusted by thousands of healthcare professionals worldwide
          </p>
        </div>
      </div>
    </div>
  )
}
