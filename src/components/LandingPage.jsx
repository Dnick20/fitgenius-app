import React from 'react';
import { Zap, Brain, TrendingUp, Users, Award, Shield, ArrowRight, Check, Star, Activity, Utensils, Dumbbell } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Coaching',
      description: 'Get personalized fitness and nutrition guidance from our advanced AI coach that learns and adapts to your progress.'
    },
    {
      icon: Utensils,
      title: 'Custom Meal Plans',
      description: 'Receive tailored meal plans that match your dietary preferences, goals, and nutritional requirements.'
    },
    {
      icon: Dumbbell,
      title: 'Personalized Workouts',
      description: 'Access workout routines designed specifically for your fitness level, goals, and available equipment.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your fitness journey with detailed analytics, charts, and milestone celebrations.'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a supportive community of fitness enthusiasts, share achievements, and participate in challenges.'
    },
    {
      icon: Shield,
      title: 'Science-Backed',
      description: 'All recommendations are based on proven scientific research and nutrition guidelines.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Lost 30 lbs in 4 months',
      content: 'FitGenius transformed my life! The personalized meal plans and workouts kept me motivated every day.',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Gained 15 lbs of muscle',
      content: 'The AI coach is incredible. It adjusts my workouts based on my progress and keeps pushing me to new limits.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Marathon Runner',
      content: 'Perfect for endurance training! The nutrition guidance helped me achieve my best marathon time ever.',
      rating: 5
    }
  ];

  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      period: 'month',
      features: [
        'Personalized meal plans',
        'Basic workout routines',
        'Progress tracking',
        'Email support'
      ],
      coming: true
    },
    {
      name: 'Pro',
      price: '$19.99',
      period: 'month',
      features: [
        'Everything in Basic',
        'AI-powered coaching',
        'Advanced analytics',
        'Priority support',
        'Custom recipes',
        'Video tutorials'
      ],
      popular: true,
      coming: true
    },
    {
      name: 'Elite',
      price: '$39.99',
      period: 'month',
      features: [
        'Everything in Pro',
        '1-on-1 consultations',
        'Supplement guidance',
        'Meal prep videos',
        'VIP community access',
        'Lifetime progress history'
      ],
      coming: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-bold text-white">FG</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-6">
              FitGenius
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              Your AI-Powered Personal Fitness Coach
            </p>
            
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
              Transform your body and mind with personalized workout plans, nutrition guidance, 
              and intelligent coaching that adapts to your unique fitness journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors">
                Watch Demo
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-8 text-gray-400">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-400 mr-2" />
                <span>7-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-300">
            Powerful features designed to help you achieve your fitness goals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-black/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How FitGenius Works
            </h2>
            <p className="text-xl text-gray-300">
              Your fitness transformation in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Create Your Profile</h3>
              <p className="text-gray-300">
                Tell us about your fitness goals, preferences, and current fitness level
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Get Your Plan</h3>
              <p className="text-gray-300">
                Receive personalized workout routines and meal plans tailored to your needs
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Track & Achieve</h3>
              <p className="text-gray-300">
                Monitor your progress, adjust your plan, and celebrate your achievements
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-300">
            Join thousands who have transformed their lives with FitGenius
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
              <div>
                <p className="text-white font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-black/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300">
              Start your fitness journey today with our flexible pricing options
            </p>
            <p className="text-orange-400 mt-2">Coming Soon - Free Access During Beta!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white/10 backdrop-blur-sm p-8 rounded-2xl border ${
                  plan.popular ? 'border-orange-500' : 'border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-300">/{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  disabled={plan.coming}
                >
                  {plan.coming ? 'Coming Soon' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Transform Your Life?
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Join FitGenius today and start your journey to a healthier, stronger you.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity inline-flex items-center"
        >
          Start Your Free Trial
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
        <p className="text-gray-400 mt-4">
          No credit card required • Cancel anytime • 100% satisfaction guarantee
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-lg font-bold text-white">FG</span>
              </div>
              <span className="text-white font-semibold">FitGenius</span>
            </div>
            
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            
            <p className="text-gray-400 mt-4 md:mt-0">
              © 2024 FitGenius. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;