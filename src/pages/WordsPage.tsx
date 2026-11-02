import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { formatRelativeDate } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { useTranslations } from '@/i18n';

const translations = {
  en: {
    myWords: 'My Words',
    wordSingular: 'word',
    wordPlural: 'words',
    savedLabel: 'saved',
    addNewWord: 'Add New Word',
    updateWord: 'Update Word',
    addWord: 'Add New Word',
    updateWordDescription: 'Update the word or phrase in your vocabulary collection.',
    addWordDescription: 'Save a new word or phrase to your vocabulary collection.',
    wordOrPhrase: 'Word or Phrase *',
    wordPlaceholder: 'e.g., idempotency, scalable',
    contextOptional: 'Context (optional)',
    contextPlaceholder: 'e.g., Node.js project, team meeting',
    category: 'Category',
    loadingCategories: 'Loading categories...',
    selectCategory: 'Select a category',
    cancel: 'Cancel',
    saving: 'Saving...',
    saveWord: 'Save Word',
    searchWords: 'Search words...',
    allCategories: 'All categories',
    loadingVocabulary: 'Loading your vocabulary...',
    contextLabel: 'Context:',
    addedLabel: 'Added {date}',
    noWordsFound: 'No words found',
    startBuilding: 'Start building your vocabulary',
    adjustSearch: 'Try adjusting your search or filter',
    startBuildingDescription:
      'Add words you encounter in your work to build a personalized vocabulary for your LinkedIn posts.',
    addFirstWord: 'Add Your First Word',
    toastLoadCategoriesTitle: 'Failed to load categories',
    toastLoadCategoriesDescription: 'Could not fetch categories from the server.',
    toastLoadVocabularyTitle: 'Failed to load vocabulary',
    toastLoadVocabularyDescription: 'Could not fetch your words from the server.',
    toastWordRequiredTitle: 'Word is required',
    toastWordRequiredDescription: 'Please enter a word or phrase to save.',
    toastWordUpdatedTitle: 'Word updated! ✏️',
    toastWordUpdatedDescription: '"{word}" has been updated.',
    toastWordAddedTitle: 'Word added! 🎉',
    toastWordAddedDescription: '"{word}" has been saved to your vocabulary.',
    toastSaveWordFailedTitle: 'Failed to save word',
    toastSaveWordFailedDescription: 'Could not save the word. Please try again.',
    toastWordRemovedTitle: 'Word removed',
    toastWordRemovedDescription: '"{word}" has been removed from your vocabulary.',
    toastRemoveWordFailedTitle: 'Failed to remove word',
    toastRemoveWordFailedDescription: 'Could not delete the word. Please try again.',
  },
  es: {
    myWords: 'Mis palabras',
    wordSingular: 'palabra',
    wordPlural: 'palabras',
    savedLabel: 'guardadas',
    addNewWord: 'Agregar nueva palabra',
    updateWord: 'Actualizar palabra',
    addWord: 'Agregar nueva palabra',
    updateWordDescription: 'Actualiza la palabra o frase en tu colección de vocabulario.',
    addWordDescription: 'Guarda una nueva palabra o frase en tu colección de vocabulario.',
    wordOrPhrase: 'Palabra o frase *',
    wordPlaceholder: 'p. ej., idempotencia, escalable',
    contextOptional: 'Contexto (opcional)',
    contextPlaceholder: 'p. ej., proyecto Node.js, reunión de equipo',
    category: 'Categoría',
    loadingCategories: 'Cargando categorías...',
    selectCategory: 'Selecciona una categoría',
    cancel: 'Cancelar',
    saving: 'Guardando...',
    saveWord: 'Guardar palabra',
    searchWords: 'Buscar palabras...',
    allCategories: 'Todas las categorías',
    loadingVocabulary: 'Cargando tu vocabulario...',
    contextLabel: 'Contexto:',
    addedLabel: 'Agregado {date}',
    noWordsFound: 'No se encontraron palabras',
    startBuilding: 'Empieza a construir tu vocabulario',
    adjustSearch: 'Intenta ajustar tu búsqueda o filtro',
    startBuildingDescription:
      'Agrega palabras que encuentres en tu trabajo para crear un vocabulario personalizado para tus publicaciones de LinkedIn.',
    addFirstWord: 'Agrega tu primera palabra',
    toastLoadCategoriesTitle: 'No se pudieron cargar las categorías',
    toastLoadCategoriesDescription: 'No se pudieron obtener las categorías del servidor.',
    toastLoadVocabularyTitle: 'No se pudo cargar el vocabulario',
    toastLoadVocabularyDescription: 'No se pudieron obtener tus palabras del servidor.',
    toastWordRequiredTitle: 'La palabra es obligatoria',
    toastWordRequiredDescription: 'Ingresa una palabra o frase para guardar.',
    toastWordUpdatedTitle: '¡Palabra actualizada! ✏️',
    toastWordUpdatedDescription: '"{word}" ha sido actualizada.',
    toastWordAddedTitle: '¡Palabra agregada! 🎉',
    toastWordAddedDescription: '"{word}" se guardó en tu vocabulario.',
    toastSaveWordFailedTitle: 'No se pudo guardar la palabra',
    toastSaveWordFailedDescription: 'No se pudo guardar la palabra. Inténtalo de nuevo.',
    toastWordRemovedTitle: 'Palabra eliminada',
    toastWordRemovedDescription: '"{word}" se eliminó de tu vocabulario.',
    toastRemoveWordFailedTitle: 'No se pudo eliminar la palabra',
    toastRemoveWordFailedDescription: 'No se pudo eliminar la palabra. Inténtalo de nuevo.',
  },
} as const;

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

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

export default function WordsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { t } = useTranslations(translations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingVocabulary, setIsLoadingVocabulary] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabularyItem | null>(null);
  const [newWord, setNewWord] = useState({
    word_or_phrase: '',
    id_category_vocabulary: '',
    context_note: '',
  });

  useEffect(() => {
    fetchCategories();
    if (user?.id) {
      fetchVocabulary();
    }
  }, [user?.id]);

  const openAddWordDialog = () => {
    setEditingWord(null);
    setNewWord({
      word_or_phrase: '',
      id_category_vocabulary: '',
      context_note: '',
    });
    setIsDialogOpen(true);
  };

  const openEditWordDialog = (word: VocabularyItem) => {
    setEditingWord(word);
    setNewWord({
      word_or_phrase: word.word_or_phrase,
      id_category_vocabulary: word.id_category_vocabulary || '',
      context_note: word.context_note || '',
    });
    setIsDialogOpen(true);
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get<Category[]>('/v1/category-vocabulary');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast({
        title: t('toastLoadCategoriesTitle'),
        description: t('toastLoadCategoriesDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingCategories(false);
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

  const getCategoryName = (categoryId: string | null): string | null => {
    if (!categoryId) return null;
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || null;
  };

  const filteredWords = vocabularyList.filter((word) => {
    const matchesSearch = word.word_or_phrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.context_note?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || word.id_category_vocabulary === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddWord = async () => {
    if (!newWord.word_or_phrase.trim()) {
      toast({
        title: t('toastWordRequiredTitle'),
        description: t('toastWordRequiredDescription'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        id_category_vocabulary: newWord.id_category_vocabulary || null,
        word_or_phrase: newWord.word_or_phrase.trim(),
        context_note: newWord.context_note.trim() || undefined,
      };

      if (editingWord) {
        // Update existing word
        await api.patch(`/v1/vocabulary/${editingWord.id}`, payload);
        await fetchVocabulary();

        toast({
          title: t('toastWordUpdatedTitle'),
          description: t('toastWordUpdatedDescription', { word: newWord.word_or_phrase }),
        });
      } else {
        // Create new word
        await api.post('/v1/vocabulary', payload);
        await fetchVocabulary();

        toast({
          title: t('toastWordAddedTitle'),
          description: t('toastWordAddedDescription', { word: newWord.word_or_phrase }),
        });
      }

      setNewWord({ word_or_phrase: '', id_category_vocabulary: '', context_note: '' });
      setEditingWord(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to save word:', error);
      toast({
        title: t('toastSaveWordFailedTitle'),
        description: t('toastSaveWordFailedDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWord = async (id: string, word: string) => {
    try {
      await api.delete(`/v1/vocabulary/${id}`);
      setVocabularyList((prev) => prev.filter((w) => w.id !== id));
      toast({
        title: t('toastWordRemovedTitle'),
        description: t('toastWordRemovedDescription', { word }),
      });
    } catch (error) {
      console.error('Failed to delete word:', error);
      toast({
        title: t('toastRemoveWordFailedTitle'),
        description: t('toastRemoveWordFailedDescription'),
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{t('myWords')}</h1>
            <p className="text-muted-foreground">
              {vocabularyList.length} {vocabularyList.length === 1 ? t('wordSingular') : t('wordPlural')} {t('savedLabel')}
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" className="gap-2" onClick={openAddWordDialog}>
                <Plus className="w-4 h-4" />
                {t('addNewWord')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingWord ? t('updateWord') : t('addWord')}</DialogTitle>
                <DialogDescription>
                  {editingWord ? t('updateWordDescription') : t('addWordDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="word">{t('wordOrPhrase')}</Label>
                  <Input
                    id="word"
                    placeholder={t('wordPlaceholder')}
                    value={newWord.word_or_phrase}
                    onChange={(e) => setNewWord({ ...newWord, word_or_phrase: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="context">{t('contextOptional')}</Label>
                  <Input
                    id="context"
                    placeholder={t('contextPlaceholder')}
                    value={newWord.context_note}
                    onChange={(e) => setNewWord({ ...newWord, context_note: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t('category')}</Label>
                  <Select
                    value={newWord.id_category_vocabulary}
                    onValueChange={(value) => setNewWord({ ...newWord, id_category_vocabulary: value })}
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoadingCategories ? t('loadingCategories') : t('selectCategory')
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  {t('cancel')}
                </Button>
                <Button variant="gradient" onClick={handleAddWord} disabled={isLoadingCategories || isSubmitting}>
                  {isSubmitting ? t('saving') : editingWord ? t('updateWord') : t('saveWord')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('searchWords')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterCategory}
            onValueChange={(value) => setFilterCategory(value)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t('allCategories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCategories')}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Words List */}
        <AnimatePresence mode="popLayout">
          {isLoadingVocabulary ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t('loadingVocabulary')}</p>
            </div>
          ) : filteredWords.length > 0 ? (
            <motion.div className="space-y-4">
              {filteredWords.map((word, index) => (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card variant="interactive" className="cursor-pointer" onClick={() => openEditWordDialog(word)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-foreground">{word.word_or_phrase}</h3>
                            {getCategoryName(word.id_category_vocabulary) && (
                              <Badge variant="secondary">{getCategoryName(word.id_category_vocabulary)}</Badge>
                            )}
                          </div>
                          {word.context_note && (
                            <p className="text-muted-foreground mb-2">
                              <span className="text-foreground font-medium">{t('contextLabel')}</span>{' '}
                              <span className="italic">{word.context_note}</span>
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-3">
                            {t('addedLabel', { date: formatRelativeDate(word.createdAt) })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWord(word.id, word.word_or_phrase);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchQuery || filterCategory !== 'all'
                  ? t('noWordsFound')
                  : t('startBuilding')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {searchQuery || filterCategory !== 'all'
                  ? t('adjustSearch')
                  : t('startBuildingDescription')}
              </p>
              {!searchQuery && filterCategory === 'all' && (
                <Button variant="gradient" onClick={openAddWordDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addFirstWord')}
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
