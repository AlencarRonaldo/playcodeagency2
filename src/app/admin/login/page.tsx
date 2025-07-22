'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  User,
  ArrowLeft,
  Home,
  AlertCircle
} from 'lucide-react';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simple authentication - in production use proper auth
      if (credentials.username === 'admin' && credentials.password === 'playcode2024') {
        // Set admin cookie
        document.cookie = 'playcode_admin=true; path=/; max-age=86400'; // 24 hours
        router.push('/admin');
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-console flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to main site */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neon-cyan hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={16} />
            <Home size={16} />
            <span className="text-sm">Voltar ao site principal</span>
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gaming-card"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-magenta-power to-gaming-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white gaming-mono mb-2">
              🎮 ADMIN ACCESS
            </h1>
            <p className="text-gray-400">
              Centro de comando PlayCode Agency
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="
                    w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg
                    text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50
                    focus:ring-1 focus:ring-neon-cyan/50 transition-all duration-300
                  "
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="
                    w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-lg
                    text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50
                    focus:ring-1 focus:ring-neon-cyan/50 transition-all duration-300
                  "
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                w-full py-3 px-4 bg-gradient-to-r from-magenta-power to-gaming-purple
                text-white font-bold rounded-lg gaming-mono
                hover:shadow-lg hover:shadow-magenta-power/25
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300
              "
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  VERIFICANDO...
                </div>
              ) : (
                'ACESSAR ADMIN'
              )}
            </motion.button>
          </form>

          {/* Development Hint */}
          <div className="mt-8 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              🧑‍💻 <strong>Dev Mode:</strong> admin / playcode2024
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-gray-500">
            PlayCode Agency - Sistema Administrativo
          </p>
        </motion.div>
      </div>
    </div>
  );
}