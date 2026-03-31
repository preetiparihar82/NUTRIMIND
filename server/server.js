import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL || 'https://api.openai.com/v1/responses';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gpt-4.1-mini';

const stylePrompt = (prompt, dietPreference, age, gender, condition, dietType, targetCalories) => {
  return `You are NutriMind AI, an antigravity-themed nutrition coach for a futuristic wellness web app. Return valid JSON only with the keys: meals, snacks, drinks, allowedFoodTypes, allowedDrinkTypes, dailyMacros, weeklyCalories, monthAdherence, threeMonthAdherence, and summary. Create a personalized plan adapted to these details: age ${age}, gender ${gender}, diet preference ${dietPreference}, health condition ${condition}, diet mode ${dietType}, target calories ${targetCalories}. The user prompt is: ${prompt}. Use the health condition and diet type to choose foods and drinks the user can eat.`;
};

const computeAllowedTypes = (condition, vegetarian) => {
  const baseFoods = vegetarian
    ? ['Leafy greens', 'Legumes', 'Whole grains', 'Tofu', 'Nuts & seeds']
    : ['Lean poultry', 'Fish', 'Eggs', 'Whole grains', 'Vegetables'];

  const conditionFoods = {
    Diabetes: ['Low-glycemic vegetables', 'Berries', 'Chia seeds', 'Cinnamon-spiced oats'],
    PCOS: ['Probiotic yogurt', 'High-fiber greens', 'Flaxseed', 'Berries'],
    'High BP': ['Low-sodium greens', 'Roasted root vegetables', 'Potassium-rich fruits', 'Whole oats']
  };

  const conditionDrinks = {
    Diabetes: ['Herbal green tea', 'Water with lemon', 'Cinnamon-infused water'],
    PCOS: ['Berry smoothies', 'Matcha', 'Coconut water'],
    'High BP': ['Hibiscus tea', 'Cucumber water', 'Low-sodium vegetable broth']
  };

  const drinks = vegetarian
    ? ['Herbal teas', 'Green smoothies', 'Sparkling water with mint']
    : ['Herbal teas', 'Protein smoothies', 'Water with lemon'];

  return {
    allowedFoodTypes: [...new Set([...(conditionFoods[condition] || []), ...baseFoods])],
    allowedDrinkTypes: [...new Set([...(conditionDrinks[condition] || []), ...drinks])]
  };
};

const fallbackRecommendation = (
  prompt,
  vegetarian,
  age,
  gender,
  condition = 'None',
  dietType = 'Specific Diet',
  targetCalories = 1900
) => {
  const dietPreference = vegetarian ? 'Vegetarian' : 'Non-Vegetarian';
  const allowed = computeAllowedTypes(condition, vegetarian);
  const healthNote = condition !== 'None' ? ` (${condition} friendly)` : '';
  const base = {
    meals: [
      {
        title: vegetarian ? 'Chickpea Avocado Toast' : 'Smoked Salmon Toast',
        category: 'Breakfast',
        description: vegetarian
          ? 'Protein-rich toast with creamy avocado and lemon zest.'
          : 'Smoked salmon, greens, and whole-grain bread.'
      },
      {
        title: vegetarian ? 'Power Grain Bowl' : 'Grilled Chicken Salad',
        category: 'Lunch',
        description: vegetarian
          ? 'Quinoa, roasted vegetables, and tahini drizzle.'
          : 'Grilled chicken, leafy greens, and sweet potato.'
      },
      {
        title: vegetarian ? 'Tofu Stir-Fry' : 'Turkey Stir-Fry',
        category: 'Dinner',
        description: vegetarian
          ? 'Crispy tofu, broccoli, and brown rice.'
          : 'Turkey strips, broccoli, and ginger sauce.'
      }
    ],
    snacks: [
      { title: 'Crunchy Seed Mix', description: 'Pumpkin seeds, almonds, and dried berries.' },
      { title: 'Greek Yogurt Parfait', description: 'Creamy yogurt, granola, and berries.' }
    ],
    drinks: [
      { title: 'Matcha Mint Refresher', description: 'Green tea, mint, and lime.' },
      { title: 'Berry Smoothie', description: 'Mixed berries, almond milk, and protein.' }
    ],
    dailyMacros: [
      { name: 'Protein', value: 46, color: '#16a34a' },
      { name: 'Carbs', value: 178, color: '#0ea5e9' },
      { name: 'Fats', value: 62, color: '#f97316' }
    ],
    weeklyCalories: [
      { name: 'Mon', calories: 1880, target: 2000 },
      { name: 'Tue', calories: 2040, target: 2000 },
      { name: 'Wed', calories: 1910, target: 2000 },
      { name: 'Thu', calories: 1750, target: 2000 },
      { name: 'Fri', calories: 2120, target: 2000 },
      { name: 'Sat', calories: 2250, target: 2000 },
      { name: 'Sun', calories: 1950, target: 2000 }
    ],
    monthAdherence: Array.from({ length: 30 }, (_, index) => ({
      day: `Day ${index + 1}`,
      score: 72 + Math.round(Math.sin(index / 4) * 6 + index / 5),
      weight: 162 - index * 0.08
    })),
    threeMonthAdherence: Array.from({ length: 90 }, (_, index) => ({
      day: `Week ${Math.floor(index / 7) + 1}`,
      score: 65 + Math.round(Math.sin(index / 6) * 6 + index / 6),
      weight: 165 - index * 0.04
    })),
    allowedFoodTypes: allowed.allowedFoodTypes,
    allowedDrinkTypes: allowed.allowedDrinkTypes,
    summary: `Generated nutrition guidance for ${dietPreference} cravings based on your prompt, optimized for ${condition || 'general'} health support and ${dietType || 'specific'} diet mode. Target calories: ${targetCalories}.`
  };

  return base;
};

const tryParseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

const parseGeminiResponse = (result) => {
  const content = result?.output?.[0]?.content || result?.candidates?.[0]?.content || [];
  if (Array.isArray(content)) {
    const jsonObject = content.find((item) => item?.json);
    if (jsonObject) {
      return jsonObject.json;
    }
    const textItem = content.find((item) => item.type === 'output_text' || item.type === 'structured_text' || item.type === 'application/json');
    const jsonText = textItem?.text || content[0]?.text;
    return tryParseJson(jsonText);
  }
  if (typeof content === 'string') {
    return tryParseJson(content);
  }
  return null;
};

app.post('/api/recommend', async (req, res) => {
  const { prompt, vegetarian, condition, dietType, age, gender, email, targetCalories } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const dietPreference = vegetarian ? 'Vegetarian' : 'Non-Vegetarian';

  if (!GEMINI_API_KEY) {
    return res.json({
      ...fallbackRecommendation(prompt, vegetarian, age, gender, condition, dietType, targetCalories),
      source: 'Fallback'
    });
  }

  try {
    const body = {
      model: GEMINI_MODEL,
      temperature: 0.65,
      max_output_tokens: 800,
      input: [
        {
          role: 'system',
          content: 'You are a nutrition assistant. Return valid JSON only.'
        },
        {
          role: 'user',
          content: stylePrompt(prompt, dietPreference, age, gender, condition, dietType, targetCalories)
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'nutritionResponse',
          description: 'Structured nutrition recommendation JSON for a user prompt.',
          type: 'object',
          properties: {
            meals: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  category: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['title', 'category', 'description']
              }
            },
            snacks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['title', 'description']
              }
            },
            drinks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' }
                },
                required: ['title', 'description']
              }
            },
            dailyMacros: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  value: { type: 'number' },
                  color: { type: 'string' }
                },
                required: ['name', 'value', 'color']
              }
            },
            weeklyCalories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  calories: { type: 'number' },
                  target: { type: 'number' }
                },
                required: ['name', 'calories', 'target']
              }
            },
            monthAdherence: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  day: { type: 'string' },
                  score: { type: 'number' },
                  weight: { type: 'number' }
                },
                required: ['day', 'score', 'weight']
              }
            },
            threeMonthAdherence: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  day: { type: 'string' },
                  score: { type: 'number' },
                  weight: { type: 'number' }
                },
                required: ['day', 'score', 'weight']
              }
            },
            allowedFoodTypes: {
              type: 'array',
              items: { type: 'string' }
            },
            allowedDrinkTypes: {
              type: 'array',
              items: { type: 'string' }
            },
            summary: { type: 'string' }
          },
          required: ['meals', 'snacks', 'drinks', 'dailyMacros', 'weeklyCalories', 'monthAdherence', 'threeMonthAdherence', 'allowedFoodTypes', 'allowedDrinkTypes', 'summary']
        }
      }
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    const text = result?.output?.[0]?.content?.find((item) => item.type === 'output_text')?.text || result?.output?.[0]?.content?.[0]?.text || result?.choices?.[0]?.message?.content || '';
    const parsed = parseGeminiResponse(result) || tryParseJson(text);
    if (parsed) {
      return res.json({ ...parsed, source: 'AI' });
    }
    return res.json({
      ...fallbackRecommendation(prompt, vegetarian, age, gender, condition, dietType, targetCalories),
      source: 'Fallback'
    });
  } catch (error) {
    return res.json({
      ...fallbackRecommendation(prompt, vegetarian, age, gender, condition, dietType, targetCalories),
      source: 'Fallback'
    });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`NutriMind backend running on http://localhost:${port}`);
});
