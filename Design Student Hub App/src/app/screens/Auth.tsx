import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, GraduationCap, Loader2, Facebook, Apple, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { login } = useAuth();
  const { request, loading, error } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const body: any = isLogin ? { email, password } : { name, email, password };
      const data = await request(endpoint, 'POST', body);
      login(data.user, data.token);
      navigate('/app');
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleAuth = () => {
    // Simulate Google authentication
    navigate('/app');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-blue-100 via-white to-purple-50">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[120px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-3xl border border-white/40 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/5 overflow-hidden">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100 mb-6"
            >
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Sign in with email' : 'Create an account'}
            </h1>
            <p className="text-gray-500 text-center text-sm leading-relaxed max-w-[240px]">
              {isLogin 
                ? 'Welcome back! Please enter your details to stay connected' 
                : 'Join our community of students and start organizing your life'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-5 py-4 bg-gray-50/50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-400"
                />
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-gray-400 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-5 py-4 bg-gray-50/50 border border-transparent focus:border-gray-200 focus:bg-white rounded-2xl outline-none transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end px-1">
                <button type="button" className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs px-2 font-medium"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-black text-white rounded-2xl font-semibold shadow-lg shadow-black/10 hover:bg-gray-900 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Get Started' : 'Join Now')}
            </motion.button>
          </form>

          {/* Switch Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-300 uppercase tracking-widest font-bold bg-transparent">
              <span className="bg-white/80 px-4">Or sign in with</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleGoogleAuth}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-blue-600"
            >
              <Facebook className="w-5 h-5 fill-current" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all text-black"
            >
              <Apple className="w-5 h-5 fill-current" />
            </motion.button>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-gray-400 font-medium tracking-wide">
          Developed with ❤️ by Student Hub Team
        </p>
      </motion.div>
    </div>
  );
}
