import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Loader, Activity, Ruler, Weight, Target, Calendar } from 'lucide-react';
import { signUp } from '../../services/auth';
import { validateProfile, sanitizeInput } from '../../utils/validation';

const SignUp = ({ onSuccess, onSignInClick }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: 'male',
    heightFeet: '5',
    heightInches: '8',
    height: Math.round((5 * 12 + 8) * 2.54), // Convert 5'8" to cm initially
    weight: '',
    activityLevel: 'moderate',
    goal: 'maintain',
    goalWeight: '',
    workoutTypes: [],
    is75Hard: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'workoutTypes') {
      const currentTypes = formData.workoutTypes || [];
      const updatedTypes = checked 
        ? [...currentTypes, value]
        : currentTypes.filter(type => type !== value);
      setFormData(prev => ({ ...prev, workoutTypes: updatedTypes }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      const sanitized = sanitizeInput(value);
      setFormData(prev => {
        const updated = { ...prev, [name]: sanitized };
        
        // Calculate combined height in cm when feet or inches change
        if (name === 'heightFeet' || name === 'heightInches') {
          const feet = parseInt(name === 'heightFeet' ? sanitized : prev.heightFeet) || 0;
          const inches = parseInt(name === 'heightInches' ? sanitized : prev.heightInches) || 0;
          const totalInches = feet * 12 + inches;
          const heightInCm = Math.round(totalInches * 2.54);
          updated.height = heightInCm;
        }
        
        return updated;
      });
    }
    
    if (errors[name] || errors.height) {
      setErrors(prev => ({ ...prev, [name]: '', height: '' }));
    }
  };

  const validateStep1 = () => {
    const stepErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      stepErrors.name = 'Name must be at least 2 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      stepErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password || formData.password.length < 6) {
      stepErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      stepErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    const validation = validateProfile(formData);
    const stepErrors = {};
    
    ['age', 'gender', 'height', 'weight'].forEach(field => {
      if (validation.errors[field]) {
        stepErrors[field] = validation.errors[field];
      }
    });
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      nextStep();
      return;
    }

    setLoading(true);
    setErrors({});

    // Convert American units to metric for storage
    const heightInCm = Math.round((parseInt(formData.heightFeet) * 12 + parseInt(formData.heightInches)) * 2.54);
    const weightInKg = Math.round(parseFloat(formData.weight) * 0.453592);
    const goalWeightInKg = formData.goalWeight ? Math.round(parseFloat(formData.goalWeight) * 0.453592) : '';

    const submissionData = {
      ...formData,
      height: heightInCm,
      weight: weightInKg,
      goalWeight: goalWeightInKg,
      // Keep American units for display
      heightFeet: formData.heightFeet,
      heightInches: formData.heightInches,
      weightLbs: formData.weight,
      goalWeightLbs: formData.goalWeight
    };

    const result = await signUp(submissionData);
    
    if (result.success) {
      onSuccess(result.user);
    } else {
      setErrors({ submit: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-3xl font-bold text-white">FG</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-300">Step {step} of 3 - {
            step === 1 ? 'Account Details' :
            step === 2 ? 'Personal Information' :
            'Fitness Goals'
          }</p>
          
          <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-500" 
                 style={{width: `${(step/3)*100}%`}} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Account Details */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${errors.password ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.age ? 'border-red-500' : 'border-white/20'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    >
                      <option value="">Select Age</option>
                      {Array.from({length: 79}, (_, i) => i + 12).map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>
                  {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Height</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="heightFeet"
                      value={formData.heightFeet}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {Array.from({length: 5}, (_, i) => i + 4).map(feet => (
                        <option key={feet} value={feet}>{feet}' </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      name="heightInches"
                      value={formData.heightInches}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {Array.from({length: 12}, (_, i) => i).map(inches => (
                        <option key={inches} value={inches}>{inches}"</option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.height && <p className="text-red-400 text-sm mt-1">{errors.height}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Weight (lbs)</label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${errors.weight ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="150"
                    min="50"
                    max="800"
                  />
                </div>
                {errors.weight && <p className="text-red-400 text-sm mt-1">{errors.weight}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Activity Level</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderately Active (3-5 days/week)</option>
                    <option value="active">Very Active (6-7 days/week)</option>
                    <option value="extra">Extra Active (athlete)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Fitness Goals */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fitness Goal</label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="lose_weight">Lose Weight</option>
                    <option value="gain_muscle">Gain Muscle</option>
                    <option value="maintain">Maintain Current Weight</option>
                    <option value="improve_fitness">Improve Overall Fitness</option>
                  </select>
                </div>
              </div>

              {(formData.goal === 'lose_weight' || formData.goal === 'gain_muscle') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Goal Weight (lbs)</label>
                  <div className="relative">
                    <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="goalWeight"
                      value={formData.goalWeight}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter your target weight (lbs)"
                      min="50"
                      max="800"
                    />
                  </div>
                  {errors.goalWeight && <p className="text-red-400 text-sm mt-1">{errors.goalWeight}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Preferred Workout Types (select all that apply)</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'hiit', label: 'HIIT' },
                    { value: 'yoga', label: 'Yoga' },
                    { value: 'running', label: 'Running' },
                    { value: 'biking', label: 'Biking' },
                    { value: 'swimming', label: 'Swimming' },
                    { value: 'walking', label: 'Walking' }
                  ].map(workout => (
                    <label key={workout.value} className="flex items-center space-x-2 bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="workoutTypes"
                        value={workout.value}
                        checked={formData.workoutTypes.includes(workout.value)}
                        onChange={handleChange}
                        className="w-4 h-4 text-orange-500 bg-transparent border-white/20 rounded focus:ring-orange-500"
                      />
                      <span className="text-white text-sm">{workout.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-purple-500/20">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is75Hard"
                    checked={formData.is75Hard}
                    onChange={handleChange}
                    className="w-5 h-5 text-purple-500 bg-transparent border-white/20 rounded focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-white font-semibold">I'm doing 75 Hard Challenge</span>
                    <p className="text-gray-300 text-sm">Get specialized meal and workout recommendations for the 75 Hard program</p>
                  </div>
                </label>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 p-4 rounded-xl border border-orange-500/20">
                <h3 className="text-white font-semibold mb-2">Your Personalized Plan Will Include:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>✓ Custom meal plans tailored to your goals</li>
                  <li>✓ Personalized workout routines</li>
                  <li>✓ Progress tracking and analytics</li>
                  <li>✓ AI-powered coaching and recommendations</li>
                  <li>✓ Community support and challenges</li>
                </ul>
              </div>
            </>
          )}

          {errors.submit && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Back
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                step === 3 ? 'Create Account' : 'Next'
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-gray-300">
          Already have an account?{' '}
          <button
            onClick={onSignInClick}
            className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;