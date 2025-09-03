import React from 'react';
import { motion } from 'framer-motion';

const avatarStyles = {
  male: {
    0: { emoji: '🚶‍♂️', color: 'from-gray-400 to-gray-500', label: 'Getting Started' },
    25: { emoji: '🏃‍♂️', color: 'from-blue-400 to-blue-500', label: 'Building Momentum' },
    50: { emoji: '💪', color: 'from-orange-400 to-orange-500', label: 'Getting Stronger' },
    75: { emoji: '🏋️‍♂️', color: 'from-purple-400 to-purple-500', label: 'Nearly There' },
    100: { emoji: '🏆', color: 'from-yellow-400 to-yellow-500', label: 'Champion!' }
  },
  female: {
    0: { emoji: '🚶‍♀️', color: 'from-gray-400 to-gray-500', label: 'Getting Started' },
    25: { emoji: '🏃‍♀️', color: 'from-pink-400 to-pink-500', label: 'Building Momentum' },
    50: { emoji: '🤸‍♀️', color: 'from-purple-400 to-purple-500', label: 'Getting Stronger' },
    75: { emoji: '🏋️‍♀️', color: 'from-emerald-400 to-emerald-500', label: 'Nearly There' },
    100: { emoji: '🏆', color: 'from-yellow-400 to-yellow-500', label: 'Champion!' }
  },
  other: {
    0: { emoji: '🌱', color: 'from-gray-400 to-gray-500', label: 'Getting Started' },
    25: { emoji: '🌿', color: 'from-green-400 to-green-500', label: 'Growing Strong' },
    50: { emoji: '⚡', color: 'from-blue-400 to-blue-500', label: 'Energized' },
    75: { emoji: '🔥', color: 'from-orange-400 to-orange-500', label: 'On Fire' },
    100: { emoji: '✨', color: 'from-purple-400 to-purple-500', label: 'Transformed!' }
  }
};

export default function ProgressAvatar({ gender = 'other', progress = 0 }) {
  const getStage = (p) => {
    if (p >= 100) return 100;
    if (p >= 75) return 75;
    if (p >= 50) return 50;
    if (p >= 25) return 25;
    return 0;
  };

  const stage = getStage(progress);
  const validGender = ['male', 'female'].includes(gender) ? gender : 'other';
  const avatar = avatarStyles[validGender][stage];

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        key={stage}
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-32 h-32 bg-gradient-to-br ${avatar.color} rounded-full flex items-center justify-center shadow-xl`}
      >
        <span className="text-5xl">{avatar.emoji}</span>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-lg font-semibold text-slate-700"
      >
        {avatar.label}
      </motion.p>
      
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        className="mt-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full shadow-inner"
        style={{ width: '120px' }}
      >
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full transition-all duration-700"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </motion.div>
      
      <p className="text-sm text-slate-500 mt-1">
        {Math.round(progress)}% to goal
      </p>
    </div>
  );
}