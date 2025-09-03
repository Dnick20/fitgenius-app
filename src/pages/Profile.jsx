import React, { useState, useEffect } from "react";
import { UserProfile } from "@/entities/all";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// Removed Badge import as its usage pattern is changing from clickable badge to checkbox with label
import { motion } from "framer-motion";
import { User as UserIcon, Target, Calculator, Sparkles, CheckCircle } from "lucide-react";
import AllergyManager from "../components/profile/AllergyManager";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    current_weight: '',
    goal_weight: '',
    height_feet: '',
    height_inches: '',
    age: '',
    gender: '',
    body_type: '',
    activity_level: '',
    fitness_goal: '',
    dietary_preferences: [],
    // Changed from food_allergies to allergies
    allergies: [],
    workout_preferences: [],
    available_equipment: [],
    weekly_workout_days: 3
  });
  const [existingProfile, setExistingProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const profiles = await UserProfile.filter({ created_by: userData.email });
      if (profiles.length > 0) {
        setExistingProfile(profiles[0]);
        // Ensure allergies is always an array when loading
        setProfile({ ...profiles[0], allergies: profiles[0].allergies || [] });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const calculateTargets = async () => {
    setIsCalculating(true);
    try {
      const prompt = `Calculate personalized nutrition and fitness targets for a person with the following details:
      - Current weight: ${profile.current_weight} lbs
      - Goal weight: ${profile.goal_weight} lbs
      - Height: ${profile.height_feet}'${profile.height_inches}"
      - Age: ${profile.age} years
      - Gender: ${profile.gender}
      - Body type: ${profile.body_type}
      - Activity level: ${profile.activity_level}
      - Fitness goal: ${profile.fitness_goal}
      - Workout days per week: ${profile.weekly_workout_days}

      Please provide accurate daily calorie target and macro targets (protein, carbs, fat in grams) based on this information. Use established nutrition science and formulas like Harris-Benedict or Mifflin-St Jeor.`;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            daily_calorie_target: { type: "number" },
            protein_target: { type: "number" },
            carb_target: { type: "number" },
            fat_target: { type: "number" }
          }
        }
      });

      setProfile(prev => ({
        ...prev,
        ...result
      }));
    } catch (error) {
      console.error("Error calculating targets:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // If this is a new profile, set the initial weight
      const isNewProfile = !existingProfile;
      const profileToSave = { 
        ...profile, 
        allergies: profile.allergies || [],
        initial_weight: isNewProfile ? profile.current_weight : existingProfile.initial_weight,
      };

      if (existingProfile) {
        await UserProfile.update(existingProfile.id, profileToSave);
      } else {
        await UserProfile.create(profileToSave);
      }
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      loadProfile(); // Reload to get the latest data
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArrayChange = (field, value, checked) => {
    setProfile(prev => ({
      ...prev,
      // Ensure prev[field] is an array before operations
      [field]: checked 
        ? [...(prev[field] || []), value]
        : (prev[field] || []).filter(item => item !== value)
    }));
  };

  const dietaryOptions = ['vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean', 'gluten_free', 'dairy_free', 'low_carb', 'high_protein'];
  const workoutOptions = ['strength_training', 'cardio', 'hiit', 'yoga', 'pilates', 'dance', 'boxing', 'running', 'cycling', 'swimming'];
  const equipmentOptions = ['dumbbells', 'resistance_bands', 'yoga_mat', 'treadmill', 'bike', 'pull_up_bar', 'kettlebells', 'none'];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <UserIcon className="w-8 h-8 text-orange-400" />
            Fitness Profile
          </h1>
          <p className="text-gray-300 text-lg">Personalize your fitness and nutrition journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Your Information</h2>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8"> {/* Changed space-y-6 to space-y-8 */}
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Changed gap-4 to gap-6 */}
                  <div className="space-y-2">
                    <Label htmlFor="current_weight" className="text-gray-300 font-medium">Current Weight (lbs)</Label>
                    <Input
                      id="current_weight"
                      type="number"
                      value={profile.current_weight}
                      onChange={(e) => setProfile({...profile, current_weight: parseFloat(e.target.value)})}
                      required
                      className="bg-white/10 border-white/20 text-white rounded-xl focus:ring-orange-500 focus:border-orange-500"
                      placeholder="150"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goal_weight" className="text-gray-300 font-medium">Goal Weight (lbs)</Label>
                    <Input
                      id="goal_weight"
                      type="number"
                      value={profile.goal_weight}
                      onChange={(e) => setProfile({...profile, goal_weight: parseFloat(e.target.value)})}
                      required
                      className="bg-white/10 border-white/20 text-white rounded-xl focus:ring-orange-500 focus:border-orange-500"
                      placeholder="140"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 font-medium">Height</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Feet"
                        value={profile.height_feet}
                        onChange={(e) => setProfile({...profile, height_feet: parseInt(e.target.value)})}
                        className="bg-white/10 border-white/20 text-white rounded-xl focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Inches"
                        value={profile.height_inches}
                        onChange={(e) => setProfile({...profile, height_inches: parseInt(e.target.value)})}
                        className="bg-white/10 border-white/20 text-white rounded-xl focus:ring-orange-500 focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-gray-300 font-medium">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age}
                      onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                      required
                      className="bg-white/10 border-white/20 text-white rounded-xl focus:ring-orange-500 focus:border-orange-500"
                      placeholder="25"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-gray-300 font-medium">Gender</Label>
                    <Select value={profile.gender || ''} onValueChange={(value) => setProfile({...profile, gender: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl focus:ring-orange-500 focus:border-orange-500">
                        <SelectValue placeholder="Select gender" className="text-gray-400" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        <SelectItem value="male" className="text-white hover:bg-white/10">Male</SelectItem>
                        <SelectItem value="female" className="text-white hover:bg-white/10">Female</SelectItem>
                        <SelectItem value="other" className="text-white hover:bg-white/10">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body_type" className="text-gray-300 font-medium">Body Type</Label>
                    <Select value={profile.body_type || ''} onValueChange={(value) => setProfile({...profile, body_type: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl focus:ring-orange-500 focus:border-orange-500">
                        <SelectValue placeholder="Select body type" className="text-gray-400" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        <SelectItem value="ectomorph" className="text-white hover:bg-white/10">Ectomorph (Lean build)</SelectItem>
                        <SelectItem value="mesomorph" className="text-white hover:bg-white/10">Mesomorph (Athletic build)</SelectItem>
                        <SelectItem value="endomorph" className="text-white hover:bg-white/10">Endomorph (Stockier build)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Activity & Goals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Changed gap-4 to gap-6 */}
                  <div className="space-y-2">
                    <Label htmlFor="activity_level" className="text-gray-300 font-medium">Activity Level</Label>
                    <Select value={profile.activity_level || ''} onValueChange={(value) => setProfile({...profile, activity_level: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl focus:ring-orange-500 focus:border-orange-500">
                        <SelectValue placeholder="Select activity level" className="text-gray-400" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        <SelectItem value="sedentary" className="text-white hover:bg-white/10">Sedentary (office job)</SelectItem>
                        <SelectItem value="lightly_active" className="text-white hover:bg-white/10">Lightly Active</SelectItem>
                        <SelectItem value="moderately_active" className="text-white hover:bg-white/10">Moderately Active</SelectItem>
                        <SelectItem value="very_active" className="text-white hover:bg-white/10">Very Active</SelectItem>
                        <SelectItem value="extremely_active" className="text-white hover:bg-white/10">Extremely Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fitness_goal" className="text-gray-300 font-medium">Primary Fitness Goal</Label>
                    <Select value={profile.fitness_goal || ''} onValueChange={(value) => setProfile({...profile, fitness_goal: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl focus:ring-orange-500 focus:border-orange-500">
                        <SelectValue placeholder="Select goal" className="text-gray-400" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-white/20">
                        <SelectItem value="weight_loss" className="text-white hover:bg-white/10">Weight Loss</SelectItem>
                        <SelectItem value="muscle_gain" className="text-white hover:bg-white/10">Muscle Gain</SelectItem>
                        <SelectItem value="maintenance" className="text-white hover:bg-white/10">Maintenance</SelectItem>
                        <SelectItem value="athletic_performance" className="text-white hover:bg-white/10">Athletic Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Dietary Preferences */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-white">Dietary Preferences</Label>
                  <div className="flex flex-wrap gap-3"> {/* Changed gap-2 to gap-3 */}
                    {dietaryOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={profile.dietary_preferences?.includes(option)}
                          onCheckedChange={(checked) => handleArrayChange('dietary_preferences', option, checked)}
                          className="border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <Label
                          htmlFor={option}
                          className="font-normal capitalize cursor-pointer text-gray-300"
                        >
                          {option.replace(/_/g, ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Allergy Manager component */}
                <AllergyManager
                  allergies={profile.allergies}
                  setAllergies={(newAllergies) => setProfile(prev => ({ ...prev, allergies: newAllergies }))}
                />

                {/* Workout Preferences */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-white">Workout Preferences</Label>
                  <div className="flex flex-wrap gap-3"> {/* Changed gap-2 to gap-3 */}
                    {workoutOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`workout_${option}`}
                          checked={profile.workout_preferences?.includes(option)}
                          onCheckedChange={(checked) => handleArrayChange('workout_preferences', option, checked)}
                          className="border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                         <Label
                          htmlFor={`workout_${option}`}
                          className="font-normal capitalize cursor-pointer text-gray-300"
                        >
                          {option.replace(/_/g, ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Equipment */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-white">Available Equipment</Label>
                  <div className="flex flex-wrap gap-3"> {/* Changed gap-2 to gap-3 */}
                    {equipmentOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`equipment_${option}`}
                          checked={profile.available_equipment?.includes(option)}
                          onCheckedChange={(checked) => handleArrayChange('available_equipment', option, checked)}
                          className="border-white/30 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                         <Label
                          htmlFor={`equipment_${option}`}
                          className="font-normal capitalize cursor-pointer text-gray-300"
                        >
                          {option.replace(/_/g, ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Workout Days */}
                <div className="space-y-2">
                  <Label htmlFor="weekly_workout_days" className="text-gray-300 font-medium">Workout Days Per Week</Label>
                  <Input
                    id="weekly_workout_days"
                    type="number"
                    min="1"
                    max="7"
                    value={profile.weekly_workout_days}
                    onChange={(e) => setProfile({...profile, weekly_workout_days: parseInt(e.target.value)})}
                    className="bg-white/10 border-white/20 text-white rounded-xl focus:ring-orange-500 focus:border-orange-500"
                    placeholder="3"
                  />
                </div>

                {/* Calculate Targets Button */}
                {profile.current_weight && profile.goal_weight && profile.height_feet && profile.age && (
                  <div className="pt-4">
                    <Button
                      type="button"
                      onClick={calculateTargets}
                      disabled={isCalculating}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl"
                    >
                      {isCalculating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Calculator className="mr-2 w-4 h-4" />
                          Calculate Nutrition Targets
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Calculated Targets Display */}
                {profile.daily_calorie_target && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl"> {/* Changed p-4 to p-6 */}
                    <h3 className="font-semibold text-emerald-400 mb-4 flex items-center gap-2 text-lg"> {/* Changed mb-3 to mb-4, added text-lg */}
                      <Sparkles className="w-5 h-5" /> {/* Changed w-4 h-4 to w-5 h-5 */}
                      Your Personalized Targets
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-3xl font-bold text-white">{Math.round(profile.daily_calorie_target)}</p> {/* Changed text-2xl to text-3xl */}
                        <p className="text-sm text-gray-300">Calories/day</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-emerald-400">{Math.round(profile.protein_target)}g</p> {/* Changed text-2xl to text-3xl */}
                        <p className="text-sm text-gray-300">Protein</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-blue-400">{Math.round(profile.carb_target)}g</p> {/* Changed text-2xl to text-3xl */}
                        <p className="text-sm text-gray-300">Carbs</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-orange-400">{Math.round(profile.fat_target)}g</p> {/* Changed text-2xl to text-3xl */}
                        <p className="text-sm text-gray-300">Fat</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 rounded-xl text-lg font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Saving Profile...
                      </>
                    ) : isSaved ? (
                      <>
                        <CheckCircle className="mr-2 w-5 h-5" />
                        Profile Saved!
                      </>
                    ) : (
                      'Save Profile'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}