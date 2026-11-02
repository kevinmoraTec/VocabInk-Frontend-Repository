import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Link2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { LinkedInConnect } from '@/components/LinkedInConnect';
import { useTranslations } from '@/i18n';

const translations = {
  en: {
    settings: 'Settings',
    settingsDescription: 'Manage your account and preferences.',
    profile: 'Profile',
    profileDescription: 'Your personal information',
    fullName: 'Full Name',
    email: 'Email',
    emailManaged: 'Email is managed by Google',
    notifications: 'Notifications',
    notificationsDescription: 'Manage how you receive updates',
    emailReminders: 'Email reminders',
    emailRemindersDescription: 'Get reminded to post',
    weeklySummary: 'Weekly summary',
    weeklySummaryDescription: 'Progress report every week',
    newFeatures: 'New features',
    newFeaturesDescription: 'Learn about updates',
    integrations: 'Integrations',
    integrationsDescription: 'Connect your social accounts',
    learningPreferences: 'Learning Preferences',
    learningPreferencesDescription: 'Customize your experience',
    englishLevel: 'English Level',
    professionalRole: 'Professional Role',
    postingFrequency: 'Posting Frequency',
    notSet: 'Not set',
    saveChanges: 'Save Changes',
    toastSavedTitle: 'Settings saved',
    toastSavedDescription: 'Your preferences have been updated.',
  },
  es: {
    settings: 'Configuración',
    settingsDescription: 'Administra tu cuenta y preferencias.',
    profile: 'Perfil',
    profileDescription: 'Tu información personal',
    fullName: 'Nombre completo',
    email: 'Correo',
    emailManaged: 'El correo es administrado por Google',
    notifications: 'Notificaciones',
    notificationsDescription: 'Gestiona cómo recibes actualizaciones',
    emailReminders: 'Recordatorios por correo',
    emailRemindersDescription: 'Recibe recordatorios para publicar',
    weeklySummary: 'Resumen semanal',
    weeklySummaryDescription: 'Reporte de progreso cada semana',
    newFeatures: 'Novedades',
    newFeaturesDescription: 'Conoce las actualizaciones',
    integrations: 'Integraciones',
    integrationsDescription: 'Conecta tus redes sociales',
    learningPreferences: 'Preferencias de aprendizaje',
    learningPreferencesDescription: 'Personaliza tu experiencia',
    englishLevel: 'Nivel de inglés',
    professionalRole: 'Rol profesional',
    postingFrequency: 'Frecuencia de publicación',
    notSet: 'No establecido',
    saveChanges: 'Guardar cambios',
    toastSavedTitle: 'Configuración guardada',
    toastSavedDescription: 'Tus preferencias se actualizaron.',
  },
} as const;

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { t } = useTranslations(translations);

  const handleSave = () => {
    toast({
      title: t('toastSavedTitle'),
      description: t('toastSavedDescription'),
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('settings')}</h1>
          <p className="text-muted-foreground">
            {t('settingsDescription')}
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{t('profile')}</CardTitle>
                    <CardDescription>{t('profileDescription')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('fullName')}</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input id="email" type="email" defaultValue={user?.email} disabled />
                  <p className="text-xs text-muted-foreground">{t('emailManaged')}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle>{t('notifications')}</CardTitle>
                    <CardDescription>{t('notificationsDescription')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t('emailReminders')}</p>
                    <p className="text-sm text-muted-foreground">{t('emailRemindersDescription')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t('weeklySummary')}</p>
                    <p className="text-sm text-muted-foreground">{t('weeklySummaryDescription')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{t('newFeatures')}</p>
                    <p className="text-sm text-muted-foreground">{t('newFeaturesDescription')}</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Integrations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-[#0A66C2]" />
                  </div>
                  <div>
                    <CardTitle>{t('integrations')}</CardTitle>
                    <CardDescription>{t('integrationsDescription')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <LinkedInConnect showDisconnect={true} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Learning Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <CardTitle>{t('learningPreferences')}</CardTitle>
                    <CardDescription>{t('learningPreferencesDescription')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('englishLevel')}</Label>
                  <p className="text-sm text-muted-foreground capitalize">
                    {user?.profileConfig?.englishLevel || t('notSet')}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>{t('professionalRole')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.profileConfig?.role || t('notSet')}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>{t('postingFrequency')}</Label>
                  <p className="text-sm text-muted-foreground capitalize">
                    {user?.profileConfig?.postFrequency?.replace('-', ' ') || t('notSet')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <Button variant="gradient" onClick={handleSave}>
              {t('saveChanges')}
            </Button>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
