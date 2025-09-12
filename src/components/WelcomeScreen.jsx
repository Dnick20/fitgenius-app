import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Sparkles, 
  Zap, 
  Target, 
  TrendingUp, 
  Apple, 
  Dumbbell,
  ChefHat,
  Activity,
  User,
  Mail,
  Eye,
  EyeOff,
  Star,
  PlayCircle,
  Shield,
  Trophy,
  Heart,
  ArrowRight,
  Check
} from 'lucide-react';

const WelcomeScreen = ({ onSignIn }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      const userProfile = {
        name: formData.name || 'Fitness Champion',
        email: formData.email || 'user@fitgenius.app',
        isSignedIn: true,
        current_weight: 150,
        goal_weight: 140,
        height_feet: 5,
        height_inches: 8,
        age: 28,
        gender: 'female',
        body_type: 'mesomorph',
        activity_level: 'moderately_active',
        fitness_goal: 'weight_loss',
        available_equipment: ['dumbbells', 'resistance_bands', 'bodyweight'],
        dietary_preferences: ['balanced'],
        allergies: []
      };
      onSignIn(userProfile);
    }, 1500);
  };

  const features = [
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "AI Sous Chef",
      description: "Personalized meal plans powered by advanced nutrition science"
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: "Workout Intelligence", 
      description: "BeachBody-inspired programs adapted to your body type"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Smart analytics to keep you motivated and on track"
    }
  ];

  const testimonials = [
    { name: "Sarah M.", text: "Lost 15 lbs in 2 months!", rating: 5 },
    { name: "Mike R.", text: "Best fitness app I've ever used!", rating: 5 },
    { name: "Lisa K.", text: "The AI coaching is incredible!", rating: 5 }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-2xl text-center lg:text-left">
            {/* Logo and Brand */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-yellow-800" />
                  </div>
                </div>
                <div className="ml-4">
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
                    FitGenius
                  </h1>
                  <p className="text-orange-300 text-sm font-medium">AI FITNESS COACH</p>
                </div>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Your AI-Powered
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent block">
                  Fitness Revolution
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Transform your body with personalized workout programs and AI-powered nutrition plans 
                tailored to your unique body type and fitness goals.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-6 mb-12"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center lg:justify-start space-x-12"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full"
          >
            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
              {/* Card Header */}
              <CardHeader className="text-center pb-6 pt-8 px-8 bg-gradient-to-r from-gray-50 to-white">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {isSignUp ? 'Start Your Journey' : 'Welcome Back'}
                </CardTitle>
                <p className="text-gray-600 leading-relaxed">
                  {isSignUp 
                    ? 'Join thousands achieving their fitness goals with AI-powered coaching'
                    : 'Ready to continue your transformation? Sign in to access your personalized fitness plan.'
                  }
                </p>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center">
                        <User className="w-4 h-4 mr-2 text-orange-500" />
                        Full Name
                      </Label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={isSignUp}
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-200"
                      />
                    </motion.div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-orange-500" />
                      Email Address
                    </Label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-orange-500" />
                      Password
                    </Label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full h-12 px-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center">
                        <Check className="w-4 h-4 mr-2 text-orange-500" />
                        Confirm Password
                      </Label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={isSignUp}
                        className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-200"
                      />
                    </motion.div>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{isSignUp ? 'Creating Your Account...' : 'Signing You In...'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>{isSignUp ? 'Start My Transformation' : 'Continue My Journey'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </form>
                
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    {isSignUp ? 'Already crushing your goals?' : 'Ready to start your transformation?'}
                    <button
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="ml-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                    >
                      {isSignUp ? 'Sign In' : 'Create Account'}
                    </button>
                  </p>
                </div>
                
                {/* Demo Access */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      const demoProfile = {
                        name: 'Fitness Champion',
                        email: 'demo@fitgenius.app',
                        isSignedIn: true,
                        current_weight: 150,
                        goal_weight: 140,
                        height_feet: 5,
                        height_inches: 8,
                        age: 28,
                        gender: 'female',
                        body_type: 'mesomorph',
                        activity_level: 'moderately_active',
                        fitness_goal: 'weight_loss',
                        available_equipment: ['dumbbells', 'resistance_bands', 'bodyweight'],
                        dietary_preferences: ['balanced'],
                        allergies: []
                      };
                      onSignIn(demoProfile);
                    }}
                    variant="outline"
                    className="w-full h-12 border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 rounded-xl transition-all duration-300 font-semibold"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Explore Demo Experience
                  </Button>
                </div>

                {/* Social Proof */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9/5 from 2,500+ users</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-gray-700">"{testimonial.text}"</p>
                        <p className="text-gray-500 mt-1">- {testimonial.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Privacy Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-center text-xs text-gray-300 mt-6 flex items-center justify-center"
            >
              <Shield className="w-3 h-3 mr-1" />
              Your data is encrypted and secure. We never share your personal information.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;