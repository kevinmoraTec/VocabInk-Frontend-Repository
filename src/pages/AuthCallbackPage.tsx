import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useTranslations } from '@/i18n';

const translations = {
  en: {
    title: 'Processing login...',
    description: 'Please wait while we complete your authentication',
  },
  es: {
    title: 'Procesando inicio de sesión...',
    description: 'Espera mientras completamos tu autenticación',
  },
} as const;

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, verifyAuth, user } = useAuthStore();
  const { t } = useTranslations(translations);

  useEffect(() => {
    const userParam = searchParams.get('user');
    
    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        
        // Debug: log the parsed user data
        console.log('🔐 Auth Callback - Parsed user data:', userData);
        console.log('👤 User ID:', userData.id);
        
        // Store user data in the auth store
        setUser(userData);
        
        // Verify auth with backend to get accurate onboarding_completed status from database
        verifyAuth().then((isAuthenticated) => {
          if (isAuthenticated) {
            // After verifyAuth completes, check onboarding status from updated user state
            // We need to read the user from store after verifyAuth updates it
            const checkUserState = () => {
              const currentUser = useAuthStore.getState().user;
              if (currentUser?.onboardingCompleted) {
                navigate('/dashboard');
              } else {
                navigate('/onboarding');
              }
            };
            
            // Use a small timeout to ensure state is updated
            setTimeout(checkUserState, 100);
          } else {
            navigate('/login');
          }
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      // No user parameter, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate, setUser, verifyAuth]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t('title')}</h2>
          <p className="text-muted-foreground text-center">
            {t('description')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
