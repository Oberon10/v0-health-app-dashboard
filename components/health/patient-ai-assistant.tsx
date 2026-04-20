"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  ArrowLeft,
  Brain,
  Send,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Activity,
  Thermometer,
  HeartPulse,
  Pill,
  Bug,
  Siren,
  Globe,
  WifiOff,
  Wifi,
  MessageCircle,
  User,
  Bot,
  Zap,
  Stethoscope,
  Shield,
  Clock,
  Search,
  Check,
  ChevronDown,
  X,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Screen } from "@/app/page"

interface PatientAIAssistantProps {
  setScreen: (screen: Screen) => void
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AnalysisResult {
  condition: string
  confidence: "high" | "medium" | "low"
  urgency: "emergency" | "urgent" | "moderate" | "low"
  description: string
  recommendations: string[]
  firstAid?: string[]
  warningSignsToWatch?: string[]
  whenToSeekHelp?: string
}

// Comprehensive symptom database with translations
const symptomDatabase: Record<string, AnalysisResult> = {
  // Animal Bites
  "dog bite": {
    condition: "Dog Bite Injury",
    confidence: "high",
    urgency: "urgent",
    description: "Dog bites can cause tissue damage and carry risk of infection including rabies. Immediate care is essential.",
    firstAid: [
      "Clean the wound immediately with soap and running water for at least 5 minutes",
      "Apply pressure with clean cloth if bleeding heavily",
      "Apply antiseptic solution if available",
      "Cover with clean bandage",
      "Do NOT close the wound tightly - leave it slightly open for drainage"
    ],
    recommendations: [
      "Seek medical attention within 24 hours",
      "Rabies vaccination may be required if dog status unknown",
      "Tetanus shot if not up to date",
      "Antibiotics may be prescribed to prevent infection",
      "Keep wound elevated if on limb"
    ],
    warningSignsToWatch: [
      "Increasing redness, swelling, or warmth around wound",
      "Pus or discharge from wound",
      "Fever or chills",
      "Red streaks spreading from wound",
      "Numbness or tingling"
    ],
    whenToSeekHelp: "Seek emergency care immediately if: deep puncture wound, heavy bleeding that won't stop, bite on face/head/neck, or if the dog was acting strangely (possible rabies)"
  },
  "cat bite": {
    condition: "Cat Bite Injury",
    confidence: "high",
    urgency: "urgent",
    description: "Cat bites have high infection risk due to deep puncture wounds and bacteria in cat saliva. Over 50% of cat bites become infected.",
    firstAid: [
      "Wash wound thoroughly with soap and water for 5-10 minutes",
      "Apply antiseptic if available",
      "Apply pressure to stop bleeding",
      "Cover with sterile bandage",
      "Keep the affected area elevated"
    ],
    recommendations: [
      "See a doctor within 12-24 hours - antibiotics often needed",
      "Tetanus booster if not current",
      "Monitor closely for signs of infection",
      "May need rabies evaluation",
      "Document the incident"
    ],
    warningSignsToWatch: [
      "Swelling or redness within hours",
      "Warmth at bite site",
      "Difficulty moving nearby joints",
      "Fever",
      "Swollen lymph nodes"
    ],
    whenToSeekHelp: "Seek care within 12 hours due to high infection risk. Seek emergency care for bites on hands, near joints, or if you have a weakened immune system."
  },
  "snake bite": {
    condition: "Snake Bite - Potential Emergency",
    confidence: "high",
    urgency: "emergency",
    description: "Snake bites can be life-threatening depending on the species. Treat all snake bites as potentially venomous until proven otherwise.",
    firstAid: [
      "Stay calm and move away from the snake",
      "Keep the bitten limb still and below heart level",
      "Remove any jewelry or tight clothing near the bite",
      "Clean the wound gently if possible",
      "DO NOT: cut the wound, suck out venom, apply tourniquet, or apply ice"
    ],
    recommendations: [
      "CALL EMERGENCY SERVICES IMMEDIATELY",
      "Try to remember the snake's appearance (do not try to catch it)",
      "Keep the person calm and still to slow venom spread",
      "Monitor breathing and vital signs",
      "Antivenom may be needed at hospital"
    ],
    warningSignsToWatch: [
      "Severe pain and swelling",
      "Nausea, vomiting, or dizziness",
      "Difficulty breathing",
      "Blurred vision",
      "Numbness or tingling",
      "Bleeding from the bite or other areas"
    ],
    whenToSeekHelp: "THIS IS AN EMERGENCY. Call emergency services immediately. Do not wait for symptoms - get to a hospital with antivenom capability."
  },
  "spider bite": {
    condition: "Spider Bite",
    confidence: "medium",
    urgency: "moderate",
    description: "Most spider bites are harmless, but some species (like black widows or brown recluse) can cause serious reactions.",
    firstAid: [
      "Clean the bite area with soap and water",
      "Apply a cold compress to reduce swelling",
      "Elevate the affected area if possible",
      "Take over-the-counter pain relievers if needed",
      "Avoid scratching the bite"
    ],
    recommendations: [
      "Take a photo of the spider if safely possible",
      "Monitor the bite for changes over 24-48 hours",
      "Apply antibiotic ointment to prevent infection",
      "Seek medical care if symptoms worsen",
      "Antihistamines may help with itching"
    ],
    warningSignsToWatch: [
      "Severe pain or cramping",
      "Spreading redness or a target-like pattern",
      "Fever or body aches",
      "Difficulty breathing",
      "Ulceration or tissue death at bite site"
    ],
    whenToSeekHelp: "Seek emergency care if: bitten by a black widow or brown recluse, severe symptoms develop, or the person is a child, elderly, or has health conditions."
  },
  "bee sting": {
    condition: "Bee/Wasp Sting",
    confidence: "high",
    urgency: "moderate",
    description: "Bee stings cause localized pain and swelling. Can be life-threatening for those with allergies (anaphylaxis).",
    firstAid: [
      "Remove the stinger by scraping sideways (don't squeeze it)",
      "Wash the area with soap and water",
      "Apply cold compress for 10-15 minutes",
      "Take antihistamine for itching",
      "Apply hydrocortisone cream if available"
    ],
    recommendations: [
      "Monitor for allergic reaction for 30 minutes",
      "Keep the area clean and dry",
      "Avoid scratching to prevent infection",
      "Pain relievers like ibuprofen can help",
      "Consider allergy testing if severe reaction"
    ],
    warningSignsToWatch: [
      "Swelling of face, lips, or throat",
      "Difficulty breathing or swallowing",
      "Rapid heartbeat",
      "Dizziness or fainting",
      "Widespread hives or rash"
    ],
    whenToSeekHelp: "CALL EMERGENCY SERVICES IMMEDIATELY if signs of anaphylaxis (difficulty breathing, swelling of throat, dizziness). Use EpiPen if available."
  },
  "scorpion sting": {
    condition: "Scorpion Sting",
    confidence: "high",
    urgency: "urgent",
    description: "Scorpion stings can range from mild to potentially life-threatening, especially in children or from certain species.",
    firstAid: [
      "Clean the sting site with soap and water",
      "Apply a cool compress to reduce pain",
      "Keep the affected limb elevated",
      "Take over-the-counter pain medication",
      "Stay calm to slow venom absorption"
    ],
    recommendations: [
      "Monitor symptoms closely for 24 hours",
      "Seek medical care especially for children",
      "Antivenom may be needed for severe cases",
      "Keep the person still and calm",
      "Note the time of the sting"
    ],
    warningSignsToWatch: [
      "Difficulty breathing",
      "Muscle twitching or thrashing",
      "Excessive drooling",
      "Vomiting",
      "High blood pressure",
      "Irregular heartbeat"
    ],
    whenToSeekHelp: "Seek emergency care if: victim is a child under 6, severe pain spreading beyond sting site, difficulty breathing, or muscle spasms."
  },
  "rat bite": {
    condition: "Rat/Rodent Bite",
    confidence: "high",
    urgency: "urgent",
    description: "Rat bites carry risk of infection and diseases like rat-bite fever, leptospirosis, and potentially rabies.",
    firstAid: [
      "Wash the wound thoroughly with soap and water for 5 minutes",
      "Apply antiseptic solution",
      "Apply pressure if bleeding",
      "Cover with clean bandage",
      "Note when and where the bite occurred"
    ],
    recommendations: [
      "See a doctor within 24 hours",
      "Antibiotics are usually prescribed",
      "Tetanus shot if not current",
      "Monitor for rat-bite fever symptoms (can appear days later)",
      "Document the incident"
    ],
    warningSignsToWatch: [
      "Fever appearing 3-10 days after bite",
      "Rash, especially on hands and feet",
      "Joint pain or swelling",
      "Headache and muscle aches",
      "Wound becoming red, swollen, or draining pus"
    ],
    whenToSeekHelp: "See a healthcare provider within 24 hours. Seek emergency care if fever develops or signs of severe infection appear."
  },
  "monkey bite": {
    condition: "Monkey/Primate Bite",
    confidence: "high",
    urgency: "emergency",
    description: "Monkey bites are serious due to risk of Herpes B virus (can be fatal in humans), rabies, and bacterial infections.",
    firstAid: [
      "Wash wound immediately and thoroughly with soap and water for 15 minutes",
      "Rinse with povidone-iodine or alcohol if available",
      "Do not scrub - gently clean",
      "Apply sterile bandage",
      "Document details of the incident"
    ],
    recommendations: [
      "SEEK IMMEDIATE MEDICAL ATTENTION",
      "Herpes B prophylaxis may be needed",
      "Rabies post-exposure prophylaxis usually required",
      "Tetanus vaccination if not current",
      "Report incident to local health authorities"
    ],
    warningSignsToWatch: [
      "Flu-like symptoms within days to weeks",
      "Tingling or numbness at bite site",
      "Blisters near the wound",
      "Muscle weakness or paralysis",
      "Confusion or neurological symptoms"
    ],
    whenToSeekHelp: "THIS IS AN EMERGENCY. Seek medical care immediately after any monkey bite due to serious disease risks."
  },
  // Common Symptoms
  "fever": {
    condition: "Fever / Possible Infection",
    confidence: "high",
    urgency: "moderate",
    description: "Fever indicates your body is fighting an infection. Common causes include viral infections, malaria (in endemic areas), bacterial infections, or inflammatory conditions.",
    firstAid: [
      "Rest in a comfortable, cool environment",
      "Drink plenty of fluids to prevent dehydration",
      "Use light clothing and blankets",
      "Take temperature regularly to monitor",
      "Take paracetamol/acetaminophen for comfort"
    ],
    recommendations: [
      "If in malaria-endemic area, get tested",
      "Complete Blood Count (CBC) may be needed",
      "Rest and stay hydrated",
      "Monitor temperature every 4-6 hours",
      "Isolate if COVID-19 or flu is suspected"
    ],
    warningSignsToWatch: [
      "Temperature above 39.4°C (103°F) in adults",
      "Fever lasting more than 3 days",
      "Severe headache or stiff neck",
      "Difficulty breathing",
      "Confusion or unusual behavior",
      "Seizures"
    ],
    whenToSeekHelp: "Seek immediate care for: fever with rash, severe headache with stiff neck, difficulty breathing, confusion, or if fever is in an infant under 3 months."
  },
  "headache": {
    condition: "Headache",
    confidence: "medium",
    urgency: "low",
    description: "Headaches can be primary (tension, migraine) or secondary to other conditions. Most are not serious but some require medical attention.",
    firstAid: [
      "Rest in a quiet, dark room",
      "Stay hydrated",
      "Apply cold or warm compress to head/neck",
      "Take over-the-counter pain relievers",
      "Avoid screen time and bright lights"
    ],
    recommendations: [
      "Note frequency, triggers, and patterns",
      "Ensure adequate sleep and hydration",
      "Reduce stress if possible",
      "Limit caffeine and alcohol",
      "Keep a headache diary if recurring"
    ],
    warningSignsToWatch: [
      "Sudden, severe 'thunderclap' headache",
      "Headache with fever and stiff neck",
      "Confusion or personality changes",
      "Vision changes or eye pain",
      "Weakness or numbness",
      "Headache after head injury"
    ],
    whenToSeekHelp: "Seek emergency care for: worst headache of your life, headache with fever and stiff neck, after head injury, or with neurological symptoms."
  },
  "chest pain": {
    condition: "Chest Pain - Requires Evaluation",
    confidence: "medium",
    urgency: "urgent",
    description: "Chest pain can range from harmless muscle strain to serious cardiac conditions. It should always be evaluated promptly.",
    firstAid: [
      "Sit down and rest immediately",
      "Loosen any tight clothing",
      "If you have prescribed nitroglycerin, take as directed",
      "Chew an aspirin (325mg) if not allergic and heart attack suspected",
      "Try to stay calm and breathe slowly"
    ],
    recommendations: [
      "Seek medical evaluation promptly",
      "ECG/Electrocardiogram recommended",
      "Cardiac enzyme tests may be needed",
      "Avoid physical exertion until evaluated",
      "Do not ignore chest pain"
    ],
    warningSignsToWatch: [
      "Crushing or squeezing chest pressure",
      "Pain spreading to arm, jaw, neck, or back",
      "Shortness of breath",
      "Nausea, vomiting, or cold sweats",
      "Dizziness or fainting"
    ],
    whenToSeekHelp: "CALL EMERGENCY SERVICES IMMEDIATELY if: chest pain with shortness of breath, pain spreading to arm/jaw, or if you have risk factors for heart disease."
  },
  "difficulty breathing": {
    condition: "Respiratory Distress",
    confidence: "high",
    urgency: "emergency",
    description: "Difficulty breathing can indicate serious conditions including asthma, pneumonia, allergic reaction, or heart problems.",
    firstAid: [
      "Sit upright to ease breathing",
      "Loosen any tight clothing",
      "Use prescribed inhaler if available",
      "Stay calm - anxiety worsens breathing",
      "Open windows for fresh air"
    ],
    recommendations: [
      "SEEK IMMEDIATE MEDICAL ATTENTION",
      "Use rescue inhaler if asthmatic",
      "Oxygen therapy may be needed",
      "Chest X-ray or other imaging",
      "Pulmonary function tests"
    ],
    warningSignsToWatch: [
      "Blue lips or fingernails (cyanosis)",
      "Unable to speak in full sentences",
      "Gasping or wheezing",
      "Chest pain with breathing",
      "Rapid, shallow breathing",
      "Confusion or drowsiness"
    ],
    whenToSeekHelp: "THIS IS AN EMERGENCY if severe. Call emergency services for: blue coloration, inability to speak, severe wheezing, or rapid deterioration."
  },
  "stomach pain": {
    condition: "Abdominal Pain",
    confidence: "medium",
    urgency: "moderate",
    description: "Stomach pain has many causes from indigestion to appendicitis. Location and character of pain help determine the cause.",
    firstAid: [
      "Rest in a comfortable position",
      "Sip clear fluids if not vomiting",
      "Avoid solid foods until pain improves",
      "Apply warm compress to abdomen",
      "Avoid aspirin or ibuprofen (can worsen stomach issues)"
    ],
    recommendations: [
      "Note location, timing, and type of pain",
      "Avoid heavy, fatty, or spicy foods",
      "Stay hydrated with clear fluids",
      "Monitor for worsening symptoms",
      "Antacids may help if upper stomach"
    ],
    warningSignsToWatch: [
      "Severe or sudden pain",
      "Rigid or board-like abdomen",
      "Blood in vomit or stool",
      "High fever with abdominal pain",
      "Unable to pass gas or stool",
      "Pain in right lower abdomen (possible appendicitis)"
    ],
    whenToSeekHelp: "Seek emergency care for: severe sudden pain, blood in vomit/stool, high fever, or if pain is in right lower abdomen and worsening."
  },
  "diarrhea": {
    condition: "Diarrhea / Gastroenteritis",
    confidence: "high",
    urgency: "moderate",
    description: "Diarrhea is often caused by viral or bacterial infections, food poisoning, or medications. Main risk is dehydration.",
    firstAid: [
      "Drink plenty of fluids - ORS (oral rehydration solution) is best",
      "Eat bland foods when able (BRAT: bananas, rice, applesauce, toast)",
      "Avoid dairy, fatty, and spicy foods",
      "Rest as much as possible",
      "Wash hands frequently to prevent spread"
    ],
    recommendations: [
      "Continue hydration with ORS or clear fluids",
      "Probiotics may help recovery",
      "Avoid anti-diarrheal medications in some infections",
      "Monitor for signs of dehydration",
      "Stool test if blood present or lasting >3 days"
    ],
    warningSignsToWatch: [
      "Blood or mucus in stool",
      "High fever (above 38.5°C/101°F)",
      "Signs of dehydration (dark urine, dizziness)",
      "Severe abdominal pain",
      "Diarrhea lasting more than 3 days",
      "Unable to keep fluids down"
    ],
    whenToSeekHelp: "Seek care if: bloody stool, high fever, severe dehydration, or symptoms in infants, elderly, or those with weak immune systems."
  },
  "vomiting": {
    condition: "Vomiting / Nausea",
    confidence: "high",
    urgency: "moderate",
    description: "Vomiting can be caused by infections, food poisoning, pregnancy, motion sickness, or more serious conditions. Dehydration is the main concern.",
    firstAid: [
      "Rest and avoid solid foods temporarily",
      "Take small sips of clear fluids every 15 minutes",
      "Try ORS, clear broth, or flat ginger ale",
      "Lie on your side to prevent aspiration",
      "Avoid strong odors that may trigger nausea"
    ],
    recommendations: [
      "Gradually reintroduce bland foods",
      "Ginger tea or ginger supplements may help",
      "Anti-nausea medications if prescribed",
      "Stay hydrated with small, frequent sips",
      "Avoid dairy until fully recovered"
    ],
    warningSignsToWatch: [
      "Blood in vomit (or looks like coffee grounds)",
      "Severe headache or stiff neck with vomiting",
      "Signs of dehydration",
      "Unable to keep any fluids down for 24 hours",
      "Severe abdominal pain",
      "Vomiting after head injury"
    ],
    whenToSeekHelp: "Seek emergency care for: blood in vomit, vomiting after head injury, severe dehydration, or if unable to keep fluids down for 24 hours."
  },
  "cough": {
    condition: "Cough / Respiratory Infection",
    confidence: "medium",
    urgency: "low",
    description: "Cough is usually caused by viral infections, allergies, or irritants. Can indicate pneumonia or other serious conditions if prolonged or severe.",
    firstAid: [
      "Stay hydrated with warm fluids",
      "Use honey (for adults and children over 1 year)",
      "Use a humidifier or steam inhalation",
      "Rest your voice",
      "Avoid irritants like smoke"
    ],
    recommendations: [
      "Over-the-counter cough suppressants for dry cough",
      "Expectorants for productive cough",
      "Throat lozenges for comfort",
      "Monitor for worsening symptoms",
      "See doctor if cough persists >2-3 weeks"
    ],
    warningSignsToWatch: [
      "Coughing up blood",
      "High fever with cough",
      "Difficulty breathing",
      "Chest pain with coughing",
      "Cough lasting more than 3 weeks",
      "Night sweats and weight loss"
    ],
    whenToSeekHelp: "Seek medical care for: coughing up blood, high fever, difficulty breathing, or cough persisting more than 3 weeks."
  },
  "rash": {
    condition: "Skin Rash",
    confidence: "medium",
    urgency: "moderate",
    description: "Rashes can be caused by allergies, infections, medications, or skin conditions. Some rashes indicate serious conditions requiring immediate care.",
    firstAid: [
      "Avoid scratching the affected area",
      "Apply cool compress for relief",
      "Use mild, unscented soap",
      "Apply calamine lotion or hydrocortisone cream",
      "Wear loose, comfortable clothing"
    ],
    recommendations: [
      "Take antihistamines for itching",
      "Identify and avoid potential triggers",
      "Keep the area clean and dry",
      "Take photos to track changes",
      "See a doctor if spreading or worsening"
    ],
    warningSignsToWatch: [
      "Rash with fever and feeling unwell",
      "Rapidly spreading rash",
      "Blistering or peeling skin",
      "Purple spots that don't fade with pressure",
      "Swelling of face, lips, or throat",
      "Rash after starting new medication"
    ],
    whenToSeekHelp: "Seek emergency care for: rash with difficulty breathing, purple non-blanching spots (could be meningitis), or severe blistering/peeling."
  },
  "burn": {
    condition: "Burn Injury",
    confidence: "high",
    urgency: "urgent",
    description: "Burns are classified by depth (1st, 2nd, 3rd degree). Proper first aid is crucial to prevent infection and minimize damage.",
    firstAid: [
      "Cool the burn under cool (not cold) running water for 10-20 minutes",
      "Remove jewelry or tight items near the burn",
      "Cover with clean, non-fluffy material (cling film works well)",
      "Do NOT apply ice, butter, or toothpaste",
      "Do NOT burst blisters"
    ],
    recommendations: [
      "Over-the-counter pain relievers as needed",
      "Keep the burn clean and covered",
      "Apply aloe vera or burn cream (for minor burns)",
      "Stay hydrated",
      "Watch for signs of infection"
    ],
    warningSignsToWatch: [
      "Burns on face, hands, feet, genitals, or joints",
      "Burns larger than palm of hand",
      "White or charred skin (deep burn)",
      "Burns all the way around a limb",
      "Chemical or electrical burns",
      "Signs of infection"
    ],
    whenToSeekHelp: "Seek emergency care for: burns on face/hands/feet/joints, burns larger than palm, white/charred appearance, or electrical/chemical burns."
  },
  "cut": {
    condition: "Cut / Laceration",
    confidence: "high",
    urgency: "moderate",
    description: "Cuts should be properly cleaned and assessed. Deep cuts, cuts with debris, or those on certain body parts may need medical attention.",
    firstAid: [
      "Apply direct pressure with clean cloth to stop bleeding",
      "Clean wound gently with water once bleeding stops",
      "Apply antibiotic ointment",
      "Cover with sterile bandage",
      "Elevate the injured area if on a limb"
    ],
    recommendations: [
      "Change dressing daily or when dirty",
      "Watch for signs of infection",
      "Consider tetanus shot if not current",
      "Stitches needed if edges don't stay together",
      "Keep the wound dry for first 24 hours"
    ],
    warningSignsToWatch: [
      "Bleeding that won't stop with pressure",
      "Wound edges that won't stay together",
      "Numbness or inability to move area",
      "Signs of infection (redness, swelling, pus)",
      "Cut from dirty or rusty object",
      "Deep cuts on face or near joints"
    ],
    whenToSeekHelp: "Seek medical care for: bleeding that won't stop, deep wounds needing stitches, cuts on face, or wounds with embedded debris."
  },
  "malaria": {
    condition: "Possible Malaria",
    confidence: "high",
    urgency: "urgent",
    description: "Malaria is a serious mosquito-borne disease common in tropical areas. Symptoms include fever, chills, headache, and body aches.",
    firstAid: [
      "Rest and stay hydrated",
      "Take paracetamol for fever",
      "Use mosquito nets to prevent further bites",
      "Note when symptoms started",
      "Monitor temperature regularly"
    ],
    recommendations: [
      "GET TESTED IMMEDIATELY (Rapid Diagnostic Test)",
      "Start antimalarial treatment as soon as diagnosed",
      "Complete full course of medication",
      "Continue monitoring even after improvement",
      "Report to health authorities if required"
    ],
    warningSignsToWatch: [
      "Very high fever",
      "Severe headache",
      "Confusion or drowsiness",
      "Difficulty breathing",
      "Dark or reduced urine",
      "Severe weakness"
    ],
    whenToSeekHelp: "Seek immediate medical care if in a malaria-endemic area and experiencing fever. Early treatment saves lives. This is especially urgent for children and pregnant women."
  },
  "fatigue": {
    condition: "Fatigue / Tiredness",
    confidence: "low",
    urgency: "low",
    description: "Persistent fatigue can indicate various conditions including anemia, thyroid disorders, diabetes, depression, or lifestyle factors.",
    firstAid: [
      "Get adequate sleep (7-9 hours for adults)",
      "Stay hydrated",
      "Eat balanced, nutritious meals",
      "Take short rest breaks during the day",
      "Reduce caffeine, especially after noon"
    ],
    recommendations: [
      "Blood tests to check for anemia, thyroid function",
      "Assess sleep quality and habits",
      "Review medications that may cause fatigue",
      "Consider stress and mental health factors",
      "Regular moderate exercise can help"
    ],
    warningSignsToWatch: [
      "Fatigue lasting more than 2 weeks",
      "Fatigue with unexplained weight loss",
      "Fatigue with fever",
      "Severe weakness or difficulty with daily tasks",
      "Chest pain or shortness of breath",
      "Depressed mood or hopelessness"
    ],
    whenToSeekHelp: "See a doctor if fatigue persists more than 2 weeks, is severe, or accompanied by other symptoms like weight loss, fever, or depression."
  },
  "eye pain": {
    condition: "Eye Pain / Discomfort",
    confidence: "medium",
    urgency: "moderate",
    description: "Eye pain can range from surface irritation to serious conditions requiring urgent care. Protecting vision is the priority.",
    firstAid: [
      "Avoid rubbing the eye",
      "If irritant in eye, rinse with clean water for 15 minutes",
      "Remove contact lenses if wearing",
      "Rest your eyes from screens",
      "Apply clean, cool compress"
    ],
    recommendations: [
      "Artificial tears for dry eye symptoms",
      "Protect eyes from bright light",
      "Avoid makeup and contact lenses until resolved",
      "See an eye doctor if not improving",
      "Note any vision changes"
    ],
    warningSignsToWatch: [
      "Sudden vision loss or changes",
      "Severe pain, especially with nausea",
      "Eye injury or foreign object",
      "Sensitivity to light with pain",
      "Seeing halos around lights",
      "Redness with discharge"
    ],
    whenToSeekHelp: "Seek emergency care for: sudden vision changes, chemical in eye, severe pain with nausea/vomiting (could be glaucoma), or eye injury."
  },
  "pregnancy": {
    condition: "Pregnancy Concern",
    confidence: "medium",
    urgency: "moderate",
    description: "Pregnancy requires regular prenatal care. Some symptoms during pregnancy require immediate medical attention.",
    firstAid: [
      "Rest on your left side if feeling unwell",
      "Stay hydrated",
      "Eat small, frequent meals for nausea",
      "Avoid strenuous activity if experiencing concerning symptoms",
      "Note timing and nature of any symptoms"
    ],
    recommendations: [
      "Regular prenatal checkups are essential",
      "Take prescribed prenatal vitamins",
      "Avoid alcohol, smoking, and certain medications",
      "Monitor baby's movements in later pregnancy",
      "Have a birth plan and know emergency contacts"
    ],
    warningSignsToWatch: [
      "Vaginal bleeding",
      "Severe abdominal pain",
      "Severe headache with vision changes",
      "Sudden swelling of face or hands",
      "Reduced or absent baby movements",
      "Leaking fluid",
      "Contractions before 37 weeks"
    ],
    whenToSeekHelp: "Seek immediate care for: vaginal bleeding, severe pain, reduced baby movements, fluid leaking, or signs of preeclampsia (headache, swelling, vision changes)."
  }
}

// Language translations for UI elements and responses
const translations: Record<string, Record<string, string>> = {
  en: {
    title: "Health Assistant",
    subtitle: "Describe your symptoms for personalized guidance",
    placeholder: "Describe how you are feeling...",
    send: "Send",
    analyzing: "Analyzing...",
    commonSymptoms: "Common Symptoms",
    condition: "Possible Condition",
    confidence: "Confidence",
    urgency: "Urgency Level",
    firstAid: "Immediate First Aid",
    recommendations: "Recommendations",
    warningSignsTitle: "Warning Signs to Watch",
    whenToSeekHelp: "When to Seek Medical Help",
    disclaimer: "Disclaimer: This AI assistant provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.",
    offline: "Offline Mode",
    online: "Online",
    emergency: "Emergency",
    urgent: "Urgent",
    moderate: "Moderate",
    low: "Low Priority",
    high: "High",
    medium: "Medium",
    greeting: "Hello! I'm your AI Health Assistant. I can help you understand symptoms and provide first aid guidance. Please describe what you're experiencing, and I'll provide helpful information. Remember, for emergencies, always call emergency services immediately.",
    noMatch: "I understand you're not feeling well. While I couldn't find a specific match for your symptoms in my database, here's what I recommend: Rest and stay hydrated, monitor your symptoms, and if they persist or worsen, please consult a healthcare provider. Can you describe your symptoms in more detail?",
    fever: "Fever",
    headache: "Headache",
    cough: "Cough",
    stomachPain: "Stomach Pain",
    snakeBite: "Snake Bite",
    animalBite: "Animal Bite",
    difficulty: "Breathing Issues",
    back: "Back"
  },
  es: {
    title: "Asistente de Salud",
    subtitle: "Describe tus síntomas para orientación personalizada",
    placeholder: "Describe cómo te sientes...",
    send: "Enviar",
    analyzing: "Analizando...",
    commonSymptoms: "Síntomas Comunes",
    condition: "Posible Condición",
    confidence: "Confianza",
    urgency: "Nivel de Urgencia",
    firstAid: "Primeros Auxilios Inmediatos",
    recommendations: "Recomendaciones",
    warningSignsTitle: "Señales de Advertencia",
    whenToSeekHelp: "Cuándo Buscar Ayuda Médica",
    disclaimer: "Aviso: Este asistente de IA proporciona solo información general de salud y no sustituye el consejo, diagnóstico o tratamiento médico profesional. Siempre consulte a un proveedor de atención médica calificado.",
    offline: "Modo Sin Conexión",
    online: "En Línea",
    emergency: "Emergencia",
    urgent: "Urgente",
    moderate: "Moderado",
    low: "Baja Prioridad",
    high: "Alta",
    medium: "Media",
    greeting: "¡Hola! Soy tu Asistente de Salud con IA. Puedo ayudarte a entender síntomas y proporcionar orientación de primeros auxilios. Por favor describe lo que estás experimentando. Recuerda, para emergencias, siempre llama a los servicios de emergencia inmediatamente.",
    noMatch: "Entiendo que no te sientes bien. Aunque no pude encontrar una coincidencia específica en mi base de datos, te recomiendo: descansar e hidratarte, monitorear tus síntomas, y si persisten o empeoran, consulta a un médico. ¿Puedes describir tus síntomas con más detalle?",
    fever: "Fiebre",
    headache: "Dolor de Cabeza",
    cough: "Tos",
    stomachPain: "Dolor de Estómago",
    snakeBite: "Mordedura de Serpiente",
    animalBite: "Mordedura de Animal",
    difficulty: "Dificultad Respiratoria",
    back: "Volver"
  },
  fr: {
    title: "Assistant Santé",
    subtitle: "Décrivez vos symptômes pour des conseils personnalisés",
    placeholder: "Décrivez comment vous vous sentez...",
    send: "Envoyer",
    analyzing: "Analyse en cours...",
    commonSymptoms: "Symptômes Courants",
    condition: "Condition Possible",
    confidence: "Confiance",
    urgency: "Niveau d'Urgence",
    firstAid: "Premiers Soins Immédiats",
    recommendations: "Recommandations",
    warningSignsTitle: "Signes d'Alerte à Surveiller",
    whenToSeekHelp: "Quand Consulter un Médecin",
    disclaimer: "Avertissement: Cet assistant IA fournit uniquement des informations de santé générales et ne remplace pas les conseils, diagnostics ou traitements médicaux professionnels. Consultez toujours un professionnel de santé qualifié.",
    offline: "Mode Hors Ligne",
    online: "En Ligne",
    emergency: "Urgence",
    urgent: "Urgent",
    moderate: "Modéré",
    low: "Faible Priorité",
    high: "Élevée",
    medium: "Moyenne",
    greeting: "Bonjour! Je suis votre Assistant Santé IA. Je peux vous aider à comprendre vos symptômes et fournir des conseils de premiers soins. Veuillez décrire ce que vous ressentez. N'oubliez pas, pour les urgences, appelez toujours les services d'urgence immédiatement.",
    noMatch: "Je comprends que vous ne vous sentez pas bien. Bien que je n'aie pas trouvé de correspondance spécifique dans ma base de données, je vous recommande: repos et hydratation, surveiller vos symptômes, et s'ils persistent ou s'aggravent, consultez un médecin. Pouvez-vous décrire vos symptômes plus en détail?",
    fever: "Fièvre",
    headache: "Mal de Tête",
    cough: "Toux",
    stomachPain: "Mal de Ventre",
    snakeBite: "Morsure de Serpent",
    animalBite: "Morsure d'Animal",
    difficulty: "Difficultés Respiratoires",
    back: "Retour"
  },
  pt: {
    title: "Assistente de Saúde",
    subtitle: "Descreva seus sintomas para orientação personalizada",
    placeholder: "Descreva como você está se sentindo...",
    send: "Enviar",
    analyzing: "Analisando...",
    commonSymptoms: "Sintomas Comuns",
    condition: "Possível Condição",
    confidence: "Confiança",
    urgency: "Nível de Urgência",
    firstAid: "Primeiros Socorros Imediatos",
    recommendations: "Recomendações",
    warningSignsTitle: "Sinais de Alerta",
    whenToSeekHelp: "Quando Procurar Ajuda Médica",
    disclaimer: "Aviso: Este assistente de IA fornece apenas informações gerais de saúde e não substitui aconselhamento, diagnóstico ou tratamento médico profissional. Sempre consulte um profissional de saúde qualificado.",
    offline: "Modo Offline",
    online: "Online",
    emergency: "Emergência",
    urgent: "Urgente",
    moderate: "Moderado",
    low: "Baixa Prioridade",
    high: "Alta",
    medium: "Média",
    greeting: "Olá! Sou seu Assistente de Saúde com IA. Posso ajudá-lo a entender sintomas e fornecer orientação de primeiros socorros. Por favor, descreva o que está sentindo. Lembre-se, para emergências, sempre ligue para os serviços de emergência imediatamente.",
    noMatch: "Entendo que você não está se sentindo bem. Embora não tenha encontrado uma correspondência específica no meu banco de dados, recomendo: descansar e se hidratar, monitorar seus sintomas, e se persistirem ou piorarem, consulte um médico. Pode descrever seus sintomas com mais detalhes?",
    fever: "Febre",
    headache: "Dor de Cabeça",
    cough: "Tosse",
    stomachPain: "Dor de Estômago",
    snakeBite: "Mordida de Cobra",
    animalBite: "Mordida de Animal",
    difficulty: "Dificuldade Respiratória",
    back: "Voltar"
  },
  sw: {
    title: "Msaidizi wa Afya",
    subtitle: "Eleza dalili zako kwa mwongozo wa kibinafsi",
    placeholder: "Eleza jinsi unavyojisikia...",
    send: "Tuma",
    analyzing: "Inachambua...",
    commonSymptoms: "Dalili za Kawaida",
    condition: "Hali Inayowezekana",
    confidence: "Uhakika",
    urgency: "Kiwango cha Dharura",
    firstAid: "Msaada wa Kwanza wa Haraka",
    recommendations: "Mapendekezo",
    warningSignsTitle: "Ishara za Onyo za Kuangalia",
    whenToSeekHelp: "Wakati wa Kutafuta Msaada wa Daktari",
    disclaimer: "Onyo: Msaidizi huu wa AI hutoa habari za afya za jumla tu na si mbadala wa ushauri, uchunguzi au matibabu ya kitaalamu. Daima wasiliana na mtoa huduma za afya aliyehitimu.",
    offline: "Hali ya Nje ya Mtandao",
    online: "Mtandaoni",
    emergency: "Dharura",
    urgent: "Ya Haraka",
    moderate: "Ya Wastani",
    low: "Kipaumbele cha Chini",
    high: "Juu",
    medium: "Wastani",
    greeting: "Habari! Mimi ni Msaidizi wako wa Afya wa AI. Ninaweza kukusaidia kuelewa dalili na kutoa mwongozo wa msaada wa kwanza. Tafadhali eleza unachohisi. Kumbuka, kwa dharura, piga simu huduma za dharura mara moja.",
    noMatch: "Naelewa kuwa hujisikii vizuri. Ingawa sikupata dalili zinazofanana katika hifadhidata yangu, napendekeza: pumzika na kunywa maji mengi, fuatilia dalili zako, na zikiendelea au kuwa mbaya zaidi, tafadhali wasiliana na daktari. Je, unaweza kueleza dalili zako kwa undani zaidi?",
    fever: "Homa",
    headache: "Maumivu ya Kichwa",
    cough: "Kikohozi",
    stomachPain: "Maumivu ya Tumbo",
    snakeBite: "Kuumwa na Nyoka",
    animalBite: "Kuumwa na Mnyama",
    difficulty: "Matatizo ya Kupumua",
    back: "Rudi"
  },
  zu: {
    title: "Umsizi Wezempilo",
    subtitle: "Chaza izimpawu zakho ukuze uthole umhlahlandlela",
    placeholder: "Chaza indlela ozizwa ngayo...",
    send: "Thumela",
    analyzing: "Kuyahlaziywa...",
    commonSymptoms: "Izimpawu Ezijwayelekile",
    condition: "Isimo Esingenzeka",
    confidence: "Ukuqiniseka",
    urgency: "Izinga Lokuphuthuma",
    firstAid: "Usizo Lokuqala Olusheshayo",
    recommendations: "Izincomo",
    warningSignsTitle: "Izimpawu Zesixwayiso Okumelwe Uzibheke",
    whenToSeekHelp: "Nini Okufanele Ufune Usizo Lwezokwelapha",
    disclaimer: "Isixwayiso: Lo msizi we-AI uhlinzeka ulwazi lwezempilo oluvamile kuphela futhi akusona isishintshiselwano seseluleko, ukuhlonza noma ukwelashwa kwezokwelapha okukhethekile. Njalo xhumana nomhlinzeki wezempilo oqeqeshiwe.",
    offline: "Imodi Engaxhunyiwe",
    online: "Ku-inthanethi",
    emergency: "Isimo Esiphuthumayo",
    urgent: "Kuphuthuma",
    moderate: "Okuphakathi",
    low: "Okubaluleke Kancane",
    high: "Ephezulu",
    medium: "Maphakathi",
    greeting: "Sawubona! Ngingumsizi wakho Wezempilo we-AI. Ngingakusiza ukuqonda izimpawu futhi ngihlinzeke umhlahlandlela wosizo lokuqala. Sicela uchaze lokho okuzwayo. Khumbula, ngezimo eziphuthumayo, shayela amasevisi aphuthumayo ngokushesha.",
    noMatch: "Ngiyaqonda ukuthi awuzizwa kahle. Nakuba ngingalutholanga uhlobo olufanayo oluqondile kudatabase yami, ngiphakamisa: phumula futhi uphuze amanzi amaningi, qaphela izimpawu zakho, futhi uma ziqhubeka noma ziba zimbi kakhulu, sicela uxhumane nodokotela. Ungachaza izimpawu zakho kabanzi?",
    fever: "Imfiva",
    headache: "Ikhanda Elibuhlungu",
    cough: "Ukukhwehlela",
    stomachPain: "Isisu Esibuhlungu",
    snakeBite: "Ukulunywa Yinyoka",
    animalBite: "Ukulunywa Yisilwane",
    difficulty: "Izinkinga Zokuphefumula",
    back: "Emuva"
  },
  ha: {
    title: "Mai Taimako kan Lafiya",
    subtitle: "Kwatanta alamominka don samun jagora na musamman",
    placeholder: "Kwatanta yadda kake ji...",
    send: "Aika",
    analyzing: "Ana nazari...",
    commonSymptoms: "Alamomi na Yau da Kullum",
    condition: "Yanayin da Zai Iya Kasancewa",
    confidence: "Tabbaci",
    urgency: "Matakin Gaggawa",
    firstAid: "Taimakon Farko na Gaggawa",
    recommendations: "Shawarwari",
    warningSignsTitle: "Alamomin Gargadi da Za a Kula",
    whenToSeekHelp: "Lokacin da Ya Kamata a Nemi Taimakon Likita",
    disclaimer: "Gargadi: Wannan mai taimako na AI yana ba da bayanai na lafiya na gaba ɗaya kawai kuma ba madadin shawarar likita, bincike, ko magani ba ne. Koyaushe tuntuɓi likita mai cancantar.",
    offline: "Yanayin Offline",
    online: "A Kan layi",
    emergency: "Gaggawa",
    urgent: "Mai Gaggawa",
    moderate: "Matsakaici",
    low: "Ƙarancin Fifiko",
    high: "Babba",
    medium: "Matsakaici",
    greeting: "Sannu! Ni ne Mai Taimako na Lafiya na AI. Zan iya taimaka maka ka fahimci alamomi kuma in ba da jagora na taimakon farko. Da fatan za a kwatanta abin da kake ji. Ka tuna, don gaggawa, koyaushe kira sabis na gaggawa nan da nan.",
    noMatch: "Na fahimci cewa ba ka jin daɗi. Ko da yake ban sami alamar da ta dace a cikin bayanan da nake da su ba, ina ba da shawarar: huta kuma sha ruwa mai yawa, kula da alamominka, kuma idan sun ci gaba ko sun yi muni, da fatan za a tuntuɓi likita. Za ka iya kwatanta alamominka dalla-dalla?",
    fever: "Zazzabi",
    headache: "Ciwon Kai",
    cough: "Tari",
    stomachPain: "Ciwon Ciki",
    snakeBite: "Cizon Maciji",
    animalBite: "Cizon Dabba",
    difficulty: "Matsalar Numfashi",
    back: "Komawa"
  },
  ar: {
    title: "مساعد الصحة",
    subtitle: "صف أعراضك للحصول على إرشادات مخصصة",
    placeholder: "صف كيف تشعر...",
    send: "إرسال",
    analyzing: "جاري التحليل...",
    commonSymptoms: "الأعراض الشائعة",
    condition: "الحالة المحتملة",
    confidence: "الثقة",
    urgency: "مستوى الإلحاح",
    firstAid: "الإسعافات الأولية الفورية",
    recommendations: "التوصيات",
    warningSignsTitle: "علامات التحذير التي يجب مراقبتها",
    whenToSeekHelp: "متى تطلب المساعدة الطبية",
    disclaimer: "تنويه: يقدم هذا المساعد الذكي معلومات صحية عامة فقط ولا يعد بديلاً عن الاستشارة الطبية أو التشخيص أو العلاج المهني. استشر دائمًا مقدم رعاية صحية مؤهل.",
    offline: "وضع عدم الاتصال",
    online: "متصل",
    emergency: "طوارئ",
    urgent: "عاجل",
    moderate: "متوسط",
    low: "أولوية منخفضة",
    high: "عالية",
    medium: "متوسطة",
    greeting: "مرحباً! أنا مساعدك الصحي الذكي. يمكنني مساعدتك في فهم الأعراض وتقديم إرشادات الإسعافات الأولية. يرجى وصف ما تشعر به. تذكر، في حالات الطوارئ، اتصل بخدمات الطوارئ فوراً.",
    noMatch: "أفهم أنك لا تشعر بحالة جيدة. على الرغم من أنني لم أجد تطابقًا محددًا في قاعدة البيانات الخاصة بي، أوصي بـ: الراحة وشرب الكثير من السوائل، ومراقبة أعراضك، وإذا استمرت أو ساءت، يرجى استشارة طبيب. هل يمكنك وصف أعراضك بمزيد من التفصيل؟",
    fever: "حمى",
    headache: "صداع",
    cough: "سعال",
    stomachPain: "ألم في المعدة",
    snakeBite: "لدغة ثعبان",
    animalBite: "عضة حيوان",
    difficulty: "صعوبة في التنفس",
    back: "رجوع"
  },
  zh: {
    title: "健康助手",
    subtitle: "描述您的症状以获得个性化指导",
    placeholder: "描述您的感受...",
    send: "发送",
    analyzing: "分析中...",
    commonSymptoms: "常见症状",
    condition: "可能的情况",
    confidence: "置信度",
    urgency: "紧急程度",
    firstAid: "紧急急救",
    recommendations: "建议",
    warningSignsTitle: "需要注意的警告信号",
    whenToSeekHelp: "何时寻求医疗帮助",
    disclaimer: "免责声明：此AI助手仅提供一般健康信息，不能替代专业医疗建议、诊断或治疗。请始终咨询合格的医疗保健提供者。",
    offline: "离线模式",
    online: "在线",
    emergency: "紧急",
    urgent: "急迫",
    moderate: "中等",
    low: "低优先级",
    high: "高",
    medium: "中",
    greeting: "您好！我是您的AI健康助手。我可以帮助您了解症状并提供急救指导。请描述您正在经历的情况。请记住，紧急情况下请立即拨打急救电话。",
    noMatch: "我理解您感觉不舒服。虽然我在数据库中找不到与您症状完全匹配的内容，但我建议：休息并多喝水，监测您的症状，如果持续或恶化，请就医。您能更详细地描述您的症状吗？",
    fever: "发烧",
    headache: "头痛",
    cough: "咳嗽",
    stomachPain: "胃痛",
    snakeBite: "蛇咬伤",
    animalBite: "动物咬伤",
    difficulty: "呼吸困难",
    back: "返回"
  },
  hi: {
    title: "स्वास्थ्य सहायक",
    subtitle: "व्यक्तिगत मार्गदर्शन के लिए अपने लक्षणों का वर्णन करें",
    placeholder: "बताएं कि आप कैसा महसूस कर रहे हैं...",
    send: "भेजें",
    analyzing: "विश्लेषण हो रहा है...",
    commonSymptoms: "सामान्य लक्षण",
    condition: "संभावित स्थिति",
    confidence: "विश्वास",
    urgency: "तात्कालिकता स्तर",
    firstAid: "तत्काल प्राथमिक चिकित्सा",
    recommendations: "सिफारिशें",
    warningSignsTitle: "देखने के लिए चेतावनी संकेत",
    whenToSeekHelp: "चिकित्सा सहायता कब लें",
    disclaimer: "अस्वीकरण: यह AI सहायक केवल सामान्य स्वास्थ्य जानकारी प्रदान करता है और पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं है। हमेशा योग्य स्��ास्थ्य सेवा प्रदाता से परामर्श लें।",
    offline: "ऑफलाइन मोड",
    online: "ऑनलाइन",
    emergency: "आपातकाल",
    urgent: "तत्काल",
    moderate: "मध्यम",
    low: "कम प्राथमिकता",
    high: "उच्च",
    medium: "मध्यम",
    greeting: "नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। मैं आपको लक्षणों को समझने और प्राथमिक चिकित्सा मार्गदर्शन प्रदान करने में मदद कर सकता हूं। कृपया बताएं कि आप क्या अनुभव कर रहे हैं। याद रखें, आपात स्थिति में, हमेशा तुरंत आपातकालीन सेवाओं को कॉल करें।",
    noMatch: "मैं समझता हूं कि आप अच्छा महसूस नहीं कर रहे हैं। हालांकि मुझे अपने डेटाबेस में आपके लक्षणों से मिलता-जुलता कुछ नहीं मिला, मेरी सलाह है: आराम करें और पानी पिएं, अपने लक्षणों पर नज़र रखें, और यदि वे जारी रहते हैं या बिगड़ते हैं, तो कृपया डॉक्टर से मिलें। क्या आप अपने लक्षणों का अधिक विस्तार से वर्णन कर सकते हैं?",
    fever: "बुखार",
    headache: "सिरदर्द",
    cough: "खांसी",
    stomachPain: "पेट दर्द",
    snakeBite: "सांप का काटना",
    animalBite: "जानवर का काटना",
    difficulty: "सांस लेने में कठिनाई",
    back: "वापस"
  },
  // German
  de: {
    title: "Gesundheitsassistent",
    subtitle: "Beschreiben Sie Ihre Symptome für personalisierte Beratung",
    placeholder: "Beschreiben Sie, wie Sie sich fühlen...",
    send: "Senden",
    analyzing: "Analysiere...",
    commonSymptoms: "Häufige Symptome",
    condition: "Mögliche Erkrankung",
    confidence: "Sicherheit",
    urgency: "Dringlichkeitsstufe",
    firstAid: "Sofortige Erste Hilfe",
    recommendations: "Empfehlungen",
    warningSignsTitle: "Warnzeichen",
    whenToSeekHelp: "Wann ärztliche Hilfe suchen",
    disclaimer: "Hinweis: Dieser KI-Assistent bietet nur allgemeine Gesundheitsinformationen und ersetzt keine professionelle medizinische Beratung, Diagnose oder Behandlung.",
    offline: "Offline-Modus",
    online: "Online",
    emergency: "Notfall",
    urgent: "Dringend",
    moderate: "Mäßig",
    low: "Niedrige Priorität",
    high: "Hoch",
    medium: "Mittel",
    greeting: "Hallo! Ich bin Ihr KI-Gesundheitsassistent. Beschreiben Sie Ihre Symptome und ich helfe Ihnen mit Erste-Hilfe-Anleitungen.",
    noMatch: "Ich verstehe, dass Sie sich nicht wohl fühlen. Bitte beschreiben Sie Ihre Symptome genauer.",
    fever: "Fieber",
    headache: "Kopfschmerzen",
    cough: "Husten",
    stomachPain: "Bauchschmerzen",
    snakeBite: "Schlangenbiss",
    animalBite: "Tierbiss",
    difficulty: "Atemnot",
    back: "Zurück"
  },
  // Italian
  it: {
    title: "Assistente Sanitario",
    subtitle: "Descrivi i tuoi sintomi per una guida personalizzata",
    placeholder: "Descrivi come ti senti...",
    send: "Invia",
    analyzing: "Analizzando...",
    commonSymptoms: "Sintomi Comuni",
    condition: "Possibile Condizione",
    confidence: "Affidabilità",
    urgency: "Livello di Urgenza",
    firstAid: "Primo Soccorso Immediato",
    recommendations: "Raccomandazioni",
    warningSignsTitle: "Segnali di Allarme",
    whenToSeekHelp: "Quando Cercare Aiuto Medico",
    disclaimer: "Avviso: Questo assistente AI fornisce solo informazioni sanitarie generali e non sostituisce consulenza medica professionale.",
    offline: "Modalità Offline",
    online: "Online",
    emergency: "Emergenza",
    urgent: "Urgente",
    moderate: "Moderato",
    low: "Bassa Priorità",
    high: "Alta",
    medium: "Media",
    greeting: "Ciao! Sono il tuo Assistente Sanitario AI. Descrivi i tuoi sintomi e ti aiuterò con le istruzioni di primo soccorso.",
    noMatch: "Capisco che non ti senti bene. Per favore descrivi i tuoi sintomi in modo più dettagliato.",
    fever: "Febbre",
    headache: "Mal di Testa",
    cough: "Tosse",
    stomachPain: "Mal di Stomaco",
    snakeBite: "Morso di Serpente",
    animalBite: "Morso di Animale",
    difficulty: "Difficoltà Respiratorie",
    back: "Indietro"
  },
  // Russian
  ru: {
    title: "Медицинский Помощник",
    subtitle: "Опишите ваши симптомы для получения рекомендаций",
    placeholder: "Опишите, как вы себя чувствуете...",
    send: "Отправить",
    analyzing: "Анализирую...",
    commonSymptoms: "Частые Симптомы",
    condition: "Возможное Состояние",
    confidence: "Уверенность",
    urgency: "Уровень Срочности",
    firstAid: "Немедленная Первая Помощь",
    recommendations: "Рекомендации",
    warningSignsTitle: "Тревожные Признаки",
    whenToSeekHelp: "Когда Обращаться к Врачу",
    disclaimer: "Внимание: Этот ИИ-помощник предоставляет только общую медицинскую информацию и не заменяет профессиональную медицинскую консультацию.",
    offline: "Оффлайн Режим",
    online: "Онлайн",
    emergency: "Экстренно",
    urgent: "Срочно",
    moderate: "Умеренно",
    low: "Низкий Приоритет",
    high: "Высокая",
    medium: "Средняя",
    greeting: "Здравствуйте! Я ваш ИИ-помощник по здоровью. Опишите симптомы, и я помогу с рекомендациями по первой помощи.",
    noMatch: "Понимаю, что вы плохо себя чувствуете. Пожалуйста, опишите симптомы подробнее.",
    fever: "Температура",
    headache: "Головная Боль",
    cough: "Кашель",
    stomachPain: "Боль в Животе",
    snakeBite: "Укус Змеи",
    animalBite: "Укус Животного",
    difficulty: "Затруднённое Дыхание",
    back: "Назад"
  },
  // Japanese
  ja: {
    title: "健康アシスタント",
    subtitle: "症状を入力してアドバイスを受けましょう",
    placeholder: "どのような症状ですか...",
    send: "送信",
    analyzing: "分析中...",
    commonSymptoms: "よくある症状",
    condition: "可能性のある状態",
    confidence: "信頼度",
    urgency: "緊急度",
    firstAid: "応急処置",
    recommendations: "推奨事項",
    warningSignsTitle: "警告サイン",
    whenToSeekHelp: "医療機関を受診する目安",
    disclaimer: "注意：このAIアシスタントは一般的な健康情報のみを提供し、専門的な医療アドバイスの代わりにはなりません。",
    offline: "オフラインモード",
    online: "オンライン",
    emergency: "緊急",
    urgent: "急ぎ",
    moderate: "中程度",
    low: "低優先度",
    high: "高",
    medium: "中",
    greeting: "こんにちは！AIヘルスアシスタントです。症状をお聞かせください。応急処置のアドバイスをいたします。",
    noMatch: "体調が悪いのですね。症状をもう少し詳しく教えていただけますか？",
    fever: "発熱",
    headache: "頭痛",
    cough: "咳",
    stomachPain: "腹痛",
    snakeBite: "蛇咬傷",
    animalBite: "動物咬傷",
    difficulty: "呼吸困難",
    back: "戻る"
  },
  // Korean
  ko: {
    title: "건강 도우미",
    subtitle: "증상을 설명하여 맞춤 안내를 받으세요",
    placeholder: "어떻게 느끼시는지 설명해주세요...",
    send: "보내기",
    analyzing: "분석 중...",
    commonSymptoms: "흔한 증상",
    condition: "가능한 상태",
    confidence: "신뢰도",
    urgency: "긴급도",
    firstAid: "즉각적인 응급처치",
    recommendations: "권장사항",
    warningSignsTitle: "경고 징후",
    whenToSeekHelp: "의료 도움이 필요한 경우",
    disclaimer: "주의: 이 AI 도우미는 일반적인 건강 정보만 제공하며 전문적인 의료 조언을 대체하지 않습니다.",
    offline: "오프라인 모드",
    online: "온라인",
    emergency: "응급",
    urgent: "긴급",
    moderate: "보통",
    low: "낮은 우선순위",
    high: "높음",
    medium: "중간",
    greeting: "안녕하세요! AI 건강 도우미입니다. 증상을 말씀해주시면 응급처치 안내를 도와드리겠습니다.",
    noMatch: "몸이 안 좋으시군요. 증상을 좀 더 자세히 설명해주시겠어요?",
    fever: "발열",
    headache: "두통",
    cough: "기침",
    stomachPain: "복통",
    snakeBite: "뱀에 물림",
    animalBite: "동물에 물림",
    difficulty: "호흡 곤란",
    back: "뒤로"
  },
  // Vietnamese
  vi: {
    title: "Trợ Lý Sức Khỏe",
    subtitle: "Mô tả triệu chứng để nhận hướng dẫn",
    placeholder: "Mô tả cảm giác của bạn...",
    send: "Gửi",
    analyzing: "Đang phân tích...",
    commonSymptoms: "Triệu Chứng Thường Gặp",
    condition: "Tình Trạng Có Thể",
    confidence: "Độ Tin Cậy",
    urgency: "Mức Độ Khẩn Cấp",
    firstAid: "Sơ Cứu Ngay",
    recommendations: "Khuyến Nghị",
    warningSignsTitle: "Dấu Hiệu Cảnh Báo",
    whenToSeekHelp: "Khi Nào Cần Đi Khám",
    disclaimer: "Lưu ý: Trợ lý AI này chỉ cung cấp thông tin sức khỏe chung và không thay thế tư vấn y tế chuyên nghiệp.",
    offline: "Chế Độ Ngoại Tuyến",
    online: "Trực Tuyến",
    emergency: "Cấp Cứu",
    urgent: "Khẩn Cấp",
    moderate: "Trung Bình",
    low: "Ưu Tiên Thấp",
    high: "Cao",
    medium: "Trung Bình",
    greeting: "Xin chào! Tôi là Trợ lý Sức khỏe AI. Hãy mô tả triệu chứng và tôi sẽ hướng dẫn sơ cứu cho bạn.",
    noMatch: "Tôi hiểu bạn không khỏe. Vui lòng mô tả triệu chứng chi tiết hơn.",
    fever: "Sốt",
    headache: "Đau Đầu",
    cough: "Ho",
    stomachPain: "Đau Bụng",
    snakeBite: "Rắn Cắn",
    animalBite: "Động Vật Cắn",
    difficulty: "Khó Thở",
    back: "Quay Lại"
  },
  // Thai
  th: {
    title: "ผู้ช่วยด้านสุขภาพ",
    subtitle: "อธิบายอาการของคุณเพื่อรับคำแนะนำ",
    placeholder: "อธิบายความรู้สึกของคุณ...",
    send: "ส่ง",
    analyzing: "กำลังวิเคราะห์...",
    commonSymptoms: "อาการที่พบบ่อย",
    condition: "ภาวะที่เป็นไปได้",
    confidence: "ความมั่นใจ",
    urgency: "ระดับความเร่งด่วน",
    firstAid: "การปฐมพยาบาลเบื้องต้น",
    recommendations: "คำแนะนำ",
    warningSignsTitle: "สัญญาณเตือน",
    whenToSeekHelp: "เมื่อไหร่ควรพบแพทย์",
    disclaimer: "หมายเหตุ: ผู้ช่วย AI นี้ให้ข้อมูลสุขภาพทั่วไปเท่านั้น ไม่ใช่การแทนที่คำแนะนำทางการแพทย์",
    offline: "โหมดออฟไลน์",
    online: "ออนไลน์",
    emergency: "ฉุกเฉิน",
    urgent: "เร่งด่วน",
    moderate: "ปานกลาง",
    low: "ความสำคัญต่ำ",
    high: "สูง",
    medium: "กลาง",
    greeting: "สวัสดี! ฉันคือผู้ช่วยสุขภาพ AI อธิบายอาการของคุณแล้วฉันจะช่วยแนะนำการปฐมพยาบาล",
    noMatch: "ฉันเข้าใจว่าคุณไม่สบาย กรุณาอธิบายอาการให้ละเอียดขึ้น",
    fever: "ไข้",
    headache: "ปวดหัว",
    cough: "ไอ",
    stomachPain: "ปวดท้อง",
    snakeBite: "งูกัด",
    animalBite: "สัตว์กัด",
    difficulty: "หายใจลำบาก",
    back: "กลับ"
  },
  // Indonesian
  id: {
    title: "Asisten Kesehatan",
    subtitle: "Jelaskan gejala Anda untuk panduan personal",
    placeholder: "Jelaskan perasaan Anda...",
    send: "Kirim",
    analyzing: "Menganalisis...",
    commonSymptoms: "Gejala Umum",
    condition: "Kemungkinan Kondisi",
    confidence: "Keyakinan",
    urgency: "Tingkat Urgensi",
    firstAid: "Pertolongan Pertama",
    recommendations: "Rekomendasi",
    warningSignsTitle: "Tanda Peringatan",
    whenToSeekHelp: "Kapan Harus ke Dokter",
    disclaimer: "Perhatian: Asisten AI ini hanya memberikan informasi kesehatan umum dan bukan pengganti saran medis profesional.",
    offline: "Mode Offline",
    online: "Online",
    emergency: "Darurat",
    urgent: "Mendesak",
    moderate: "Sedang",
    low: "Prioritas Rendah",
    high: "Tinggi",
    medium: "Sedang",
    greeting: "Halo! Saya Asisten Kesehatan AI. Jelaskan gejala Anda dan saya akan membantu dengan panduan pertolongan pertama.",
    noMatch: "Saya mengerti Anda tidak enak badan. Mohon jelaskan gejala Anda lebih detail.",
    fever: "Demam",
    headache: "Sakit Kepala",
    cough: "Batuk",
    stomachPain: "Sakit Perut",
    snakeBite: "Gigitan Ular",
    animalBite: "Gigitan Hewan",
    difficulty: "Sesak Napas",
    back: "Kembali"
  },
  // Turkish
  tr: {
    title: "Sağlık Asistanı",
    subtitle: "Kişisel rehberlik için belirtilerinizi açıklayın",
    placeholder: "Nasıl hissettiğinizi açıklayın...",
    send: "Gönder",
    analyzing: "Analiz ediliyor...",
    commonSymptoms: "Yaygın Belirtiler",
    condition: "Olası Durum",
    confidence: "Güvenilirlik",
    urgency: "Aciliyet Düzeyi",
    firstAid: "Acil İlk Yardım",
    recommendations: "Öneriler",
    warningSignsTitle: "Uyarı İşaretleri",
    whenToSeekHelp: "Ne Zaman Doktora Gitmeli",
    disclaimer: "Uyarı: Bu AI asistanı yalnızca genel sağlık bilgileri sunar ve profesyonel tıbbi tavsiyenin yerini almaz.",
    offline: "Çevrimdışı Mod",
    online: "Çevrimiçi",
    emergency: "Acil",
    urgent: "Acil",
    moderate: "Orta",
    low: "Düşük Öncelik",
    high: "Yüksek",
    medium: "Orta",
    greeting: "Merhaba! Ben AI Sağlık Asistanınızım. Belirtilerinizi anlatın, ilk yardım rehberliği konusunda size yardımcı olayım.",
    noMatch: "İyi hissetmediğinizi anlıyorum. Lütfen belirtilerinizi daha ayrıntılı açıklayın.",
    fever: "Ateş",
    headache: "Baş Ağrısı",
    cough: "Öksürük",
    stomachPain: "Karın Ağrısı",
    snakeBite: "Yılan Isırığı",
    animalBite: "Hayvan Isırığı",
    difficulty: "Nefes Darlığı",
    back: "Geri"
  },
  // Amharic (Ethiopian)
  am: {
    title: "የጤና ረዳት",
    subtitle: "ምልክቶችዎን ይግለጹ",
    placeholder: "እንዴት እንደሚሰማዎት ይግለጹ...",
    send: "ላክ",
    analyzing: "በመተንተን ላይ...",
    commonSymptoms: "የተለመዱ ምልክቶች",
    condition: "ሊሆን የሚችል ሁኔታ",
    confidence: "እምነት",
    urgency: "የአስቸኳይ ደረጃ",
    firstAid: "የመጀመሪያ እርዳታ",
    recommendations: "ምክሮች",
    warningSignsTitle: "የማስጠንቀቂያ ምልክቶች",
    whenToSeekHelp: "መቼ ሐኪም ማማከር",
    disclaimer: "ማስጠንቀቂያ: ይህ AI ረዳት አጠቃላይ የጤና መረጃ ብቻ ይሰጣል።",
    offline: "ከመስመር ውጭ",
    online: "በመስመር ላይ",
    emergency: "አደጋ",
    urgent: "አስቸኳይ",
    moderate: "መካከለኛ",
    low: "ዝቅተኛ ቅድሚያ",
    high: "ከፍተኛ",
    medium: "መካከለኛ",
    greeting: "ሰላም! የ AI ጤና ረዳትዎ ነኝ። ምልክቶችዎን ይንገሩኝ።",
    noMatch: "ጥሩ እንዳልሆኑ ገባኝ። እባክዎ ምልክቶችዎን በዝርዝር ያብራሩ።",
    fever: "ትኩሳት",
    headache: "ራስ ምታት",
    cough: "ሳል",
    stomachPain: "የሆድ ህመም",
    snakeBite: "የእባብ ንክሻ",
    animalBite: "የእንስሳ ንክሻ",
    difficulty: "የመተንፈስ ችግር",
    back: "ተመለስ"
  },
  // Bengali
  bn: {
    title: "স্বাস্থ্য সহকারী",
    subtitle: "ব্যক্তিগত নির্দেশনার জন্য আপনার লক্ষণগুলি বর্ণনা করুন",
    placeholder: "আপনি কেমন অনুভব করছেন বর্ণনা করুন...",
    send: "পাঠান",
    analyzing: "বিশ্লেষণ করা হচ্ছে...",
    commonSymptoms: "সাধারণ লক্ষণ",
    condition: "সম্ভাব্য অবস্থা",
    confidence: "আস্থা",
    urgency: "জরুরি স্তর",
    firstAid: "তাৎক্ষণিক প্রাথমিক চিকিৎসা",
    recommendations: "সুপারিশ",
    warningSignsTitle: "সতর্কতা চিহ্ন",
    whenToSeekHelp: "কখন ডাক্তার দেখাবেন",
    disclaimer: "সতর্কতা: এই AI সহকারী শুধুমাত্র সাধারণ স্বাস্থ্য তথ্য প্রদান করে।",
    offline: "অফলাইন মোড",
    online: "অনলাইন",
    emergency: "জরুরি",
    urgent: "জরুরি",
    moderate: "মাঝারি",
    low: "কম অগ্রাধিকার",
    high: "উচ্চ",
    medium: "মাঝারি",
    greeting: "হ্যালো! আমি আপনার AI স্বাস্থ্য সহকারী। আপনার লক্ষণগুলি বর্ণনা করুন।",
    noMatch: "বুঝতে পারছি আপনি ভালো নেই। অনুগ্রহ করে আপনার লক্ষণগুলি বিস্তারিত বর্ণনা করুন।",
    fever: "জ্বর",
    headache: "মাথাব্যথা",
    cough: "কাশি",
    stomachPain: "পেটব্যথা",
    snakeBite: "সাপের কামড়",
    animalBite: "পশুর কামড়",
    difficulty: "শ্বাসকষ্ট",
    back: "পেছনে"
  },
  // Filipino/Tagalog
  tl: {
    title: "Katulong sa Kalusugan",
    subtitle: "Ilarawan ang iyong mga sintomas para sa gabay",
    placeholder: "Ilarawan kung ano ang nararamdaman mo...",
    send: "Ipadala",
    analyzing: "Sinusuri...",
    commonSymptoms: "Karaniwang Sintomas",
    condition: "Posibleng Kondisyon",
    confidence: "Tiwala",
    urgency: "Antas ng Pagkadali",
    firstAid: "Agarang First Aid",
    recommendations: "Mga Rekomendasyon",
    warningSignsTitle: "Mga Babalang Senyales",
    whenToSeekHelp: "Kailan Dapat Magpatingin",
    disclaimer: "Babala: Ang AI assistant na ito ay nagbibigay lamang ng pangkalahatang impormasyon sa kalusugan.",
    offline: "Offline Mode",
    online: "Online",
    emergency: "Emergency",
    urgent: "Madali",
    moderate: "Katamtaman",
    low: "Mababang Priyoridad",
    high: "Mataas",
    medium: "Katamtaman",
    greeting: "Kamusta! Ako ang iyong AI Health Assistant. Ilarawan ang iyong mga sintomas.",
    noMatch: "Naiintindihan kong hindi ka maganda ang pakiramdam. Pakipaliwanag pa ang iyong mga sintomas.",
    fever: "Lagnat",
    headache: "Sakit ng Ulo",
    cough: "Ubo",
    stomachPain: "Sakit ng Tiyan",
    snakeBite: "Kagat ng Ahas",
    animalBite: "Kagat ng Hayop",
    difficulty: "Hirap sa Paghinga",
    back: "Bumalik"
  },
  // Yoruba (Nigeria)
  yo: {
    title: "Oluranlọwọ Ilera",
    subtitle: "Ṣe apejuwe awọn ami aisan rẹ",
    placeholder: "Ṣe apejuwe bi o ṣe rilara...",
    send: "Firanṣẹ",
    analyzing: "N ṣe atupale...",
    commonSymptoms: "Awọn Ami Aisan Wọpọ",
    condition: "Ipo ti o ṣeeṣe",
    confidence: "Igbẹkẹle",
    urgency: "Ipele Pajawiri",
    firstAid: "Iranlọwọ Akọkọ",
    recommendations: "Awọn Iṣeduro",
    warningSignsTitle: "Awọn Ami Ikilọ",
    whenToSeekHelp: "Nigbawo ni O Yẹ Ki O Ri Dokita",
    disclaimer: "Ikilọ: Oluranlọwọ AI yii n pese alaye ilera gbogbogbo nikan.",
    offline: "Aisinipo",
    online: "Lori Ayelujara",
    emergency: "Pajawiri",
    urgent: "Kiakia",
    moderate: "Iwọntunwọnsi",
    low: "Pataki Kekere",
    high: "Giga",
    medium: "Aarin",
    greeting: "Bawo! Mo jẹ Oluranlọwọ Ilera AI rẹ. Ṣe apejuwe awọn ami aisan rẹ.",
    noMatch: "Mo ye pe o ko dara. Jọwọ ṣe alaye awọn ami aisan rẹ diẹ sii.",
    fever: "Iba",
    headache: "Orififo",
    cough: "Ikọ",
    stomachPain: "Irora Inu",
    snakeBite: "Ejo bu",
    animalBite: "Eranko bu",
    difficulty: "Wahala Mimi",
    back: "Pada"
  },
  // Somali
  so: {
    title: "Caawiye Caafimaad",
    subtitle: "Sharax calaamaadahaaga",
    placeholder: "Sharax sida aad dareemeyso...",
    send: "Dir",
    analyzing: "Waa la falanqeynayaa...",
    commonSymptoms: "Calaamaadaha Caadiga",
    condition: "Xaaladda Suurtogalka",
    confidence: "Kalsooni",
    urgency: "Heerka Degdega",
    firstAid: "Gargaarka Degdega",
    recommendations: "Talooyinka",
    warningSignsTitle: "Calaamaadaha Digniin",
    whenToSeekHelp: "Goorma La Arko Dhakhtar",
    disclaimer: "Digniin: Caawiyaha AI-ga ah wuxuu bixiyaa macluumaad caafimaad guud oo keliya.",
    offline: "Offline",
    online: "Online",
    emergency: "Degdeg",
    urgent: "Degdeg",
    moderate: "Dhexdhexaad",
    low: "Mudnaanta Hoose",
    high: "Sare",
    medium: "Dhexe",
    greeting: "Salaan! Waxaan ahay Caawiyahaaga Caafimaadka AI. Sharax calaamaadahaaga.",
    noMatch: "Waan fahamsanahay inaadan fiicneyn. Fadlan sharax calaamaadahaaga si faahfaahsan.",
    fever: "Qandho",
    headache: "Madax Xanuun",
    cough: "Qufac",
    stomachPain: "Calool Xanuun",
    snakeBite: "Mas Qaniinay",
    animalBite: "Xayawaan Qaniinay",
    difficulty: "Neefsashada Adkaan",
    back: "Dib u noqo"
  }
}

const languages = [
  // Major World Languages
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", region: "Europe" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", region: "Europe" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", region: "Europe" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", region: "Europe" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", region: "Europe" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", region: "Europe" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", region: "Europe" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", region: "Europe" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", region: "Europe" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦", region: "Europe" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷", region: "Europe" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴", region: "Europe" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺", region: "Europe" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿", region: "Europe" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", region: "Europe" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴", region: "Europe" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰", region: "Europe" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮", region: "Europe" },
  
  // Asian Languages
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", region: "Asia" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", region: "Asia" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩", region: "Asia" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", region: "Asia" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", region: "Asia" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", region: "Asia" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭", region: "Asia" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", region: "Asia" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾", region: "Asia" },
  { code: "tl", name: "Filipino", nativeName: "Tagalog", flag: "🇵🇭", region: "Asia" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", region: "Asia" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", region: "Asia" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", region: "Asia" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", region: "Asia" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", region: "Asia" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰", region: "Asia" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", flag: "🇳🇵", region: "Asia" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල", flag: "🇱🇰", region: "Asia" },
  { code: "my", name: "Burmese", nativeName: "မြန်မာဘာသာ", flag: "🇲🇲", region: "Asia" },
  { code: "km", name: "Khmer", nativeName: "ខ្មែរ", flag: "🇰🇭", region: "Asia" },
  
  // Middle Eastern Languages
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", region: "Middle East" },
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷", region: "Middle East" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", region: "Middle East" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", region: "Middle East" },
  { code: "ku", name: "Kurdish", nativeName: "Kurdî", flag: "🇮🇶", region: "Middle East" },
  { code: "ps", name: "Pashto", nativeName: "پښتو", flag: "🇦🇫", region: "Middle East" },
  
  // African Languages
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇹🇿", region: "Africa" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦", region: "Africa" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬", region: "Africa" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹", region: "Africa" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬", region: "Africa" },
  { code: "ig", name: "Igbo", nativeName: "Igbo", flag: "🇳🇬", region: "Africa" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa", flag: "🇿🇦", region: "Africa" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦", region: "Africa" },
  { code: "so", name: "Somali", nativeName: "Soomaali", flag: "🇸🇴", region: "Africa" },
  { code: "rw", name: "Kinyarwanda", nativeName: "Ikinyarwanda", flag: "🇷🇼", region: "Africa" },
  { code: "lg", name: "Luganda", nativeName: "Luganda", flag: "🇺🇬", region: "Africa" },
  { code: "ny", name: "Chichewa", nativeName: "Chicheŵa", flag: "🇲🇼", region: "Africa" },
  { code: "sn", name: "Shona", nativeName: "ChiShona", flag: "🇿🇼", region: "Africa" },
  { code: "tn", name: "Tswana", nativeName: "Setswana", flag: "🇧🇼", region: "Africa" },
  { code: "st", name: "Sesotho", nativeName: "Sesotho", flag: "🇱🇸", region: "Africa" },
  
  // Americas Languages
  { code: "pt-BR", name: "Portuguese (Brazil)", nativeName: "Português (Brasil)", flag: "🇧🇷", region: "Americas" },
  { code: "es-MX", name: "Spanish (Mexico)", nativeName: "Español (México)", flag: "🇲🇽", region: "Americas" },
  { code: "ht", name: "Haitian Creole", nativeName: "Kreyòl Ayisyen", flag: "🇭🇹", region: "Americas" },
  { code: "qu", name: "Quechua", nativeName: "Runasimi", flag: "🇵🇪", region: "Americas" },
  { code: "gn", name: "Guarani", nativeName: "Avañe'ẽ", flag: "🇵🇾", region: "Americas" },
]

// Cache name for offline functionality
const CACHE_NAME = "health-assistant-v1"

// Language Selector Component with Search
function LanguageSelector({ 
  language, 
  setLanguage 
}: { 
  language: string
  setLanguage: (lang: string) => void 
}) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  
  const currentLanguage = languages.find(l => l.code === language) || languages[0]
  
  // Filter languages based on search query
  const filteredLanguages = languages.filter(lang => {
    const query = searchQuery.toLowerCase()
    return (
      lang.name.toLowerCase().includes(query) ||
      lang.nativeName.toLowerCase().includes(query) ||
      lang.region.toLowerCase().includes(query) ||
      lang.code.toLowerCase().includes(query)
    )
  })
  
  // Group languages by region
  const groupedLanguages = filteredLanguages.reduce((acc, lang) => {
    if (!acc[lang.region]) {
      acc[lang.region] = []
    }
    acc[lang.region].push(lang)
    return acc
  }, {} as Record<string, typeof languages>)
  
  // Focus input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])
  
  const handleSelect = (code: string) => {
    setLanguage(code)
    setOpen(false)
    setSearchQuery("")
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 bg-primary-foreground/20 border border-primary-foreground/30 text-primary-foreground text-xs hover:bg-primary-foreground/30"
        >
          <Globe className="h-3 w-3 mr-1.5" />
          <span className="mr-1">{currentLanguage.flag}</span>
          <span className="hidden sm:inline max-w-[80px] truncate">{currentLanguage.nativeName}</span>
          <ChevronDown className="h-3 w-3 ml-1 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-0" 
        align="end"
        sideOffset={8}
      >
        {/* Search Header */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-8 h-9 text-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {filteredLanguages.length} language{filteredLanguages.length !== 1 ? 's' : ''} available
          </p>
        </div>
        
        {/* Languages List */}
        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {Object.entries(groupedLanguages).map(([region, langs]) => (
              <div key={region} className="mb-3">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1 sticky top-0 bg-popover">
                  {region}
                </p>
                <div className="space-y-0.5">
                  {langs.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-colors hover:bg-accent ${
                        language === lang.code ? 'bg-accent' : ''
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{lang.nativeName}</p>
                        <p className="text-xs text-muted-foreground">{lang.name}</p>
                      </div>
                      {language === lang.code && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {filteredLanguages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No languages found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

export function PatientAIAssistant({ setScreen }: PatientAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [language, setLanguage] = useState("en")
  const [isOnline, setIsOnline] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const t = translations[language] || translations.en

  // Check online status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    
    setIsOnline(navigator.onLine)
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)
    
    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  // Register service worker for offline support
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Service worker registration failed - offline mode may be limited
      })
    }
  }, [])

  // Load cached messages
  useEffect(() => {
    const cached = localStorage.getItem("health_assistant_messages")
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        setMessages(parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })))
      } catch {
        // Invalid cached data
      }
    }
    
    // Load saved language preference
    const savedLang = localStorage.getItem("health_assistant_language")
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang)
    }
  }, [])

  // Save messages to cache
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("health_assistant_messages", JSON.stringify(messages))
    }
  }, [messages])

  // Save language preference
  useEffect(() => {
    localStorage.setItem("health_assistant_language", language)
  }, [language])

  // Add greeting message on first load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: t.greeting,
          timestamp: new Date(),
        },
      ])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update greeting when language changes
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "greeting") {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: t.greeting,
          timestamp: new Date(),
        },
      ])
    }
  }, [language, t.greeting]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const analyzeSymptoms = useCallback((input: string): AnalysisResult | null => {
    const lowerInput = input.toLowerCase()
    
    // Search through symptom database
    for (const [key, result] of Object.entries(symptomDatabase)) {
      const keywords = key.split(" ")
      if (keywords.every(keyword => lowerInput.includes(keyword))) {
        return result
      }
    }
    
    // Check for partial matches
    for (const [key, result] of Object.entries(symptomDatabase)) {
      if (lowerInput.includes(key) || key.split(" ").some(k => lowerInput.includes(k))) {
        return result
      }
    }
    
    // Additional keyword matching
    const keywordMap: Record<string, string> = {
      "bitten": "dog bite",
      "animal": "dog bite",
      "dog": "dog bite",
      "cat": "cat bite",
      "snake": "snake bite",
      "viper": "snake bite",
      "cobra": "snake bite",
      "spider": "spider bite",
      "bee": "bee sting",
      "wasp": "bee sting",
      "scorpion": "scorpion sting",
      "rat": "rat bite",
      "mouse": "rat bite",
      "rodent": "rat bite",
      "monkey": "monkey bite",
      "hot": "fever",
      "temperature": "fever",
      "head": "headache",
      "migraine": "headache",
      "chest": "chest pain",
      "heart": "chest pain",
      "breathe": "difficulty breathing",
      "breathing": "difficulty breathing",
      "asthma": "difficulty breathing",
      "stomach": "stomach pain",
      "belly": "stomach pain",
      "abdominal": "stomach pain",
      "loose motion": "diarrhea",
      "running stomach": "diarrhea",
      "vomit": "vomiting",
      "throwing up": "vomiting",
      "nausea": "vomiting",
      "coughing": "cough",
      "cold": "cough",
      "flu": "fever",
      "skin": "rash",
      "itchy": "rash",
      "itching": "rash",
      "burnt": "burn",
      "fire": "burn",
      "wound": "cut",
      "bleeding": "cut",
      "injured": "cut",
      "mosquito": "malaria",
      "tired": "fatigue",
      "weak": "fatigue",
      "exhausted": "fatigue",
      "eye": "eye pain",
      "vision": "eye pain",
      "pregnant": "pregnancy",
      "baby": "pregnancy",
    }
    
    for (const [keyword, symptomKey] of Object.entries(keywordMap)) {
      if (lowerInput.includes(keyword) && symptomDatabase[symptomKey]) {
        return symptomDatabase[symptomKey]
      }
    }
    
    return null
  }, [])

  const formatAnalysisAsMessage = useCallback((analysis: AnalysisResult): string => {
    const urgencyLabels: Record<string, string> = {
      emergency: t.emergency,
      urgent: t.urgent,
      moderate: t.moderate,
      low: t.low,
    }
    
    const confidenceLabels: Record<string, string> = {
      high: t.high,
      medium: t.medium,
      low: t.low,
    }
    
    let message = `**${t.condition}:** ${analysis.condition}\n`
    message += `**${t.urgency}:** ${urgencyLabels[analysis.urgency] || analysis.urgency}\n`
    message += `**${t.confidence}:** ${confidenceLabels[analysis.confidence] || analysis.confidence}\n\n`
    message += `${analysis.description}\n\n`
    
    if (analysis.firstAid && analysis.firstAid.length > 0) {
      message += `**${t.firstAid}:**\n`
      analysis.firstAid.forEach((step, index) => {
        message += `${index + 1}. ${step}\n`
      })
      message += "\n"
    }
    
    message += `**${t.recommendations}:**\n`
    analysis.recommendations.forEach((rec, index) => {
      message += `${index + 1}. ${rec}\n`
    })
    
    if (analysis.warningSignsToWatch && analysis.warningSignsToWatch.length > 0) {
      message += `\n**${t.warningSignsTitle}:**\n`
      analysis.warningSignsToWatch.forEach(sign => {
        message += `• ${sign}\n`
      })
    }
    
    if (analysis.whenToSeekHelp) {
      message += `\n**${t.whenToSeekHelp}:**\n${analysis.whenToSeekHelp}`
    }
    
    return message
  }, [t])

  const handleSend = useCallback(() => {
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsAnalyzing(true)
    
    // Simulate analysis delay for better UX
    setTimeout(() => {
      const analysis = analyzeSymptoms(input)
      
      let responseContent: string
      if (analysis) {
        responseContent = formatAnalysisAsMessage(analysis)
      } else {
        responseContent = t.noMatch
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsAnalyzing(false)
    }, 1000)
  }, [input, analyzeSymptoms, formatAnalysisAsMessage, t.noMatch])

  const handleQuickSymptom = useCallback((symptom: string) => {
    setInput(symptom)
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: symptom,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const analysis = analyzeSymptoms(symptom)
      
      let responseContent: string
      if (analysis) {
        responseContent = formatAnalysisAsMessage(analysis)
      } else {
        responseContent = t.noMatch
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsAnalyzing(false)
      setInput("")
    }, 1000)
  }, [analyzeSymptoms, formatAnalysisAsMessage, t.noMatch])

  const quickSymptoms = [
    { icon: Thermometer, label: t.fever, symptom: "fever" },
    { icon: Brain, label: t.headache, symptom: "headache" },
    { icon: Activity, label: t.cough, symptom: "cough" },
    { icon: Stethoscope, label: t.stomachPain, symptom: "stomach pain" },
    { icon: Zap, label: t.snakeBite, symptom: "snake bite" },
    { icon: Bug, label: t.animalBite, symptom: "dog bite" },
    { icon: HeartPulse, label: t.difficulty, symptom: "difficulty breathing" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="relative h-36 overflow-hidden shrink-0">
        <Image
          src="/images/ai-health.jpg"
          alt="AI Health Assistant"
          fill
          className="object-cover brightness-110 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/80 to-primary/90" />
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setScreen("dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </Button>
            
            <div className="flex items-center gap-2">
              {/* Online/Offline indicator */}
              <Badge 
                variant="outline" 
                className={`text-xs ${isOnline ? 'bg-accent/20 text-accent border-accent/30' : 'bg-amber-500/20 text-amber-200 border-amber-500/30'}`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="h-3 w-3 mr-1" />
                    {t.online}
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 mr-1" />
                    {t.offline}
                  </>
                )}
              </Badge>
              
              {/* Language selector with search */}
              <LanguageSelector 
                language={language} 
                setLanguage={setLanguage} 
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
              <span className="text-primary-foreground/80 text-xs">AI-Powered</span>
            </div>
            <h1 className="text-xl font-bold text-primary-foreground flex items-center gap-2 drop-shadow-lg">
              <Brain className="h-6 w-6" />
              {t.title}
            </h1>
            <p className="text-primary-foreground/70 text-xs mt-0.5">{t.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Quick Symptoms */}
      <div className="px-4 py-3 bg-card border-b shrink-0">
        <p className="text-xs text-muted-foreground mb-2">{t.commonSymptoms}</p>
        <div className="flex flex-wrap gap-2">
          {quickSymptoms.map((item) => (
            <Button
              key={item.label}
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() => handleQuickSymptom(item.symptom)}
              disabled={isAnalyzing}
            >
              <item.icon className="h-3 w-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
        <div className="py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-2 max-w-[85%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent/20 text-accent"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-card-foreground"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content.split("\n").map((line, i) => {
                      // Handle bold text
                      if (line.startsWith("**") && line.includes(":**")) {
                        const parts = line.split(":**")
                        const label = parts[0].replace(/\*\*/g, "")
                        const value = parts[1] || ""
                        
                        // Check for urgency levels
                        if (label.toLowerCase().includes("urgency") || label.toLowerCase().includes("urgencia") || label.toLowerCase().includes("dharura")) {
                          const isEmergency = value.toLowerCase().includes("emergency") || value.toLowerCase().includes("emergencia") || value.toLowerCase().includes("dharura")
                          const isUrgent = value.toLowerCase().includes("urgent") || value.toLowerCase().includes("urgente") || value.toLowerCase().includes("haraka")
                          
                          return (
                            <p key={i} className="mb-1">
                              <strong>{label}:</strong>{" "}
                              <span className={
                                isEmergency ? "text-red-500 font-semibold" :
                                isUrgent ? "text-amber-500 font-semibold" : ""
                              }>
                                {isEmergency && <Siren className="inline h-4 w-4 mr-1" />}
                                {value}
                              </span>
                            </p>
                          )
                        }
                        
                        return (
                          <p key={i} className="mb-1">
                            <strong>{label}:</strong>{value}
                          </p>
                        )
                      }
                      
                      // Handle section headers
                      if (line.startsWith("**") && line.endsWith(":**")) {
                        return (
                          <p key={i} className="font-semibold mt-3 mb-1">
                            {line.replace(/\*\*/g, "")}
                          </p>
                        )
                      }
                      
                      // Handle bullet points
                      if (line.startsWith("•")) {
                        return (
                          <p key={i} className="ml-2 mb-0.5">
                            {line}
                          </p>
                        )
                      }
                      
                      // Handle numbered lists
                      if (/^\d+\./.test(line)) {
                        return (
                          <p key={i} className="ml-2 mb-0.5">
                            {line}
                          </p>
                        )
                      }
                      
                      return line ? <p key={i} className="mb-1">{line}</p> : <br key={i} />
                    })}
                  </div>
                  <p className={`text-[10px] mt-2 ${
                    message.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}>
                    <Clock className="inline h-3 w-3 mr-1" />
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-accent/20 text-accent">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-secondary">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-4 w-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                    {t.analyzing}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-card border-t shrink-0">
        <div className="flex gap-2">
          <Input
            placeholder={t.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="h-11"
            disabled={isAnalyzing}
          />
          <Button
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={handleSend}
            disabled={isAnalyzing || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Disclaimer */}
        <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-[10px] text-amber-700 flex items-start gap-1.5">
            <Shield className="h-3 w-3 shrink-0 mt-0.5" />
            <span>{t.disclaimer}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
