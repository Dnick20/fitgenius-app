import React, { useState, useEffect, useCallback } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Square, ShoppingCart, MapPin, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORE_OPTIONS = [
  { id: 'kroger', name: 'Kroger', color: 'bg-blue-100 text-blue-700' },
  { id: 'walmart', name: 'Walmart', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'meijer', name: 'Meijer', color: 'bg-red-100 text-red-700' }
];

export default function ShoppingList({ plan, onClose }) {
  const [selectedStore, setSelectedStore] = useState('kroger');
  const [organizedList, setOrganizedList] = useState(null);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [isOrganizing, setIsOrganizing] = useState(false);

  const organizeShoppingList = useCallback(async () => {
    setIsOrganizing(true);
    try {
      const storeName = STORE_OPTIONS.find(s => s.id === selectedStore)?.name;
      
      const prompt = `Act as a grocery store layout expert for ${storeName}. Organize the following shopping list by store sections and provide aisle information.

Shopping List Items: ${plan.shopping_list.join(', ')}

Please organize these items by typical ${storeName} store layout sections. Group items logically and provide estimated aisle numbers or store areas.

Return the organized list grouped by sections like: Produce, Dairy, Meat & Seafood, Pantry/Dry Goods, Frozen, Bakery, etc.

For each item, include:
- The item name
- Estimated aisle number or store area
- Any helpful location notes

Make this practical for efficient shopping at ${storeName}.`;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            organized_sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  section_name: { type: "string" },
                  aisle_info: { type: "string" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        location_note: { type: "string" }
                      }
                    }
                  }
                }
              }
            },
            shopping_tips: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setOrganizedList(result);
    } catch (error) {
      console.error("Error organizing shopping list:", error);
    } finally {
      setIsOrganizing(false);
    }
  }, [selectedStore, plan.shopping_list]);

  useEffect(() => {
    if (plan.shopping_list && plan.shopping_list.length > 0) {
      organizeShoppingList();
    }
  }, [organizeShoppingList]);

  const toggleItem = (itemName) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemName)) {
      newChecked.delete(itemName);
    } else {
      newChecked.add(itemName);
    }
    setCheckedItems(newChecked);
  };

  const getProgress = () => {
    if (!organizedList) return 0;
    const totalItems = organizedList.organized_sections?.reduce((sum, section) => sum + section.items.length, 0) || 0;
    return totalItems > 0 ? (checkedItems.size / totalItems) * 100 : 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden glass-card border-0 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Shopping List - {plan.name}
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STORE_OPTIONS.map(store => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" onClick={onClose}>✕</Button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <Badge className={STORE_OPTIONS.find(s => s.id === selectedStore)?.color}>
              <MapPin className="w-3 h-3 mr-1" />
              {STORE_OPTIONS.find(s => s.id === selectedStore)?.name}
            </Badge>
            <Badge variant="outline">
              {Math.round(getProgress())}% Complete ({checkedItems.size} items)
            </Badge>
          </div>
        </CardHeader>

        <div className="overflow-auto max-h-[calc(90vh-140px)]">
          <CardContent className="p-6">
            {isOrganizing ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4" />
                  <p className="text-slate-600">Organizing your shopping list...</p>
                </div>
              </div>
            ) : organizedList ? (
              <div className="space-y-6">
                {organizedList.organized_sections?.map((section, sectionIndex) => (
                  <motion.div
                    key={section.section_name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                  >
                    <Card className="glass-card border border-slate-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span className="capitalize">{section.section_name}</span>
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {section.aisle_info}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {section.items.map((item, itemIndex) => (
                            <motion.div
                              key={`${section.section_name}-${itemIndex}`}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                checkedItems.has(item.name) 
                                  ? 'bg-emerald-50 text-emerald-800' 
                                  : 'hover:bg-slate-50'
                              }`}
                              onClick={() => toggleItem(item.name)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {checkedItems.has(item.name) ? (
                                <CheckSquare className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-400" />
                              )}
                              <div className="flex-1">
                                <p className={`font-medium ${checkedItems.has(item.name) ? 'line-through' : ''}`}>
                                  {item.name}
                                </p>
                                {item.location_note && (
                                  <p className="text-xs text-slate-500">{item.location_note}</p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* Shopping Tips */}
                {organizedList.shopping_tips && organizedList.shopping_tips.length > 0 && (
                  <Card className="glass-card border border-blue-200 bg-blue-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Shopping Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {organizedList.shopping_tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                            <span className="text-blue-500 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No shopping list available for this meal plan</p>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}