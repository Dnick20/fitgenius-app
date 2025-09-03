import React, { useState } from 'react';
import { User, Save, Edit2, Calendar, Ruler, Weight, Target, Activity } from 'lucide-react';
import { updateUserProfile, getAuthUser } from '../services/auth';
import { validateProfile, sanitizeInput } from '../utils/validation';

const Settings = ({ currentUser, onProfileUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  const [profileData, setProfileData] = useState({
    name: currentUser?.profile?.name || '',
    email: currentUser?.profile?.email || '',
    age: currentUser?.profile?.age || '',
    gender: currentUser?.profile?.gender || 'male',
    heightFeet: currentUser?.profile?.heightFeet || Math.floor((currentUser?.profile?.height || 175) / 2.54 / 12).toString(),
    heightInches: currentUser?.profile?.heightInches || Math.round(((currentUser?.profile?.height || 175) / 2.54) % 12).toString(),
    weight: currentUser?.profile?.weightLbs || Math.round((currentUser?.profile?.weight || 70) * 2.20462),
    activityLevel: currentUser?.profile?.activityLevel || 'moderate',
    goal: currentUser?.profile?.goal || 'maintain',
    goalWeight: currentUser?.profile?.goalWeightLbs || Math.round((currentUser?.profile?.goalWeight || 65) * 2.20462)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitized = sanitizeInput(value);
    setProfileData(prev => ({ ...prev, [name]: sanitized }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setErrors({});
    setMessage('');

    // Convert American units to metric for storage
    const heightInCm = Math.round((parseInt(profileData.heightFeet) * 12 + parseInt(profileData.heightInches)) * 2.54);
    const weightInKg = Math.round(parseFloat(profileData.weight) * 0.453592);
    const goalWeightInKg = profileData.goalWeight ? Math.round(parseFloat(profileData.goalWeight) * 0.453592) : '';

    const updatedProfile = {
      ...profileData,
      height: heightInCm,
      weight: weightInKg,
      goalWeight: goalWeightInKg,
      weightLbs: profileData.weight,
      goalWeightLbs: profileData.goalWeight
    };

    // Validate
    const validation = validateProfile(updatedProfile);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    // Update profile
    const result = await updateUserProfile(currentUser.id, updatedProfile);
    
    if (result.success) {
      setMessage('Profile updated successfully!');
      setEditMode(false);
      // Update the current user in the parent component
      if (onProfileUpdate) {
        const updatedUser = getAuthUser();
        onProfileUpdate(updatedUser);
      }
    } else {
      setMessage('Failed to update profile: ' + result.error);
    }
    
    setLoading(false);
  };

  const cancelEdit = () => {
    // Reset to original values
    setProfileData({
      name: currentUser?.profile?.name || '',
      email: currentUser?.profile?.email || '',
      age: currentUser?.profile?.age || '',
      gender: currentUser?.profile?.gender || 'male',
      heightFeet: currentUser?.profile?.heightFeet || Math.floor((currentUser?.profile?.height || 175) / 2.54 / 12).toString(),
      heightInches: currentUser?.profile?.heightInches || Math.round(((currentUser?.profile?.height || 175) / 2.54) % 12).toString(),
      weight: currentUser?.profile?.weightLbs || Math.round((currentUser?.profile?.weight || 70) * 2.20462),
      activityLevel: currentUser?.profile?.activityLevel || 'moderate',
      goal: currentUser?.profile?.goal || 'maintain',
      goalWeight: currentUser?.profile?.goalWeightLbs || Math.round((currentUser?.profile?.goalWeight || 65) * 2.20462)
    });
    setEditMode(false);
    setErrors({});
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
          Account Settings
        </h1>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.includes('success') ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
        <div className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                {editMode ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>
                ) : (
                  <p className="text-white py-3">{currentUser?.profile?.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                {editMode ? (
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                ) : (
                  <p className="text-white py-3">{currentUser?.profile?.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                {editMode ? (
                  <div>
                    <select
                      name="age"
                      value={profileData.age}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.age ? 'border-red-500' : 'border-white/20'} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    >
                      <option value="">Select Age</option>
                      {Array.from({length: 79}, (_, i) => i + 12).map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                    {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
                  </div>
                ) : (
                  <p className="text-white py-3">{currentUser?.profile?.age} years old</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                {editMode ? (
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="text-white py-3 capitalize">{currentUser?.profile?.gender}</p>
                )}
              </div>
            </div>
          </div>

          {/* Physical Stats */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Physical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Height</label>
                {editMode ? (
                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        name="heightFeet"
                        value={profileData.heightFeet}
                        onChange={handleChange}
                        className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {Array.from({length: 5}, (_, i) => i + 4).map(feet => (
                          <option key={feet} value={feet}>{feet}'</option>
                        ))}
                      </select>
                      <select
                        name="heightInches"
                        value={profileData.heightInches}
                        onChange={handleChange}
                        className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {Array.from({length: 12}, (_, i) => i).map(inches => (
                          <option key={inches} value={inches}>{inches}"</option>
                        ))}
                      </select>
                    </div>
                    {errors.height && <p className="text-red-400 text-sm mt-1">{errors.height}</p>}
                  </div>
                ) : (
                  <p className="text-white py-3">
                    {currentUser?.profile?.heightFeet && currentUser?.profile?.heightInches 
                      ? `${currentUser.profile.heightFeet}'${currentUser.profile.heightInches}"`
                      : `${Math.floor((currentUser?.profile?.height || 175) / 2.54 / 12)}'${Math.round(((currentUser?.profile?.height || 175) / 2.54) % 12)}"`
                    }
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Weight (lbs)</label>
                {editMode ? (
                  <div>
                    <input
                      type="number"
                      name="weight"
                      value={profileData.weight}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/10 border ${errors.weight ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      min="50"
                      max="800"
                    />
                    {errors.weight && <p className="text-red-400 text-sm mt-1">{errors.weight}</p>}
                  </div>
                ) : (
                  <p className="text-white py-3">
                    {currentUser?.profile?.weightLbs || Math.round((currentUser?.profile?.weight || 70) * 2.20462)} lbs
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Goal Weight (lbs)</label>
                {editMode ? (
                  <div>
                    <input
                      type="number"
                      name="goalWeight"
                      value={profileData.goalWeight}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min="50"
                      max="800"
                    />
                    {errors.goalWeight && <p className="text-red-400 text-sm mt-1">{errors.goalWeight}</p>}
                  </div>
                ) : (
                  <p className="text-white py-3">
                    {currentUser?.profile?.goalWeightLbs || Math.round((currentUser?.profile?.goalWeight || 65) * 2.20462)} lbs
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Fitness Goals */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Fitness Goals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Goal</label>
                {editMode ? (
                  <select
                    name="goal"
                    value={profileData.goal}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="lose_weight">Lose Weight</option>
                    <option value="gain_muscle">Gain Muscle</option>
                    <option value="maintain">Maintain Current Weight</option>
                    <option value="improve_fitness">Improve Overall Fitness</option>
                  </select>
                ) : (
                  <p className="text-white py-3 capitalize">{currentUser?.profile?.goal?.replace('_', ' ')}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Activity Level</label>
                {editMode ? (
                  <select
                    name="activityLevel"
                    value={profileData.activityLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderately Active (3-5 days/week)</option>
                    <option value="active">Very Active (6-7 days/week)</option>
                    <option value="extra">Extra Active (athlete)</option>
                  </select>
                ) : (
                  <p className="text-white py-3 capitalize">{currentUser?.profile?.activityLevel?.replace('_', ' ')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {editMode && (
            <div className="flex gap-4 pt-6">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={cancelEdit}
                disabled={loading}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;