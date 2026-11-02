import { BrandIcon } from '@/components/BrandIcon';
import { Link } from 'react-router-dom';
import { useTranslations } from '@/i18n';

const translations = {
  en: {
    description:
      'Build your personal brand on LinkedIn while mastering professional English vocabulary.',
    product: 'Product',
    features: 'Features',
    howItWorks: 'How it works',
    company: 'Company',
    about: 'About',
    privacy: 'Privacy',
    terms: 'Terms',
    allRightsReserved: 'All rights reserved.',
  },
  es: {
    description:
      'Construye tu marca personal en LinkedIn mientras dominas vocabulario profesional en inglés.',
    product: 'Producto',
    features: 'Funciones',
    howItWorks: 'Cómo funciona',
    company: 'Compañía',
    about: 'Acerca de',
    privacy: 'Privacidad',
    terms: 'Términos',
    allRightsReserved: 'Todos los derechos reservados.',
  },
} as const;

export function Footer() {
  const { t } = useTranslations(translations);

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BrandIcon />
              <span className="text-xl font-bold text-foreground">
                VocabInk
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              {t('description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('product')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('features')}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('howItWorks')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('company')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('about')}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t('terms')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} VocabInk. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
