import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Loader2,
  BookOpen,
  Save,
  Trash2,
  ExternalLink,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { copyToClipboard, getCharacterCount, getLinkedInCharacterLimit, shareToLinkedIn } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { getLinkedInStatus } from '@/services/linkedinService';

type GeneratorStep = 'select-words' | 'select-template' | 'generate';

interface VocabularyItem {
  id: string;
  user_id: string;
  id_category_vocabulary: string | null;
  word_or_phrase: string;
  context_note: string | null;
  time_used: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface PostTemplateItem {
  id: string;
  name: string;
  structure: object | null;
  ai_prompt: string;
  example_preview: string | null;
  is_active: boolean;
  usage_count: number;
  icon: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Updated interface to match backend response
interface GeneratedPost {
  id: string;
  user_id: string;
  system_template_id: string;
  content: string;
  status: 'draft' | 'published' | 'discarded';
  linkedin_post_id: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  createdAt: string;
  updatedAt: string;
  vocabulary_used: {
    id: string;
    word_or_phrase: string;
  }[];
}

const translations = {
  en: {
    headerTitle: 'Generate Post',
    headerSubtitle: 'Create AI-powered LinkedIn posts using your vocabulary.',
    stepSelectWords: 'Select Words',
    stepChooseTemplate: 'Choose Template',
    stepGenerate: 'Generate',
    selectWordsTitle: 'Select Words to Use',
    selectWordsDescription: 'Choose 1-3 words from your vocabulary to incorporate into your post.',
    loadingVocabulary: 'Loading your vocabulary...',
    noWordsTitle: 'No words saved yet',
    noWordsDescription: 'Add some vocabulary first to generate posts.',
    goToMyWords: 'Go to My Words',
    wordsSelected: '{count}/3 words selected',
    continue: 'Continue',
    chooseTemplateTitle: 'Choose a Template',
    chooseTemplateDescription: 'Select a post format that fits your message.',
    loadingTemplates: 'Loading templates...',
    noTemplatesTitle: 'No templates available',
    noTemplatesDescription: 'Templates could not be loaded. Please try again later.',
    back: 'Back',
    generatePosts: 'Generate Posts',
    generatingTitle: 'Generating your posts...',
    generatingDescription: 'Creating 3 variations using {words}',
    generatingWordsFallback: 'your words',
    generatedPostsTitle: 'Your Generated Posts',
    generatedPostsDescription: 'Choose your favorite and publish it or copy to LinkedIn!',
    startOver: 'Start Over',
    saved: 'Saved',
    userFallback: 'User',
    roleFallback: 'Professional',
    discard: 'Discard',
    save: 'Save',
    copy: 'Copy',
    posting: 'Posting...',
    postToLinkedIn: 'Post to LinkedIn',
    shareOnLinkedIn: 'Share on LinkedIn',
    noPostsTitle: 'No posts generated yet',
    noPostsDescription: 'Select words and a template to generate posts.',
    toastLoadVocabularyTitle: 'Failed to load vocabulary',
    toastLoadVocabularyDescription: 'Could not fetch your words from the server.',
    toastLoadTemplatesTitle: 'Failed to load templates',
    toastLoadTemplatesDescription: 'Could not fetch post templates from the server.',
    toastGeneratedTitle: 'Posts generated! 🎉',
    toastGeneratedDescription: 'Created {count} variations. They\'re saved as drafts.',
    toastGenerationFailedTitle: 'Generation failed',
    toastGenerationFailedDescription: 'Could not generate posts. Please try again.',
    toastPostSavedTitle: 'Post saved! 🚀',
    toastPostSavedDescription: 'You can find it in your published posts.',
    toastPostSaveFailedTitle: 'Failed to save',
    toastPostSaveFailedDescription: 'Could not save the post. Please try again.',
    toastPostDiscardedTitle: 'Post discarded',
    toastPostDiscardedDescription: 'The post has been removed.',
    toastPostDiscardFailedTitle: 'Failed to discard',
    toastPostDiscardFailedDescription: 'Could not remove the post. Please try again.',
    toastCopiedTitle: 'Copied to clipboard! 📋',
    toastCopiedDescription: 'The post is ready to paste on LinkedIn.',
    toastPostedLinkedInTitle: 'Posted to LinkedIn! 🎉',
    toastPostedLinkedInDescription: 'Your post has been published successfully.',
    toastOpeningLinkedInTitle: 'Opening LinkedIn! 🚀',
    toastOpeningLinkedInDescription: 'Your post has been copied to clipboard. If LinkedIn truncates it, just paste (Ctrl+V / Cmd+V) in the post box.',
    toastShareFailedTitle: 'Failed to share',
    toastShareFailedDescription: 'Something went wrong. Please try again or copy the post manually.',
  },
  es: {
    headerTitle: 'Generar publicación',
    headerSubtitle: 'Crea publicaciones de LinkedIn con IA usando tu vocabulario.',
    stepSelectWords: 'Seleccionar palabras',
    stepChooseTemplate: 'Elegir plantilla',
    stepGenerate: 'Generar',
    selectWordsTitle: 'Selecciona palabras para usar',
    selectWordsDescription: 'Elige 1-3 palabras de tu vocabulario para incorporarlas en tu publicación.',
    loadingVocabulary: 'Cargando tu vocabulario...',
    noWordsTitle: 'Aún no hay palabras guardadas',
    noWordsDescription: 'Agrega vocabulario primero para generar publicaciones.',
    goToMyWords: 'Ir a Mis palabras',
    wordsSelected: '{count}/3 palabras seleccionadas',
    continue: 'Continuar',
    chooseTemplateTitle: 'Elige una plantilla',
    chooseTemplateDescription: 'Selecciona un formato que se adapte a tu mensaje.',
    loadingTemplates: 'Cargando plantillas...',
    noTemplatesTitle: 'No hay plantillas disponibles',
    noTemplatesDescription: 'No se pudieron cargar las plantillas. Inténtalo de nuevo más tarde.',
    back: 'Atrás',
    generatePosts: 'Generar publicaciones',
    generatingTitle: 'Generando tus publicaciones...',
    generatingDescription: 'Creando 3 variaciones usando {words}',
    generatingWordsFallback: 'tus palabras',
    generatedPostsTitle: 'Tus publicaciones generadas',
    generatedPostsDescription: 'Elige tu favorita y publícala o cópiala a LinkedIn.',
    startOver: 'Empezar de nuevo',
    saved: 'Guardado',
    userFallback: 'Usuario',
    roleFallback: 'Profesional',
    discard: 'Descartar',
    save: 'Guardar',
    copy: 'Copiar',
    posting: 'Publicando...',
    postToLinkedIn: 'Publicar en LinkedIn',
    shareOnLinkedIn: 'Compartir en LinkedIn',
    noPostsTitle: 'Aún no hay publicaciones generadas',
    noPostsDescription: 'Selecciona palabras y una plantilla para generar publicaciones.',
    toastLoadVocabularyTitle: 'No se pudo cargar el vocabulario',
    toastLoadVocabularyDescription: 'No se pudieron obtener tus palabras del servidor.',
    toastLoadTemplatesTitle: 'No se pudieron cargar las plantillas',
    toastLoadTemplatesDescription: 'No se pudieron obtener las plantillas de publicaciones del servidor.',
    toastGeneratedTitle: '¡Publicaciones generadas! 🎉',
    toastGeneratedDescription: 'Se crearon {count} variaciones. Están guardadas como borradores.',
    toastGenerationFailedTitle: 'La generación falló',
    toastGenerationFailedDescription: 'No se pudieron generar las publicaciones. Inténtalo de nuevo.',
    toastPostSavedTitle: '¡Publicación guardada! 🚀',
    toastPostSavedDescription: 'Puedes encontrarla en tus publicaciones guardadas.',
    toastPostSaveFailedTitle: 'No se pudo guardar',
    toastPostSaveFailedDescription: 'No se pudo guardar la publicación. Inténtalo de nuevo.',
    toastPostDiscardedTitle: 'Publicación descartada',
    toastPostDiscardedDescription: 'La publicación se eliminó.',
    toastPostDiscardFailedTitle: 'No se pudo descartar',
    toastPostDiscardFailedDescription: 'No se pudo eliminar la publicación. Inténtalo de nuevo.',
    toastCopiedTitle: '¡Copiado al portapapeles! 📋',
    toastCopiedDescription: 'La publicación está lista para pegar en LinkedIn.',
    toastPostedLinkedInTitle: '¡Publicado en LinkedIn! 🎉',
    toastPostedLinkedInDescription: 'Tu publicación se publicó correctamente.',
    toastOpeningLinkedInTitle: '¡Abriendo LinkedIn! 🚀',
    toastOpeningLinkedInDescription: 'Tu publicación se copió al portapapeles. Si LinkedIn la corta, solo pega (Ctrl+V / Cmd+V) en el cuadro de publicación.',
    toastShareFailedTitle: 'No se pudo compartir',
    toastShareFailedDescription: 'Algo salió mal. Inténtalo de nuevo o copia la publicación manualmente.',
  },
} as const;

export default function GeneratePostPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const appLanguage = user?.profileConfig?.appLanguage === 'es' ? 'es' : 'en';
  const t = (
    key: keyof typeof translations.en,
    vars?: Record<string, string | number>
  ) => {
    const template = translations[appLanguage][key] ?? translations.en[key];
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
  };

  const [step, setStep] = useState<GeneratorStep>('select-words');
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<PostTemplateItem[]>([]);
  const [isLoadingVocabulary, setIsLoadingVocabulary] = useState(true);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [selectedWords, setSelectedWords] = useState<VocabularyItem[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [savingPostId, setSavingPostId] = useState<string | null>(null);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);
  const [sharingPostId, setSharingPostId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchVocabulary();
      fetchCategories();
      fetchTemplates();
      fetchDraftPosts();
      checkLinkedInConnection();
    }
  }, [user?.id]);

  const checkLinkedInConnection = async () => {
    try {
      const status = await getLinkedInStatus();
      setIsLinkedInConnected(status.connected);
    } catch (error) {
      console.error('Failed to check LinkedIn status:', error);
      setIsLinkedInConnected(false);
    }
  };

  const fetchVocabulary = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get<VocabularyItem[]>(`/v1/vocabulary/all-vocabulary/${user.id}`);
      setVocabularyList(response.data);
    } catch (error) {
      console.error('Failed to fetch vocabulary:', error);
      toast({
        title: t('toastLoadVocabularyTitle'),
        description: t('toastLoadVocabularyDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingVocabulary(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get<Category[]>('/v1/category-vocabulary');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTemplates = async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await api.get<PostTemplateItem[]>('/v1/system-templates');
      // Filter only active templates
      setTemplates(response.data.filter(t => t.is_active));
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast({
        title: t('toastLoadTemplatesTitle'),
        description: t('toastLoadTemplatesDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  // Fetch existing draft posts (persisted from previous sessions)
  const fetchDraftPosts = async () => {
    try {
      const response = await api.get<GeneratedPost[]>(`/v1/posts/drafts/${user?.id}`);
      if (response.data.length > 0) {
        setGeneratedPosts(response.data);
        setStep('generate'); // Show drafts if they exist
      }
    } catch (error) {
      console.error('Failed to fetch draft posts:', error);
      // Silent fail - user can generate new posts
    }
  };

  const getCategoryName = (categoryId: string | null): string | null => {
    if (!categoryId) return null;
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || null;
  };

  const toggleWord = (word: VocabularyItem) => {
    const isSelected = selectedWords.some(w => w.id === word.id);
    if (isSelected) {
      setSelectedWords(selectedWords.filter(w => w.id !== word.id));
    } else if (selectedWords.length < 3) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const isWordSelected = (wordId: string) => {
    return selectedWords.some(w => w.id === wordId);
  };

  // Generate posts via backend AI
  const generatePosts = async () => {
    if (!selectedTemplateId || selectedWords.length === 0) return;
    
    setIsGenerating(true);
    
    try {
      const payload = {
        system_template_id: selectedTemplateId,
        vocabulary_ids: selectedWords.map(w => w.id),
        user_context: {
          english_level: user?.profileConfig?.englishLevel,
          role: user?.profileConfig?.role,
          topics: user?.profileConfig?.topics,
        },
      };

      console.log('📤 Generating posts:', payload);

      const response = await api.post<GeneratedPost[]>('/v1/posts/generate', payload);

      console.log('✅ Posts generated:', response.data);

      // Handle both array response and { posts: [] } response
      const posts = Array.isArray(response.data) ? response.data : response.data || [];
      setGeneratedPosts(posts);

      toast({
        title: t('toastGeneratedTitle'),
        description: t('toastGeneratedDescription', { count: posts.length }),
      });
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: t('toastGenerationFailedTitle'),
        description: t('toastGenerationFailedDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Publish a post (mark as ready to use on LinkedIn)
  const handlePublishPost = async (postId: string) => {
    setSavingPostId(postId);
    try {
      await api.patch(`/v1/posts/${postId}/saved`);
      
      // Update local state
      setGeneratedPosts(prev => 
        prev.map(p => p.id === postId ? { ...p, status: 'published' as const } : p)
      );

      toast({
        title: t('toastPostSavedTitle'),
        description: t('toastPostSavedDescription'),
      });
    } catch (error) {
      console.error('Failed to publish post:', error);
      toast({
        title: t('toastPostSaveFailedTitle'),
        description: t('toastPostSaveFailedDescription'),
        variant: 'destructive',
      });
    } finally {
      setSavingPostId(null);
    }
  };

  // Discard a post
  const handleDiscardPost = async (postId: string) => {
    try {
      await api.delete(`/v1/posts/${postId}`);
      
      // Remove from local state
      setGeneratedPosts(prev => prev.filter(p => p.id !== postId));

      toast({
        title: t('toastPostDiscardedTitle'),
        description: t('toastPostDiscardedDescription'),
      });
    } catch (error) {
      console.error('Failed to discard post:', error);
      toast({
        title: t('toastPostDiscardFailedTitle'),
        description: t('toastPostDiscardFailedDescription'),
        variant: 'destructive',
      });
    }
  };

  const handleCopyPost = async (postId: string, content: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      // Log the action to backend
      try {
        await api.post('/v1/post-actions', {
          post_id: postId,
          action_type: 'COPY'
        });
      } catch (error) {
        console.error('Failed to log copy action:', error);
      }

      toast({
        title: t('toastCopiedTitle'),
        description: t('toastCopiedDescription'),
      });
    }
  };

  const handleShareToLinkedIn = async (postId: string, content: string) => {
    setSharingPostId(postId);

    try {
      if (isLinkedInConnected) {
        // User has LinkedIn connected - share directly via API
        await api.post('/v1/auth/linkedin/share', { text: content });

        // Log the action to backend
        try {
          await api.post('/v1/post-actions', {
            post_id: postId,
            action_type: 'SHARE_LINKEDIN_API'
          });
        } catch (error) {
          console.error('Failed to log share action:', error);
        }

        // Update post status to published
        try {
          await api.patch(`/v1/posts/${postId}`, { status: 'published' });
          setGeneratedPosts(prev => 
            prev.map(p => p.id === postId ? { ...p, status: 'published' } : p)
          );
        } catch (error) {
          console.error('Failed to update post status:', error);
        }

        toast({
          title: t('toastPostedLinkedInTitle'),
          description: t('toastPostedLinkedInDescription'),
        });
      } else {
        // User doesn't have LinkedIn connected - use URL sharing
        // Log the action to backend
        try {
          await api.post('/v1/post-actions', {
            post_id: postId,
            action_type: 'SHARE_LINKEDIN_URL'
          });
        } catch (error) {
          console.error('Failed to log share action:', error);
        }

        // Always copy to clipboard as a backup before opening LinkedIn
        await copyToClipboard(content);
        shareToLinkedIn(content);
        
        toast({
          title: t('toastOpeningLinkedInTitle'),
          description: t('toastOpeningLinkedInDescription'),
          duration: 6000,
        });
      }
    } catch (error) {
      console.error('Failed to share to LinkedIn:', error);
      toast({
        title: t('toastShareFailedTitle'),
        description: t('toastShareFailedDescription'),
        variant: 'destructive',
      });
    } finally {
      setSharingPostId(null);
    }
  };

  const canProceed = () => {
    if (step === 'select-words') return selectedWords.length > 0;
    if (step === 'select-template') return selectedTemplateId !== null;
    return false;
  };

  const handleNext = () => {
    if (step === 'select-words') setStep('select-template');
    else if (step === 'select-template') {
      setStep('generate');
      generatePosts();
    }
  };

  const handleBack = () => {
    if (step === 'select-template') setStep('select-words');
    else if (step === 'generate') {
      setStep('select-template');
    }
  };

  const handleRegenerate = () => {
    generatePosts();
  };

  const handleStartOver = () => {
    setSelectedWords([]);
    setSelectedTemplateId(null);
    setGeneratedPosts([]);
    setStep('select-words');
  };

  const stepNumber = step === 'select-words' ? 1 : step === 'select-template' ? 2 : 3;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('headerTitle')}</h1>
          <p className="text-muted-foreground">
            {t('headerSubtitle')}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          {[
            { num: 1, label: t('stepSelectWords') },
            { num: 2, label: t('stepChooseTemplate') },
            { num: 3, label: t('stepGenerate') },
          ].map((s, index) => (
            <div key={s.num} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                  stepNumber >= s.num
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {stepNumber > s.num ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center font-bold">
                    {s.num}
                  </span>
                )}
                <span className="font-medium hidden sm:inline">{s.label}</span>
              </div>
              {index < 2 && (
                <ChevronRight className="w-5 h-5 text-muted-foreground mx-2" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Select Words */}
          {step === 'select-words' && (
            <motion.div
              key="select-words"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('selectWordsTitle')}</CardTitle>
                  <CardDescription>
                    {t('selectWordsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingVocabulary ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
                      <p className="text-muted-foreground">{t('loadingVocabulary')}</p>
                    </div>
                  ) : vocabularyList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {vocabularyList.map((word) => (
                        <button
                          key={word.id}
                          onClick={() => toggleWord(word)}
                          disabled={selectedWords.length >= 3 && !isWordSelected(word.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all duration-200",
                            isWordSelected(word.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50",
                            selectedWords.length >= 3 && !isWordSelected(word.id)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                isWordSelected(word.id)
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              )}
                            >
                              {isWordSelected(word.id) && (
                                <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                              )}
                            </div>
                            <span className="font-medium text-foreground">{word.word_or_phrase}</span>
                          </div>
                          {getCategoryName(word.id_category_vocabulary) && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {getCategoryName(word.id_category_vocabulary)}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {t('noWordsTitle')}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {t('noWordsDescription')}
                      </p>
                      <Link to="/words">
                        <Button variant="gradient">
                          {t('goToMyWords')}
                        </Button>
                      </Link>
                    </div>
                  )}

                  {!isLoadingVocabulary && vocabularyList.length > 0 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        {t('wordsSelected', { count: selectedWords.length })}
                      </p>
                      <Button
                        variant="gradient"
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="gap-2"
                      >
                        {t('continue')}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Select Template */}
          {step === 'select-template' && (
            <motion.div
              key="select-template"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('chooseTemplateTitle')}</CardTitle>
                  <CardDescription>
                    {t('chooseTemplateDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingTemplates ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
                      <p className="text-muted-foreground">{t('loadingTemplates')}</p>
                    </div>
                  ) : templates.length > 0 ? (
                    <div className="space-y-4">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplateId(template.id)}
                          className={cn(
                            "w-full p-6 rounded-xl border-2 text-left transition-all duration-200",
                            selectedTemplateId === template.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <span className="text-3xl">{template.icon}</span>
                            <div>
                              <h3 className="font-bold text-foreground text-lg mb-1">
                              {template.name}
                            </h3>
                            <p className="text-muted-foreground">{template.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {t('noTemplatesTitle')}
                      </h3>
                      <p className="text-muted-foreground">
                        {t('noTemplatesDescription')}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                    <Button variant="ghost" onClick={handleBack} className="gap-2">
                      <ChevronLeft className="w-4 h-4" />
                      {t('back')}
                    </Button>
                    <Button
                      variant="gradient"
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="gap-2"
                    >
                      {t('generatePosts')}
                      <Sparkles className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Generated Posts */}
          {step === 'generate' && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {isGenerating ? (
                <Card>
                  <CardContent className="py-16">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-primary mx-auto mb-6 flex items-center justify-center shadow-glow animate-pulse">
                        <Sparkles className="w-10 h-10 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {t('generatingTitle')}
                      </h3>
                      <p className="text-muted-foreground">
                        {t('generatingDescription', {
                          words: selectedWords?.map(w => w.word_or_phrase).join(', ') || t('generatingWordsFallback'),
                        })}
                      </p>
                      <Loader2 className="w-6 h-6 text-primary mx-auto mt-6 animate-spin" />
                    </div>
                  </CardContent>
                </Card>
              ) : generatedPosts?.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{t('generatedPostsTitle')}</h2>
                      <p className="text-muted-foreground">
                        {t('generatedPostsDescription')}
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleStartOver} className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      {t('startOver')}
                    </Button>
                  </div>

                  {generatedPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={cn(
                        post.status === 'published' && "border-green-500/50 bg-green-500/5"
                      )}>
                        <CardContent className="p-6">
                          {/* Status Badge */}
                          {post.status === 'published' && (
                            <div className="mb-4">
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                {t('saved')}
                              </Badge>
                            </div>
                          )}

                          {/* LinkedIn-style preview */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-lg font-bold text-primary">
                                {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {user?.name || t('userFallback')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {user?.profileConfig?.role || t('roleFallback')} • 1st
                              </p>
                            </div>
                          </div>

                          <div className="bg-surface rounded-xl p-4 mb-4">
                            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                              {post.content}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex gap-1 flex-wrap">
                                {post.vocabulary_used?.map((vocab) => (
                                  <Badge key={vocab.id} variant="default" className="text-xs">
                                    {vocab.word_or_phrase}
                                  </Badge>
                                ))}
                              </div>
                              <span className={cn(
                                "text-sm",
                                getCharacterCount(post.content) > getLinkedInCharacterLimit()
                                  ? "text-destructive"
                                  : "text-muted-foreground"
                              )}>
                                {getCharacterCount(post.content)}/{getLinkedInCharacterLimit()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {post.status === 'draft' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDiscardPost(post.id)}
                                    className="gap-1 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    {t('discard')}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePublishPost(post.id)}
                                    disabled={savingPostId === post.id}
                                    className="gap-1"
                                  >
                                    {savingPostId === post.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Save className="w-4 h-4" />
                                    )}
                                    {t('save')}
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyPost(post.id, post.content)}
                                className="gap-1"
                              >
                                <Copy className="w-4 h-4" />
                                {t('copy')}
                              </Button>
                              <Button
                                variant="gradient"
                                size="sm"
                                onClick={() => handleShareToLinkedIn(post.id, post.content)}
                                disabled={sharingPostId === post.id}
                                className="gap-1"
                              >
                                {sharingPostId === post.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Linkedin className="w-4 h-4" />
                                )}
                                {sharingPostId === post.id 
                                  ? t('posting')
                                  : isLinkedInConnected 
                                    ? t('postToLinkedIn')
                                    : t('shareOnLinkedIn')
                                }
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  <div className="flex justify-center pt-4">
                    <Button variant="ghost" onClick={handleStartOver} className="gap-2">
                      <ChevronLeft className="w-4 h-4" />
                      {t('startOver')}
                    </Button>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-16">
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {t('noPostsTitle')}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {t('noPostsDescription')}
                      </p>
                      <Button variant="gradient" onClick={handleStartOver}>
                        {t('startOver')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
