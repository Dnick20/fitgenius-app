import React, { useState } from 'react';

export const ExpandableCard = ({ 
  title, 
  subtitle, 
  content, 
  expandedContent, 
  icon, 
  color = 'emerald',
  type = 'meal' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const colorClasses = {
    emerald: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500 to-green-500'
    },
    orange: {
      border: 'border-orange-500', 
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      gradient: 'from-orange-500 to-red-500'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`linear-card ${isExpanded ? colors.bg : ''} transition-all duration-300`}>
      <div 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{icon}</span>
            <div>
              <h4 className="font-semibold text-white">{title}</h4>
              {subtitle && <p className={`text-sm ${colors.text}`}>{subtitle}</p>}
            </div>
          </div>
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        <div className="text-gray-300 text-sm">
          {content}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/20 animate-fade-in">
          {expandedContent}
        </div>
      )}
    </div>
  );
};

export const MealCard = ({ meal, isSelected, onClick }) => {
  const expandedContent = (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/10 rounded-lg p-2">
          <div className="text-emerald-400 font-semibold">{meal.protein}g</div>
          <div className="text-xs text-gray-400">Protein</div>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <div className="text-yellow-400 font-semibold">{meal.carbs}g</div>
          <div className="text-xs text-gray-400">Carbs</div>
        </div>
        <div className="bg-white/10 rounded-lg p-2">
          <div className="text-purple-400 font-semibold">{meal.fat}g</div>
          <div className="text-xs text-gray-400">Fat</div>
        </div>
      </div>
      
      {meal.ingredients && (
        <div>
          <h5 className="text-white font-medium mb-2">Ingredients:</h5>
          <div className="flex flex-wrap gap-2">
            {meal.ingredients.map((ingredient, index) => (
              <span key={index} className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-xs">
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <button 
        onClick={() => onClick(meal)}
        className={`w-full py-2 rounded-lg font-medium transition-all ${
          isSelected 
            ? 'bg-emerald-500 text-white' 
            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
        }`}
      >
        {isSelected ? 'Selected ✓' : 'Select Meal'}
      </button>
    </div>
  );

  return (
    <ExpandableCard
      title={meal.name}
      subtitle={`${meal.calories} calories`}
      content={meal.description}
      expandedContent={expandedContent}
      icon="🍽️"
      color="emerald"
      type="meal"
    />
  );
};

export const WorkoutCard = ({ workout, isSelected, onClick }) => {
  const expandedContent = (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-orange-400 font-semibold">{workout.duration} min</div>
          <div className="text-xs text-gray-400">Duration</div>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="text-red-400 font-semibold">{workout.difficulty}</div>
          <div className="text-xs text-gray-400">Difficulty</div>
        </div>
      </div>
      
      {workout.exercises && (
        <div>
          <h5 className="text-white font-medium mb-2">Exercises:</h5>
          <div className="space-y-2">
            {workout.exercises.slice(0, 3).map((exercise, index) => (
              <div key={index} className="flex justify-between items-center bg-white/10 rounded p-2">
                <span className="text-white text-sm">{exercise.name}</span>
                <span className="text-orange-400 text-xs">{exercise.sets}x{exercise.reps}</span>
              </div>
            ))}
            {workout.exercises.length > 3 && (
              <div className="text-center text-gray-400 text-sm">
                +{workout.exercises.length - 3} more exercises
              </div>
            )}
          </div>
        </div>
      )}
      
      <button 
        onClick={() => onClick(workout)}
        className={`w-full py-2 rounded-lg font-medium transition-all ${
          isSelected 
            ? 'bg-orange-500 text-white' 
            : 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
        }`}
      >
        {isSelected ? 'Selected ✓' : 'Select Workout'}
      </button>
    </div>
  );

  return (
    <ExpandableCard
      title={workout.name}
      subtitle={`${workout.category} • ${workout.duration} min`}
      content={workout.description}
      expandedContent={expandedContent}
      icon="💪"
      color="orange"
      type="workout"
    />
  );
};

export default { ExpandableCard, MealCard, WorkoutCard };