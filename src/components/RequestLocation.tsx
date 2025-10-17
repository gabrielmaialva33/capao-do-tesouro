/**
 * Request Location Permission Component
 *
 * Solicita permissão de geolocalização ao usuário quando necessário
 */

import { useEffect, useState } from 'react';
import { Button, Card, Alert } from './ui';

interface RequestLocationProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export default function RequestLocation({
  onPermissionGranted,
  onPermissionDenied,
}: RequestLocationProps) {
  const [permissionState, setPermissionState] = useState<
    'prompt' | 'granted' | 'denied' | 'checking'
  >('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (!('geolocation' in navigator)) {
      setPermissionState('denied');
      setError('Geolocalização não suportada neste navegador');
      return;
    }

    // Verificar se a API Permissions está disponível
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionState(result.state as 'prompt' | 'granted' | 'denied');

        if (result.state === 'granted') {
          onPermissionGranted?.();
        }

        // Listener para mudanças de permissão
        result.addEventListener('change', () => {
          setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
        });
      } catch (err) {
        // Fallback se permissions API não funcionar
        setPermissionState('prompt');
      }
    } else {
      // Se não tem API Permissions, assume prompt
      setPermissionState('prompt');
    }
  };

  const requestPermission = () => {
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location permission granted:', position);
        setPermissionState('granted');
        onPermissionGranted?.();
      },
      (error) => {
        console.error('Location permission denied:', error);
        setPermissionState('denied');

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Permissão de localização negada. Por favor, habilite nas configurações do navegador.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Localização não disponível no momento.');
            break;
          case error.TIMEOUT:
            setError('Tempo esgotado ao tentar obter localização.');
            break;
          default:
            setError('Erro desconhecido ao obter localização.');
        }

        onPermissionDenied?.();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Se já tem permissão, não mostra nada
  if (permissionState === 'granted' || permissionState === 'checking') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Permissão de Localização
          </h2>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {permissionState === 'denied'
              ? 'Precisamos da sua localização para encontrar tesouros próximos de você.'
              : 'Para encontrar tesouros próximos, precisamos acessar sua localização.'}
          </p>

          {/* Error Alert */}
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Buttons */}
          <div className="space-y-2">
            {permissionState === 'denied' ? (
              <>
                <Alert variant="info">
                  <div className="text-sm">
                    <p className="font-semibold mb-2">Como habilitar:</p>
                    <ol className="text-left list-decimal list-inside space-y-1">
                      <li>Clique no ícone do cadeado na barra de endereço</li>
                      <li>Selecione "Configurações do site"</li>
                      <li>Altere "Localização" para "Permitir"</li>
                      <li>Recarregue a página</li>
                    </ol>
                  </div>
                </Alert>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Recarregar Página
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={requestPermission} className="w-full">
                Permitir Localização
              </Button>
            )}
          </div>

          {/* Help Text */}
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
            Sua localização é usada apenas para verificar check-ins e não é armazenada.
          </p>
        </div>
      </Card>
    </div>
  );
}
