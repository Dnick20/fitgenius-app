import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const COMMON_ALLERGIES = [
  'Milk', 'Eggs', 'Peanuts', 'Tree Nuts', 'Soy', 'Wheat', 
  'Fish', 'Shellfish', 'Sesame', 'Mustard', 'Celery', 'Lupin', 'Molluscs'
];

export default function AllergyManager({ allergies = [], setAllergies }) {
  const handleStatusChange = (name, status) => {
    const existingIndex = allergies.findIndex(a => a.name === name);
    let newAllergies = [...allergies];

    if (existingIndex > -1) {
      if (status === 'include') {
        newAllergies.splice(existingIndex, 1);
      } else {
        newAllergies[existingIndex] = { name, status };
      }
    } else if (status !== 'include') {
      newAllergies.push({ name, status });
    }
    setAllergies(newAllergies);
  };

  const getStatus = (name) => {
    return allergies.find(a => a.name === name)?.status || 'include';
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Allergy Management</Label>
      <p className="text-sm text-slate-500">
        Specify how to handle common allergens in your meal plans.
      </p>
      <div className="space-y-6">
        {COMMON_ALLERGIES.map(allergy => (
          <div key={allergy} className="p-4 border rounded-xl bg-slate-50/50">
            <Label className="font-semibold text-slate-800">{allergy}</Label>
            <RadioGroup
              defaultValue="include"
              value={getStatus(allergy)}
              onValueChange={(value) => handleStatusChange(allergy, value)}
              className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="include" id={`${allergy}-include`} />
                <Label htmlFor={`${allergy}-include`} className="font-normal cursor-pointer">Include</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cooked_only" id={`${allergy}-cooked`} />
                <Label htmlFor={`${allergy}-cooked`} className="font-normal cursor-pointer">Cooked Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exclude" id={`${allergy}-exclude`} />
                <Label htmlFor={`${allergy}-exclude`} className="font-normal cursor-pointer">Exclude</Label>
              </div>
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );
}