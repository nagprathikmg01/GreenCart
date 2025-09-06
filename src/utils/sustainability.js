// Sustainability contribution calculation utility

// Category-based sustainability weights (higher = more environmental impact)
const SUSTAINABILITY_WEIGHTS = {
  'Electronics': 25,      // High impact - prevents e-waste, saves rare materials
  'Furniture': 20,        // High impact - saves wood, reduces manufacturing
  'Clothing': 15,         // Medium-high impact - reduces fast fashion waste
  'Home & Garden': 12,    // Medium impact - reduces packaging waste
  'Sports & Outdoors': 10, // Medium impact - extends product lifecycle
  'Books & Media': 8,     // Lower impact - but still reduces paper waste
  'Toys & Games': 6,      // Lower impact - but promotes sharing economy
  'Others': 5             // Default baseline
};

// Price-based multiplier (higher value items have more impact)
const PRICE_MULTIPLIERS = {
  'low': 0.8,      // Items under $50
  'medium': 1.0,   // Items $50-$200
  'high': 1.2,     // Items $200-$500
  'premium': 1.5   // Items over $500
};

/**
 * Calculate sustainability contribution for a single item
 * @param {Object} item - Product item with category and price
 * @returns {Object} - Contribution details
 */
export function calculateItemSustainability(item) {
  const category = item.category || 'Others';
  const price = parseFloat(item.price) || 0;
  
  // Get base weight from category
  const baseWeight = SUSTAINABILITY_WEIGHTS[category] || SUSTAINABILITY_WEIGHTS['Others'];
  
  // Determine price multiplier
  let priceMultiplier = PRICE_MULTIPLIERS['medium'];
  if (price < 50) priceMultiplier = PRICE_MULTIPLIERS['low'];
  else if (price > 500) priceMultiplier = PRICE_MULTIPLIERS['premium'];
  else if (price > 200) priceMultiplier = PRICE_MULTIPLIERS['high'];
  
  // Calculate final contribution
  const contribution = Math.round(baseWeight * priceMultiplier);
  
  return {
    contribution,
    category,
    baseWeight,
    priceMultiplier,
    explanation: getContributionExplanation(category, contribution, price)
  };
}

/**
 * Calculate sustainability contribution for multiple items
 * @param {Array} items - Array of product items
 * @returns {Object} - Total contribution details
 */
export function calculateTotalSustainability(items) {
  if (!items || items.length === 0) {
    return {
      totalContribution: 0,
      itemCount: 0,
      breakdown: [],
      message: "No items to calculate sustainability impact."
    };
  }

  const breakdown = items.map(item => {
    const itemSustainability = calculateItemSustainability(item);
    return {
      ...itemSustainability,
      itemTitle: item.title,
      itemPrice: item.price
    };
  });

  const totalContribution = breakdown.reduce((sum, item) => sum + item.contribution, 0);
  const itemCount = items.length;

  return {
    totalContribution,
    itemCount,
    breakdown,
    message: generateTotalMessage(totalContribution, itemCount)
  };
}

/**
 * Get explanation for sustainability contribution
 */
function getContributionExplanation(category, contribution, price) {
  const explanations = {
    'Electronics': `Prevented e-waste and saved rare materials! Electronics have the highest environmental impact.`,
    'Furniture': `Saved trees and reduced manufacturing waste! Furniture reuse has significant environmental benefits.`,
    'Clothing': `Reduced fast fashion waste! Extending clothing lifecycle helps the environment.`,
    'Home & Garden': `Reduced packaging waste and promoted sustainable living!`,
    'Sports & Outdoors': `Extended product lifecycle and promoted active lifestyle!`,
    'Books & Media': `Reduced paper waste and promoted knowledge sharing!`,
    'Toys & Games': `Promoted sharing economy and reduced toy waste!`,
    'Others': `Contributed to circular economy and reduced waste!`
  };

  const baseExplanation = explanations[category] || explanations['Others'];
  const priceNote = price > 200 ? " High-value items have even greater impact!" : "";
  
  return baseExplanation + priceNote;
}

/**
 * Generate motivational message for total contribution
 */
function generateTotalMessage(totalContribution, itemCount) {
  if (totalContribution >= 100) {
    return `🌍 AMAZING! You've contributed ${totalContribution}% to sustainability! You're a true eco-warrior!`;
  } else if (totalContribution >= 50) {
    return `🌱 EXCELLENT! You've contributed ${totalContribution}% to sustainability! Keep up the great work!`;
  } else if (totalContribution >= 25) {
    return `♻️ GREAT! You've contributed ${totalContribution}% to sustainability! Every action counts!`;
  } else if (totalContribution >= 10) {
    return `🌿 GOOD! You've contributed ${totalContribution}% to sustainability! You're making a difference!`;
  } else {
    return `🌱 You've contributed ${totalContribution}% to sustainability! Every small step helps!`;
  }
}

/**
 * Calculate user's lifetime sustainability score
 * @param {Array} purchases - User's purchase history
 * @returns {Object} - Lifetime sustainability metrics
 */
export function calculateLifetimeSustainability(purchases) {
  if (!purchases || purchases.length === 0) {
    return {
      totalContribution: 0,
      totalItems: 0,
      averageContribution: 0,
      level: 'Beginner',
      nextLevel: 50,
      progress: 0
    };
  }

  let totalContribution = 0;
  let totalItems = 0;

  purchases.forEach(purchase => {
    if (purchase.products && purchase.products.length > 0) {
      purchase.products.forEach(product => {
        const sustainability = calculateItemSustainability(product);
        totalContribution += sustainability.contribution;
        totalItems += product.quantity || 1;
      });
    }
  });

  const averageContribution = totalItems > 0 ? Math.round(totalContribution / totalItems) : 0;
  
  // Determine user level based on total contribution
  const level = getUserLevel(totalContribution);
  const nextLevel = getNextLevelThreshold(totalContribution);
  const progress = nextLevel > 0 ? Math.round((totalContribution / nextLevel) * 100) : 100;

  return {
    totalContribution,
    totalItems,
    averageContribution,
    level,
    nextLevel,
    progress
  };
}

/**
 * Get user sustainability level
 */
function getUserLevel(totalContribution) {
  if (totalContribution >= 500) return 'Eco Champion';
  if (totalContribution >= 300) return 'Green Warrior';
  if (totalContribution >= 200) return 'Sustainability Hero';
  if (totalContribution >= 100) return 'Eco Enthusiast';
  if (totalContribution >= 50) return 'Green Starter';
  return 'Beginner';
}

/**
 * Get next level threshold
 */
function getNextLevelThreshold(totalContribution) {
  if (totalContribution < 50) return 50;
  if (totalContribution < 100) return 100;
  if (totalContribution < 200) return 200;
  if (totalContribution < 300) return 300;
  if (totalContribution < 500) return 500;
  return 0; // Max level reached
}

/**
 * Get sustainability tips based on user level
 */
export function getSustainabilityTips(level) {
  const tips = {
    'Beginner': [
      "Start by buying second-hand books and clothing",
      "Look for electronics in good condition",
      "Consider the environmental impact of each purchase"
    ],
    'Green Starter': [
      "Try buying second-hand furniture for your home",
      "Look for high-quality items that last longer",
      "Share your sustainability journey with friends"
    ],
    'Eco Enthusiast': [
      "Focus on high-impact categories like electronics",
      "Consider the full lifecycle of products",
      "Encourage others to join the circular economy"
    ],
    'Sustainability Hero': [
      "You're making a real difference! Keep it up!",
      "Consider selling your own unused items",
      "Share your success stories to inspire others"
    ],
    'Green Warrior': [
      "You're a sustainability leader!",
      "Mentor others in sustainable shopping",
      "Look for ways to maximize your impact"
    ],
    'Eco Champion': [
      "You're an inspiration to us all!",
      "Consider becoming a sustainability ambassador",
      "Your impact is truly remarkable!"
    ]
  };

  return tips[level] || tips['Beginner'];
}
