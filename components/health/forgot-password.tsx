"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import type { Screen } from "@/app/page"

interface ForgotPasswordProps {
  setScreen: (screen: Screen) => void
}

export function ForgotPassword({ setScreen }: ForgotPasswordProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => setScreen("login")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Button>

        <Card className="border-0 shadow-xl bg-card">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              {submitted ? (
                <CheckCircle className="h-8 w-8 text-accent" />
              ) : (
                <Mail className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl text-card-foreground">
              {submitted ? "Check Your Email" : "Reset Password"}
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              {submitted
                ? "We&apos;ve sent you a password reset link"
                : "Enter your email to receive a reset link"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {!submitted ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-card-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button className="w-full h-12 text-base font-medium" onClick={handleSubmit}>
                  Send Reset Link
                </Button>
              </>
            ) : (
              <>
                <div className="text-center p-4 bg-accent/10 rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    A password reset link has been sent to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
                <Button
                  className="w-full h-12 text-base font-medium"
                  onClick={() => setScreen("login")}
                >
                  Return to Login
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground">
          <Heart className="h-5 w-5 text-primary" fill="currentColor" />
          <span className="text-sm font-medium">SmartHealth</span>
        </div>
      </div>
    </div>
  )
}
