import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { useTranslations } from '@/i18n';

type FeedbackType = 'bug' | 'feature' | 'general';

const translations = {
  en: {
    toastThanksTitle: 'Thank you! 🙏',
    toastThanksDescription: 'Your feedback helps us improve VocabInk.',
    toastFailedTitle: 'Failed to send',
    toastFailedDescription: 'Please try again later.',
    ariaSendFeedback: 'Send feedback',
    headerTitle: 'Send Feedback',
    feedbackTypeQuestion: 'What type of feedback?',
    feedbackBug: 'Bug',
    feedbackFeature: 'Feature',
    feedbackGeneral: 'General',
    placeholderBug: 'What went wrong?',
    placeholderFeature: 'What would help you?',
    placeholderGeneral: 'Share your thoughts...',
    sendingAs: 'Sending as {email}',
    sendingAnonymous: 'Sending anonymously',
    sending: 'Sending...',
    sendFeedback: 'Send Feedback',
  },
  es: {
    toastThanksTitle: '¡Gracias! 🙏',
    toastThanksDescription: 'Tu feedback nos ayuda a mejorar VocabInk.',
    toastFailedTitle: 'No se pudo enviar',
    toastFailedDescription: 'Inténtalo de nuevo más tarde.',
    ariaSendFeedback: 'Enviar feedback',
    headerTitle: 'Enviar feedback',
    feedbackTypeQuestion: '¿Qué tipo de feedback?',
    feedbackBug: 'Error',
    feedbackFeature: 'Funcionalidad',
    feedbackGeneral: 'General',
    placeholderBug: '¿Qué salió mal?',
    placeholderFeature: '¿Qué te ayudaría?',
    placeholderGeneral: 'Comparte tus ideas...',
    sendingAs: 'Enviando como {email}',
    sendingAnonymous: 'Enviando de forma anónima',
    sending: 'Enviando...',
    sendFeedback: 'Enviar feedback',
  },
} as const;

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { t } = useTranslations(translations);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/v1/feedback', {
        type: feedbackType,
        message,
        user_id: user?.id,
        userEmail: user?.email,
        userName: user?.name,
        current_page: window.location.pathname,
      });

      toast({
        title: t('toastThanksTitle'),
        description: t('toastThanksDescription'),
      });
      setMessage('');
      setFeedbackType('general');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast({
        title: t('toastFailedTitle'),
        description: t('toastFailedDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes: { value: FeedbackType; label: string; emoji: string }[] = [
    { value: 'bug', label: t('feedbackBug'), emoji: '🐛' },
    { value: 'feature', label: t('feedbackFeature'), emoji: '💡' },
    { value: 'general', label: t('feedbackGeneral'), emoji: '💬' },
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label={t('ariaSendFeedback')}
      >
        <MessageSquarePlus className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-surface">
                <div className="flex items-center gap-2">
                  <MessageSquarePlus className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{t('headerTitle')}</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Feedback Type Selector */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t('feedbackTypeQuestion')}</p>
                  <div className="flex gap-2">
                    {feedbackTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setFeedbackType(type.value)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          feedbackType === type.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface text-muted-foreground hover:bg-surface/80 border border-border'
                        }`}
                      >
                        <span className="mr-1">{type.emoji}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <Textarea
                  placeholder={
                    feedbackType === 'bug' 
                      ? t('placeholderBug')
                      : feedbackType === 'feature'
                      ? t('placeholderFeature')
                      : t('placeholderGeneral')
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />

                <p className="text-xs text-muted-foreground">
                  {user?.email
                    ? t('sendingAs', { email: user.email })
                    : t('sendingAnonymous')}
                </p>

                {/* Submit Button */}
                <Button
                  variant="gradient"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={!message.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {t('sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t('sendFeedback')}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
