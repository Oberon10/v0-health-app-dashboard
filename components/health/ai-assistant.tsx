"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Brain,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Activity,
  Thermometer,
  HeartPulse,
  Pill,
} from "lucide-react"
import type { Screen } from "@/app/page"

interface AIAssistantProps {
  setScreen: (screen: Screen) => void
}

interface AnalysisResult {
  condition: string
  confidence: "high" | "medium" | "low"
  description: string
  recommendations: string[]
}

export function AIAssistant({ setScreen }: AIAssistantProps) {
  const [symptom, setSymptom] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const commonSymptoms = [
    { icon: Thermometer, label: "Fever", symptom: "fever" },
    { icon: HeartPulse, label: "Chest Pain", symptom: "chest pain" },
    { icon: Activity, label: "Fatigue", symptom: "fatigue" },
    { icon: Brain, label: "Headache", symptom: "headache" },
  ]

  const analyzeSymptom = (input: string) => {
    setIsAnalyzing(true)

    // Simulated AI analysis
    setTimeout(() => {
      const lowerInput = input.toLowerCase()

      let analysis: AnalysisResult

      if (lowerInput.includes("fever")) {
        analysis = {
          condition: "Possible Viral Infection / Malaria",
          confidence: "high",
          description:
            "Fever is commonly associated with viral infections, including influenza, COVID-19, or in endemic areas, malaria. Further tests recommended.",
          recommendations: [
            "Complete Blood Count (CBC)",
            "Malaria Rapid Diagnostic Test",
            "Rest and adequate hydration",
            "Monitor temperature regularly",
          ],
        }
      } else if (lowerInput.includes("chest") || lowerInput.includes("heart")) {
        analysis = {
          condition: "Cardiac Evaluation Recommended",
          confidence: "medium",
          description:
            "Chest pain can have various causes ranging from musculoskeletal issues to cardiac conditions. Immediate evaluation advised.",
          recommendations: [
            "ECG / Electrocardiogram",
            "Cardiac enzyme markers",
            "Stress test if indicated",
            "Avoid strenuous activity until evaluated",
          ],
        }
      } else if (lowerInput.includes("headache")) {
        analysis = {
          condition: "Tension Headache / Migraine",
          confidence: "medium",
          description:
            "Headaches can be primary (tension, migraine) or secondary to other conditions. Pattern and duration help determine the cause.",
          recommendations: [
            "Note frequency and triggers",
            "Adequate rest and hydration",
            "OTC pain relievers as needed",
            "Consult if persistent or severe",
          ],
        }
      } else if (lowerInput.includes("fatigue") || lowerInput.includes("tired")) {
        analysis = {
          condition: "Multiple Possible Causes",
          confidence: "low",
          description:
            "Persistent fatigue can indicate various conditions including anemia, thyroid disorders, or lifestyle factors. Comprehensive evaluation recommended.",
          recommendations: [
            "Thyroid function tests",
            "Complete metabolic panel",
            "Sleep quality assessment",
            "Lifestyle modification review",
          ],
        }
      } else {
        analysis = {
          condition: "Further Assessment Needed",
          confidence: "low",
          description:
            "The provided symptoms require additional context for accurate analysis. Please provide more specific details or consult directly with a healthcare provider.",
          recommendations: [
            "Detailed symptom history",
            "Physical examination",
            "Basic laboratory workup",
            "Follow-up consultation",
          ],
        }
      }

      setResult(analysis)
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleAnalyze = () => {
    if (!symptom.trim()) return
    analyzeSymptom(symptom)
  }

  const confidenceColors = {
    high: "bg-accent/20 text-accent",
    medium: "bg-amber-500/20 text-amber-600",
    low: "bg-muted text-muted-foreground",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src="/images/ai-health.jpg"
          alt="AI Health Assistant"
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
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
              <span className="text-primary-foreground/80 text-sm">AI-Powered</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-foreground flex items-center gap-2">
              <Brain className="h-7 w-7" />
              Diagnostic Assistant
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6 relative z-10 pb-8">
        {/* Search Card */}
        <Card className="border-0 shadow-xl mb-6 bg-card">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Enter patient symptoms..."
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="pl-10 h-12"
                />
              </div>
              <Button
                className="h-12 px-6"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Analyzing
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>

            {/* Quick Symptoms */}
            <div className="flex flex-wrap gap-2 mt-4">
              {commonSymptoms.map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setSymptom(item.symptom)
                    analyzeSymptom(item.symptom)
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Result */}
        {result && (
          <Card className="border-0 shadow-lg bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Brain className="h-5 w-5 text-primary" />
                  Analysis Result
                </CardTitle>
                <Badge className={confidenceColors[result.confidence]}>
                  {result.confidence.charAt(0).toUpperCase() +
                    result.confidence.slice(1)}{" "}
                  Confidence
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Condition */}
              <div className="p-4 rounded-xl bg-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  {result.confidence === "high" ? (
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                  <span className="font-semibold text-card-foreground">
                    {result.condition}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {result.description}
                </p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2 text-card-foreground">
                  <Pill className="h-4 w-4 text-primary" />
                  Recommendations
                </h4>
                <div className="grid gap-2">
                  {result.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {index + 1}
                      </div>
                      <span className="text-sm text-card-foreground">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-700">
                  <strong>Disclaimer:</strong> This AI analysis is for
                  informational purposes only and should not replace
                  professional medical diagnosis. Always consult with a
                  qualified healthcare provider.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
