"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Globe,
  Bug,
  Frown,
  Wind,
  Eye,
  Bone,
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
  urgency?: "emergency" | "urgent" | "routine"
}

type Language = "en" | "es" | "fr" | "pt" | "sw" | "ha" | "yo" | "ig" | "ar" | "zh"

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Espanol" },
  { code: "fr", name: "French", nativeName: "Francais" },
  { code: "pt", name: "Portuguese", nativeName: "Portugues" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "ha", name: "Hausa", nativeName: "Hausa" },
  { code: "yo", name: "Yoruba", nativeName: "Yoruba" },
  { code: "ig", name: "Igbo", nativeName: "Igbo" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
]

// Translations for UI elements
const translations: Record<Language, {
  welcome: string
  selectLanguage: string
  startAssistant: string
  enterSymptoms: string
  analyzing: string
  analyze: string
  analysisResult: string
  confidence: string
  recommendations: string
  disclaimer: string
  back: string
  aiPowered: string
  healthAssistant: string
  commonSymptoms: string
  urgencyEmergency: string
  urgencyUrgent: string
  urgencyRoutine: string
}> = {
  en: {
    welcome: "Welcome to AI Health Assistant",
    selectLanguage: "Select your preferred language",
    startAssistant: "Start AI Assistant",
    enterSymptoms: "Describe your symptoms...",
    analyzing: "Analyzing",
    analyze: "Analyze",
    analysisResult: "Analysis Result",
    confidence: "Confidence",
    recommendations: "Recommendations",
    disclaimer: "This AI analysis is for informational purposes only and should not replace professional medical diagnosis. Always consult with a qualified healthcare provider.",
    back: "Back",
    aiPowered: "AI-Powered",
    healthAssistant: "Health Assistant",
    commonSymptoms: "Common Symptoms",
    urgencyEmergency: "Seek Emergency Care Immediately",
    urgencyUrgent: "See a Doctor Within 24 Hours",
    urgencyRoutine: "Schedule a Routine Appointment",
  },
  es: {
    welcome: "Bienvenido al Asistente de Salud IA",
    selectLanguage: "Seleccione su idioma preferido",
    startAssistant: "Iniciar Asistente IA",
    enterSymptoms: "Describa sus sintomas...",
    analyzing: "Analizando",
    analyze: "Analizar",
    analysisResult: "Resultado del Analisis",
    confidence: "Confianza",
    recommendations: "Recomendaciones",
    disclaimer: "Este analisis de IA es solo para fines informativos y no debe reemplazar el diagnostico medico profesional. Siempre consulte con un proveedor de atencion medica calificado.",
    back: "Volver",
    aiPowered: "Impulsado por IA",
    healthAssistant: "Asistente de Salud",
    commonSymptoms: "Sintomas Comunes",
    urgencyEmergency: "Busque Atencion de Emergencia Inmediatamente",
    urgencyUrgent: "Consulte a un Medico en 24 Horas",
    urgencyRoutine: "Programe una Cita de Rutina",
  },
  fr: {
    welcome: "Bienvenue sur l'Assistant Sante IA",
    selectLanguage: "Selectionnez votre langue preferee",
    startAssistant: "Demarrer l'Assistant IA",
    enterSymptoms: "Decrivez vos symptomes...",
    analyzing: "Analyse en cours",
    analyze: "Analyser",
    analysisResult: "Resultat de l'Analyse",
    confidence: "Confiance",
    recommendations: "Recommandations",
    disclaimer: "Cette analyse IA est a titre informatif uniquement et ne doit pas remplacer un diagnostic medical professionnel. Consultez toujours un professionnel de sante qualifie.",
    back: "Retour",
    aiPowered: "Propulse par IA",
    healthAssistant: "Assistant Sante",
    commonSymptoms: "Symptomes Courants",
    urgencyEmergency: "Consultez les Urgences Immediatement",
    urgencyUrgent: "Consultez un Medecin dans les 24 Heures",
    urgencyRoutine: "Prenez un Rendez-vous de Routine",
  },
  pt: {
    welcome: "Bem-vindo ao Assistente de Saude IA",
    selectLanguage: "Selecione seu idioma preferido",
    startAssistant: "Iniciar Assistente IA",
    enterSymptoms: "Descreva seus sintomas...",
    analyzing: "Analisando",
    analyze: "Analisar",
    analysisResult: "Resultado da Analise",
    confidence: "Confianca",
    recommendations: "Recomendacoes",
    disclaimer: "Esta analise de IA e apenas para fins informativos e nao deve substituir o diagnostico medico profissional. Sempre consulte um profissional de saude qualificado.",
    back: "Voltar",
    aiPowered: "Alimentado por IA",
    healthAssistant: "Assistente de Saude",
    commonSymptoms: "Sintomas Comuns",
    urgencyEmergency: "Procure Atendimento de Emergencia Imediatamente",
    urgencyUrgent: "Consulte um Medico em 24 Horas",
    urgencyRoutine: "Agende uma Consulta de Rotina",
  },
  sw: {
    welcome: "Karibu kwa Msaidizi wa Afya wa AI",
    selectLanguage: "Chagua lugha unayopendelea",
    startAssistant: "Anza Msaidizi wa AI",
    enterSymptoms: "Eleza dalili zako...",
    analyzing: "Inachambua",
    analyze: "Changanua",
    analysisResult: "Matokeo ya Uchambuzi",
    confidence: "Uhakika",
    recommendations: "Mapendekezo",
    disclaimer: "Uchambuzi huu wa AI ni kwa madhumuni ya habari tu na haupaswi kuchukua nafasi ya utambuzi wa kitaalamu wa matibabu. Daima wasiliana na mtoa huduma wa afya aliyehitimu.",
    back: "Rudi",
    aiPowered: "Inayoendeshwa na AI",
    healthAssistant: "Msaidizi wa Afya",
    commonSymptoms: "Dalili za Kawaida",
    urgencyEmergency: "Tafuta Huduma ya Dharura Mara Moja",
    urgencyUrgent: "Muone Daktari Ndani ya Saa 24",
    urgencyRoutine: "Panga Miadi ya Kawaida",
  },
  ha: {
    welcome: "Barka da zuwa Mataimakin Lafiya na AI",
    selectLanguage: "Zaɓi harshen da kuke so",
    startAssistant: "Fara Mataimakin AI",
    enterSymptoms: "Bayyana alamominku...",
    analyzing: "Ana nazari",
    analyze: "Nazarta",
    analysisResult: "Sakamakon Nazari",
    confidence: "Amincewa",
    recommendations: "Shawarwari",
    disclaimer: "Wannan nazarin AI don bayani ne kawai kuma bai kamata ya maye gurbin ganewar likita ba. Koyaushe tuntuɓi mai ba da lafiya.",
    back: "Komawa",
    aiPowered: "AI ke jagoranta",
    healthAssistant: "Mataimakin Lafiya",
    commonSymptoms: "Alamomin gama gari",
    urgencyEmergency: "Nemi Kulawar Gaggawa Nan da Nan",
    urgencyUrgent: "Ga Likita Cikin Awanni 24",
    urgencyRoutine: "Shirya Alƙawari na Yau da Kullum",
  },
  yo: {
    welcome: "Kaabo si Oluranlọwọ Ilera AI",
    selectLanguage: "Yan ede ti o fẹran",
    startAssistant: "Bẹrẹ Oluranlọwọ AI",
    enterSymptoms: "Ṣapejuwe awọn aami aisan rẹ...",
    analyzing: "N ṣe atupale",
    analyze: "Ṣe atupale",
    analysisResult: "Abajade Atupale",
    confidence: "Igbẹkẹle",
    recommendations: "Awọn iṣeduro",
    disclaimer: "Atupale AI yii jẹ fun awọn idi alaye nikan ko yẹ ki o rọpo ayẹwo iṣoogun alamọdaju. Nigbagbogbo kan si olupese ilera ti o peye.",
    back: "Pada",
    aiPowered: "AI n ṣakoso",
    healthAssistant: "Oluranlọwọ Ilera",
    commonSymptoms: "Awọn Aami Aisan ti o Wọpọ",
    urgencyEmergency: "Wa Itọju Pajawiri Lẹsẹkẹsẹ",
    urgencyUrgent: "Wo Dokita Laarin Wakati 24",
    urgencyRoutine: "Ṣeto Ipade Deede",
  },
  ig: {
    welcome: "Nnọọ na AI Health Assistant",
    selectLanguage: "Họrọ asụsụ ị họọrọ",
    startAssistant: "Malite AI Assistant",
    enterSymptoms: "Kọwaa ihe mgbaàmà gị...",
    analyzing: "Na-enyocha",
    analyze: "Nyochaa",
    analysisResult: "Nsonaazụ Nyocha",
    confidence: "Ntụkwasị obi",
    recommendations: "Ndụmọdụ",
    disclaimer: "Nyocha AI a bụ naanị maka ebumnuche ozi ma ekwesịghị ịnọchi anya nyocha ahụike ọkachamara. Na-akparịta ụka na onye na-enye ahụike tozuru etozu.",
    back: "Laghachi",
    aiPowered: "AI na-akwado",
    healthAssistant: "Onye Enyemaka Ahụike",
    commonSymptoms: "Ihe Mgbaàmà A Na-ahụkarị",
    urgencyEmergency: "Chọọ Nlekọta Mberede Ozugbo",
    urgencyUrgent: "Hụ Dọkịta N'ime Awa 24",
    urgencyRoutine: "Hazie Nzukọ Oge niile",
  },
  ar: {
    welcome: "مرحبا بك في مساعد الصحة الذكي",
    selectLanguage: "اختر لغتك المفضلة",
    startAssistant: "ابدأ المساعد الذكي",
    enterSymptoms: "صف أعراضك...",
    analyzing: "جاري التحليل",
    analyze: "تحليل",
    analysisResult: "نتيجة التحليل",
    confidence: "الثقة",
    recommendations: "التوصيات",
    disclaimer: "هذا التحليل الذكي لأغراض إعلامية فقط ولا ينبغي أن يحل محل التشخيص الطبي المهني. استشر دائما مقدم رعاية صحية مؤهل.",
    back: "رجوع",
    aiPowered: "مدعوم بالذكاء الاصطناعي",
    healthAssistant: "مساعد الصحة",
    commonSymptoms: "الأعراض الشائعة",
    urgencyEmergency: "اطلب الرعاية الطارئة فورا",
    urgencyUrgent: "راجع الطبيب خلال 24 ساعة",
    urgencyRoutine: "حدد موعدا روتينيا",
  },
  zh: {
    welcome: "欢迎使用AI健康助手",
    selectLanguage: "选择您的首选语言",
    startAssistant: "启动AI助手",
    enterSymptoms: "描述您的症状...",
    analyzing: "分析中",
    analyze: "分析",
    analysisResult: "分析结果",
    confidence: "置信度",
    recommendations: "建议",
    disclaimer: "此AI分析仅供参考，不应替代专业医疗诊断。请始终咨询合格的医疗保健提供者。",
    back: "返回",
    aiPowered: "AI驱动",
    healthAssistant: "健康助手",
    commonSymptoms: "常见症状",
    urgencyEmergency: "立即寻求紧急护理",
    urgencyUrgent: "24小时内就医",
    urgencyRoutine: "预约常规检查",
  },
}

// Symptom analysis data with translations
const getAnalysisData = (lang: Language): Record<string, AnalysisResult> => {
  const data: Record<Language, Record<string, AnalysisResult>> = {
    en: {
      fever: {
        condition: "Possible Viral Infection / Malaria",
        confidence: "high",
        description: "Fever is commonly associated with viral infections, including influenza, COVID-19, or in endemic areas, malaria. Further tests recommended.",
        recommendations: [
          "Complete Blood Count (CBC)",
          "Malaria Rapid Diagnostic Test",
          "Rest and adequate hydration",
          "Monitor temperature regularly",
          "Take paracetamol for fever reduction",
        ],
        urgency: "urgent",
      },
      chest: {
        condition: "Cardiac Evaluation Recommended",
        confidence: "high",
        description: "Chest pain can have various causes ranging from musculoskeletal issues to cardiac conditions. Immediate evaluation advised.",
        recommendations: [
          "ECG / Electrocardiogram immediately",
          "Cardiac enzyme markers test",
          "Avoid strenuous activity",
          "Do not ignore - seek medical attention",
          "Note pain characteristics and duration",
        ],
        urgency: "emergency",
      },
      headache: {
        condition: "Tension Headache / Migraine",
        confidence: "medium",
        description: "Headaches can be primary (tension, migraine) or secondary to other conditions. Pattern and duration help determine the cause.",
        recommendations: [
          "Note frequency and triggers",
          "Adequate rest and hydration",
          "OTC pain relievers as needed",
          "Reduce screen time and stress",
          "Consult if persistent or severe",
        ],
        urgency: "routine",
      },
      fatigue: {
        condition: "Multiple Possible Causes",
        confidence: "medium",
        description: "Persistent fatigue can indicate various conditions including anemia, thyroid disorders, diabetes, or lifestyle factors.",
        recommendations: [
          "Thyroid function tests",
          "Complete metabolic panel",
          "Blood sugar level check",
          "Sleep quality assessment",
          "Lifestyle modification review",
        ],
        urgency: "routine",
      },
      "animal bite": {
        condition: "Potential Rabies / Infection Risk",
        confidence: "high",
        description: "Animal bites carry serious infection risks including rabies, tetanus, and bacterial infections. Immediate medical attention is critical.",
        recommendations: [
          "Wash wound thoroughly with soap and water for 15 minutes",
          "Seek emergency medical care immediately",
          "Rabies post-exposure prophylaxis (PEP) may be needed",
          "Tetanus vaccination if not up to date",
          "Antibiotics to prevent bacterial infection",
          "Report the incident to local health authorities",
        ],
        urgency: "emergency",
      },
      "dog bite": {
        condition: "Dog Bite - Infection & Rabies Risk",
        confidence: "high",
        description: "Dog bites require immediate attention due to risk of rabies transmission and bacterial infections like Pasteurella and Capnocytophaga.",
        recommendations: [
          "Clean wound immediately with soap and running water",
          "Apply antiseptic solution",
          "Seek emergency medical care within hours",
          "Rabies vaccination series if dog status unknown",
          "Tetanus booster if needed",
          "Watch for signs of infection (redness, swelling, pus)",
        ],
        urgency: "emergency",
      },
      "snake bite": {
        condition: "Venomous Snake Bite Emergency",
        confidence: "high",
        description: "Snake bites are medical emergencies. Even non-venomous bites can cause serious infections. Do not try to suck out venom.",
        recommendations: [
          "Call emergency services immediately",
          "Keep the affected limb immobilized and below heart level",
          "Remove jewelry and tight clothing near bite",
          "Do NOT apply ice, tourniquet, or cut the wound",
          "Try to remember snake appearance for identification",
          "Antivenom may be required at hospital",
        ],
        urgency: "emergency",
      },
      cough: {
        condition: "Respiratory Infection / Allergies",
        confidence: "medium",
        description: "Persistent cough can indicate viral infection, bacterial infection, allergies, or chronic conditions like asthma.",
        recommendations: [
          "Monitor cough duration and characteristics",
          "Stay hydrated with warm fluids",
          "Use honey for sore throat (if over 1 year old)",
          "Avoid irritants like smoke and dust",
          "Seek care if cough persists over 2 weeks",
          "COVID-19 test if applicable",
        ],
        urgency: "routine",
      },
      diarrhea: {
        condition: "Gastrointestinal Infection / Food Poisoning",
        confidence: "medium",
        description: "Diarrhea can result from viral/bacterial infections, food poisoning, or digestive disorders. Dehydration is the main concern.",
        recommendations: [
          "Oral rehydration solution (ORS) is essential",
          "Avoid dairy and fatty foods temporarily",
          "BRAT diet (bananas, rice, applesauce, toast)",
          "Monitor for signs of dehydration",
          "Seek care if bloody stool or high fever",
          "Stool test may be needed",
        ],
        urgency: "urgent",
      },
      vomiting: {
        condition: "Gastroenteritis / Food Poisoning",
        confidence: "medium",
        description: "Vomiting can be caused by infections, food poisoning, medication side effects, or other conditions. Risk of dehydration.",
        recommendations: [
          "Small sips of clear fluids",
          "Avoid solid foods until vomiting stops",
          "Oral rehydration solution recommended",
          "Rest in comfortable position",
          "Seek emergency care if blood in vomit",
          "Monitor for signs of severe dehydration",
        ],
        urgency: "urgent",
      },
      rash: {
        condition: "Skin Condition / Allergic Reaction",
        confidence: "medium",
        description: "Skin rashes can indicate allergies, infections, autoimmune conditions, or contact dermatitis. Location and appearance help diagnosis.",
        recommendations: [
          "Avoid scratching affected area",
          "Apply cool compress for relief",
          "Note any new foods, medications, or products",
          "Antihistamines may help if allergic",
          "Seek emergency care if breathing difficulty",
          "Photograph rash progression for doctor",
        ],
        urgency: "routine",
      },
      "breathing difficulty": {
        condition: "Respiratory Distress - Urgent Evaluation",
        confidence: "high",
        description: "Difficulty breathing can indicate asthma, pneumonia, heart problems, or severe allergic reaction. Requires immediate attention.",
        recommendations: [
          "Seek emergency care immediately",
          "Sit upright to help breathing",
          "Use prescribed inhaler if available",
          "Loosen tight clothing",
          "Stay calm and take slow breaths",
          "Call emergency services if severe",
        ],
        urgency: "emergency",
      },
      "stomach pain": {
        condition: "Abdominal Pain - Multiple Causes",
        confidence: "medium",
        description: "Stomach pain can range from indigestion to serious conditions like appendicitis. Location and severity are important.",
        recommendations: [
          "Note pain location and characteristics",
          "Avoid heavy meals temporarily",
          "Apply warm compress for cramps",
          "Monitor for fever or vomiting",
          "Seek emergency care if severe right-side pain",
          "Avoid NSAIDs if stomach upset",
        ],
        urgency: "urgent",
      },
      "eye pain": {
        condition: "Ocular Condition Requiring Evaluation",
        confidence: "medium",
        description: "Eye pain can indicate infection, injury, glaucoma, or other conditions. Vision changes require prompt attention.",
        recommendations: [
          "Avoid rubbing the eye",
          "Rinse with clean water if foreign object",
          "Remove contact lenses if wearing",
          "Seek urgent care if vision changes",
          "Note any discharge or sensitivity to light",
          "Emergency care if chemical exposure",
        ],
        urgency: "urgent",
      },
      "joint pain": {
        condition: "Musculoskeletal / Inflammatory Condition",
        confidence: "medium",
        description: "Joint pain can indicate arthritis, injury, infection, or other conditions. Swelling and limited movement are concerning signs.",
        recommendations: [
          "Rest the affected joint",
          "Apply ice for acute pain/swelling",
          "Gentle stretching exercises",
          "OTC anti-inflammatory medications",
          "Seek care if joint is hot or very swollen",
          "Blood tests may be needed for arthritis",
        ],
        urgency: "routine",
      },
      "insect bite": {
        condition: "Insect Bite / Sting Reaction",
        confidence: "medium",
        description: "Most insect bites cause local reactions. Watch for signs of severe allergic reaction (anaphylaxis) or infection.",
        recommendations: [
          "Clean the area with soap and water",
          "Apply cold compress to reduce swelling",
          "Antihistamines for itching",
          "Hydrocortisone cream for inflammation",
          "Seek emergency care if difficulty breathing",
          "Watch for spreading redness (infection sign)",
        ],
        urgency: "routine",
      },
      default: {
        condition: "Further Assessment Needed",
        confidence: "low",
        description: "The provided symptoms require additional context for accurate analysis. Please provide more specific details or consult directly with a healthcare provider.",
        recommendations: [
          "Detailed symptom history",
          "Physical examination recommended",
          "Basic laboratory workup",
          "Follow-up consultation",
          "Keep a symptom diary",
        ],
        urgency: "routine",
      },
    },
    es: {
      fever: {
        condition: "Posible Infeccion Viral / Malaria",
        confidence: "high",
        description: "La fiebre se asocia comunmente con infecciones virales, incluyendo gripe, COVID-19, o en areas endemicas, malaria.",
        recommendations: [
          "Hemograma completo (CBC)",
          "Prueba rapida de malaria",
          "Descanso e hidratacion adecuada",
          "Monitorear temperatura regularmente",
          "Tomar paracetamol para reducir la fiebre",
        ],
        urgency: "urgent",
      },
      "animal bite": {
        condition: "Riesgo de Rabia / Infeccion",
        confidence: "high",
        description: "Las mordeduras de animales conllevan riesgos serios de infeccion incluyendo rabia, tetanos e infecciones bacterianas.",
        recommendations: [
          "Lavar la herida con agua y jabon por 15 minutos",
          "Buscar atencion medica de emergencia inmediatamente",
          "Puede necesitar profilaxis post-exposicion de rabia",
          "Vacuna contra el tetanos si no esta al dia",
          "Antibioticos para prevenir infeccion bacteriana",
        ],
        urgency: "emergency",
      },
      default: {
        condition: "Se Necesita Evaluacion Adicional",
        confidence: "low",
        description: "Los sintomas proporcionados requieren contexto adicional para un analisis preciso. Proporcione mas detalles o consulte directamente con un proveedor de atencion medica.",
        recommendations: [
          "Historia detallada de sintomas",
          "Examen fisico recomendado",
          "Analisis de laboratorio basico",
          "Consulta de seguimiento",
        ],
        urgency: "routine",
      },
    },
    fr: {
      fever: {
        condition: "Infection Virale Possible / Paludisme",
        confidence: "high",
        description: "La fievre est generalement associee aux infections virales, y compris la grippe, le COVID-19 ou le paludisme dans les zones endemiques.",
        recommendations: [
          "Numeration formule sanguine complete",
          "Test de diagnostic rapide du paludisme",
          "Repos et hydratation adequate",
          "Surveiller la temperature regulierement",
          "Prendre du paracetamol pour reduire la fievre",
        ],
        urgency: "urgent",
      },
      "animal bite": {
        condition: "Risque de Rage / Infection",
        confidence: "high",
        description: "Les morsures d'animaux comportent des risques graves d'infection, y compris la rage, le tetanos et les infections bacteriennes.",
        recommendations: [
          "Laver la plaie avec du savon et de l'eau pendant 15 minutes",
          "Chercher des soins medicaux d'urgence immediatement",
          "Prophylaxie post-exposition contre la rage peut etre necessaire",
          "Vaccination contre le tetanos si pas a jour",
          "Antibiotiques pour prevenir l'infection bacterienne",
        ],
        urgency: "emergency",
      },
      default: {
        condition: "Evaluation Supplementaire Necessaire",
        confidence: "low",
        description: "Les symptomes fournis necessitent un contexte supplementaire pour une analyse precise. Veuillez fournir plus de details ou consulter directement un professionnel de sante.",
        recommendations: [
          "Historique detaille des symptomes",
          "Examen physique recommande",
          "Bilan biologique de base",
          "Consultation de suivi",
        ],
        urgency: "routine",
      },
    },
    pt: {
      fever: {
        condition: "Possivel Infeccao Viral / Malaria",
        confidence: "high",
        description: "A febre e comumente associada a infeccoes virais, incluindo gripe, COVID-19 ou, em areas endemicas, malaria.",
        recommendations: [
          "Hemograma completo",
          "Teste rapido de malaria",
          "Descanso e hidratacao adequada",
          "Monitorar temperatura regularmente",
          "Tomar paracetamol para reducao da febre",
        ],
        urgency: "urgent",
      },
      "animal bite": {
        condition: "Risco de Raiva / Infeccao",
        confidence: "high",
        description: "Mordidas de animais apresentam riscos serios de infeccao, incluindo raiva, tetano e infeccoes bacterianas.",
        recommendations: [
          "Lavar a ferida com agua e sabao por 15 minutos",
          "Procurar atendimento medico de emergencia imediatamente",
          "Profilaxia pos-exposicao contra raiva pode ser necessaria",
          "Vacinacao contra tetano se nao estiver em dia",
          "Antibioticos para prevenir infeccao bacteriana",
        ],
        urgency: "emergency",
      },
      default: {
        condition: "Avaliacao Adicional Necessaria",
        confidence: "low",
        description: "Os sintomas fornecidos requerem contexto adicional para analise precisa. Forneca mais detalhes ou consulte diretamente um profissional de saude.",
        recommendations: [
          "Historico detalhado de sintomas",
          "Exame fisico recomendado",
          "Exames laboratoriais basicos",
          "Consulta de acompanhamento",
        ],
        urgency: "routine",
      },
    },
    sw: {
      fever: {
        condition: "Uwezekano wa Maambukizi ya Virusi / Malaria",
        confidence: "high",
        description: "Homa inahusishwa na maambukizi ya virusi, ikiwa ni pamoja na mafua, COVID-19, au katika maeneo ya endemic, malaria.",
        recommendations: [
          "Hesabu kamili ya damu",
          "Jaribio la haraka la malaria",
          "Pumziko na kunywa maji ya kutosha",
          "Fuatilia joto mara kwa mara",
          "Tumia paracetamol kupunguza homa",
        ],
        urgency: "urgent",
      },
      "animal bite": {
        condition: "Hatari ya Kichaa cha Mbwa / Maambukizi",
        confidence: "high",
        description: "Kuumwa na wanyama kunaweza kusababisha maambukizi makubwa ikiwa ni pamoja na kichaa cha mbwa, pepopunda, na maambukizi ya bakteria.",
        recommendations: [
          "Osha jeraha kwa sabuni na maji kwa dakika 15",
          "Tafuta huduma ya dharura mara moja",
          "Chanjo ya kichaa cha mbwa inaweza kuhitajika",
          "Chanjo ya pepopunda ikiwa haijasasishwa",
          "Antibiotiki kuzuia maambukizi ya bakteria",
        ],
        urgency: "emergency",
      },
      default: {
        condition: "Tathmini Zaidi Inahitajika",
        confidence: "low",
        description: "Dalili zilizotolewa zinahitaji muktadha zaidi kwa uchambuzi sahihi. Tafadhali toa maelezo zaidi au wasiliana na mtoa huduma za afya.",
        recommendations: [
          "Historia ya kina ya dalili",
          "Uchunguzi wa kimwili unapendekezwa",
          "Vipimo vya msingi vya maabara",
          "Mashauriano ya ufuatiliaji",
        ],
        urgency: "routine",
      },
    },
    ha: {
      fever: {
        condition: "Yiwuwar Kamuwa ta Kwayoyin cuta / Zazzabin cizon sauro",
        confidence: "high",
        description: "Zazzabi yana da alaka da kamuwa ta kwayoyin cuta, ciki har da mura, COVID-19, ko a yankunan da ake fama da zazzabin cizon sauro.",
        recommendations: [
          "Cikakken gwajin jini",
          "Gwajin zazzabin cizon sauro na gaggawa",
          "Hutawa da shan ruwa isashe",
          "Duba zafin jiki akai-akai",
          "Sha paracetamol don rage zazzabi",
        ],
        urgency: "urgent",
      },
      "animal bite": {
        condition: "Hadarin Cutar hauka / Kamuwa",
        confidence: "high",
        description: "Cizon dabbobi na iya haifar da hadarin kamuwa mai tsanani ciki har da cutar hauka, tetanus, da kamuwa ta kwayoyin cuta.",
        recommendations: [
          "Wanke raunin da sabulu da ruwa na minti 15",
          "Nemi kulawar gaggawa nan take",
          "Allurar cutar hauka na iya zama dole",
          "Allurar tetanus idan ba a sabunta ba",
          "Maganin kashe kwayoyin cuta don hana kamuwa",
        ],
        urgency: "emergency",
      },
      default: {
        condition: "Ana Bukatar Karin Nazari",
        confidence: "low",
        description: "Alamomin da aka bayar suna bukatar karin bayani don nazari daidai. Da fatan za a bayar da karin cikakkun bayanai ko tuntuɓi mai ba da lafiya kai tsaye.",
        recommendations: [
          "Cikakken tarihin alamomi",
          "Ana ba da shawarar dubawa",
          "Gwajin dakin gwaje-gwaje na asali",
          "Mashawarcin biyo baya",
        ],
        urgency: "routine",
      },
    },
    yo: {
      fever: {
        condition: "O ṣeeṣe Akoran Virus / Iba",
        confidence: "high",
        description: "Iba ni ibatan pẹlu awọn akoran virus, pẹlu aisan, COVID-19, tabi ni awọn agbegbe endemic, malaria.",
        recommendations: [
          "Iye ẹjẹ kikun",
          "Idanwo iyara malaria",
          "Isinmi ati mimu omi to peye",
          "Ṣe abojuto iwọn otutu nigbagbogbo",
          "Mu paracetamol lati din iba ku",
        ],
        urgency: "urgent",
      },
      "animal bite": {
        condition: "Ewu Rabies / Akoran",
        confidence: "high",
        description: "Awọn jẹjẹ ẹranko gbe awọn ewu akoran pataki pẹlu rabies, tetanus, ati awọn akoran kokoro arun.",
        recommendations: [
          "Fo ọgbẹ naa pẹlu ọṣẹ ati omi fun iṣẹju 15",
          "Wa itọju pajawiri lẹsẹkẹsẹ",
          "Ajesara rabies le nilo",
          "Ajesara tetanus ti ko ba ti wa ni imudojuiwọn",
          "Awọn egboogi lati ṣe idiwọ akoran kokoro arun",
        ],
        urgency: "emergency",
      },
      default: {
        condition: "Ayẹwo Afikun Nilo",
        confidence: "low",
        description: "Awọn aami aisan ti a pese nilo afikun fun itupalẹ deede. Jọwọ pese awọn alaye diẹ sii tabi kan si olupese ilera taara.",
        recommendations: [
          "Itan alaye ti awọn aami aisan",
          "A ṣe iṣeduro ayẹwo ti ara",
          "Awọn idanwo yàrá ipilẹ",
          "Ijumọsọrọ itẹle",
        ],
        urgency: "routine",
      },
    },
    ig: {
      fever: {
        condition: "O Nwere Ike Ọrịa Virus / Ịba",
        confidence: "high",
        description: "Ahụ ọkụ na-ejikọta ya na ọrịa virus, gụnyere oyi, COVID-19, ma ọ bụ na mpaghara endemic, ịba.",
        recommendations: [
          "Ngụkọta ọbara zuru ezu",
          "Nnwale ngwa ngwa nke ịba",
          "Ezumike na mmiri mmiri zuru ezu",
          "Nyochaa okpomọkụ oge niile",
          "Ṅụọ paracetamol iji belata ahụ ọkụ",
        ],
        urgency: "urgent",
      },
      "animal bite": {
        condition: "Ihe Ize Ndụ Rabies / Ọrịa",
        confidence: "high",
        description: "Ọtụtụ anụmanụ na-ebute ihe ize ndụ ọrịa dị njọ gụnyere rabies, tetanus, na ọrịa bacteria.",
        recommendations: [
          "Saa ọnya ahụ nke ọma na ncha na mmiri ruo nkeji 15",
          "Chọọ nlekọta mberede ozugbo",
          "Ogwu rabies nwere ike ịdị mkpa",
          "Ogwu tetanus ma ọ bụrụ na ọ bụghị nke ọhụrụ",
          "Ogwu nje iji gbochie ọrịa bacteria",
        ],
        urgency: "emergency",
      },
      default: {
        condition: "A Chọrọ Nyocha Ọzọ",
        confidence: "low",
        description: "Ihe mgbaàmà e nyere achọrọ ọzọ maka nyocha ziri ezi. Biko nye nkọwa ndị ọzọ ma ọ bụ kparịta ụka na onye na-enye ahụike ozugbo.",
        recommendations: [
          "Akụkọ zuru ezu banyere ihe mgbaàmà",
          "A na-atụ aro nyocha ahụ",
          "Nnwale nyocha ụlọ ọrụ mmepụta ihe dị mkpa",
          "Nzukọ nlekọta",
        ],
        urgency: "routine",
      },
    },
    ar: {
      fever: {
        condition: "عدوى فيروسية محتملة / ملاريا",
        confidence: "high",
        description: "ترتبط الحمى عادة بالعدوى الفيروسية، بما في ذلك الأنفلونزا وكوفيد-19 أو الملاريا في المناطق الموبوءة.",
        recommendations: [
          "فحص دم شامل",
          "اختبار سريع للملاريا",
          "الراحة والترطيب الكافي",
          "مراقبة درجة الحرارة بانتظام",
          "تناول الباراسيتامول لخفض الحرارة",
        ],
        urgency: "urgent",
      },
      "animal bite": {
        condition: "خطر داء الكلب / العدوى",
        confidence: "high",
        description: "تحمل عضات الحيوانات مخاطر عدوى خطيرة بما في ذلك داء الكلب والكزاز والعدوى البكتيرية.",
        recommendations: [
          "غسل الجرح جيدا بالماء والصابون لمدة 15 دقيقة",
          "طلب الرعاية الطبية الطارئة فورا",
          "قد تكون هناك حاجة للقاح داء الكلب",
          "لقاح الكزاز إذا لم يكن محدثا",
          "المضادات الحيوية لمنع العدوى البكتيرية",
        ],
        urgency: "emergency",
      },
      default: {
        condition: "مطلوب تقييم إضافي",
        confidence: "low",
        description: "الأعراض المقدمة تتطلب سياقا إضافيا للتحليل الدقيق. يرجى تقديم المزيد من التفاصيل أو استشارة مقدم الرعاية الصحية مباشرة.",
        recommendations: [
          "تاريخ مفصل للأعراض",
          "يوصى بالفحص البدني",
          "فحوصات مخبرية أساسية",
          "استشارة متابعة",
        ],
        urgency: "routine",
      },
    },
    zh: {
      fever: {
        condition: "可能的病毒感染/疟疾",
        confidence: "high",
        description: "发烧通常与病毒感染有关，包括流感、新冠病毒，或在流行地区的疟疾。",
        recommendations: [
          "全血细胞计数",
          "疟疾快速诊断测试",
          "充分休息和补水",
          "定期监测体温",
          "服用扑热息痛退烧",
        ],
        urgency: "urgent",
      },
      "animal bite": {
        condition: "狂犬病/感染风险",
        confidence: "high",
        description: "动物咬伤有严重的感染风险，包括狂犬病、破伤风和细菌感染。",
        recommendations: [
          "用肥皂和水彻底清洗伤口15分钟",
          "立即寻求紧急医疗护理",
          "可能需要狂犬病暴露后预防",
          "如未更新则需接种破伤风疫苗",
          "抗生素预防细菌感染",
        ],
        urgency: "emergency",
      },
      default: {
        condition: "需要进一步评估",
        confidence: "low",
        description: "提供的症状需要更多背景信息才能准确分析。请提供更多详细信息或直接咨询医疗保健提供者。",
        recommendations: [
          "详细的症状历史",
          "建议进行体检",
          "基本实验室检查",
          "随访咨询",
        ],
        urgency: "routine",
      },
    },
  }
  
  return data[lang] || data.en
}

export function AIAssistant({ setScreen }: AIAssistantProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [symptom, setSymptom] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const t = selectedLanguage ? translations[selectedLanguage] : translations.en

  const commonSymptoms = [
    { icon: Thermometer, label: "Fever", symptom: "fever" },
    { icon: HeartPulse, label: "Chest Pain", symptom: "chest" },
    { icon: Activity, label: "Fatigue", symptom: "fatigue" },
    { icon: Brain, label: "Headache", symptom: "headache" },
    { icon: Bug, label: "Animal Bite", symptom: "animal bite" },
    { icon: Wind, label: "Cough", symptom: "cough" },
    { icon: Frown, label: "Stomach Pain", symptom: "stomach pain" },
    { icon: Eye, label: "Eye Pain", symptom: "eye pain" },
    { icon: Bone, label: "Joint Pain", symptom: "joint pain" },
  ]

  const analyzeSymptom = (input: string) => {
    setIsAnalyzing(true)

    setTimeout(() => {
      const lowerInput = input.toLowerCase()
      const analysisData = getAnalysisData(selectedLanguage || "en")
      
      let analysis: AnalysisResult = analysisData.default

      // Check for specific symptoms
      const symptomKeys = Object.keys(analysisData).filter(k => k !== "default")
      for (const key of symptomKeys) {
        if (lowerInput.includes(key)) {
          analysis = analysisData[key]
          break
        }
      }
      
      // Additional checks for English keywords that might be used
      if (selectedLanguage === "en" || !selectedLanguage) {
        if (lowerInput.includes("dog") || lowerInput.includes("cat") || lowerInput.includes("bite") || lowerInput.includes("bitten")) {
          analysis = analysisData["animal bite"] || analysisData.default
        }
        if (lowerInput.includes("snake")) {
          analysis = analysisData["snake bite"] || analysisData.default
        }
        if (lowerInput.includes("breathing") || lowerInput.includes("breathe") || lowerInput.includes("breath")) {
          analysis = analysisData["breathing difficulty"] || analysisData.default
        }
        if (lowerInput.includes("diarrhea") || lowerInput.includes("loose stool")) {
          analysis = analysisData["diarrhea"] || analysisData.default
        }
        if (lowerInput.includes("vomit") || lowerInput.includes("throwing up") || lowerInput.includes("nausea")) {
          analysis = analysisData["vomiting"] || analysisData.default
        }
        if (lowerInput.includes("rash") || lowerInput.includes("skin") || lowerInput.includes("itchy")) {
          analysis = analysisData["rash"] || analysisData.default
        }
        if (lowerInput.includes("insect") || lowerInput.includes("mosquito") || lowerInput.includes("bee") || lowerInput.includes("wasp")) {
          analysis = analysisData["insect bite"] || analysisData.default
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

  const urgencyColors = {
    emergency: "bg-red-500/20 text-red-600 border-red-500/30",
    urgent: "bg-amber-500/20 text-amber-600 border-amber-500/30",
    routine: "bg-accent/20 text-accent border-accent/30",
  }

  // Language selection screen
  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src="/images/ai-health.jpg"
            alt="AI Health Assistant"
            fill
            className="object-cover brightness-110 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-slate-900/90" />
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="w-fit text-white hover:bg-white/20"
              onClick={() => setScreen("dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-6 w-6 text-white" />
                <span className="text-white/80 text-sm">AI-Powered</span>
              </div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
                <Brain className="h-7 w-7" />
                Health Assistant
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-6 relative z-10 pb-8">
          <Card className="border-0 shadow-xl bg-card">
            <CardHeader className="text-center pb-2">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-card-foreground">
                Welcome to AI Health Assistant
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Select your preferred language to continue
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={(value) => setSelectedLanguage(value as Language)}>
                <SelectTrigger className="h-14 text-base">
                  <SelectValue placeholder="Choose your language..." />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-muted-foreground">({lang.nativeName})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Quick language buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {languages.slice(0, 6).map((lang) => (
                  <Button
                    key={lang.code}
                    variant="outline"
                    className="h-12 justify-start gap-2"
                    onClick={() => setSelectedLanguage(lang.code)}
                  >
                    <span className="font-medium">{lang.nativeName}</span>
                  </Button>
                ))}
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  The AI assistant will communicate with you in your selected language
                </p>
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
      <div className="relative h-48 overflow-hidden">
        <Image
          src="/images/ai-health.jpg"
          alt="AI Health Assistant"
          fill
          className="object-cover brightness-110 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-slate-900/90" />
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="w-fit text-white hover:bg-white/20"
              onClick={() => setScreen("dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 gap-2"
              onClick={() => {
                setSelectedLanguage(null)
                setResult(null)
                setSymptom("")
              }}
            >
              <Globe className="h-4 w-4" />
              {languages.find(l => l.code === selectedLanguage)?.nativeName}
            </Button>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6 text-white" />
              <span className="text-white/80 text-sm">{t.aiPowered}</span>
            </div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 drop-shadow-lg">
              <Brain className="h-7 w-7" />
              {t.healthAssistant}
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
                  placeholder={t.enterSymptoms}
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
                    {t.analyzing}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t.analyze}
                  </>
                )}
              </Button>
            </div>

            {/* Quick Symptoms */}
            <p className="text-sm text-muted-foreground mt-4 mb-2">{t.commonSymptoms}:</p>
            <div className="flex flex-wrap gap-2">
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
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Brain className="h-5 w-5 text-primary" />
                  {t.analysisResult}
                </CardTitle>
                <Badge className={confidenceColors[result.confidence]}>
                  {result.confidence.charAt(0).toUpperCase() +
                    result.confidence.slice(1)}{" "}
                  {t.confidence}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Urgency Alert */}
              {result.urgency && (
                <div className={`p-4 rounded-xl border ${urgencyColors[result.urgency]}`}>
                  <div className="flex items-center gap-2">
                    {result.urgency === "emergency" ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : result.urgency === "urgent" ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <CheckCircle className="h-5 w-5" />
                    )}
                    <span className="font-semibold">
                      {result.urgency === "emergency"
                        ? t.urgencyEmergency
                        : result.urgency === "urgent"
                        ? t.urgencyUrgent
                        : t.urgencyRoutine}
                    </span>
                  </div>
                </div>
              )}

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
                  {t.recommendations}
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
                  <strong>Disclaimer:</strong> {t.disclaimer}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
