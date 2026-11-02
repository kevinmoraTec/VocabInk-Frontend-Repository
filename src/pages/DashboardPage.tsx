import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  BookOpen, 
  Sparkles, 
  Flame,
  ArrowRight,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { getGreeting, formatRelativeDate } from '@/utils/helpers';
import api from '@/lib/api';
import { useTranslations, type AppLanguage } from '@/i18n';

interface VocabularyItem {
  id: string;
  user_id: string;
  id_category_vocabulary: string | null;
  word_or_phrase: string;
  context_note: string | null;
  time_used: number;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
  };
}

interface PostItem {
  id: string;
  content: string;
  status: 'draft' | 'published' | 'discarded';
  createdAt: string;
  vocabulary_used?: {
    id: string;
    word_or_phrase: string;
  }[];
}

interface DashboardStats {
  totalWords: number;
  totalPosts: number;
  currentStreak: number;
  streakChange: number;
}

const translations = {
  en: {
    overview: "Here's an overview of your learning journey.",
    wordsSaved: 'Words Saved',
    postsGenerated: 'Posts Generated',
    currentStreak: 'Current Streak',
    streakChange: '+{count} from last week',
    addNewWord: 'Add New Word',
    addNewWordDescription: "Save vocabulary you've learned",
    generatePost: 'Generate Post',
    generatePostDescription: 'Create AI-powered LinkedIn content',
    recentWords: 'Recent Words',
    viewAll: 'View All',
    noWordsSavedYet: 'No words saved yet',
    addYourFirstWord: 'Add Your First Word',
    recentPosts: 'Recent Posts',
    generateNew: 'Generate New',
    noPostsGeneratedYet: 'No posts generated yet',
    generateFirstPost: 'Generate Your First Post',
    greetingFallback: 'there',
  },
  es: {
    overview: 'Aquí tienes un resumen de tu aprendizaje.',
    wordsSaved: 'Palabras guardadas',
    postsGenerated: 'Publicaciones generadas',
    currentStreak: 'Racha actual',
    streakChange: '+{count} desde la semana pasada',
    addNewWord: 'Agregar nueva palabra',
    addNewWordDescription: 'Guarda el vocabulario que aprendiste',
    generatePost: 'Generar publicación',
    generatePostDescription: 'Crea contenido de LinkedIn con IA',
    recentWords: 'Palabras recientes',
    viewAll: 'Ver todo',
    noWordsSavedYet: 'Aún no hay palabras guardadas',
    addYourFirstWord: 'Agregar tu primera palabra',
    recentPosts: 'Publicaciones recientes',
    generateNew: 'Generar nueva',
    noPostsGeneratedYet: 'Aún no hay publicaciones generadas',
    generateFirstPost: 'Generar tu primera publicación',
    greetingFallback: 'hola',
  },
} satisfies Record<AppLanguage, Record<string, string>>;

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { t, language } = useTranslations(translations);
  
  const [stats, setStats] = useState<DashboardStats>({
    totalWords: 0,
    totalPosts: 0,
    currentStreak: 0,
    streakChange: 0,
  });
  const [recentWords, setRecentWords] = useState<VocabularyItem[]>([]);
  const [recentPosts, setRecentPosts] = useState<PostItem[]>([]);
  const [isLoadingWords, setIsLoadingWords] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchVocabulary();
      fetchPosts();
    }
  }, [user?.id]);

  const fetchVocabulary = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get<VocabularyItem[]>(`/v1/vocabulary/all-vocabulary/${user.id}`);
      const allWords = response.data;
      setStats(prev => ({ ...prev, totalWords: allWords.length }));
      // Get last 5 words, most recent first
      setRecentWords(allWords.slice(-5).reverse());
    } catch (error) {
      console.error('Failed to fetch vocabulary:', error);
    } finally {
      setIsLoadingWords(false);
    }
  };

  const fetchPosts = async () => {
    if (!user?.id) return;
    try {
      const response = await api.get<PostItem[]>(`/v1/posts/user/${user.id}`);
      const allPosts = response.data;
      // Count only published posts for stats
      const publishedCount = allPosts.filter(p => p.status === 'published').length;
      setStats(prev => ({ ...prev, totalPosts: publishedCount }));
      // Get last 3 posts, most recent first
      setRecentPosts(allPosts.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const firstName = user?.name?.split(' ')[0] || t('greetingFallback');
  const statsConfig = [
    {
      label: t('wordsSaved'),
      key: 'totalWords' as const,
      icon: BookOpen,
      color: 'primary',
    },
    {
      label: t('postsGenerated'),
      key: 'totalPosts' as const,
      icon: Sparkles,
      color: 'accent',
    },
    {
      label: t('currentStreak'),
      key: 'currentStreak' as const,
      icon: Flame,
      color: 'warning',
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getGreeting(language)}, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground">
            {t('overview')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {statsConfig.map((stat) => (
            <Card key={stat.label} variant="elevated" className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-4xl font-bold text-foreground">
                      {stats[stat.key]}
                    </p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl bg-${stat.color}/10 flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 text-${stat.color}`} />
                  </div>
                </div>
                {stat.key === 'currentStreak' && stats.streakChange !== 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-sm text-success font-medium">
                      {t('streakChange', { count: stats.streakChange })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <Link to="/words">
            <Card variant="interactive" className="h-full group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{t('addNewWord')}</h3>
                  <p className="text-sm text-muted-foreground">{t('addNewWordDescription')}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/generate-post">
            <Card variant="interactive" className="h-full group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{t('generatePost')}</h3>
                  <p className="text-sm text-muted-foreground">{t('generatePostDescription')}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Words */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">{t('recentWords')}</CardTitle>
                <Link to="/words">
                  <Button variant="ghost" size="sm" className="text-primary">
                    {t('viewAll')}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoadingWords ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
                  </div>
                ) : recentWords.length > 0 ? (
                  <div className="space-y-3">
                    {recentWords.map((word) => (
                      <div
                        key={word.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-surface"
                      >
                        <div>
                          <p className="font-medium text-foreground">{word.word_or_phrase}</p>
                          {word.context_note && (
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {word.context_note}
                            </p>
                          )}
                        </div>
                        {word.category && (
                          <Badge variant="secondary">{word.category.name}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">{t('noWordsSavedYet')}</p>
                    <Link to="/words">
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('addYourFirstWord')}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">{t('recentPosts')}</CardTitle>
                <Link to="/generate-post">
                  <Button variant="ghost" size="sm" className="text-primary">
                    {t('generateNew')}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoadingPosts ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
                  </div>
                ) : recentPosts.length > 0 ? (
                  <div className="space-y-3">
                    {recentPosts.map((post) => (
                      <div
                        key={post.id}
                        className="p-3 rounded-xl bg-surface"
                      >
                        <p className="text-sm text-foreground line-clamp-2 mb-2">
                          {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1 flex-wrap">
                            {post.vocabulary_used?.map((vocab) => (
                              <Badge key={vocab.id} variant="outline" className="text-xs">
                                {vocab.word_or_phrase}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeDate(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">{t('noPostsGeneratedYet')}</p>
                    <Link to="/generate-post">
                      <Button variant="outline" size="sm">
                        <Sparkles className="w-4 h-4 mr-2" />
                        {t('generateFirstPost')}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
