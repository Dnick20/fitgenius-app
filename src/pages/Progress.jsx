import React, { useState } from 'react';
import { TrendingUp, Target, Award, Plus, Weight } from 'lucide-react';

const Progress = ({ userProfile }) => {
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [progressEntries, setProgressEntries] = useState([
    { date: '2024-09-01', weight: 180, bodyFat: 18, notes: 'Starting my fitness journey!' },
    { date: '2024-08-25', weight: 182, bodyFat: 19, notes: 'Feeling motivated' }
  ]);

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '', bodyFat: '', notes: ''
  });

  const addProgressEntry = () => {
    if (newEntry.weight) {
      setProgressEntries([newEntry, ...progressEntries]);
      setNewEntry({ date: new Date().toISOString().split('T')[0], weight: '', bodyFat: '', notes: '' });
      setShowAddEntry(false);
    }
  };

  // Use consistent weight data sources with Dashboard
  const getUserCurrentWeight = () => {
    if (progressEntries.length > 0) {
      return progressEntries[0].weight; // Most recent progress entry
    }
    return userProfile?.weightLbs || Math.round((userProfile?.weight || 68) * 2.20462); // Convert from kg to lbs
  };

  const getUserGoalWeight = () => {
    return userProfile?.goalWeightLbs || Math.round((userProfile?.goalWeight || getUserCurrentWeight() - 10) * 2.20462);
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

  const achievements = [
    { title: 'First Workout', description: 'Completed your first workout', earned: true, icon: '🏋️' },
    { title: 'Goal Getter', description: 'Lost 5 pounds', earned: weightChange <= -5, icon: '🎯' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">Progress Tracking</h1>
          <p className="text-gray-300">Monitor your fitness journey and celebrate achievements</p>
        </div>
        <button onClick={() => setShowAddEntry(!showAddEntry)} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center">
          <Plus className="w-5 h-5 mr-2" />Add Entry
        </button>
      </div>

      {showAddEntry && (
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Log Your Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input type="date" value={newEntry.date} onChange={(e) => setNewEntry({...newEntry, date: e.target.value})} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Weight (lbs)</label>
              <input type="number" value={newEntry.weight} onChange={(e) => setNewEntry({...newEntry, weight: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="180" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Body Fat %</label>
              <input type="number" value={newEntry.bodyFat} onChange={(e) => setNewEntry({...newEntry, bodyFat: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="18" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
              <input type="text" value={newEntry.notes} onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="How are you feeling?" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addProgressEntry} className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">Save Entry</button>
            <button onClick={() => setShowAddEntry(false)} className="px-6 py-2 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Current Weight</h3>
            <Weight className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{currentWeight} lbs</div>
          <div className="text-xs text-gray-400">Goal: {goalWeight} lbs</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Weight Change</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className={`text-2xl font-bold ${weightChange < 0 ? 'text-green-400' : weightChange > 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {weightChange !== 0 ? (weightChange > 0 ? '+' : '') + weightChange.toFixed(1) : '0'} lbs
          </div>
          <div className="text-xs text-gray-400">Total change</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">To Goal</h3>
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{Math.abs(currentWeight - goalWeight).toFixed(1)} lbs</div>
          <div className="text-xs text-gray-400">{currentWeight > goalWeight ? 'to lose' : 'to gain'}</div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Goal</h3>
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{getGoalDescription(userProfile?.goal)}</div>
          <div className="text-xs text-gray-400 capitalize">
            {userProfile?.activityLevel} activity
            {userProfile?.is75Hard && (
              <div className="text-purple-400 font-semibold mt-1">75 Hard Challenge</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-4">Progress Chart</h3>
          <div className="h-64 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>Interactive chart coming soon!</p>
            </div>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
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
        </div>
      </div>

      <div className="mt-8 bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
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
      </div>
    </div>
  );
};

export default Progress;