/**
 * GroceryIntelligenceBot - Advanced Grocery List Enhancement
 * Captain Bot deployment for grocery optimization with pricing intelligence
 */

class GroceryIntelligenceBot {
  constructor() {
    this.name = 'GroceryIntelligenceBot';
    this.version = '1.0.0';
    this.status = 'active';
    this.deployedBy = 'Captain Bot';
    
    // Supported grocery chains with pricing tiers
    this.groceryChains = {
      walmart: {
        name: 'Walmart',
        priceMultiplier: 0.85, // 15% below average
        delivery: {
          available: true,
          fee: 9.95,
          freeThreshold: 35
        },
        categories: {
          protein: 0.82,
          vegetables: 0.88,
          fruits: 0.85,
          grains: 0.80,
          dairy: 0.85,
          nuts: 0.90
        }
      },
      kroger: {
        name: 'Kroger',
        priceMultiplier: 1.0, // Average market price
        delivery: {
          available: true,
          fee: 11.95,
          freeThreshold: 60
        },
        categories: {
          protein: 1.0,
          vegetables: 0.95,
          fruits: 0.98,
          grains: 1.02,
          dairy: 0.92,
          nuts: 1.05
        }
      },
      wholefoods: {
        name: 'Whole Foods',
        priceMultiplier: 1.35, // 35% above average (premium organic)
        delivery: {
          available: true,
          fee: 4.95, // Amazon Prime benefit
          freeThreshold: 35
        },
        categories: {
          protein: 1.45,
          vegetables: 1.25,
          fruits: 1.30,
          grains: 1.40,
          dairy: 1.35,
          nuts: 1.20
        }
      }
    };

    // Store-specific pricing database (simulated API responses)
    this.storePricing = {
      walmart: {
        'chicken breast': { price: 4.98, unit: 'lb', brand: 'Great Value', size: '1 lb', inStock: true, url: 'walmart.com/ip/chicken-breast' },
        'ground turkey': { price: 4.78, unit: 'lb', brand: 'Butterball', size: '1 lb', inStock: true, url: 'walmart.com/ip/ground-turkey' },
        'salmon fillet': { price: 9.98, unit: 'lb', brand: 'Great Value Atlantic', size: '1 lb', inStock: true, url: 'walmart.com/ip/salmon-fillet' },
        'eggs': { price: 2.84, unit: 'dozen', brand: 'Great Value Large', size: '12 count', inStock: true, url: 'walmart.com/ip/eggs-large' },
        'greek yogurt': { price: 4.98, unit: '32oz', brand: 'Great Value Plain', size: '32 oz', inStock: true, url: 'walmart.com/ip/greek-yogurt' },
        'milk': { price: 3.68, unit: 'gallon', brand: 'Great Value 2%', size: '1 gallon', inStock: true, url: 'walmart.com/ip/milk-2-percent' },
        'quinoa': { price: 4.48, unit: 'lb', brand: 'Great Value', size: '1 lb', inStock: true, url: 'walmart.com/ip/quinoa' },
        'spinach': { price: 2.78, unit: 'bunch', brand: 'Fresh', size: '1 bunch', inStock: true, url: 'walmart.com/ip/fresh-spinach' },
        'broccoli': { price: 1.98, unit: 'lb', brand: 'Fresh', size: '1 lb', inStock: true, url: 'walmart.com/ip/fresh-broccoli' },
        'avocado': { price: 0.88, unit: 'each', brand: 'Fresh Hass', size: '1 each', inStock: true, url: 'walmart.com/ip/hass-avocado' },
        'banana': { price: 0.68, unit: 'lb', brand: 'Fresh', size: '1 lb', inStock: true, url: 'walmart.com/ip/bananas' },
        'almonds': { price: 6.98, unit: 'lb', brand: 'Great Value Raw', size: '1 lb', inStock: true, url: 'walmart.com/ip/almonds' },
        'olive oil': { price: 5.98, unit: '16oz', brand: 'Great Value Extra Virgin', size: '16.9 oz', inStock: true, url: 'walmart.com/ip/olive-oil' },
        'onion': { price: 1.28, unit: 'lb', brand: 'Fresh Yellow', size: '1 lb', inStock: true, url: 'walmart.com/ip/yellow-onions' }
      },
      kroger: {
        'chicken breast': { price: 5.99, unit: 'lb', brand: 'Kroger Boneless Skinless', size: '1 lb', inStock: true, url: 'kroger.com/p/chicken-breast' },
        'ground turkey': { price: 5.49, unit: 'lb', brand: 'Kroger 93/7 Lean', size: '1 lb', inStock: true, url: 'kroger.com/p/ground-turkey' },
        'salmon fillet': { price: 11.99, unit: 'lb', brand: 'Simple Truth Atlantic', size: '1 lb', inStock: true, url: 'kroger.com/p/salmon-fillet' },
        'eggs': { price: 3.29, unit: 'dozen', brand: 'Kroger Large Grade AA', size: '12 count', inStock: true, url: 'kroger.com/p/eggs-large' },
        'greek yogurt': { price: 5.49, unit: '32oz', brand: 'Kroger Plain Nonfat', size: '32 oz', inStock: true, url: 'kroger.com/p/greek-yogurt' },
        'milk': { price: 3.79, unit: 'gallon', brand: 'Kroger 2% Reduced Fat', size: '1 gallon', inStock: true, url: 'kroger.com/p/milk-2-percent' },
        'quinoa': { price: 5.99, unit: 'lb', brand: 'Simple Truth Organic', size: '1 lb', inStock: true, url: 'kroger.com/p/quinoa-organic' },
        'spinach': { price: 2.99, unit: 'bunch', brand: 'Fresh Bundle', size: '1 bunch', inStock: true, url: 'kroger.com/p/fresh-spinach' },
        'broccoli': { price: 2.49, unit: 'lb', brand: 'Fresh Crowns', size: '1 lb', inStock: true, url: 'kroger.com/p/broccoli-crowns' },
        'avocado': { price: 1.25, unit: 'each', brand: 'Hass Large', size: '1 each', inStock: true, url: 'kroger.com/p/hass-avocado' },
        'banana': { price: 0.79, unit: 'lb', brand: 'Fresh', size: '1 lb', inStock: true, url: 'kroger.com/p/bananas' },
        'almonds': { price: 8.99, unit: 'lb', brand: 'Simple Truth Raw', size: '1 lb', inStock: true, url: 'kroger.com/p/almonds-raw' },
        'olive oil': { price: 7.49, unit: '16oz', brand: 'Kroger Extra Virgin', size: '16.9 oz', inStock: true, url: 'kroger.com/p/olive-oil' },
        'onion': { price: 1.49, unit: 'lb', brand: 'Fresh Yellow', size: '1 lb', inStock: true, url: 'kroger.com/p/yellow-onions' }
      },
      wholefoods: {
        'chicken breast': { price: 8.99, unit: 'lb', brand: '365 Organic Boneless', size: '1 lb', inStock: true, url: 'wholefoodsmarket.com/products/chicken-breast' },
        'ground turkey': { price: 7.99, unit: 'lb', brand: '365 Organic 93/7', size: '1 lb', inStock: true, url: 'wholefoodsmarket.com/products/ground-turkey' },
        'salmon fillet': { price: 16.99, unit: 'lb', brand: 'Wild-Caught Atlantic', size: '1 lb', inStock: true, url: 'wholefoodsmarket.com/products/salmon-fillet' },
        'eggs': { price: 4.99, unit: 'dozen', brand: '365 Organic Large', size: '12 count', inStock: true, url: 'wholefoodsmarket.com/products/eggs-organic' },
        'greek yogurt': { price: 6.99, unit: '32oz', brand: '365 Organic Plain', size: '32 oz', inStock: true, url: 'wholefoodsmarket.com/products/greek-yogurt' },
        'milk': { price: 4.99, unit: 'gallon', brand: '365 Organic 2%', size: '1 gallon', inStock: true, url: 'wholefoodsmarket.com/products/milk-organic' },
        'quinoa': { price: 7.99, unit: 'lb', brand: '365 Organic Tri-Color', size: '1 lb', inStock: true, url: 'wholefoodsmarket.com/products/quinoa-organic' },
        'spinach': { price: 3.99, unit: 'bunch', brand: 'Organic Fresh', size: '1 bunch', inStock: true, url: 'wholefoodsmarket.com/products/spinach-organic' },
        'broccoli': { price: 3.49, unit: 'lb', brand: 'Organic Crowns', size: '1 lb', inStock: true, url: 'wholefoodsmarket.com/products/broccoli-organic' },
        'avocado': { price: 1.99, unit: 'each', brand: 'Organic Hass', size: '1 each', inStock: true, url: 'wholefoodsmarket.com/products/avocado-organic' },
        'banana': { price: 1.29, unit: 'lb', brand: 'Organic', size: '1 lb', inStock: true, url: 'wholefoodsmarket.com/products/bananas-organic' },
        'almonds': { price: 12.99, unit: 'lb', brand: '365 Organic Raw', size: '1 lb', inStock: true, url: 'wholefoodsmarket.com/products/almonds-organic' },
        'olive oil': { price: 9.99, unit: '16oz', brand: '365 Organic Extra Virgin', size: '16.9 oz', inStock: true, url: 'wholefoodsmarket.com/products/olive-oil-organic' },
        'onion': { price: 2.49, unit: 'lb', brand: 'Organic Yellow', size: '1 lb', inStock: true, url: 'wholefoodsmarket.com/products/onions-organic' }
      }
    };

    // Regional pricing adjustments by zipcode prefix
    this.regionalMultipliers = {
      // High cost areas
      '100': 1.25, // Manhattan, NY
      '101': 1.20, // New York Metro
      '941': 1.30, // San Francisco, CA
      '902': 1.25, // Los Angeles, CA
      '600': 1.15, // Chicago, IL
      '021': 1.20, // Boston, MA
      '201': 1.18, // Washington, DC
      '331': 1.22, // Miami, FL
      
      // Medium cost areas
      '750': 1.05, // Dallas, TX
      '770': 1.08, // Atlanta, GA
      '800': 1.12, // Denver, CO
      '980': 1.15, // Seattle, WA
      '331': 1.10, // Phoenix, AZ
      '890': 1.08, // Las Vegas, NV
      
      // Lower cost areas
      '350': 0.92, // Birmingham, AL
      '700': 0.88, // Oklahoma City, OK
      '650': 0.85, // Kansas City, MO
      '450': 0.90, // Cincinnati, OH
      '370': 0.87, // Memphis, TN
      '300': 0.89  // Atlanta suburbs, GA
    };
  }

  /**
   * Analyzes grocery list for improvements and pricing
   */
  async analyzeGroceryList(groceryList, userZipcode = null) {
    console.log('🤖 Captain Bot deploying GroceryIntelligenceBot analysis...');
    
    const analysis = {
      timestamp: new Date().toISOString(),
      improvements: [],
      pricingAnalysis: this.generatePricingAnalysis(groceryList, userZipcode),
      suggestions: [],
      budgetOptimization: {},
      healthOptimization: {},
      convenienceFactors: {}
    };

    // Analyze each item for improvements
    groceryList.forEach(item => {
      analysis.improvements.push(...this.analyzeItem(item));
    });

    // Generate store recommendations
    analysis.storeRecommendations = this.generateStoreRecommendations(groceryList, userZipcode);
    
    // Budget optimization suggestions
    analysis.budgetOptimization = this.generateBudgetOptimization(groceryList, userZipcode);
    
    // Health-focused improvements
    analysis.healthOptimization = this.generateHealthOptimizations(groceryList);
    
    // Convenience and efficiency suggestions
    analysis.convenienceFactors = this.generateConvenienceOptimizations(groceryList);

    return analysis;
  }

  /**
   * Generates comprehensive pricing analysis across stores using actual product data
   */
  generatePricingAnalysis(groceryList, zipcode) {
    const regionalMultiplier = this.getRegionalMultiplier(zipcode);
    const pricingAnalysis = {};

    Object.entries(this.groceryChains).forEach(([chainKey, chain]) => {
      let totalCost = 0;
      let deliveryFee = 0;
      const itemPrices = [];

      groceryList.forEach(item => {
        const itemName = item.name.toLowerCase();
        const storeData = this.storePricing[chainKey];
        let productInfo = null;
        
        // Find exact or partial match in store pricing database
        for (const [productKey, product] of Object.entries(storeData)) {
          if (itemName.includes(productKey) || productKey.includes(itemName)) {
            productInfo = product;
            break;
          }
        }
        
        // If no match found, use fallback pricing
        if (!productInfo) {
          productInfo = this.getFallbackProductInfo(item, chainKey);
        }
        
        // Apply regional multiplier to base price
        const adjustedPrice = productInfo.price * regionalMultiplier;
        const finalPrice = adjustedPrice * item.amount;
        
        totalCost += finalPrice;
        itemPrices.push({
          name: item.name,
          price: Math.round(finalPrice * 100) / 100,
          pricePerUnit: Math.round(adjustedPrice * 100) / 100,
          unit: productInfo.unit,
          brand: productInfo.brand,
          size: productInfo.size,
          inStock: productInfo.inStock,
          url: productInfo.url,
          amount: item.amount
        });
      });

      // Calculate delivery fee
      if (chain.delivery.available && totalCost < chain.delivery.freeThreshold) {
        deliveryFee = chain.delivery.fee;
      }

      pricingAnalysis[chainKey] = {
        name: chain.name,
        subtotal: Math.round(totalCost * 100) / 100,
        deliveryFee: deliveryFee,
        total: Math.round((totalCost + deliveryFee) * 100) / 100,
        itemPrices: itemPrices,
        freeDeliveryThreshold: chain.delivery.freeThreshold,
        savings: {
          vs_average: 0, // Will calculate after all stores processed
          percentage: 0
        }
      };
    });

    // Calculate savings vs average
    const storeTotals = Object.values(pricingAnalysis).map(store => store.subtotal);
    const averageTotal = storeTotals.reduce((sum, total) => sum + total, 0) / storeTotals.length;
    
    Object.keys(pricingAnalysis).forEach(storeKey => {
      const store = pricingAnalysis[storeKey];
      const savingsAmount = averageTotal - store.subtotal;
      store.savings = {
        vs_average: Math.round(savingsAmount * 100) / 100,
        percentage: Math.round((savingsAmount / averageTotal) * 100)
      };
    });

    return pricingAnalysis;
  }

  /**
   * Analyzes individual items for improvements
   */
  analyzeItem(item) {
    const improvements = [];

    // Check for healthier alternatives
    if (item.name.toLowerCase().includes('white bread')) {
      improvements.push({
        type: 'health',
        severity: 'medium',
        item: item.name,
        suggestion: 'Consider whole grain bread for better fiber and nutrients',
        alternative: 'Ezekiel bread or 100% whole wheat bread',
        healthBenefit: 'Higher fiber, B vitamins, and sustained energy'
      });
    }

    if (item.name.toLowerCase().includes('ground beef')) {
      improvements.push({
        type: 'health',
        severity: 'low',
        item: item.name,
        suggestion: 'Consider leaner protein alternatives',
        alternative: 'Ground turkey (93% lean) or chicken breast',
        healthBenefit: 'Lower saturated fat, similar protein content'
      });
    }

    // Check for budget-friendly alternatives
    if (item.category === 'protein' && item.name.toLowerCase().includes('steak')) {
      improvements.push({
        type: 'budget',
        severity: 'medium',
        item: item.name,
        suggestion: 'Consider more budget-friendly protein sources',
        alternative: 'Chicken thighs, eggs, or canned tuna',
        budgetSaving: 'Save 40-60% on protein costs'
      });
    }

    // Bulk buying opportunities
    if (item.category === 'grains' || item.category === 'nuts') {
      improvements.push({
        type: 'budget',
        severity: 'low',
        item: item.name,
        suggestion: 'Consider buying in bulk for better value',
        alternative: `Bulk ${item.name} from warehouse stores`,
        budgetSaving: 'Save 20-30% with bulk purchases'
      });
    }

    // Seasonal optimization
    improvements.push(...this.getSeasonalSuggestions(item));

    return improvements;
  }

  /**
   * Gets seasonal suggestions for produce
   */
  getSeasonalSuggestions(item) {
    const currentMonth = new Date().getMonth();
    const suggestions = [];

    if (item.category === 'vegetables' || item.category === 'fruits') {
      const seasonalAlternatives = this.getSeasonalProduce(currentMonth);
      
      if (seasonalAlternatives.includes(item.name.toLowerCase())) {
        suggestions.push({
          type: 'seasonal',
          severity: 'low',
          item: item.name,
          suggestion: `${item.name} is in season - great choice for freshness and value!`,
          benefit: 'Peak freshness, lower prices, better nutrition'
        });
      } else {
        const alternatives = seasonalAlternatives.filter(alt => 
          item.category === 'vegetables' ? this.isVegetable(alt) : this.isFruit(alt)
        ).slice(0, 3);

        if (alternatives.length > 0) {
          suggestions.push({
            type: 'seasonal',
            severity: 'medium',
            item: item.name,
            suggestion: `Consider seasonal alternatives for better value`,
            alternatives: alternatives,
            benefit: 'Lower cost, peak freshness, and better flavor'
          });
        }
      }
    }

    return suggestions;
  }

  /**
   * Gets seasonal produce by month
   */
  getSeasonalProduce(month) {
    const seasonal = {
      0: ['kale', 'brussels sprouts', 'citrus', 'pears'], // January
      1: ['broccoli', 'cauliflower', 'citrus', 'apples'], // February
      2: ['spinach', 'asparagus', 'strawberries', 'artichokes'], // March
      3: ['peas', 'radishes', 'strawberries', 'spring onions'], // April
      4: ['lettuce', 'asparagus', 'strawberries', 'peas'], // May
      5: ['tomatoes', 'zucchini', 'berries', 'stone fruits'], // June
      6: ['corn', 'tomatoes', 'berries', 'melons'], // July
      7: ['peppers', 'eggplant', 'peaches', 'corn'], // August
      8: ['apples', 'pumpkin', 'grapes', 'peppers'], // September
      9: ['squash', 'apples', 'cranberries', 'sweet potatoes'], // October
      10: ['brussels sprouts', 'cranberries', 'pears', 'squash'], // November
      11: ['citrus', 'pomegranates', 'pears', 'winter squash'] // December
    };

    return seasonal[month] || [];
  }

  /**
   * Generates store recommendations based on analysis
   */
  generateStoreRecommendations(groceryList, zipcode) {
    const pricingAnalysis = this.generatePricingAnalysis(groceryList, zipcode);
    const recommendations = [];

    // Find cheapest option
    const cheapest = Object.entries(pricingAnalysis)
      .reduce((min, [key, store]) => store.total < min.total ? { key, ...store } : min, 
        { total: Infinity });

    recommendations.push({
      type: 'budget',
      store: cheapest.name,
      reason: `Lowest total cost at $${cheapest.total}`,
      savings: `Save $${Math.max(...Object.values(pricingAnalysis).map(s => s.total)) - cheapest.total}`,
      priority: 'high'
    });

    // Find best value (considering quality)
    const krogerData = pricingAnalysis.kroger;
    if (krogerData && krogerData.total - cheapest.total < 10) {
      recommendations.push({
        type: 'value',
        store: 'Kroger',
        reason: 'Best balance of price and quality',
        benefit: 'Good prices with reliable quality and selection',
        priority: 'medium'
      });
    }

    // Premium option for health-conscious users
    const wholeFoodsData = pricingAnalysis.wholefoods;
    if (wholeFoodsData) {
      recommendations.push({
        type: 'premium',
        store: 'Whole Foods',
        reason: 'Highest quality organic and natural products',
        benefit: 'Organic options, strict quality standards, Prime delivery',
        premium: `+$${wholeFoodsData.total - cheapest.total} for premium quality`,
        priority: 'low'
      });
    }

    return recommendations;
  }

  /**
   * Generates budget optimization strategies
   */
  generateBudgetOptimization(groceryList, zipcode) {
    const totalItems = groceryList.length;
    const budgetBreakdown = this.calculateCategoryBreakdown(groceryList);
    const proteinCost = budgetBreakdown.protein || 0;

    return {
      totalItems,
      estimatedWeeklyCost: this.calculateWeeklyCost(groceryList, zipcode),
      budgetBreakdown: budgetBreakdown,
      savingOpportunities: [
        {
          strategy: 'Store Brand Substitutions',
          potentialSavings: '$8-15/week',
          impact: 'Switch to store brands for 15-30% savings'
        },
        {
          strategy: 'Bulk Buying',
          potentialSavings: '$5-12/week',
          impact: 'Buy rice, oats, nuts in bulk for long-term savings'
        },
        {
          strategy: 'Seasonal Shopping',
          potentialSavings: '$6-18/week',
          impact: 'Choose seasonal produce for 20-40% savings'
        },
        {
          strategy: 'Protein Optimization',
          potentialSavings: '$10-25/week',
          impact: 'Mix expensive and budget proteins (eggs, chicken thighs)'
        }
      ],
      monthlyBudgetTarget: this.generateBudgetTargets(groceryList, zipcode)
    };
  }

  /**
   * Generates health optimization suggestions
   */
  generateHealthOptimizations(groceryList) {
    const nutritionScore = this.calculateNutritionScore(groceryList);
    
    return {
      currentNutritionScore: nutritionScore,
      improvements: [
        {
          category: 'Vegetables',
          current: groceryList.filter(item => item.category === 'vegetables').length,
          recommended: Math.max(5, Math.ceil(groceryList.length * 0.4)),
          suggestion: 'Aim for 40% of items to be vegetables for optimal nutrition'
        },
        {
          category: 'Processed Foods',
          current: this.countProcessedFoods(groceryList),
          recommended: 0,
          suggestion: 'Minimize processed foods and choose whole food alternatives'
        },
        {
          category: 'Protein Variety',
          current: new Set(groceryList.filter(item => item.category === 'protein').map(item => item.name)).size,
          recommended: 3,
          suggestion: 'Include at least 3 different protein sources for amino acid variety'
        }
      ],
      superfoods: [
        { name: 'Blueberries', benefit: 'Antioxidants for brain health', category: 'fruits' },
        { name: 'Salmon', benefit: 'Omega-3 fatty acids for heart health', category: 'protein' },
        { name: 'Quinoa', benefit: 'Complete protein and fiber', category: 'grains' },
        { name: 'Spinach', benefit: 'Iron, folate, and vitamins', category: 'vegetables' }
      ]
    };
  }

  /**
   * Helper methods
   */
  getRegionalMultiplier(zipcode) {
    if (!zipcode) return 1.0;
    const prefix = zipcode.toString().substring(0, 3);
    return this.regionalMultipliers[prefix] || 1.0;
  }

  /**
   * Provides fallback product information when item not found in store database
   */
  getFallbackProductInfo(item, storeKey) {
    const chain = this.groceryChains[storeKey];
    const categoryMultiplier = chain.categories[item.category] || 1.0;
    
    // Default prices by category
    const basePrices = {
      protein: 8.99,
      vegetables: 2.99,
      fruits: 3.49,
      grains: 3.99,
      dairy: 4.99,
      nuts: 9.99,
      oils: 6.99,
      spices: 2.49,
      condiments: 3.99
    };
    
    const basePrice = basePrices[item.category] || 3.99;
    const adjustedPrice = basePrice * chain.priceMultiplier * categoryMultiplier;
    
    return {
      price: Math.round(adjustedPrice * 100) / 100,
      unit: item.unit || 'lb',
      brand: chain.name + ' Brand',
      size: '1 ' + (item.unit || 'lb'),
      inStock: true,
      url: `${storeKey === 'wholefoods' ? 'wholefoodsmarket' : storeKey}.com/search?q=${encodeURIComponent(item.name)}`
    };
  }

  getItemBasePrice(item) {
    // Legacy method - now uses getFallbackProductInfo for consistency
    const fallbackInfo = this.getFallbackProductInfo(item, 'kroger'); // Use Kroger as baseline
    return fallbackInfo.price;
  }

  calculateWeeklyCost(groceryList, zipcode) {
    const pricingAnalysis = this.generatePricingAnalysis(groceryList, zipcode);
    const averageCost = Object.values(pricingAnalysis).reduce((sum, store) => sum + store.total, 0) / 3;
    return Math.round(averageCost * 100) / 100;
  }

  calculateCategoryBreakdown(groceryList) {
    const breakdown = {};
    const regionalMultiplier = this.getRegionalMultiplier();
    
    groceryList.forEach(item => {
      const itemName = item.name.toLowerCase();
      let productInfo = null;
      
      // Use Kroger as baseline for category breakdown (average pricing)
      const storeData = this.storePricing.kroger;
      for (const [productKey, product] of Object.entries(storeData)) {
        if (itemName.includes(productKey) || productKey.includes(itemName)) {
          productInfo = product;
          break;
        }
      }
      
      if (!productInfo) {
        productInfo = this.getFallbackProductInfo(item, 'kroger');
      }
      
      const cost = productInfo.price * regionalMultiplier * item.amount;
      breakdown[item.category] = (breakdown[item.category] || 0) + cost;
    });
    
    // Round values
    Object.keys(breakdown).forEach(category => {
      breakdown[category] = Math.round(breakdown[category] * 100) / 100;
    });
    
    return breakdown;
  }

  calculateNutritionScore(groceryList) {
    let score = 0;
    const vegetables = groceryList.filter(item => item.category === 'vegetables').length;
    const fruits = groceryList.filter(item => item.category === 'fruits').length;
    const processed = this.countProcessedFoods(groceryList);
    
    score += Math.min(vegetables * 10, 50); // Max 50 points for vegetables
    score += Math.min(fruits * 8, 32); // Max 32 points for fruits
    score -= processed * 5; // Deduct for processed foods
    score += groceryList.filter(item => item.category === 'protein').length * 6; // Protein variety
    
    return Math.max(0, Math.min(100, score));
  }

  countProcessedFoods(groceryList) {
    const processedKeywords = ['frozen', 'canned', 'packaged', 'instant', 'processed'];
    return groceryList.filter(item => 
      processedKeywords.some(keyword => item.name.toLowerCase().includes(keyword))
    ).length;
  }

  generateBudgetTargets(groceryList, zipcode) {
    const weeklyCost = this.calculateWeeklyCost(groceryList, zipcode);
    return {
      conservative: Math.round(weeklyCost * 4.2 * 100) / 100,
      moderate: Math.round(weeklyCost * 4.5 * 100) / 100,
      comfortable: Math.round(weeklyCost * 5.0 * 100) / 100
    };
  }

  generateConvenienceOptimizations(groceryList) {
    return {
      deliveryRecommendation: this.getOptimalDeliveryStrategy(groceryList),
      shoppingTips: [
        'Shop early morning or late evening for less crowded stores',
        'Use store apps for digital coupons and price comparisons',
        'Create a shopping list organized by store layout',
        'Consider curbside pickup for time savings'
      ],
      mealPrepSynergy: [
        'Buy ingredients that work in multiple recipes',
        'Choose items with longer shelf life first',
        'Prep vegetables immediately after shopping',
        'Batch cook grains and proteins for the week'
      ]
    };
  }

  getOptimalDeliveryStrategy(groceryList) {
    const strategies = [];
    
    strategies.push({
      option: 'Walmart Delivery',
      cost: '$9.95 or free over $35',
      benefit: 'Lowest prices, good for bulk items',
      recommended: 'Budget-conscious shoppers'
    });

    strategies.push({
      option: 'Kroger Pickup',
      cost: 'Usually free',
      benefit: 'Save time, avoid impulse purchases',
      recommended: 'Busy professionals'
    });

    strategies.push({
      option: 'Whole Foods + Prime',
      cost: '$4.95 or free over $35',
      benefit: 'Fast delivery, premium quality',
      recommended: 'Health-focused, convenience seekers'
    });

    return strategies;
  }

  isVegetable(item) {
    const vegetables = ['broccoli', 'spinach', 'kale', 'peppers', 'onions', 'carrots', 'celery'];
    return vegetables.some(veg => item.includes(veg));
  }

  isFruit(item) {
    const fruits = ['apples', 'berries', 'citrus', 'bananas', 'grapes', 'melons', 'stone fruits'];
    return fruits.some(fruit => item.includes(fruit));
  }

  /**
   * Main execution method
   */
  async execute(groceryList, userZipcode) {
    console.log('🤖 Captain Bot: Deploying GroceryIntelligenceBot for enhanced grocery optimization...');
    
    const analysis = await this.analyzeGroceryList(groceryList, userZipcode);
    
    return {
      status: 'analysis_complete',
      bot: this.name,
      deployedBy: this.deployedBy,
      timestamp: new Date().toISOString(),
      analysis,
      summary: {
        totalImprovements: analysis.improvements.length,
        potentialWeeklySavings: this.calculatePotentialSavings(analysis),
        healthScore: analysis.healthOptimization.currentNutritionScore,
        recommendedStore: analysis.storeRecommendations[0]?.store || 'Walmart',
        keyInsights: this.generateKeyInsights(analysis)
      },
      nextSteps: [
        'Review store price comparisons',
        'Consider seasonal produce alternatives',
        'Implement budget optimization strategies',
        'Explore bulk buying opportunities',
        'Set up preferred store delivery/pickup'
      ]
    };
  }

  calculatePotentialSavings(analysis) {
    const budgetSavings = analysis.budgetOptimization.savingOpportunities
      .reduce((total, opp) => {
        const savings = opp.potentialSavings.match(/\$(\d+)/);
        return total + (savings ? parseInt(savings[1]) : 0);
      }, 0);
    
    return `$${budgetSavings}-${budgetSavings + 20}/week`;
  }

  generateKeyInsights(analysis) {
    return [
      `Price comparison shows potential savings of $${Math.max(...Object.values(analysis.pricingAnalysis).map(s => s.total)) - Math.min(...Object.values(analysis.pricingAnalysis).map(s => s.total))} per shopping trip`,
      `${analysis.improvements.filter(i => i.type === 'health').length} health optimization opportunities identified`,
      `Nutrition score: ${analysis.healthOptimization.currentNutritionScore}/100 with room for improvement`,
      `${analysis.improvements.filter(i => i.type === 'budget').length} budget-saving alternatives available`
    ];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GroceryIntelligenceBot;
}

export default GroceryIntelligenceBot;