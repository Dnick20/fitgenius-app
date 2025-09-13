import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, Plus, Weight, Calculator } from 'lucide-react';
import { GlassCard, GlassButton } from '../components/glass/GlassCard';
import { useUserData } from '../context/UserDataContext';

const Progress = ({ userProfile }) => {
  const { currentWeight: contextWeight, updateWeight, addProgressEntry: addToContext } = useUserData() || {};
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [progressEntries, setProgressEntries] = useState(() => {
    const saved = localStorage.getItem('progressEntries');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { date: '2024-09-01', weight: 180, bodyFat: 18, notes: 'Starting my fitness journey!' },
      { date: '2024-08-25', weight: 182, bodyFat: 19, notes: 'Feeling motivated' }
    ];
  });

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '', 
    bodyFat: '', 
    waist: '',
    neck: '',
    hip: '',
    height: userProfile?.heightFeet && userProfile?.heightInches 
      ? (userProfile.heightFeet * 12 + parseInt(userProfile.heightInches)) 
      : 68,
    notes: ''
  });

  // Pre-defined notes options
  const noteOptions = [
    'Feeling great!',
    'Making progress',
    'Stayed consistent',
    'Challenging day',
    'New personal best',
    'Recovery day',
    'High energy',
    'Good nutrition day',
    'Missed workout',
    'Back on track',
    'Feeling stronger',
    'Need more rest',
    'Custom...'
  ];

  // Calculate body fat percentage using Navy Method
  const calculateBodyFat = () => {
    const { waist, neck, hip, height } = newEntry;
    const gender = userProfile?.gender || 'male';
    
    if (waist && neck && height) {
      const waistCm = waist * 2.54;
      const neckCm = neck * 2.54;
      const heightCm = height * 2.54;
      
      let bodyFat;
      if (gender === 'male') {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
      } else {
        // For female, need hip measurement too
        if (hip) {
          const hipCm = hip * 2.54;
          bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
        } else {
          return 'Hip measurement needed';
        }
      }
      
      return Math.round(bodyFat * 10) / 10;
    }
    return '';
  };

  // Auto-calculate body fat when measurements change
  useEffect(() => {
    const gender = userProfile?.gender || 'male';
    if (newEntry.waist && newEntry.neck && (gender === 'male' || newEntry.hip)) {
      const calculated = calculateBodyFat();
      if (calculated && typeof calculated === 'number') {
        setNewEntry(prev => ({ ...prev, bodyFat: calculated }));
      }
    }
  }, [newEntry.waist, newEntry.neck, newEntry.hip, userProfile?.gender]);

  const addProgressEntry = () => {
    if (newEntry.weight) {
      const entryToAdd = {
        ...newEntry,
        weight: parseFloat(newEntry.weight),
        bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : undefined
      };
      
      // Update local progress entries
      const updatedEntries = [entryToAdd, ...progressEntries];
      setProgressEntries(updatedEntries);
      
      // Use UserDataContext to update weight and add progress entry
      if (updateWeight && addToContext) {
        updateWeight(entryToAdd.weight);
        addToContext(entryToAdd);
      } else {
        // Fallback to localStorage if context not available
        localStorage.setItem('progressEntries', JSON.stringify(updatedEntries));
        const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        savedProfile.weightLbs = entryToAdd.weight;
        savedProfile.currentWeight = entryToAdd.weight;
        localStorage.setItem('userProfile', JSON.stringify(savedProfile));
      }
      
      // Reset form
      setNewEntry({ 
        date: new Date().toISOString().split('T')[0], 
        weight: '', 
        bodyFat: '', 
        waist: '',
        neck: '',
        hip: '',
        height: userProfile?.heightFeet && userProfile?.heightInches 
          ? (userProfile.heightFeet * 12 + parseInt(userProfile.heightInches)) 
          : 68,
        notes: '' 
      });
      setShowAddEntry(false);
    }
  };

  // Use consistent weight data sources with Dashboard
  const getUserCurrentWeight = () => {
    // Use context weight if available
    if (contextWeight) {
      return contextWeight;
    }
    
    // Otherwise check saved progress entries
    if (progressEntries.length > 0) {
      return progressEntries[0].weight;
    }
    
    // Then check userProfile for weightLbs
    if (userProfile?.weightLbs) {
      return parseFloat(userProfile.weightLbs);
    }
    
    // Finally check localStorage
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (savedProfile.weightLbs) {
      return parseFloat(savedProfile.weightLbs);
    }
    
    return Math.round((userProfile?.weight || savedProfile?.weight || 68) * 2.20462);
  };

  const getUserGoalWeight = () => {
    // Check userProfile for goalWeightLbs (from account creation)
    if (userProfile?.goalWeightLbs) {
      return parseFloat(userProfile.goalWeightLbs);
    }
    
    // Check localStorage for saved profile
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (savedProfile.goalWeightLbs) {
      return parseFloat(savedProfile.goalWeightLbs);
    }
    
    // Fallback: convert from kg or calculate default
    if (userProfile?.goalWeight || savedProfile?.goalWeight) {
      return Math.round((userProfile?.goalWeight || savedProfile?.goalWeight) * 2.20462);
    }
    
    return getUserCurrentWeight() - 10; // Default to 10 lbs loss
  };

  const currentWeight = getUserCurrentWeight();
  const goalWeight = getUserGoalWeight();
  const weightChange = progressEntries.length > 1 ? progressEntries[0].weight - progressEntries[progressEntries.length - 1].weight : 0;

  // Goal description function to match Dashboard
  const getGoalDescription = (goal) => {
    const goals = {
      lose_weight: 'Lose Weight',
      gain_muscle: 'Gain Muscle',
      maintain: 'Maintain Weight',
      improve_fitness: 'Improve Fitness'
    };
    return goals[goal] || 'Improve Health';
  };

  // Calculate progress expectations based on aggressive 15 lbs/month model
  const getProgressExpectations = () => {
    if (userProfile?.fitness_goal === 'weight_loss' || userProfile?.fitness_goal === 'lose_weight') {
      return {
        weeklyLoss: 0.8, // lbs per week  
        monthlyLoss: 3.4, // lbs per month (0.8 × 4.25 weeks)
        description: 'Using our moderate weight loss approach, you should see approximately 0.8 lbs of weight loss per week.',
        tips: [
          'Track your weight daily and take weekly averages',
          'Focus on the trend rather than daily fluctuations', 
          'Expect faster results in the first 2-3 weeks',
          'Stay consistent with your moderate calorie deficit and exercise plan'
        ]
      };
    }
    return null;
  };

  const progressExpectations = getProgressExpectations();

  const achievements = [
    { title: 'First Workout', description: 'Completed your first workout', earned: true, icon: '🏋️' },
    { title: 'Goal Getter', description: 'Lost 5 pounds', earned: weightChange <= -5, icon: '🎯' },
    { title: 'Steady Progress', description: 'Lost 5+ pounds consistently', earned: weightChange <= -5, icon: '⚡' },
    { title: 'Consistency King', description: 'Logged progress for 7 days straight', earned: progressEntries.length >= 7, icon: '👑' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Progress Tracking
          </h1>
          <p className="text-gray-300">Monitor your fitness journey and celebrate achievements</p>
        </div>
        <button onClick={() => setShowAddEntry(!showAddEntry)} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center">
          <Plus className="w-5 h-5 mr-2" />Add Entry
        </button>
      </div>

      {showAddEntry && (
        <GlassCard intensity="strong" className="p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Log Your Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input 
                type="date" 
                value={newEntry.date} 
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} 
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Weight (lbs)</label>
              <input 
                type="number" 
                value={newEntry.weight} 
                onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})} 
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="180" 
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
              <select 
                value={newEntry.notes} 
                onChange={(e) => {
                  if (e.target.value === 'Custom...') {
                    setNewEntry({...newEntry, notes: ''});
                  } else {
                    setNewEntry({...newEntry, notes: e.target.value});
                  }
                }} 
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select or enter note...</option>
                {noteOptions.map(option => (
                  <option key={option} value={option} className="bg-gray-800">{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Body Fat Calculator Section */}
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-3">
              <Calculator className="w-5 h-5 text-blue-400 mr-2" />
              <h4 className="text-sm font-medium text-white">Body Fat Calculator (Navy Method)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Waist (inches)</label>
                <input 
                  type="number" 
                  value={newEntry.waist} 
                  onChange={(e) => setNewEntry({...newEntry, waist: e.target.value})} 
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" 
                  placeholder="32"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Neck (inches)</label>
                <input 
                  type="number" 
                  value={newEntry.neck} 
                  onChange={(e) => setNewEntry({...newEntry, neck: e.target.value})} 
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" 
                  placeholder="15"
                  step="0.5"
                />
              </div>
              {(userProfile?.gender === 'female') && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Hip (inches)</label>
                  <input 
                    type="number" 
                    value={newEntry.hip} 
                    onChange={(e) => setNewEntry({...newEntry, hip: e.target.value})} 
                    className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" 
                    placeholder="36"
                    step="0.5"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Height (inches)</label>
                <input 
                  type="number" 
                  value={newEntry.height} 
                  onChange={(e) => setNewEntry({...newEntry, height: e.target.value})} 
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" 
                  placeholder="68"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Calculated Body Fat %</label>
                <div className="px-2 py-1 bg-blue-500/20 border border-blue-400/40 rounded text-blue-300 text-sm font-medium">
                  {typeof newEntry.bodyFat === 'number' ? newEntry.bodyFat + '%' : newEntry.bodyFat || '--'}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Enter waist, neck{userProfile?.gender === 'female' ? ', and hip' : ''} measurements for automatic body fat calculation</p>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addProgressEntry} className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">Save Entry</button>
            <button onClick={() => setShowAddEntry(false)} className="px-6 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors">Cancel</button>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard intensity="strong" className="p-6 glass-blue">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Current Weight</h3>
            <Weight className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{currentWeight} lbs</div>
          <div className="text-xs text-gray-400">Goal: {goalWeight} lbs</div>
          <div className="text-xs text-green-400 mt-1">Context: {contextWeight || 'Loading...'} lbs</div>
        </GlassCard>
        
        <GlassCard intensity="strong" className="p-6 glass-green">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Weight Change</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className={`text-2xl font-bold ${weightChange < 0 ? 'text-green-400' : weightChange > 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {weightChange !== 0 ? (weightChange > 0 ? '+' : '') + weightChange.toFixed(1) : '0'} lbs
          </div>
          <div className="text-xs text-gray-400">Total change</div>
        </GlassCard>
        
        <GlassCard intensity="strong" className="p-6 glass-orange">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">To Goal</h3>
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{Math.abs(currentWeight - goalWeight).toFixed(1)} lbs</div>
          <div className="text-xs text-gray-400">{currentWeight > goalWeight ? 'to lose' : 'to gain'}</div>
        </GlassCard>
        
        <GlassCard intensity="strong" className="p-6 glass-purple">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Goal</h3>
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{getGoalDescription(userProfile?.goal || userProfile?.fitness_goal)}</div>
          <div className="text-xs text-gray-400 capitalize">
            {userProfile?.activityLevel} activity
            {userProfile?.is75Hard && (
              <div className="text-purple-400 font-semibold mt-1">75 Hard Challenge</div>
            )}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard intensity="strong" className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Progress Chart</h3>
          <div className="h-64 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>Interactive chart coming soon!</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard intensity="strong" className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className={`p-4 rounded-xl border ${achievement.earned ? 'bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${achievement.earned ? 'text-white' : 'text-gray-400'}`}>{achievement.title}</h4>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                  {achievement.earned && <Award className="w-5 h-5 text-yellow-400" />}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Progress Expectations Section */}
      {progressExpectations && (
        <div className="mt-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 backdrop-blur-xl p-6 rounded-2xl border border-green-500/20 shadow-2xl">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-400 mr-2" />
            <h3 className="text-xl font-semibold text-white">Expected Progress - Sustainable Weight Loss</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 p-4 rounded-xl">
              <h4 className="text-white font-medium mb-3">Your Targets</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Weekly Loss:</span>
                  <span className="text-green-400 font-bold">{progressExpectations.weeklyLoss} lbs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Monthly Loss:</span>
                  <span className="text-green-400 font-bold">{progressExpectations.monthlyLoss} lbs</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 p-4 rounded-xl">
              <h4 className="text-white font-medium mb-3">Success Tips</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                {progressExpectations.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-400 mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
            <p className="text-sm text-green-200 text-center">
              ⚡ {progressExpectations.description}
            </p>
          </div>
        </div>
      )}

      <GlassCard intensity="strong" className="p-6 mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Entries</h3>
        <div className="space-y-3">
          {progressEntries.slice(0, 5).map((entry, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="text-white font-medium">{new Date(entry.date).toLocaleDateString()}</div>
                <div className="text-gray-400">{entry.weight} lbs{entry.bodyFat && ` • ${entry.bodyFat}% BF`}</div>
                {entry.notes && <div className="text-gray-500 text-sm">"{entry.notes}"</div>}
              </div>
              <div className="text-gray-400 text-sm">{index === 0 ? 'Latest' : `${index + 1} entries ago`}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default Progress;