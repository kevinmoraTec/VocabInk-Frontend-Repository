import React, { useState, useEffect } from 'react';
import {
  connectLinkedIn,
  getLinkedInStatus,
  disconnectLinkedIn,
  checkLinkedInCallback,
  LinkedInStatus,
} from '@/services/linkedinService';
import { useTranslations, type AppLanguage } from '@/i18n';

const translations = {
  en: {
    connectedSuccess: 'LinkedIn connected successfully!',
    failedToConnect: 'Failed to connect LinkedIn',
    failedToInitiate: 'Failed to initiate LinkedIn connection',
    disconnectedSuccess: 'LinkedIn disconnected successfully',
    failedToDisconnect: 'Failed to disconnect LinkedIn',
    checkingStatus: 'Checking LinkedIn status...',
    connected: 'Connected',
    since: 'since {date}',
    notConnected: 'Not connected',
    disconnecting: 'Disconnecting...',
    disconnect: 'Disconnect',
    connecting: 'Connecting...',
    connectLinkedIn: 'Connect LinkedIn',
    helpText: 'Connect your LinkedIn account to publish posts directly from VocabInk.',
  },
  es: {
    connectedSuccess: '¡LinkedIn conectado con éxito!',
    failedToConnect: 'No se pudo conectar LinkedIn',
    failedToInitiate: 'No se pudo iniciar la conexión con LinkedIn',
    disconnectedSuccess: 'LinkedIn desconectado correctamente',
    failedToDisconnect: 'No se pudo desconectar LinkedIn',
    checkingStatus: 'Verificando estado de LinkedIn...',
    connected: 'Conectado',
    since: 'desde {date}',
    notConnected: 'No conectado',
    disconnecting: 'Desconectando...',
    disconnect: 'Desconectar',
    connecting: 'Conectando...',
    connectLinkedIn: 'Conectar LinkedIn',
    helpText: 'Conecta tu cuenta de LinkedIn para publicar directamente desde VocabInk.',
  },
} satisfies Record<AppLanguage, Record<string, string>>;

interface LinkedInConnectProps {
  onConnectionChange?: (connected: boolean) => void;
  onConnected?: () => void; // Called when LinkedIn is successfully connected (after redirect)
  showDisconnect?: boolean;
  className?: string;
}

export const LinkedInConnect: React.FC<LinkedInConnectProps> = ({
  onConnectionChange,
  onConnected,
  showDisconnect = true,
  className = '',
}) => {
  const { t } = useTranslations(translations);
  const [status, setStatus] = useState<LinkedInStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Check for callback params first
    const callbackResult = checkLinkedInCallback();
    if (callbackResult) {
      if (callbackResult.success) {
        setMessage({ type: 'success', text: t('connectedSuccess') });
        onConnectionChange?.(true);
        // Trigger the onConnected callback after a brief delay to show success message
        if (onConnected) {
          setTimeout(() => {
            onConnected();
          }, 1500);
        }
      } else {
        setMessage({ type: 'error', text: callbackResult.error || t('failedToConnect') });
      }
    }

    // Fetch current status
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const linkedInStatus = await getLinkedInStatus();
      setStatus(linkedInStatus);
      onConnectionChange?.(linkedInStatus.connected);
    } catch (error) {
      console.error('Failed to fetch LinkedIn status:', error);
      setStatus({ connected: false });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    try {
      setActionLoading(true);
      connectLinkedIn();
      // Note: This will redirect, so loading state may not matter
    } catch (error) {
      setMessage({ type: 'error', text: t('failedToInitiate') });
      setActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setActionLoading(true);
      await disconnectLinkedIn();
      setStatus({ connected: false });
      setMessage({ type: 'success', text: t('disconnectedSuccess') });
      onConnectionChange?.(false);
    } catch (error) {
      setMessage({ type: 'error', text: t('failedToDisconnect') });
    } finally {
      setActionLoading(false);
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
        <span className="text-gray-500">{t('checkingStatus')}</span>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Status Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Connection Status & Actions */}
      <div className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
        status?.connected 
          ? 'bg-green-50 border-green-200' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          {/* LinkedIn Icon */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            status?.connected 
              ? 'bg-green-500' 
              : 'bg-[#0A66C2]'
          }`}>
            {status?.connected ? (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            )}
          </div>

          <div>
            <h3 className={`font-medium ${status?.connected ? 'text-green-900' : 'text-gray-900'}`}>
              LinkedIn
            </h3>
            <p className="text-sm">
              {status?.connected ? (
                <span className="flex items-center gap-1 text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {t('connected')}
                  {status.connectedAt && (
                    <span className="text-green-500">
                      · {t('since', { date: new Date(status.connectedAt).toLocaleDateString() })}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-gray-500">{t('notConnected')}</span>
              )}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {status?.connected ? (
          showDisconnect && (
            <button
              onClick={handleDisconnect}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading ? t('disconnecting') : t('disconnect')}
            </button>
          )
        ) : (
          <button
            onClick={handleConnect}
            disabled={actionLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0A66C2] rounded-lg hover:bg-[#004182] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {actionLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                {t('connecting')}
              </>
            ) : (
              t('connectLinkedIn')
            )}
          </button>
        )}
      </div>

      {/* Help Text */}
      {!status?.connected && (
        <p className="text-xs text-gray-500">
          {t('helpText')}
        </p>
      )}
    </div>
  );
};

export default LinkedInConnect;
