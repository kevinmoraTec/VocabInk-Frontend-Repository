import { BrandIcon } from '@/components/BrandIcon';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Languages, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Hash,
  MapPin,
  Calendar,
  Globe,
  PenLine,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { 
  ENGLISH_LEVELS, 
  PROFESSIONAL_ROLES, 
  WRITING_TOPICS, 
  DISCOVERY_SOURCES,
  POST_FREQUENCIES,
  SUPPORTED_LANGUAGES
} from '@/utils/constants';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { LinkedInConnect } from '@/components/LinkedInConnect';
import { useTranslations, type AppLanguage } from '@/i18n';

const ONBOARDING_STORAGE_KEY = 'vocabink_onboarding_progress';

const translations = {
  en: {
    stepLanguage: 'Language',
    stepEnglishLevel: 'English Level',
    stepRole: 'Your Role',
    stepTopics: 'Topics',
    stepDiscovery: 'How You Found Us',
    stepFrequency: 'Post Frequency',
    stepLinkedIn: 'LinkedIn',
    chooseLanguageTitle: 'Choose your language',
    chooseLanguageDescription: 'This will be used for the app interface',
    useSameLanguage: 'Use same language for posts',
    differentLanguage: 'Want to publish posts in a different language?',
    contentLanguageTitle: 'In which language do you want to publish your posts?',
    englishLevelTitle: "What's your current English level?",
    englishLevelDescription: 'This helps us tailor the vocabulary suggestions for you.',
    roleTitle: "What's your professional role?",
    roleDescription: "We'll customize content templates based on your expertise.",
    topicsTitle: 'What topics do you want to write about?',
    topicsDescription: 'Select all that interest you. You can change this later.',
    discoveryTitle: 'How did you find us?',
    discoveryDescription: 'This helps us understand where our community comes from.',
    frequencyTitle: 'How often do you want to post?',
    frequencyDescription: "We'll help you stay consistent with reminders.",
    linkedInTitle: 'Connect your LinkedIn',
    linkedInDescription: 'Link your LinkedIn account to publish posts directly from VocabInk.',
    linkedInSkip: 'You can skip this step and connect later from Settings.',
    back: 'Back',
    continue: 'Continue',
    saving: 'Saving...',
    completeSetup: 'Complete Setup',
    authErrorTitle: 'Authentication Error',
    authErrorDescription: 'User not found. Please log in again.',
    onboardingSuccessTitle: 'Welcome to VocabInk! 🎉',
    onboardingSuccessDescription: 'Your profile has been set up successfully.',
    onboardingErrorTitle: 'Something went wrong',
    onboardingErrorDescription: 'Failed to save your preferences. Please try again.',
  },
  es: {
    stepLanguage: 'Idioma',
    stepEnglishLevel: 'Nivel de inglés',
    stepRole: 'Tu rol',
    stepTopics: 'Temas',
    stepDiscovery: 'Cómo nos encontraste',
    stepFrequency: 'Frecuencia de publicaciones',
    stepLinkedIn: 'LinkedIn',
    chooseLanguageTitle: 'Elige tu idioma',
    chooseLanguageDescription: 'Se usará para la interfaz de la app',
    useSameLanguage: 'Usar el mismo idioma para publicaciones',
    differentLanguage: '¿Quieres publicar en un idioma distinto?',
    contentLanguageTitle: '¿En qué idioma quieres publicar tus posts?',
    englishLevelTitle: '¿Cuál es tu nivel de inglés?',
    englishLevelDescription: 'Esto nos ayuda a personalizar sugerencias de vocabulario.',
    roleTitle: '¿Cuál es tu rol profesional?',
    roleDescription: 'Personalizaremos las plantillas según tu experiencia.',
    topicsTitle: '¿Sobre qué temas quieres escribir?',
    topicsDescription: 'Selecciona los que te interesen. Puedes cambiarlo después.',
    discoveryTitle: '¿Cómo nos encontraste?',
    discoveryDescription: 'Esto nos ayuda a entender de dónde viene nuestra comunidad.',
    frequencyTitle: '¿Con qué frecuencia quieres publicar?',
    frequencyDescription: 'Te ayudaremos a mantener la constancia con recordatorios.',
    linkedInTitle: 'Conecta tu LinkedIn',
    linkedInDescription: 'Vincula tu cuenta de LinkedIn para publicar directamente desde VocabInk.',
    linkedInSkip: 'Puedes omitir este paso y conectarlo después desde Configuración.',
    back: 'Atrás',
    continue: 'Continuar',
    saving: 'Guardando...',
    completeSetup: 'Completar configuración',
    authErrorTitle: 'Error de autenticación',
    authErrorDescription: 'Usuario no encontrado. Inicia sesión nuevamente.',
    onboardingSuccessTitle: '¡Bienvenido a VocabInk! 🎉',
    onboardingSuccessDescription: 'Tu perfil se configuró correctamente.',
    onboardingErrorTitle: 'Algo salió mal',
    onboardingErrorDescription: 'No se pudieron guardar tus preferencias. Inténtalo de nuevo.',
  },
} satisfies Record<AppLanguage, Record<string, string>>;

const steps = [
  { id: 1, titleKey: 'stepLanguage', icon: Globe },
  { id: 2, titleKey: 'stepEnglishLevel', icon: GraduationCap },
  { id: 3, titleKey: 'stepRole', icon: Briefcase },
  { id: 4, titleKey: 'stepTopics', icon: Hash },
  { id: 5, titleKey: 'stepDiscovery', icon: MapPin },
  { id: 6, titleKey: 'stepFrequency', icon: Calendar },
  { id: 7, titleKey: 'stepLinkedIn', icon: Linkedin },
];

const englishLevelsByLanguage = {
  en: {
    beginner: {
      label: 'Beginner',
      description: 'Just starting to learn English',
    },
    intermediate: {
      label: 'Intermediate',
      description: 'Can communicate but need practice',
    },
    advanced: {
      label: 'Advanced',
      description: 'Fluent but want to refine vocabulary',
    },
  },
  es: {
    beginner: {
      label: 'Principiante',
      description: 'Recién comienzas a aprender inglés',
    },
    intermediate: {
      label: 'Intermedio',
      description: 'Puedes comunicarte pero necesitas práctica',
    },
    advanced: {
      label: 'Avanzado',
      description: 'Fluido, pero quieres mejorar vocabulario',
    },
  },
} as const;

const postFrequenciesByLanguage = {
  en: {
    daily: { label: 'Daily', description: 'Post every day' },
    '3x-week': { label: '3x per week', description: 'Post 3 times a week' },
    weekly: { label: 'Weekly', description: 'Post once a week' },
  },
  es: {
    daily: { label: 'Diario', description: 'Publica todos los días' },
    '3x-week': { label: '3x por semana', description: 'Publica 3 veces por semana' },
    weekly: { label: 'Semanal', description: 'Publica una vez por semana' },
  },
} as const;

const discoverySourcesByLanguage = {
  en: {
    LinkedIn: 'LinkedIn',
    'Twitter/X': 'Twitter/X',
    'Friend Referral': 'Friend Referral',
    'Google Search': 'Google Search',
    YouTube: 'YouTube',
    Other: 'Other',
  },
  es: {
    LinkedIn: 'LinkedIn',
    'Twitter/X': 'Twitter/X',
    'Friend Referral': 'Recomendación de un amigo',
    'Google Search': 'Búsqueda en Google',
    YouTube: 'YouTube',
    Other: 'Otro',
  },
} as const;

const writingTopicsByLanguage = {
  en: {
    backend: 'Backend Development',
    frontend: 'Frontend Development',
    cloud: 'Cloud & Infrastructure',
    'ai-ml': 'AI & Machine Learning',
    devops: 'DevOps & CI/CD',
    data: 'Data & Analytics',
    cybersecurity: 'Cybersecurity',
    career: 'Career Growth',
    leadership: 'Leadership',
    productivity: 'Productivity & Tools',
    'personal-branding': 'Personal Branding',
    networking: 'Networking & Community',
    healthcare: 'Healthcare & Medicine',
    finance: 'Finance & Business',
    marketing: 'Marketing & Sales',
    education: 'Education & Learning',
    entrepreneurship: 'Entrepreneurship',
    legal: 'Legal & Compliance',
  },
  es: {
    backend: 'Desarrollo backend',
    frontend: 'Desarrollo frontend',
    cloud: 'Cloud e infraestructura',
    'ai-ml': 'IA y aprendizaje automático',
    devops: 'DevOps y CI/CD',
    data: 'Datos y analítica',
    cybersecurity: 'Ciberseguridad',
    career: 'Crecimiento profesional',
    leadership: 'Liderazgo',
    productivity: 'Productividad y herramientas',
    'personal-branding': 'Marca personal',
    networking: 'Networking y comunidad',
    healthcare: 'Salud y medicina',
    finance: 'Finanzas y negocios',
    marketing: 'Marketing y ventas',
    education: 'Educación y aprendizaje',
    entrepreneurship: 'Emprendimiento',
    legal: 'Legal y cumplimiento',
  },
} as const;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, completeOnboarding } = useAuthStore();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    appLanguage: '',
    contentLanguage: '',
    englishLevel: '',
    role: '',
    topics: [] as string[],
    source: '',
    postFrequency: '',
    linkedinConnected: false,
  });

  const { t, language } = useTranslations(
    translations,
    formData.appLanguage || user?.profileConfig?.appLanguage
  );

  const [showContentLanguage, setShowContentLanguage] = useState(false);

  // Restore progress from sessionStorage on mount and handle LinkedIn callback
  useEffect(() => {
    const savedProgress = sessionStorage.getItem(ONBOARDING_STORAGE_KEY);
    const linkedinConnected = searchParams.get('linkedin') === 'connected';
    
    if (savedProgress) {
      try {
        const { step, data } = JSON.parse(savedProgress);
        setFormData(data);
        
        // If returning from LinkedIn OAuth, go to step 7
        if (linkedinConnected) {
          setCurrentStep(7);
          setFormData(prev => ({ ...prev, linkedinConnected: true }));
        } else {
          setCurrentStep(step);
        }
      } catch (e) {
        console.error('Failed to restore onboarding progress:', e);
      }
    }
  }, [searchParams]);

  // Save progress to sessionStorage whenever step or formData changes
  useEffect(() => {
    if (currentStep > 1 || formData.appLanguage) {
      sessionStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({ step: currentStep, data: formData })
      );
    }
  }, [currentStep, formData]);

  // Clear storage when onboarding is complete
  const clearOnboardingProgress = () => {
    sessionStorage.removeItem(ONBOARDING_STORAGE_KEY);
  };

  const handleNext = async () => {
    if (currentStep < 7) {
      // Skip English level step if content language is not English
      if (currentStep === 1 && formData.contentLanguage !== 'en') {
        setCurrentStep(3); // Skip to role
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Check if user exists
      if (!user?.id) {
        toast({
          title: t('authErrorTitle'),
          description: t('authErrorDescription'),
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      // Build the onboarding payload
      const onboardingPayload = {
        appLanguage: formData.appLanguage,
        contentLanguage: formData.contentLanguage,
        englishLevel: formData.contentLanguage === 'en' ? formData.englishLevel : null,
        role: formData.role,
        topics: formData.topics,
        source: formData.source,
        postFrequency: formData.postFrequency,
      };

      // 👇 Console.log to see the structure
      console.log('📦 Onboarding Payload:', JSON.stringify(onboardingPayload, null, 2));
      console.log('👤 User ID:', user.id);

      setIsSubmitting(true);

      try {
        // Send to backend using axios PATCH with user ID
        const response = await api.patch(`/v1/users/onboarding/${user.id}`, onboardingPayload);

        console.log('✅ Onboarding saved successfully:', response.data);

        // Update local state
        completeOnboarding({
          appLanguage: formData.appLanguage,
          contentLanguage: formData.contentLanguage,
          englishLevel: formData.contentLanguage === 'en' 
            ? formData.englishLevel as 'beginner' | 'intermediate' | 'advanced' 
            : undefined,
          role: formData.role,
          topics: formData.topics,
          source: formData.source,
          postFrequency: formData.postFrequency,
        });

        // Clear saved progress from sessionStorage
        clearOnboardingProgress();

        toast({
          title: t('onboardingSuccessTitle'),
          description: t('onboardingSuccessDescription'),
        });

        navigate('/dashboard');
      } catch (error) {
        console.error('❌ Onboarding failed:', error);
        toast({
          title: t('onboardingErrorTitle'),
          description: t('onboardingErrorDescription'),
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Skip English level step when going back if content language is not English
      if (currentStep === 3 && formData.contentLanguage !== 'en') {
        setCurrentStep(1);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.appLanguage !== '' && formData.contentLanguage !== '';
      case 2: return formData.contentLanguage !== 'en' || formData.englishLevel !== '';
      case 3: return formData.role !== '';
      case 4: return formData.topics.length > 0;
      case 5: return formData.source !== '';
      case 6: return formData.postFrequency !== '';
      case 7: return true; // LinkedIn connection is optional
      default: return false;
    }
  };

  const handleAppLanguageSelect = (code: string) => {
    setFormData({ 
      ...formData, 
      appLanguage: code,
      contentLanguage: showContentLanguage ? formData.contentLanguage : code 
    });
  };

  const toggleTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <BrandIcon />
          <span className="text-2xl font-bold text-foreground">
            VocabInk
          </span>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  currentStep > step.id
                    ? "bg-success text-success-foreground"
                    : currentStep === step.id
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-1 mx-1 rounded-full transition-all duration-300",
                    currentStep > step.id ? "bg-success" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step 1: Language Selection */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-primary" />
                        <h2 className="text-2xl font-bold text-foreground">
                          {t('chooseLanguageTitle')}
                        </h2>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        {t('chooseLanguageDescription')}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleAppLanguageSelect(lang.code)}
                            className={cn(
                              "p-4 rounded-xl border-2 text-center transition-all duration-200",
                              formData.appLanguage === lang.code
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <span className="text-3xl block mb-2">{lang.flag}</span>
                            <p className="font-medium text-foreground">{lang.nativeLabel}</p>
                            {formData.appLanguage === lang.code && (
                              <CheckCircle2 className="w-4 h-4 text-primary mx-auto mt-2" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Content Language (optional toggle) */}
                    {formData.appLanguage && (
                      <div className="pt-4 border-t">
                        <button
                          onClick={() => {
                            setShowContentLanguage(!showContentLanguage);
                            if (showContentLanguage) {
                              setFormData({ ...formData, contentLanguage: formData.appLanguage });
                            }
                          }}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <PenLine className="w-4 h-4" />
                          {showContentLanguage ? t('useSameLanguage') : t('differentLanguage')}
                        </button>

                        {showContentLanguage && (
                          <div className="mt-4 p-4 bg-muted/30 rounded-xl">
                            <p className="text-sm font-medium text-foreground mb-3">
                              {t('contentLanguageTitle')}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {SUPPORTED_LANGUAGES.map((lang) => (
                                <button
                                  key={lang.code}
                                  onClick={() => setFormData({ ...formData, contentLanguage: lang.code })}
                                  className={cn(
                                    "p-3 rounded-lg border-2 text-center transition-all duration-200",
                                    formData.contentLanguage === lang.code
                                      ? "border-primary bg-primary/10"
                                      : "border-border hover:border-primary/50"
                                  )}
                                >
                                  <span className="text-xl">{lang.flag}</span>
                                  <p className="text-sm font-medium mt-1">{lang.nativeLabel}</p>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: English Level (only if content language is English) */}
                {currentStep === 2 && formData.contentLanguage === 'en' && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {t('englishLevelTitle')}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {t('englishLevelDescription')}
                    </p>
                    <div className="space-y-3">
                      {ENGLISH_LEVELS.map((level) => {
                        const localizedLevel =
                          englishLevelsByLanguage[language]?.[
                            level.value as keyof typeof englishLevelsByLanguage.en
                          ];

                        return (
                          <button
                            key={level.value}
                            onClick={() => setFormData({ ...formData, englishLevel: level.value })}
                            className={cn(
                              "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                              formData.englishLevel === level.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <p className="font-semibold text-foreground">
                              {localizedLevel?.label || level.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {localizedLevel?.description || level.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 3: Professional Role */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {t('roleTitle')}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {t('roleDescription')}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {PROFESSIONAL_ROLES.map((role) => (
                        <button
                          key={role}
                          onClick={() => setFormData({ ...formData, role })}
                          className={cn(
                            "p-3 rounded-xl border-2 text-left transition-all duration-200",
                            formData.role === role
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <p className="font-medium text-foreground text-sm">{role}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: Topics */}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {t('topicsTitle')}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {t('topicsDescription')}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {WRITING_TOPICS.map((topic) => (
                        <button
                          key={topic.value}
                          onClick={() => toggleTopic(topic.value)}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3",
                            formData.topics.includes(topic.value)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div
                            className={cn(
                              "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                              formData.topics.includes(topic.value)
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                            )}
                          >
                            {formData.topics.includes(topic.value) && (
                              <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="font-medium text-foreground">
                            {writingTopicsByLanguage[language]?.[
                              topic.value as keyof typeof writingTopicsByLanguage.en
                            ] || topic.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 5: Discovery Source */}
                {currentStep === 5 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {t('discoveryTitle')}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {t('discoveryDescription')}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {DISCOVERY_SOURCES.map((source) => (
                        <button
                          key={source}
                          onClick={() => setFormData({ ...formData, source })}
                          className={cn(
                            "p-4 rounded-xl border-2 text-center transition-all duration-200",
                            formData.source === source
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <p className="font-medium text-foreground">
                            {discoverySourcesByLanguage[language]?.[
                              source as keyof typeof discoverySourcesByLanguage.en
                            ] || source}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 6: Post Frequency */}
                {currentStep === 6 && (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {t('frequencyTitle')}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {t('frequencyDescription')}
                    </p>
                    <div className="space-y-3">
                      {POST_FREQUENCIES.map((freq) => {
                        const localizedFrequency = postFrequenciesByLanguage[language]?.[
                          freq.value as keyof typeof postFrequenciesByLanguage.en
                        ];

                        return (
                          <button
                            key={freq.value}
                            onClick={() => setFormData({ ...formData, postFrequency: freq.value })}
                            className={cn(
                              "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                              formData.postFrequency === freq.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <p className="font-semibold text-foreground">
                              {localizedFrequency?.label || freq.label}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {localizedFrequency?.description || freq.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 7: LinkedIn Connection */}
                {currentStep === 7 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                      <h2 className="text-2xl font-bold text-foreground">
                        {t('linkedInTitle')}
                      </h2>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      {t('linkedInDescription')}
                    </p>
                    <LinkedInConnect
                      onConnectionChange={(connected) => 
                        setFormData({ ...formData, linkedinConnected: connected })
                      }
                      onConnected={() => {
                        // Auto-submit onboarding when LinkedIn is connected
                        handleNext();
                      }}
                      showDisconnect={false}
                    />
                    <p className="text-sm text-muted-foreground mt-4">
                      {t('linkedInSkip')}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('back')}
              </Button>
              <Button
                variant="gradient"
                onClick={handleNext}
                disabled={!canProceed() || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  t('saving')
                ) : currentStep === 7 ? (
                  t('completeSetup')
                ) : (
                  t('continue')
                )}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
