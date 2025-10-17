/**
 * Sign Up Page Component
 *
 * Provides user registration with email/password.
 * Includes password strength validation and confirmation.
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Input, Alert } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUpWithEmail, error: authError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Password strength validation
  const validatePasswordStrength = (pwd: string): string | undefined => {
    if (!pwd) return 'Senha é obrigatória';
    if (pwd.length < 8) return 'Senha deve ter no mínimo 8 caracteres';
    if (!/[A-Z]/.test(pwd)) return 'Senha deve conter pelo menos uma letra maiúscula';
    if (!/[a-z]/.test(pwd)) return 'Senha deve conter pelo menos uma letra minúscula';
    if (!/[0-9]/.test(pwd)) return 'Senha deve conter pelo menos um número';
    return undefined;
  };

  // Get password strength level for visual feedback
  const getPasswordStrength = (pwd: string): {
    level: number;
    label: string;
    color: string;
  } => {
    if (!pwd) return { level: 0, label: '', color: '' };

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { level: 1, label: 'Fraca', color: 'bg-red-500' };
    if (strength <= 4) return { level: 2, label: 'Média', color: 'bg-yellow-500' };
    return { level: 3, label: 'Forte', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signUpWithEmail(email, password);
      navigate('/', { replace: true });
    } catch (err: any) {
      setLocalError(err.message || 'Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Criar Conta
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Junte-se à caça ao tesouro
          </p>
        </div>

        <Card>
          {/* Error Alert */}
          {displayError && (
            <Alert variant="error" className="mb-6">
              {displayError}
            </Alert>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="seu@email.com"
              disabled={isLoading}
              autoComplete="email"
              required
            />

            <div>
              <Input
                type="password"
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="new-password"
                required
              />

              {/* Password Strength Indicator */}
              {password && !errors.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Força da senha:
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.level / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <Input
              type="password"
              label="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="new-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Criando conta...
                </span>
              ) : (
                'Criar Conta'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Faça login
            </Link>
          </p>
        </Card>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          Ao criar uma conta, você concorda com nossos Termos de Serviço e Política de
          Privacidade
        </p>
      </div>
    </div>
  );
}
