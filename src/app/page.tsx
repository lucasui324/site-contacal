"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Camera, Upload, Plus, Minus, History, User, TrendingDown, Calculator, Utensils, Clock, Target, ArrowRight, Heart, Users, Instagram, Youtube, Facebook, Twitter, CheckCircle, Star, Trophy, Zap, Search, BarChart3, Settings, Home, Award, Flame, Apple, Coffee, Sandwich, Moon, Scale, Activity, Calendar, Sparkles, Gift, CreditCard, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'

interface Food {
  name: string
  quantity: number
  unit: string
  calories: number
  protein?: number
  carbs?: number
  fat?: number
}

interface Meal {
  id: string
  date: string
  time: string
  foods: Food[]
  totalCalories: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  image?: string
}

interface UserProfile {
  // Informações básicas
  goal: string
  gender: string
  age: number
  weight: number
  height: number
  targetWeight: number
  activityLevel: string
  
  // Informações de personalização
  nickname: string
  motivation: string
  experience: string
  challenges: string[]
  timeAvailable: string
  budget: string
  
  // Informações de persuasão/marketing
  source: string
  previousAttempts: string
  biggestChallenge: string
  dreamBody: string
  socialInfluence: string
  urgency: string
  investmentWillingness: string
  
  // Novas perguntas adicionais
  restrictions: string[]
  favoriteFood: string
  mealPreference: string
  biggestMotivator: string
  strictPlan: string
  exerciseTips: string
  biggestTemptation: string
  dailyNotifications: string
  personalizedMeals: string
  
  // Configurações calculadas
  dailyCalorieGoal: number
  isCompleted: boolean
}

interface NutritionGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export default function Contacal() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [meals, setMeals] = useState<Meal[]>([])
  const [mounted, setMounted] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [foodQuantity, setFoodQuantity] = useState(100)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sistema de Onboarding Completo com 20 perguntas
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [showPremiumOffer, setShowPremiumOffer] = useState(false)
  const [showDiscountWheel, setShowDiscountWheel] = useState(false)
  const [showPersonalizedLoading, setShowPersonalizedLoading] = useState(false)
  const [showYampiCheckout, setShowYampiCheckout] = useState(false)
  const [yampiLink, setYampiLink] = useState('')
  const [wheelDiscount, setWheelDiscount] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    goal: '',
    gender: '',
    age: 0,
    weight: 0,
    height: 0,
    targetWeight: 0,
    activityLevel: '',
    nickname: '',
    motivation: '',
    experience: '',
    challenges: [],
    timeAvailable: '',
    budget: '',
    source: '',
    previousAttempts: '',
    biggestChallenge: '',
    dreamBody: '',
    socialInfluence: '',
    urgency: '',
    investmentWillingness: '',
    restrictions: [],
    favoriteFood: '',
    mealPreference: '',
    biggestMotivator: '',
    strictPlan: '',
    exerciseTips: '',
    biggestTemptation: '',
    dailyNotifications: '',
    personalizedMeals: '',
    dailyCalorieGoal: 2000,
    isCompleted: false
  })

  // Carregar dados do localStorage apenas no cliente
  useEffect(() => {
    setMounted(true)
    
    // Carregar meals
    const savedMeals = localStorage.getItem('contacal-meals')
    if (savedMeals) {
      setMeals(JSON.parse(savedMeals))
    }

    // Carregar profile
    const savedProfile = localStorage.getItem('contacal-profile')
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setUserProfile(profile)
      if (!profile.isCompleted) {
        setShowOnboarding(true)
      }
    } else {
      setShowOnboarding(true)
    }

    // Carregar link Yampi
    const savedYampiLink = localStorage.getItem('contacal-yampi-link')
    if (savedYampiLink) {
      setYampiLink(savedYampiLink)
    }
  }, [])

  const saveProfile = (updates: Partial<UserProfile>) => {
    const updatedProfile = { ...userProfile, ...updates }
    setUserProfile(updatedProfile)
    if (mounted) {
      localStorage.setItem('contacal-profile', JSON.stringify(updatedProfile))
    }
  }

  const saveYampiLink = (link: string) => {
    setYampiLink(link)
    if (mounted) {
      localStorage.setItem('contacal-yampi-link', link)
    }
  }

  const nextStep = () => {
    if (onboardingStep < 20) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      // Mostrar tela de configuração personalizada
      setShowPersonalizedLoading(true)
      setTimeout(() => {
        setShowPersonalizedLoading(false)
        setShowPremiumOffer(true)
      }, 3000)
    }
  }

  const calculateCalorieGoal = () => {
    // Fórmula de Harris-Benedict para calcular TMB
    let bmr = 0
    if (userProfile.gender === 'masculino') {
      bmr = 88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age)
    } else {
      bmr = 447.593 + (9.247 * userProfile.weight) + (3.098 * userProfile.height) - (4.330 * userProfile.age)
    }

    // Fator de atividade
    const activityFactors: Record<string, number> = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'intenso': 1.725,
      'muito_intenso': 1.9
    }

    const tdee = bmr * (activityFactors[userProfile.activityLevel] || 1.2)

    // Ajustar baseado no objetivo
    let calorieGoal = tdee
    if (userProfile.goal === 'emagrecer') {
      calorieGoal = tdee - 500 // Déficit de 500 kcal para perder ~0.5kg/semana
    } else if (userProfile.goal === 'ganhar massa muscular') {
      calorieGoal = tdee + 300 // Superávit de 300 kcal
    }

    return Math.round(calorieGoal)
  }

  const completeOnboarding = () => {
    const calculatedGoal = calculateCalorieGoal()
    saveProfile({ 
      isCompleted: true, 
      dailyCalorieGoal: calculatedGoal 
    })
    setShowOnboarding(false)
    setShowPremiumOffer(false)
    setShowDiscountWheel(false)
    setShowYampiCheckout(false)
  }

  const skipToPremium = () => {
    setShowPremiumOffer(true)
  }

  const skipPremium = () => {
    setShowDiscountWheel(true)
  }

  const proceedToYampiCheckout = () => {
    setShowYampiCheckout(true)
  }

  const spinWheel = () => {
    setIsSpinning(true)
    const discounts = [10, 15, 20, 25, 30, 35, 40, 45, 50]
    const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)]
    
    setTimeout(() => {
      setWheelDiscount(randomDiscount)
      setIsSpinning(false)
    }, 3000)
  }

  // Base de dados nutricional completa (calorias, proteína, carboidratos, gordura por 100g)
  const nutritionDB: Record<string, { calories: number, protein: number, carbs: number, fat: number }> = {
    // Cereais e grãos
    'arroz branco cozido': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    'arroz integral cozido': { calories: 123, protein: 2.6, carbs: 25, fat: 1.0 },
    'aveia': { calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9 },
    'pão francês': { calories: 300, protein: 8.0, carbs: 58, fat: 3.2 },
    'pão integral': { calories: 247, protein: 13.4, carbs: 41, fat: 4.2 },
    'macarrão cozido': { calories: 131, protein: 5.0, carbs: 25, fat: 1.1 },
    'quinoa cozida': { calories: 120, protein: 4.4, carbs: 22, fat: 1.9 },
    
    // Proteínas
    'frango grelhado': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    'peito de frango': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    'carne bovina magra': { calories: 213, protein: 26, carbs: 0, fat: 11 },
    'salmão': { calories: 208, protein: 25, carbs: 0, fat: 12 },
    'atum': { calories: 144, protein: 30, carbs: 0, fat: 1.0 },
    'ovo cozido': { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
    'tilápia': { calories: 96, protein: 20, carbs: 0, fat: 1.7 },
    
    // Laticínios
    'leite desnatado': { calories: 35, protein: 3.4, carbs: 5.0, fat: 0.1 },
    'iogurte grego': { calories: 97, protein: 9.0, carbs: 4.0, fat: 5.0 },
    'queijo mussarela': { calories: 280, protein: 22, carbs: 2.2, fat: 20 },
    'queijo cottage': { calories: 98, protein: 11, carbs: 3.4, fat: 4.3 },
    
    // Vegetais
    'brócolis': { calories: 34, protein: 2.8, carbs: 7.0, fat: 0.4 },
    'espinafre': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    'tomate': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
    'cenoura': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
    'alface': { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 },
    'pepino': { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 },
    'couve-flor': { calories: 25, protein: 1.9, carbs: 5.0, fat: 0.3 },
    
    // Frutas
    'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
    'maçã': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
    'laranja': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
    'morango': { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3 },
    'abacate': { calories: 160, protein: 2.0, carbs: 9.0, fat: 15 },
    'manga': { calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
    
    // Oleaginosas
    'amendoim': { calories: 567, protein: 26, carbs: 16, fat: 49 },
    'amêndoas': { calories: 579, protein: 21, carbs: 22, fat: 50 },
    'castanha do pará': { calories: 656, protein: 14, carbs: 12, fat: 66 },
    'nozes': { calories: 654, protein: 15, carbs: 14, fat: 65 },
    
    // Leguminosas
    'feijão preto cozido': { calories: 77, protein: 4.5, carbs: 14, fat: 0.5 },
    'lentilha cozida': { calories: 116, protein: 9.0, carbs: 20, fat: 0.4 },
    'grão de bico cozido': { calories: 164, protein: 8.9, carbs: 27, fat: 2.6 },
    
    // Tubérculos
    'batata cozida': { calories: 87, protein: 1.9, carbs: 20, fat: 0.1 },
    'batata doce': { calories: 118, protein: 2.0, carbs: 27, fat: 0.1 },
    'mandioca': { calories: 125, protein: 1.4, carbs: 30, fat: 0.3 },
    
    // Óleos e gorduras
    'azeite de oliva': { calories: 884, protein: 0, carbs: 0, fat: 100 },
    'óleo de coco': { calories: 862, protein: 0, carbs: 0, fat: 100 },
    'manteiga': { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 },
    
    // Bebidas
    'café': { calories: 2, protein: 0.3, carbs: 0, fat: 0 },
    'chá verde': { calories: 1, protein: 0, carbs: 0, fat: 0 },
    'água': { calories: 0, protein: 0, carbs: 0, fat: 0 }
  }

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return Coffee
      case 'lunch': return Utensils
      case 'dinner': return Sandwich
      case 'snack': return Apple
      default: return Utensils
    }
  }

  const getMealName = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Café da Manhã'
      case 'lunch': return 'Almoço'
      case 'dinner': return 'Jantar'
      case 'snack': return 'Lanche'
      default: return 'Refeição'
    }
  }

  const getTodayMeals = () => {
    if (!mounted) return []
    const today = new Date().toLocaleDateString('pt-BR')
    return meals.filter(meal => meal.date === today)
  }

  const getTotalCaloriesToday = () => {
    if (!mounted) return 0
    return getTodayMeals().reduce((sum, meal) => sum + meal.totalCalories, 0)
  }

  const getTotalMacrosToday = () => {
    const todayMeals = getTodayMeals()
    return todayMeals.reduce((totals, meal) => {
      meal.foods.forEach(food => {
        const multiplier = food.quantity / 100
        totals.protein += (food.protein || 0) * multiplier
        totals.carbs += (food.carbs || 0) * multiplier
        totals.fat += (food.fat || 0) * multiplier
      })
      return totals
    }, { protein: 0, carbs: 0, fat: 0 })
  }

  const getMealCalories = (mealType: string) => {
    return getTodayMeals()
      .filter(meal => meal.mealType === mealType)
      .reduce((sum, meal) => sum + meal.totalCalories, 0)
  }

  const getFilteredFoods = () => {
    if (!searchQuery) return Object.keys(nutritionDB).slice(0, 10)
    return Object.keys(nutritionDB)
      .filter(food => food.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 10)
  }

  const addFoodToMeal = () => {
    if (!selectedFood) return

    const multiplier = foodQuantity / 100
    const foodWithQuantity: Food = {
      name: selectedFood.name,
      quantity: foodQuantity,
      unit: 'g',
      calories: Math.round(selectedFood.calories * multiplier),
      protein: Math.round((selectedFood.protein || 0) * multiplier * 10) / 10,
      carbs: Math.round((selectedFood.carbs || 0) * multiplier * 10) / 10,
      fat: Math.round((selectedFood.fat || 0) * multiplier * 10) / 10
    }

    const meal: Meal = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('pt-BR'),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      foods: [foodWithQuantity],
      totalCalories: foodWithQuantity.calories,
      mealType: selectedMealType
    }

    const updatedMeals = [meal, ...meals]
    setMeals(updatedMeals)
    if (mounted) {
      localStorage.setItem('contacal-meals', JSON.stringify(updatedMeals))
    }

    // Reset
    setSelectedFood(null)
    setFoodQuantity(100)
    setSearchQuery('')
    setActiveTab('dashboard')
  }

  // Função para tirar foto do prato
  const takePhotoOfPlate = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)
    
    // Simular análise de imagem (em produção, usaria API de reconhecimento)
    setTimeout(() => {
      const estimatedCalories = Math.floor(Math.random() * 400) + 200 // 200-600 kcal
      
      const meal: Meal = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        foods: [{
          name: 'Prato fotografado',
          quantity: 1,
          unit: 'porção',
          calories: estimatedCalories,
          protein: Math.round(estimatedCalories * 0.15 / 4), // ~15% proteína
          carbs: Math.round(estimatedCalories * 0.50 / 4), // ~50% carboidratos
          fat: Math.round(estimatedCalories * 0.35 / 9) // ~35% gordura
        }],
        totalCalories: estimatedCalories,
        mealType: selectedMealType,
        image: URL.createObjectURL(file)
      }

      const updatedMeals = [meal, ...meals]
      setMeals(updatedMeals)
      if (mounted) {
        localStorage.setItem('contacal-meals', JSON.stringify(updatedMeals))
      }

      setIsAnalyzing(false)
      setActiveTab('dashboard')
    }, 2000)
  }

  // Não renderizar até que o componente seja montado no cliente
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Apple className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Contacal
          </h1>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Renderizar Checkout Yampi
  if (showYampiCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900">
                Finalizar Assinatura Premium
              </h2>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-green-600 mb-4">🎉 Parabéns pela escolha!</h3>
                <p className="text-gray-700 mb-4">
                  Você está prestes a ter acesso completo ao Contacal Premium com todas as funcionalidades exclusivas.
                </p>
                
                <div className="space-y-2 text-left text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Meta calórica personalizada: <strong>{calculateCalorieGoal()} kcal/dia</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Scanner de código de barras</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Análise de fotos com IA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Planos alimentares personalizados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Suporte nutricional 24/7</span>
                  </div>
                </div>
              </div>

              {yampiLink ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-blue-800 font-medium mb-2">
                      🔗 Link de pagamento configurado!
                    </p>
                    <p className="text-sm text-blue-600">
                      Clique no botão abaixo para finalizar sua assinatura
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => window.open(yampiLink, '_blank')}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 text-lg font-bold"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Finalizar Pagamento - Yampi
                  </Button>
                </div>
              ) : (
                <div className="bg-orange-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-orange-800 mb-4">
                    ⚙️ Configuração Necessária
                  </h3>
                  <p className="text-orange-700 mb-4">
                    Para processar pagamentos, você precisa configurar seu link do Yampi.
                  </p>
                  <p className="text-sm text-orange-600 mb-4">
                    Entre em contato com o suporte para configurar sua integração de pagamento.
                  </p>
                  
                  <div className="space-y-3">
                    <Input
                      placeholder="Cole aqui seu link do Yampi (temporário para teste)"
                      value={yampiLink}
                      onChange={(e) => setYampiLink(e.target.value)}
                      className="text-sm"
                    />
                    
                    <Button
                      onClick={() => {
                        if (yampiLink.trim()) {
                          saveYampiLink(yampiLink.trim())
                        }
                      }}
                      disabled={!yampiLink.trim()}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Salvar Link Yampi
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={completeOnboarding}
                  className="w-full text-gray-600"
                >
                  Continuar com versão gratuita
                </Button>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>💳 Formas de pagamento:</strong></p>
                <p>PIX, Cartão de crédito/débito, Boleto</p>
                <p>Cancele quando quiser • Sem fidelidade • Garantia de 7 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Renderizar Tela de Configuração Personalizada
  if (showPersonalizedLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Configurando especialmente para você, {userProfile.nickname}!
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Objetivo: {userProfile.goal} • {userProfile.weight}kg → {userProfile.targetWeight}kg
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Meta calórica personalizada: {calculateCalorieGoal()} kcal/dia
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">
                    Motivação: {userProfile.motivation}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-lg text-gray-700">
                Analisando suas respostas e criando seu plano personalizado...
              </p>
              <p className="text-sm text-gray-500">
                Baseado em: {userProfile.experience}, {userProfile.activityLevel}, {userProfile.timeAvailable}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Renderizar Roleta de Desconto
  if (showDiscountWheel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 Última Chance!</h2>
            <p className="text-lg text-gray-600 mb-8">
              Gire a roleta e ganhe até <span className="font-bold text-purple-600">50% OFF</span> na sua primeira mensalidade!
            </p>

            <div className="relative w-64 h-64 mx-auto mb-8">
              <div 
                className={`w-full h-full rounded-full border-8 border-purple-500 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-2xl transition-transform duration-3000 ${isSpinning ? 'animate-spin' : ''}`}
                style={{ 
                  background: `conic-gradient(
                    #ef4444 0deg 40deg,
                    #f97316 40deg 80deg,
                    #eab308 80deg 120deg,
                    #22c55e 120deg 160deg,
                    #06b6d4 160deg 200deg,
                    #3b82f6 200deg 240deg,
                    #8b5cf6 240deg 280deg,
                    #ec4899 280deg 320deg,
                    #f43f5e 320deg 360deg
                  )`
                }}
              >
                {wheelDiscount > 0 ? `${wheelDiscount}% OFF` : '🎁'}
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-purple-600"></div>
              </div>
            </div>

            {wheelDiscount === 0 ? (
              <Button
                onClick={spinWheel}
                disabled={isSpinning}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 text-lg font-bold"
              >
                {isSpinning ? 'Girando...' : '🎰 GIRAR ROLETA'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
                  <h3 className="text-2xl font-bold text-green-600 mb-2">🎉 Parabéns!</h3>
                  <p className="text-lg text-gray-700">Você ganhou <span className="font-bold text-green-600">{wheelDiscount}% OFF</span>!</p>
                  <div className="text-3xl font-bold text-green-600 mt-2">
                    R$ {(29.99 * (1 - wheelDiscount/100)).toFixed(2)}/mês
                  </div>
                  <div className="text-sm text-gray-500 line-through">R$ 29,99/mês</div>
                </div>
                
                <Button
                  onClick={proceedToYampiCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 text-lg font-bold"
                >
                  Assinar com {wheelDiscount}% OFF - R$ {(29.99 * (1 - wheelDiscount/100)).toFixed(2)}/mês
                </Button>
                
                <Button
                  variant="outline"
                  onClick={completeOnboarding}
                  className="w-full"
                >
                  Não, obrigado
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Renderizar Oferta Premium
  if (showPremiumOffer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-10 h-10 text-white" />
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Configuração Personalizada Completa!</span>
                </div>
                <p className="text-xs text-gray-600">
                  Baseado no seu perfil: {userProfile.goal}, {userProfile.gender}, {userProfile.age} anos
                </p>
              </div>

              <h2 className="text-3xl font-bold text-gray-900">
                Seu plano está pronto, {userProfile.nickname}!
              </h2>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl space-y-4">
                <h3 className="text-xl font-bold text-gray-900">🚀 Contacal Premium</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Meta calórica personalizada: <strong>{calculateCalorieGoal()} kcal/dia</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Scanner de código de barras</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Análise de fotos de pratos com IA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Planos alimentares para {userProfile.goal}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Relatórios detalhados de progresso</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Receitas personalizadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Suporte nutricional 24/7</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Escolha seu plano:</h3>
                
                {/* Plano Mensal */}
                <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                  <div className="text-lg font-bold text-gray-900">1 Mês</div>
                  <div className="text-2xl font-bold text-orange-600">R$ 29,99</div>
                  <div className="text-sm text-gray-500">por mês</div>
                </div>

                {/* Plano Trimestral - MAIS POPULAR */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-300 relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">MAIS POPULAR</Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900">3 Meses</div>
                  <div className="text-2xl font-bold text-green-600">R$ 69,99</div>
                  <div className="text-sm text-gray-500">R$ 23,33/mês</div>
                  <div className="text-xs text-green-600 font-medium">Economize R$ 19,98!</div>
                </div>

                {/* Plano Anual - MELHOR OFERTA */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-300 relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white">MELHOR OFERTA</Badge>
                  </div>
                  <div className="text-lg font-bold text-gray-900">12 Meses</div>
                  <div className="text-2xl font-bold text-purple-600">R$ 119,99</div>
                  <div className="text-sm text-gray-500">R$ 9,99/mês</div>
                  <div className="text-xs text-purple-600 font-medium">Economize R$ 239,89!</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={proceedToYampiCheckout}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 text-lg font-bold"
                >
                  🚀 Escolher Plano Premium
                </Button>
                
                <Button
                  variant="outline"
                  onClick={skipPremium}
                  className="w-full text-gray-600"
                >
                  Talvez mais tarde
                </Button>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>💳 Formas de pagamento:</strong></p>
                <p>PIX, Cartão de crédito/débito, Boleto</p>
                <p>Cancele quando quiser • Sem fidelidade • Garantia de 7 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Renderizar Onboarding com 20 perguntas
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {/* Progresso */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Passo {onboardingStep} de 20</span>
                <span className="text-sm text-green-600 font-medium">{Math.round((onboardingStep / 20) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(onboardingStep / 20) * 100}%` }}
                />
              </div>
            </div>

            {/* Passo 1: Objetivo Principal */}
            {onboardingStep === 1 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é o seu objetivo principal?</h2>
                <p className="text-gray-600">Vamos personalizar sua experiência no Contacal</p>
                <div className="grid grid-cols-2 gap-4">
                  {['Emagrecer', 'Ganhar massa muscular', 'Manter peso', 'Melhorar saúde'].map((goal) => (
                    <Button
                      key={goal}
                      variant={userProfile.goal === goal.toLowerCase() ? "default" : "outline"}
                      className={`p-6 h-auto ${userProfile.goal === goal.toLowerCase() ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}`}
                      onClick={() => {
                        saveProfile({ goal: goal.toLowerCase() })
                        nextStep()
                      }}
                    >
                      <div className="text-center">
                        <div className="text-lg font-medium">{goal}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 2: Sexo Biológico */}
            {onboardingStep === 2 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é o seu sexo biológico?</h2>
                <p className="text-gray-600">Isso nos ajuda a calcular suas necessidades calóricas com precisão</p>
                <div className="grid grid-cols-2 gap-4">
                  {['Masculino', 'Feminino'].map((gender) => (
                    <Button
                      key={gender}
                      variant={userProfile.gender === gender.toLowerCase() ? "default" : "outline"}
                      className={`p-6 h-auto ${userProfile.gender === gender.toLowerCase() ? 'bg-gradient-to-r from-blue-500 to-purple-500' : ''}`}
                      onClick={() => {
                        saveProfile({ gender: gender.toLowerCase() })
                        nextStep()
                      }}
                    >
                      <div className="text-center">
                        <div className="text-lg font-medium">{gender}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 3: Idade */}
            {onboardingStep === 3 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é a sua idade?</h2>
                <p className="text-gray-600">Sua idade influencia no cálculo do metabolismo</p>
                <div className="max-w-xs mx-auto">
                  <Input
                    type="number"
                    placeholder="Digite sua idade"
                    value={userProfile.age || ''}
                    onChange={(e) => saveProfile({ age: Number(e.target.value) })}
                    className="text-center text-lg"
                  />
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!userProfile.age || userProfile.age < 16 || userProfile.age > 100}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Passo 4: Peso Atual */}
            {onboardingStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é o seu peso atual?</h2>
                <p className="text-gray-600">Em quilogramas (kg)</p>
                <div className="max-w-xs mx-auto">
                  <Input
                    type="number"
                    placeholder="Ex: 70"
                    value={userProfile.weight || ''}
                    onChange={(e) => saveProfile({ weight: Number(e.target.value) })}
                    className="text-center text-lg"
                  />
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!userProfile.weight || userProfile.weight < 30 || userProfile.weight > 300}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3"
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Passo 5: Altura */}
            {onboardingStep === 5 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é a sua altura?</h2>
                <p className="text-gray-600">Em centímetros (cm)</p>
                <div className="max-w-xs mx-auto">
                  <Input
                    type="number"
                    placeholder="Ex: 170"
                    value={userProfile.height || ''}
                    onChange={(e) => saveProfile({ height: Number(e.target.value) })}
                    className="text-center text-lg"
                  />
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!userProfile.height || userProfile.height < 100 || userProfile.height > 250}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-8 py-3"
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Passo 6: Peso Meta */}
            {onboardingStep === 6 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é o seu peso ideal?</h2>
                <p className="text-gray-600">O peso que você gostaria de atingir</p>
                <div className="max-w-xs mx-auto">
                  <Input
                    type="number"
                    placeholder="Ex: 65"
                    value={userProfile.targetWeight || ''}
                    onChange={(e) => saveProfile({ targetWeight: Number(e.target.value) })}
                    className="text-center text-lg"
                  />
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!userProfile.targetWeight || userProfile.targetWeight < 30 || userProfile.targetWeight > 300}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3"
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Passo 7: Nível de Atividade */}
            {onboardingStep === 7 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é o seu nível de atividade física?</h2>
                <p className="text-gray-600">Isso afeta diretamente suas necessidades calóricas</p>
                <div className="space-y-3">
                  {[
                    { key: 'sedentario', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                    { key: 'leve', label: 'Levemente ativo', desc: 'Exercício leve 1-3 dias/semana' },
                    { key: 'moderado', label: 'Moderadamente ativo', desc: 'Exercício moderado 3-5 dias/semana' },
                    { key: 'intenso', label: 'Muito ativo', desc: 'Exercício intenso 6-7 dias/semana' },
                    { key: 'muito_intenso', label: 'Extremamente ativo', desc: 'Exercício muito intenso, trabalho físico' }
                  ].map((activity) => (
                    <Button
                      key={activity.key}
                      variant={userProfile.activityLevel === activity.key ? "default" : "outline"}
                      className={`w-full p-4 h-auto text-left ${userProfile.activityLevel === activity.key ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : ''}`}
                      onClick={() => {
                        saveProfile({ activityLevel: activity.key })
                        nextStep()
                      }}
                    >
                      <div>
                        <div className="font-medium">{activity.label}</div>
                        <div className="text-sm opacity-70">{activity.desc}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 8: Como prefere ser chamado */}
            {onboardingStep === 8 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Como você gostaria de ser chamado(a)?</h2>
                <p className="text-gray-600">Vamos personalizar sua experiência!</p>
                <div className="max-w-xs mx-auto">
                  <Input
                    type="text"
                    placeholder="Digite seu nome ou apelido"
                    value={userProfile.nickname || ''}
                    onChange={(e) => saveProfile({ nickname: e.target.value })}
                    className="text-center text-lg"
                  />
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!userProfile.nickname || userProfile.nickname.length < 2}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3"
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Passo 9: Principal motivação */}
            {onboardingStep === 9 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">O que mais te motiva a {userProfile.goal}?</h2>
                <p className="text-gray-600">Sua motivação nos ajuda a te manter focado(a)</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Saúde e bem-estar',
                    'Autoestima',
                    'Roupas que não servem mais',
                    'Evento especial',
                    'Exemplo para família',
                    'Performance esportiva',
                    'Recomendação médica',
                    'Qualidade de vida'
                  ].map((motivation) => (
                    <Button
                      key={motivation}
                      variant={userProfile.motivation === motivation ? "default" : "outline"}
                      className={`p-4 h-auto text-sm ${userProfile.motivation === motivation ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : ''}`}
                      onClick={() => {
                        saveProfile({ motivation })
                        nextStep()
                      }}
                    >
                      {motivation}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 10: Experiência anterior */}
            {onboardingStep === 10 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é a sua experiência com dietas?</h2>
                <p className="text-gray-600">Isso nos ajuda a personalizar melhor seu plano</p>
                <div className="space-y-3">
                  {[
                    'Primeira vez tentando',
                    'Já tentei algumas vezes',
                    'Tenho bastante experiência',
                    'Sou expert no assunto'
                  ].map((exp) => (
                    <Button
                      key={exp}
                      variant={userProfile.experience === exp ? "default" : "outline"}
                      className={`w-full p-4 h-auto ${userProfile.experience === exp ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : ''}`}
                      onClick={() => {
                        saveProfile({ experience: exp })
                        nextStep()
                      }}
                    >
                      {exp}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 11: Maiores desafios */}
            {onboardingStep === 11 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Quais são seus maiores desafios?</h2>
                <p className="text-gray-600">Pode selecionar mais de uma opção</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Falta de tempo',
                    'Ansiedade/compulsão',
                    'Falta de motivação',
                    'Não sei cozinhar',
                    'Comer fora muito',
                    'Vida social ativa',
                    'Trabalho estressante',
                    'Família não colabora'
                  ].map((challenge) => (
                    <Button
                      key={challenge}
                      variant={userProfile.challenges?.includes(challenge) ? "default" : "outline"}
                      className={`p-3 h-auto text-sm ${userProfile.challenges?.includes(challenge) ? 'bg-gradient-to-r from-red-500 to-pink-500' : ''}`}
                      onClick={() => {
                        const currentChallenges = userProfile.challenges || []
                        const newChallenges = currentChallenges.includes(challenge)
                          ? currentChallenges.filter(c => c !== challenge)
                          : [...currentChallenges, challenge]
                        saveProfile({ challenges: newChallenges })
                      }}
                    >
                      {challenge}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!userProfile.challenges || userProfile.challenges.length === 0}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3"
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Passo 12: Tempo disponível */}
            {onboardingStep === 12 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Quanto tempo você tem por dia para se dedicar?</h2>
                <p className="text-gray-600">Para planejamento de refeições e exercícios</p>
                <div className="space-y-3">
                  {[
                    'Menos de 30 minutos',
                    '30 minutos a 1 hora',
                    '1 a 2 horas',
                    'Mais de 2 horas'
                  ].map((time) => (
                    <Button
                      key={time}
                      variant={userProfile.timeAvailable === time ? "default" : "outline"}
                      className={`w-full p-4 h-auto ${userProfile.timeAvailable === time ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : ''}`}
                      onClick={() => {
                        saveProfile({ timeAvailable: time })
                        nextStep()
                      }}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 13: Orçamento para alimentação */}
            {onboardingStep === 13 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é seu orçamento mensal para alimentação?</h2>
                <p className="text-gray-600">Isso nos ajuda a sugerir receitas adequadas</p>
                <div className="space-y-3">
                  {[
                    'Até R$ 300',
                    'R$ 300 - R$ 500',
                    'R$ 500 - R$ 800',
                    'Acima de R$ 800'
                  ].map((budget) => (
                    <Button
                      key={budget}
                      variant={userProfile.budget === budget ? "default" : "outline"}
                      className={`w-full p-4 h-auto ${userProfile.budget === budget ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}`}
                      onClick={() => {
                        saveProfile({ budget })
                        nextStep()
                      }}
                    >
                      {budget}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 14: Restrições alimentares */}
            {onboardingStep === 14 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
                  <Apple className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Você tem alguma restrição alimentar?</h2>
                <p className="text-gray-600">Pode selecionar mais de uma opção</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Nenhuma restrição',
                    'Vegetariano',
                    'Vegano',
                    'Sem glúten',
                    'Sem lactose',
                    'Diabético',
                    'Hipertensão',
                    'Outras alergias'
                  ].map((restriction) => (
                    <Button
                      key={restriction}
                      variant={userProfile.restrictions?.includes(restriction) ? "default" : "outline"}
                      className={`p-3 h-auto text-sm ${userProfile.restrictions?.includes(restriction) ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : ''}`}
                      onClick={() => {
                        const currentRestrictions = userProfile.restrictions || []
                        const newRestrictions = currentRestrictions.includes(restriction)
                          ? currentRestrictions.filter(r => r !== restriction)
                          : [...currentRestrictions, restriction]
                        saveProfile({ restrictions: newRestrictions })
                      }}
                    >
                      {restriction}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!userProfile.restrictions || userProfile.restrictions.length === 0}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-8 py-3"
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Passo 15: Comida favorita */}
            {onboardingStep === 15 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é sua refeição favorita?</h2>
                <p className="text-gray-600">Vamos incluir opções similares no seu plano</p>
                <div className="max-w-xs mx-auto">
                  <Input
                    type="text"
                    placeholder="Ex: Pizza, Lasanha, Sushi..."
                    value={userProfile.favoriteFood || ''}
                    onChange={(e) => saveProfile({ favoriteFood: e.target.value })}
                    className="text-center text-lg"
                  />
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!userProfile.favoriteFood || userProfile.favoriteFood.length < 2}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
                >
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Passo 16: Preferência de refeições */}
            {onboardingStep === 16 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Você prefere refeições caseiras ou de restaurante?</h2>
                <p className="text-gray-600">Isso influencia nas sugestões que faremos</p>
                <div className="space-y-3">
                  {[
                    'Prefiro cozinhar em casa',
                    'Gosto de ambos',
                    'Prefiro comer fora',
                    'Depende da ocasião'
                  ].map((preference) => (
                    <Button
                      key={preference}
                      variant={userProfile.mealPreference === preference ? "default" : "outline"}
                      className={`w-full p-4 h-auto ${userProfile.mealPreference === preference ? 'bg-gradient-to-r from-teal-500 to-green-500' : ''}`}
                      onClick={() => {
                        saveProfile({ mealPreference: preference })
                        nextStep()
                      }}
                    >
                      {preference}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 17: Maior motivador */}
            {onboardingStep === 17 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é o seu maior motivador para atingir sua meta?</h2>
                <p className="text-gray-600">Isso nos ajuda a criar mensagens personalizadas</p>
                <div className="space-y-3">
                  {[
                    'Ver resultados na balança',
                    'Sentir-me mais confiante',
                    'Melhorar minha saúde',
                    'Usar roupas que quero',
                    'Ser exemplo para outros',
                    'Ter mais energia'
                  ].map((motivator) => (
                    <Button
                      key={motivator}
                      variant={userProfile.biggestMotivator === motivator ? "default" : "outline"}
                      className={`w-full p-4 h-auto text-sm ${userProfile.biggestMotivator === motivator ? 'bg-gradient-to-r from-pink-500 to-purple-500' : ''}`}
                      onClick={() => {
                        saveProfile({ biggestMotivator: motivator })
                        nextStep()
                      }}
                    >
                      {motivator}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 18: Plano rigoroso */}
            {onboardingStep === 18 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Você está disposto(a) a seguir um plano alimentar rigoroso?</h2>
                <p className="text-gray-600">Isso define o nível de flexibilidade do seu plano</p>
                <div className="space-y-3">
                  {[
                    'Sim, quero resultados rápidos',
                    'Moderadamente rigoroso',
                    'Prefiro flexibilidade',
                    'Muito flexível, sem pressão'
                  ].map((strictness) => (
                    <Button
                      key={strictness}
                      variant={userProfile.strictPlan === strictness ? "default" : "outline"}
                      className={`w-full p-4 h-auto text-sm ${userProfile.strictPlan === strictness ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : ''}`}
                      onClick={() => {
                        saveProfile({ strictPlan: strictness })
                        nextStep()
                      }}
                    >
                      {strictness}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 19: Dicas de exercícios */}
            {onboardingStep === 19 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Você gostaria de receber dicas de exercícios físicos?</h2>
                <p className="text-gray-600">Podemos complementar sua dieta com sugestões de atividades</p>
                <div className="space-y-3">
                  {[
                    'Sim, adoro exercícios!',
                    'Sim, mas exercícios leves',
                    'Talvez, se for fácil',
                    'Não, só quero focar na dieta'
                  ].map((exercise) => (
                    <Button
                      key={exercise}
                      variant={userProfile.exerciseTips === exercise ? "default" : "outline"}
                      className={`w-full p-4 h-auto text-sm ${userProfile.exerciseTips === exercise ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : ''}`}
                      onClick={() => {
                        saveProfile({ exerciseTips: exercise })
                        nextStep()
                      }}
                    >
                      {exercise}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 20: Maior tentação */}
            {onboardingStep === 20 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Qual é a sua maior tentação alimentar?</h2>
                <p className="text-gray-600">Vamos te ajudar a lidar com isso de forma saudável</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Doces e sobremesas',
                    'Salgadinhos',
                    'Fast food',
                    'Refrigerantes',
                    'Pão e massas',
                    'Chocolate',
                    'Bebidas alcoólicas',
                    'Comida de festa'
                  ].map((temptation) => (
                    <Button
                      key={temptation}
                      variant={userProfile.biggestTemptation === temptation ? "default" : "outline"}
                      className={`p-3 h-auto text-sm ${userProfile.biggestTemptation === temptation ? 'bg-gradient-to-r from-red-500 to-pink-500' : ''}`}
                      onClick={() => {
                        saveProfile({ biggestTemptation: temptation })
                        nextStep()
                      }}
                    >
                      {temptation}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const caloriesProgress = (getTotalCaloriesToday() / (userProfile.dailyCalorieGoal || 2000)) * 100
  const macros = getTotalMacrosToday()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Contacal
                </h1>
                <p className="text-sm text-gray-600">
                  {userProfile.nickname ? `Olá, ${userProfile.nickname}!` : 'Contador de calorias'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {getTotalCaloriesToday()}/{userProfile.dailyCalorieGoal || 2000} kcal
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-white">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </TabsTrigger>
            <TabsTrigger value="diary" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">Diário</span>
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Progresso</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Resumo de Calorias */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                    <div 
                      className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent transform -rotate-90"
                      style={{ 
                        background: `conic-gradient(from 0deg, #10b981 ${caloriesProgress * 3.6}deg, transparent ${caloriesProgress * 3.6}deg)`,
                        borderRadius: '50%'
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{getTotalCaloriesToday()}</div>
                        <div className="text-sm text-gray-600">kcal</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Restam {Math.max(0, (userProfile.dailyCalorieGoal || 2000) - getTotalCaloriesToday())} kcal</p>
                    <p className="text-sm text-gray-600">Meta: {userProfile.dailyCalorieGoal || 2000} kcal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Macronutrientes */}
            <Card>
              <CardHeader>
                <CardTitle>Macronutrientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Proteína</span>
                    <span className="text-sm text-gray-600">{Math.round(macros.protein)}g</span>
                  </div>
                  <Progress value={(macros.protein / 150) * 100} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Carboidratos</span>
                    <span className="text-sm text-gray-600">{Math.round(macros.carbs)}g</span>
                  </div>
                  <Progress value={(macros.carbs / 250) * 100} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Gordura</span>
                    <span className="text-sm text-gray-600">{Math.round(macros.fat)}g</span>
                  </div>
                  <Progress value={(macros.fat / 65) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Refeições de Hoje */}
            <Card>
              <CardHeader>
                <CardTitle>Refeições de Hoje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                  const Icon = getMealIcon(mealType)
                  const calories = getMealCalories(mealType)
                  return (
                    <div key={mealType} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium">{getMealName(mealType)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{calories} kcal</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedMealType(mealType as any)
                            setActiveTab('add')
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diary Tab */}
          <TabsContent value="diary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Diário Alimentar</CardTitle>
              </CardHeader>
              <CardContent>
                {getTodayMeals().length === 0 ? (
                  <div className="text-center py-12">
                    <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Nenhuma refeição registrada hoje</p>
                    <p className="text-gray-400">Comece adicionando sua primeira refeição!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getTodayMeals().map((meal) => (
                      <Card key={meal.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const Icon = getMealIcon(meal.mealType)
                                return <Icon className="w-5 h-5 text-gray-600" />
                              })()}
                              <div>
                                <p className="font-medium text-gray-900">{getMealName(meal.mealType)}</p>
                                <p className="text-sm text-gray-600">{meal.time}</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              {meal.totalCalories} kcal
                            </Badge>
                          </div>
                          
                          {meal.image && (
                            <div className="mb-3">
                              <img src={meal.image} alt="Prato fotografado" className="w-full h-32 object-cover rounded-lg" />
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            {meal.foods.map((food, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  {food.name} ({food.quantity}{food.unit})
                                </span>
                                <span className="text-gray-600">{food.calories} kcal</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Food Tab */}
          <TabsContent value="add" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Alimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Seletor de Refeição */}
                <div>
                  <Label>Tipo de Refeição</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { type: 'breakfast', name: 'Café da Manhã', icon: Coffee },
                      { type: 'lunch', name: 'Almoço', icon: Utensils },
                      { type: 'dinner', name: 'Jantar', icon: Sandwich },
                      { type: 'snack', name: 'Lanche', icon: Apple }
                    ].map(({ type, name, icon: Icon }) => (
                      <Button
                        key={type}
                        variant={selectedMealType === type ? "default" : "outline"}
                        className="justify-start gap-2"
                        onClick={() => setSelectedMealType(type as any)}
                      >
                        <Icon className="w-4 h-4" />
                        {name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Opção de Foto */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">📸 Tire uma foto do seu prato!</h3>
                  <p className="text-sm text-blue-700 mb-3">Nossa IA analisa automaticamente as calorias</p>
                  <Button
                    onClick={takePhotoOfPlate}
                    disabled={isAnalyzing}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {isAnalyzing ? 'Analisando foto...' : 'Fotografar Prato'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <Separator />

                {/* Busca de Alimentos */}
                <div>
                  <Label>Buscar Alimento</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Digite o nome do alimento..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Lista de Alimentos */}
                {searchQuery && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {getFilteredFoods().map((foodName) => {
                      const foodData = nutritionDB[foodName]
                      return (
                        <div
                          key={foodName}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedFood?.name === foodName 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedFood({ name: foodName, ...foodData })}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900 capitalize">{foodName}</p>
                              <p className="text-sm text-gray-600">
                                {foodData.calories} kcal • P: {foodData.protein}g • C: {foodData.carbs}g • G: {foodData.fat}g
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Quantidade */}
                {selectedFood && (
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                    <div>
                      <Label>Quantidade (gramas)</Label>
                      <Input
                        type="number"
                        value={foodQuantity}
                        onChange={(e) => setFoodQuantity(Number(e.target.value))}
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Calorias</p>
                        <p className="font-bold text-green-600">
                          {Math.round((selectedFood.calories * foodQuantity) / 100)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Proteína</p>
                        <p className="font-bold text-blue-600">
                          {Math.round((selectedFood.protein * foodQuantity) / 100 * 10) / 10}g
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Carboidratos</p>
                        <p className="font-bold text-orange-600">
                          {Math.round((selectedFood.carbs * foodQuantity) / 100 * 10) / 10}g
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Gordura</p>
                        <p className="font-bold text-red-600">
                          {Math.round((selectedFood.fat * foodQuantity) / 100 * 10) / 10}g
                        </p>
                      </div>
                    </div>

                    <Button 
                      onClick={addFoodToMeal}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      Adicionar ao {getMealName(selectedMealType)}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progresso Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Gráficos de progresso</p>
                  <p className="text-gray-400">Continue registrando suas refeições para ver seu progresso!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center pb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{userProfile.nickname || 'Usuário'}</h3>
                  <p className="text-gray-600 capitalize">Objetivo: {userProfile.goal}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Meta Diária</p>
                    <p className="text-xl font-bold text-green-600">{userProfile.dailyCalorieGoal} kcal</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Hoje</p>
                    <p className="text-xl font-bold text-blue-600">{getTotalCaloriesToday()} kcal</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Peso Atual</p>
                    <p className="text-xl font-bold text-purple-600">{userProfile.weight} kg</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Meta</p>
                    <p className="text-xl font-bold text-orange-600">{userProfile.targetWeight} kg</p>
                  </div>
                </div>

                {/* Configuração do Link Yampi */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Configuração de Pagamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="yampi-link" className="text-green-700">Link do Yampi para Checkout</Label>
                      <Input
                        id="yampi-link"
                        placeholder="Cole aqui seu link do Yampi"
                        value={yampiLink}
                        onChange={(e) => setYampiLink(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={() => {
                        if (yampiLink.trim()) {
                          saveYampiLink(yampiLink.trim())
                          alert('Link do Yampi salvo com sucesso!')
                        }
                      }}
                      disabled={!yampiLink.trim()}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Salvar Link do Yampi
                    </Button>
                    {yampiLink && (
                      <div className="bg-green-100 p-3 rounded-lg">
                        <p className="text-sm text-green-700">
                          ✅ Link configurado! Agora os usuários podem finalizar pagamentos através do seu checkout Yampi.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    localStorage.removeItem('contacal-profile')
                    localStorage.removeItem('contacal-meals')
                    localStorage.removeItem('contacal-yampi-link')
                    window.location.reload()
                  }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Redefinir Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}