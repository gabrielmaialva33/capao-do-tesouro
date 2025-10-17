/**
 * CheckInButton Component
 * Button to perform check-in at a location with visual feedback
 */

import { useState } from 'react';
import { useQuestStore } from '../../stores/questStore';
import { isWithinRadius } from '../../lib/utils';
import Button from '../ui/Button';

export interface CheckInButtonProps {
  locationId: string;
  locationName: string;
  locationCoordinates: { lat: number; lng: number };
  radius: number;
  userPosition: { lat: number; lng: number } | null;
  userId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function CheckInButton({
  locationId,
  locationName,
  locationCoordinates,
  radius,
  userPosition,
  userId,
  onSuccess,
  onError,
}: CheckInButtonProps) {
  const { performCheckin, checkInLoading, locations } = useQuestStore();
  const [showAnimation, setShowAnimation] = useState(false);

  const location = locations.find(loc => loc.id === locationId);
  const isCheckedIn = location?.checkedIn || false;

  // Check if user is within range
  const isInRange =
    userPosition &&
    isWithinRadius(
      userPosition.lat,
      userPosition.lng,
      locationCoordinates.lat,
      locationCoordinates.lng,
      radius
    );

  const handleCheckIn = async () => {
    if (!userPosition) {
      onError?.('Localizacao do usuario nao disponivel');
      return;
    }

    if (!isInRange) {
      onError?.(`Voce precisa estar a ${radius}m de ${locationName}`);
      return;
    }

    const response = await performCheckin(locationId, userId, userPosition);

    if (response.success) {
      // Show animation
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 1000);
      onSuccess?.();
    } else {
      onError?.(response.message);
    }
  };

  // Determine button state and text
  const getButtonConfig = () => {
    if (isCheckedIn) {
      return {
        text: 'Ja visitado',
        disabled: true,
        variant: 'ghost' as const,
        icon: '✓',
      };
    }

    if (!userPosition) {
      return {
        text: 'Aguardando localizacao...',
        disabled: true,
        variant: 'outline' as const,
        icon: '📍',
      };
    }

    if (!isInRange) {
      return {
        text: `Muito longe (${radius}m necessarios)`,
        disabled: true,
        variant: 'outline' as const,
        icon: '🚶',
      };
    }

    return {
      text: 'Fazer Check-in',
      disabled: false,
      variant: 'primary' as const,
      icon: '📍',
    };
  };

  const config = getButtonConfig();

  return (
    <div className="relative">
      <Button
        variant={config.variant}
        onClick={handleCheckIn}
        disabled={config.disabled || checkInLoading}
        className="w-full relative overflow-hidden"
      >
        {checkInLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processando...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{config.icon}</span>
            <span>{config.text}</span>
          </div>
        )}
      </Button>

      {/* Points animation */}
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-ping text-2xl font-bold text-accent">
            +{location?.points} pts!
          </div>
        </div>
      )}
    </div>
  );
}
