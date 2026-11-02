import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/i18n';

const translations = {
  en: {
    title: 'A look inside VocabInk',
    dashboard: 'Dashboard',
    words: 'My Words',
    post: 'Generate Post',
    dashboardCaption: 'Your vocabulary and writing progress, in one place.',
    wordsCaption: 'Save words with context. Find them by search or category.',
    postCaption: 'Turn saved vocabulary into a draft you can edit, save, and share.',
    dashboardAlt: 'VocabInk dashboard with saved-word totals, recent vocabulary, and recent posts.',
    wordsAlt: 'Vocabulary library with search, category filters, and saved words with context.',
    postAlt: 'Generated LinkedIn draft with editing, save, copy, and publish controls.',
    expand: 'Enlarge screenshot',
    previous: 'Previous screenshot',
    next: 'Next screenshot',
    preview: 'App preview',
  },
  es: {
    title: 'Conoce VocabInk',
    dashboard: 'Panel',
    words: 'Mis palabras',
    post: 'Generar publicación',
    dashboardCaption: 'Tu vocabulario y progreso de escritura en un solo lugar.',
    wordsCaption: 'Guarda palabras con contexto. Encuéntralas por búsqueda o categoría.',
    postCaption: 'Convierte tu vocabulario en un borrador que puedes editar, guardar y compartir.',
    dashboardAlt: 'Panel de VocabInk con totales, vocabulario reciente y publicaciones recientes.',
    wordsAlt: 'Biblioteca de vocabulario con búsqueda, categorías y palabras guardadas con contexto.',
    postAlt: 'Borrador de LinkedIn con controles para editar, guardar, copiar y publicar.',
    expand: 'Ampliar captura',
    previous: 'Captura anterior',
    next: 'Siguiente captura',
    preview: 'Vista previa',
  },
} as const;

export function ProductPreview() {
  const { t } = useTranslations(translations);
  const reducedMotion = useReducedMotion();
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const slides = [
    { src: '/screenshots/dashboard.png', title: t('dashboard'), caption: t('dashboardCaption'), alt: t('dashboardAlt') },
    { src: '/screenshots/words.png', title: t('words'), caption: t('wordsCaption'), alt: t('wordsAlt') },
    { src: '/screenshots/post.png', title: t('post'), caption: t('postCaption'), alt: t('postAlt') },
  ];

  useEffect(() => {
    if (!api) return;
    const sync = () => setSelected(api.selectedScrollSnap());
    sync();
    api.on('select', sync);
    api.on('reInit', sync);
    return () => {
      api.off('select', sync);
      api.off('reInit', sync);
    };
  }, [api]);

  return (
    <section aria-label={t('title')} className="min-w-0 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg shadow-blue-900/5">
      <Carousel setApi={setApi} opts={{ loop: true, duration: reducedMotion ? 0 : 25 }} aria-label={t('title')}>
        <div className="flex items-center justify-between gap-3 border-b border-blue-100 px-4 py-3">
          <h2 className="text-sm font-semibold">{t('title')}</h2>
          <span className="text-[11px] font-medium text-muted-foreground">{t('preview')}</span>
        </div>
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.src} className="pl-0" aria-label={`${index + 1} / ${slides.length}: ${slide.title}`}>
              <img
                src={slide.src}
                alt={slide.alt}
                width={1660}
                height={948}
                loading={index === 0 ? 'eager' : 'lazy'}
                draggable={false}
                className="aspect-[1660/948] w-full object-contain bg-slate-50"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="border-t border-blue-100 px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div aria-live="polite" aria-atomic="true" className="min-h-[4.5rem]">
              <p className="text-sm font-semibold">{slides[selected].title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{slides[selected].caption}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('expand')} title={t('expand')} className="shrink-0">
                  <Expand aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-7xl max-h-[95dvh] overflow-y-auto p-3 sm:p-5">
                <DialogHeader className="pr-7">
                  <DialogTitle>{slides[selected].title}</DialogTitle>
                  <DialogDescription>{slides[selected].caption}</DialogDescription>
                </DialogHeader>
                <img src={slides[selected].src} alt={slides[selected].alt} className="w-full rounded-lg" />
              </DialogContent>
            </Dialog>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('title')}>
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-pressed={selected === index}
                  onClick={() => api?.scrollTo(index)}
                  className={`min-h-9 rounded-lg px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${selected === index ? 'bg-primary text-white' : 'bg-slate-50 text-muted-foreground hover:bg-blue-50 hover:text-primary'}`}
                >
                  {slide.title}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <Button type="button" variant="outline" size="icon" className="h-9 w-9" aria-label={t('previous')} onClick={() => api?.scrollPrev()}>
                <ArrowLeft aria-hidden="true" />
              </Button>
              <Button type="button" variant="outline" size="icon" className="h-9 w-9" aria-label={t('next')} onClick={() => api?.scrollNext()}>
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </Carousel>
    </section>
  );
}
