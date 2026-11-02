import { BrandIcon } from '@/components/BrandIcon';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { useTranslations } from '@/i18n';

const translations = {
  en: {
    features: 'Features',
    howItWorks: 'How it works',
    dashboard: 'Dashboard',
    signOut: 'Sign Out',
    getStarted: 'Get Started',
  },
  es: {
    features: 'Funciones',
    howItWorks: 'Cómo funciona',
    dashboard: 'Panel',
    signOut: 'Cerrar sesión',
    getStarted: 'Comenzar',
  },
} as const;

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const { t } = useTranslations(translations);

  const isLanding = location.pathname === '/';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <BrandIcon />
            <span className="text-xl font-bold text-foreground">
              VocabInk
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isLanding && (
              <>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('features')}
                </a>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('howItWorks')}
                </a>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost">{t('dashboard')}</Button>
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-semibold text-primary">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    {t('signOut')}
                  </Button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="gradient">{t('getStarted')}</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col gap-4">
              {isLanding && (
                <>
                  <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                    {t('features')}
                  </a>
                  <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors py-2">
                    {t('howItWorks')}
                  </a>
                </>
              )}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="py-2">
                    <Button variant="ghost" className="w-full justify-start">{t('dashboard')}</Button>
                  </Link>
                  <Button variant="outline" onClick={logout}>{t('signOut')}</Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="gradient" className="w-full">{t('getStarted')}</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
