import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, register, setUserData } = useAuth();
  const [searchParams] = useSearchParams();
  
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  // Google OAuth response handler - function declaration for proper hoisting
  async function handleGoogleResponse(response) {
    try {
      setIsLoading(true);
      
      const decoded = JSON.parse(atob(response.credential.split('.')[1]));
      
      const userData = {
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
        verified: true,
        provider: 'google'
      };

      try {
        await login({ email: userData.email, provider: 'google' });
      } catch (loginError) {
        await register(userData);
      }
      
      toast.success('Google login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Handle Google OAuth redirect back first
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = localStorage.getItem('google_oauth_state');
    
    if (code && state && state === storedState) {
      console.log('Google OAuth code received:', code);
      localStorage.removeItem('google_oauth_state');
      handleGoogleAuthCode(code);
      
      // Clean up URL
      window.history.replaceState({}, document.title, '/auth');
      return; // Exit early for OAuth handling
    }

    // Only check URL mode on initial load if not OAuth
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const loginData = authMethod === 'email' 
          ? { email: formData.email, password: formData.password }
          : { phone: formData.phone, password: formData.password };
        
        await login(loginData);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        }

        const registerData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        };

        await register(registerData);
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = (provider) => {
    if (provider === 'google') {
      handleGoogleLogin();
    }
  };

  const handleGoogleLogin = () => {
    const clientId = "189234615705-1d4ccucjopba08tdpcb5kn3u3l95hakm.apps.googleusercontent.com";
    
    console.log('Redirecting to Google Sign-In page...');
    
    // Pure OAuth2 redirect - no Google Identity Services
    const redirectUri = encodeURIComponent('http://localhost:3000/auth');
    const scope = encodeURIComponent('email profile');
    const state = Math.random().toString(36).substring(2, 15);
    
    localStorage.setItem('google_oauth_state', state);
    
    // Direct OAuth2 URL - this will force full page redirect
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `response_type=code&` +
      `state=${state}&` +
      `prompt=select_account`;

    console.log('Full page redirect to:', authUrl);
    
    // Force immediate redirect
    window.location.replace(authUrl);
  };

  const handleGoogleAuthCode = async (code) => {
    try {
      setIsLoading(true);
      console.log('Processing Google auth code:', code);
      
      // Send code to backend for processing
      const response = await fetch('http://localhost:8080/api/users/google-oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code }),
      });
      
      console.log('Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error(`Server error (${response.status}): Unable to parse response`);
      }
      
      console.log('Backend response:', data);
      
      if (!response.ok) {
        if (data.error && data.error.includes('401 Unauthorized')) {
          throw new Error('Google authentication expired. Please try logging in again.');
        }
        throw new Error(data.error || `Server error: ${response.status}`);
      }
      
      if (!data.user || !data.token) {
        throw new Error('Invalid response from server');
      }
      
      // Use AuthContext to update user state immediately
      const userData = data.user;
      const authToken = data.token;
      
      console.log('Setting user data:', userData);
      
      // Update AuthContext state immediately
      setUserData(userData, authToken);
      
      toast.success(`Welcome ${userData.name}!`);
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Google OAuth error:', error);
      if (error.message.includes('expired') || error.message.includes('401')) {
        toast.error('Google login expired. Please try again.');
        // Clear the URL to allow fresh login
        window.history.replaceState({}, document.title, '/auth');
      } else {
        toast.error(`Google login failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? t('auth.signIn') : t('auth.signUp')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? t('auth.signInSubtitle') : t('auth.signUpSubtitle')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="flex mb-6">
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
                authMethod === 'email'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border-t border-r border-b ${
                authMethod === 'phone'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <Input
                icon={User}
                type="text"
                placeholder={t('auth.fullName')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            )}

            {authMethod === 'email' ? (
              <Input
                icon={Mail}
                type="email"
                placeholder={t('auth.email')}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            ) : (
              <Input
                icon={Phone}
                type="tel"
                placeholder={t('auth.phone')}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            )}

            <div className="relative">
              <Input
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.password')}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Input
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.confirmPassword')}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t('common.loading') : (isLogin ? t('auth.signIn') : t('auth.signUp'))}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center mt-3"
              onClick={() => handleSSOLogin('google')}
            >
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                className="w-5 h-5 mr-3"
              />
              {t('auth.loginWithGoogle')}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
