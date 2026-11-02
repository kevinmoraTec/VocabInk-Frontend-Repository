import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  ArrowRight,
  CheckCircle2,
  Linkedin,
  Zap,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from '@/i18n';

const translations = {
  en: {
    heroTagline: 'For developers who want to shine on LinkedIn',
    heroTitleLine1: 'Build Your Brand While',
    heroTitleLine2: 'Mastering English',
    heroDescription:
      'VocabInk helps developers create engaging LinkedIn content while expanding their professional vocabulary. Learn by doing, grow by sharing.',
    startFreeToday: 'Start Free Today',
    seeHowItWorks: 'See How It Works',
    sampleName: 'John Developer',
    sampleRole: 'Full Stack Developer | Building cool stuff',
    samplePost:
      "Today I learned about idempotency while working on our payment system. Here's what made it click: 💡\n\n1️⃣ It ensures the same request can be safely retried without side effects\n2️⃣ Critical for payment APIs - nobody wants duplicate charges!\n\nHave you implemented idempotent APIs? Share your experience! 👇",
    featuresTitle: 'Everything You Need to',
    featuresHighlight: 'Level Up',
    featuresDescription:
      'A simple workflow designed specifically for developers who want to improve their English while building their professional presence.',
    howItWorksTitle: 'Simple as',
    howItWorksHighlight: '1-2-3',
    howItWorksDescription: 'From saving a new word to publishing a polished post in minutes.',
    benefitsTagline: 'Why VocabInk?',
    benefitsTitle: 'Learn Faster by',
    benefitsHighlight: 'Creating Content',
    benefitsDescription:
      'The best way to remember new vocabulary is to use it in context. VocabInk turns learning into action by helping you create real content for your professional network.',
  },
  es: {
    heroTagline: 'Para desarrolladores que quieren brillar en LinkedIn',
    heroTitleLine1: 'Construye tu marca mientras',
    heroTitleLine2: 'dominas el inglés',
    heroDescription:
      'VocabInk ayuda a desarrolladores a crear contenido atractivo en LinkedIn mientras amplían su vocabulario profesional. Aprende haciendo, crece compartiendo.',
    startFreeToday: 'Comenzar gratis',
    seeHowItWorks: 'Ver cómo funciona',
    sampleName: 'Juan Desarrollador',
    sampleRole: 'Desarrollador Full Stack | Construyendo cosas geniales',
    samplePost:
      'Hoy aprendí sobre la idempotencia mientras trabajaba en nuestro sistema de pagos. Esto fue lo que lo hizo claro: 💡\n\n1️⃣ Permite reintentar la misma solicitud sin efectos secundarios\n2️⃣ Es clave para APIs de pago: ¡nadie quiere cargos duplicados!\n\n¿Has implementado APIs idempotentes? ¡Comparte tu experiencia! 👇',
    featuresTitle: 'Todo lo que necesitas para',
    featuresHighlight: 'subir de nivel',
    featuresDescription:
      'Un flujo de trabajo simple diseñado para desarrolladores que quieren mejorar su inglés mientras construyen su presencia profesional.',
    howItWorksTitle: 'Así de simple:',
    howItWorksHighlight: '1-2-3',
    howItWorksDescription: 'Desde guardar una palabra nueva hasta publicar un post pulido en minutos.',
    benefitsTagline: '¿Por qué VocabInk?',
    benefitsTitle: 'Aprende más rápido',
    benefitsHighlight: 'creando contenido',
    benefitsDescription:
      'La mejor forma de recordar vocabulario es usarlo en contexto. VocabInk convierte el aprendizaje en acción ayudándote a crear contenido real para tu red profesional.',
  },
} as const;

const featuresByLanguage = {
  en: [
    {
      icon: BookOpen,
      title: 'Build Your Vocabulary',
      description: 'Save and organize new words you discover. Create a personal dictionary that grows with you.',
      color: 'primary',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Posts',
      description: 'Generate engaging LinkedIn posts that naturally incorporate your vocabulary.',
      color: 'accent',
    },
    {
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: 'Monitor your learning journey with insights on words used and posts created.',
      color: 'success',
    },
  ],
  es: [
    {
      icon: BookOpen,
      title: 'Construye tu vocabulario',
      description: 'Guarda y organiza nuevas palabras. Crea un diccionario personal que crece contigo.',
      color: 'primary',
    },
    {
      icon: Sparkles,
      title: 'Publicaciones con IA',
      description: 'Genera posts de LinkedIn atractivos que incorporan tu vocabulario.',
      color: 'accent',
    },
    {
      icon: TrendingUp,
      title: 'Sigue tu progreso',
      description: 'Monitorea tu aprendizaje con métricas de palabras usadas y posts creados.',
      color: 'success',
    },
  ],
} as const;

const stepsByLanguage = {
  en: [
    {
      number: '01',
      title: 'Save New Words',
      description: 'Discover a new word or phrase? Add it to your personal vocabulary with context.',
    },
    {
      number: '02',
      title: 'Choose a Template',
      description: 'Select from proven LinkedIn post templates designed for developers.',
    },
    {
      number: '03',
      title: 'Generate & Post',
      description: 'Let AI create engaging posts using your vocabulary. Copy and share!',
    },
  ],
  es: [
    {
      number: '01',
      title: 'Guarda nuevas palabras',
      description: '¿Descubriste una palabra o frase? Agrégala a tu vocabulario con contexto.',
    },
    {
      number: '02',
      title: 'Elige una plantilla',
      description: 'Selecciona plantillas de LinkedIn diseñadas para desarrolladores.',
    },
    {
      number: '03',
      title: 'Genera y publica',
      description: 'Deja que la IA cree posts usando tu vocabulario. ¡Copia y comparte!',
    },
  ],
} as const;

const benefitsByLanguage = {
  en: [
    'Practice using new vocabulary in real contexts',
    'Build consistent LinkedIn presence',
    'Templates designed for tech professionals',
    'Learn by doing, not just reading',
  ],
  es: [
    'Practica nuevo vocabulario en contextos reales',
    'Construye una presencia constante en LinkedIn',
    'Plantillas diseñadas para profesionales tech',
    'Aprende haciendo, no solo leyendo',
  ],
} as const;

export default function LandingPage() {
  const { t, language } = useTranslations(translations);
  const features = featuresByLanguage[language];
  const steps = stepsByLanguage[language];
  const benefits = benefitsByLanguage[language];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Linkedin className="w-4 h-4" />
                <span>{t('heroTagline')}</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
                {t('heroTitleLine1')}
                <span className="text-gradient-primary block">{t('heroTitleLine2')}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('heroDescription')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/login">
                  <Button variant="gradient" size="xl" className="group">
                    {t('startFreeToday')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="outline" size="xl">
                    {t('seeHowItWorks')}
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-16 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
              <Card className="bg-card/80 backdrop-blur-sm border-border shadow-xl max-w-2xl mx-auto">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary">JD</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-foreground">{t('sampleName')}</span>
                        <span className="text-muted-foreground text-sm">• 2nd</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{t('sampleRole')}</p>
                      <p className="text-foreground leading-relaxed">
                        {t('samplePost')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('featuresTitle')} <span className="text-gradient-primary">{t('featuresHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('featuresDescription')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="interactive" className="h-full">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-6`}>
                      <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('howItWorksTitle')} <span className="text-gradient-accent">{t('howItWorksHighlight')}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('howItWorksDescription')}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex gap-6 mb-12 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <span className="text-2xl font-bold text-primary-foreground">{step.number}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                  <Zap className="w-4 h-4" />
                  <span>{t('benefitsTagline')}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {t('benefitsTitle')} <span className="text-gradient-primary">{t('benefitsHighlight')}</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {t('benefitsDescription')}
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-primary rounded-3xl opacity-10 blur-xl" />
                <Card className="relative bg-card shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <Target className="w-10 h-10 text-primary" />
                      <div>
                        <p className="font-bold text-foreground">Your Weekly Progress</p>
                        <p className="text-sm text-muted-foreground">Keep the streak going!</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-primary">12</p>
                        <p className="text-sm text-muted-foreground">Words Saved</p>
                      </div>
                      <div className="bg-surface rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-accent">5</p>
                        <p className="text-sm text-muted-foreground">Posts Created</p>
                      </div>
                      <div className="bg-surface rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-success">7</p>
                        <p className="text-sm text-muted-foreground">Day Streak 🔥</p>
                      </div>
                      <div className="bg-surface rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-foreground">89%</p>
                        <p className="text-sm text-muted-foreground">Words Used</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Build Your Brand?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join developers who are improving their English and growing their LinkedIn presence at the same time.
            </p>
            <Link to="/login">
              <Button variant="gradient" size="xl" className="group">
                Get Started for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
