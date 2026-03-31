import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine
} from 'recharts';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Specific Diet', href: '#specific-diet' },
  { label: 'Login', href: '#login' }
];

const mealIcons = {
  breakfast: '☀️',
  lunch: '🥗',
  dinner: '🍲',
  snack: '🍎',
  drink: '☕'
};

const macroColors = {
  Protein: '#16a34a',
  Carbs: '#0ea5e9',
  Fats: '#f97316'
};

const rangeTabs = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: '1 Month' },
  { key: '3months', label: '3 Months' }
];

const healthConditions = ['None', 'Diabetes', 'PCOS', 'High BP', 'Thyroid', 'Cholesterol', 'IBS', 'Heart Disease'];

const healthConditionNotes = {
  Diabetes: 'Low-glycemic recipes and steady carb pacing to support blood sugar balance.',
  PCOS: 'Anti-inflammatory, high fiber meals designed to stabilize hormones and support insulin sensitivity.',
  'High BP': 'Low-sodium, potassium-rich food choices to promote healthy circulation.',
  Thyroid: 'Balanced meals with selenium, iodine and clean protein to support thyroid health.',
  Cholesterol: 'Heart-friendly foods high in fiber, omega-3 and low in saturated fat.',
  IBS: 'Gentle gut-friendly meals with soluble fiber and low-FODMAP choices.',
  'Heart Disease': 'Low-sodium, nutrient-dense foods focused on circulation and healthy fats.',
  None: 'Balanced nutrition with a mix of proteins, healthy fats, and whole grains for everyday wellness.'
};

const healthConditionRecommendations = {
  Diabetes: {
    food: ['Low-glycemic vegetables', 'Berries', 'Legumes', 'Lean protein', 'Whole grains'],
    drinks: ['Herbal green tea', 'Cinnamon water', 'Sparkling water with lime']
  },
  PCOS: {
    food: ['Probiotic yogurt', 'High-fiber greens', 'Lean protein', 'Flaxseed', 'Berries'],
    drinks: ['Matcha', 'Berry smoothies', 'Coconut water']
  },
  'High BP': {
    food: ['Low-sodium greens', 'Roasted root vegetables', 'Potassium-rich fruits', 'Whole oats', 'Fish'],
    drinks: ['Hibiscus tea', 'Cucumber water', 'Beet juice']
  },
  Thyroid: {
    food: ['Sea vegetables', 'Brazil nuts', 'Lean poultry', 'Whole grains', 'Berries'],
    drinks: ['Green tea', 'Water with lemon', 'Herbal infusions']
  },
  Cholesterol: {
    food: ['Oats', 'Avocado', 'Salmon', 'Nuts', 'Beans'],
    drinks: ['Oat milk latte', 'Green tea', 'Berry water']
  },
  IBS: {
    food: ['Bananas', 'Cooked carrots', 'Oatmeal', 'Rice', 'Lean turkey'],
    drinks: ['Peppermint tea', 'Chamomile tea', 'Gentle electrolyte water']
  },
  'Heart Disease': {
    food: ['Leafy greens', 'Whole grains', 'Fatty fish', 'Berries', 'Walnuts'],
    drinks: ['Hibiscus tea', 'Citrus water', 'Green tea']
  },
  None: {
    food: ['Leafy greens', 'Whole grains', 'Seasonal vegetables', 'Lean proteins', 'Nuts & seeds'],
    drinks: ['Water', 'Herbal tea', 'Fruit-infused water']
  }
};

const healthConditionDietChart = {
  Diabetes: [
    { name: 'Breakfast', details: 'Oatmeal with berries and cinnamon, scrambled egg whites.' },
    { name: 'Lunch', details: 'Grilled chicken salad with mixed greens and beans.' },
    { name: 'Dinner', details: 'Steamed fish with roasted vegetables and quinoa.' },
    { name: 'Snack', details: 'Cottage cheese with cucumber slices.' },
    { name: 'Hydration', details: 'Cinnamon water and herbal tea.' }
  ],
  PCOS: [
    { name: 'Breakfast', details: 'Greek yogurt bowl with seeds, berries, and walnuts.' },
    { name: 'Lunch', details: 'Chickpea bowl with greens, avocado, and turmeric.' },
    { name: 'Dinner', details: 'Baked salmon with asparagus and brown rice.' },
    { name: 'Snack', details: 'Apple slices with almond butter.' },
    { name: 'Hydration', details: 'Matcha latte and coconut water.' }
  ],
  'High BP': [
    { name: 'Breakfast', details: 'Oats with berries and ground flaxseed.' },
    { name: 'Lunch', details: 'Beet and quinoa salad with kale.' },
    { name: 'Dinner', details: 'Grilled fish with spinach and roasted sweet potato.' },
    { name: 'Snack', details: 'Carrot sticks and hummus.' },
    { name: 'Hydration', details: 'Cucumber water and hibiscus tea.' }
  ],
  Thyroid: [
    { name: 'Breakfast', details: 'Smoothie with berries, almond milk, and spinach.' },
    { name: 'Lunch', details: 'Turkey salad with seaweed and avocado.' },
    { name: 'Dinner', details: 'Baked chicken with steamed broccoli and brown rice.' },
    { name: 'Snack', details: 'Brazil nuts and pear slices.' },
    { name: 'Hydration', details: 'Warm herbal water and green tea.' }
  ],
  Cholesterol: [
    { name: 'Breakfast', details: 'Oatmeal with chia and apple.' },
    { name: 'Lunch', details: 'Salmon bowl with lentils and greens.' },
    { name: 'Dinner', details: 'Grilled turkey with steamed broccoli and barley.' },
    { name: 'Snack', details: 'Mixed nuts and carrot sticks.' },
    { name: 'Hydration', details: 'Berry-infused water and iced green tea.' }
  ],
  IBS: [
    { name: 'Breakfast', details: 'Warm oatmeal with banana and maple.' },
    { name: 'Lunch', details: 'Rice bowl with grilled poultry and cooked carrots.' },
    { name: 'Dinner', details: 'Poached fish with zucchini and mashed potatoes.' },
    { name: 'Snack', details: 'Rice crackers with avocado.' },
    { name: 'Hydration', details: 'Peppermint tea and coconut water.' }
  ],
  'Heart Disease': [
    { name: 'Breakfast', details: 'Whole-grain toast with avocado and tomato.' },
    { name: 'Lunch', details: 'Salmon salad with walnuts and spinach.' },
    { name: 'Dinner', details: 'Grilled chicken with barley and greens.' },
    { name: 'Snack', details: 'Fresh berries and almond butter.' },
    { name: 'Hydration', details: 'Citrus water and hibiscus tea.' }
  ],
  None: [
    { name: 'Breakfast', details: 'Smoothie bowl with oats, banana, and berries.' },
    { name: 'Lunch', details: 'Quinoa salad with roasted vegetables.' },
    { name: 'Dinner', details: 'Lean protein with mixed greens and sweet potato.' },
    { name: 'Snack', details: 'Greek yogurt with nuts.' },
    { name: 'Hydration', details: 'Water and green tea.' }
  ]
};

const baseChartData = {
  todayMacros: [
    { name: 'Protein', value: 46, color: macroColors.Protein },
    { name: 'Carbs', value: 178, color: macroColors.Carbs },
    { name: 'Fats', value: 62, color: macroColors.Fats }
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
  }))
};

const healthPlanStyle = (condition, vegetarian) => {
  const meals = {
    Diabetes: [
      {
        title: vegetarian ? 'Cinnamon Quinoa Porridge' : 'Egg White Veggie Bowl',
        category: 'Breakfast',
        description: vegetarian ? 'Low-glycemic quinoa with cinnamon and berries.' : 'Egg whites, spinach, and tomato for a clean protein start.'
      },
      {
        title: vegetarian ? 'Lentil & Greens Salad' : 'Grilled Salmon Salad',
        category: 'Lunch',
        description: vegetarian ? 'Fiber-rich lentils with kale, cucumber, and lemon.' : 'Salmon with mixed greens and avocado for stable energy.'
      },
      {
        title: vegetarian ? 'Zucchini Noodles' : 'Turkey Lettuce Wraps',
        category: 'Dinner',
        description: vegetarian ? 'Zoodles with tomato basil and walnut pesto.' : 'Lean turkey with crunchy lettuce and herbs.'
      }
    ],
    PCOS: [
      {
        title: vegetarian ? 'Greek Yogurt & Berry Bowl' : 'Smoked Salmon Scramble',
        category: 'Breakfast',
        description: vegetarian ? 'Probiotic yogurt with berries and chia for hormonal support.' : 'Salmon egg scramble with spinach and zucchini.'
      },
      {
        title: vegetarian ? 'Chickpea Spinach Wrap' : 'Quinoa Chicken Bowl',
        category: 'Lunch',
        description: vegetarian ? 'Fiber-rich chickpea wrap with leafy greens.' : 'Grilled chicken over quinoa with roasted vegetables.'
      },
      {
        title: vegetarian ? 'Stuffed Peppers' : 'Salmon Veggie Bake',
        category: 'Dinner',
        description: vegetarian ? 'Bell peppers filled with quinoa, beans, and herbs.' : 'Salmon baked with asparagus and sweet potato.'
      }
    ],
    'High BP': [
      {
        title: vegetarian ? 'Oatmeal with Berries' : 'Herbed Egg Toast',
        category: 'Breakfast',
        description: vegetarian ? 'Whole oats with berries and flaxseed.' : 'Whole-grain toast topped with herbed eggs and greens.'
      },
      {
        title: vegetarian ? 'Beet & Citrus Salad' : 'Turkey Avocado Sandwich',
        category: 'Lunch',
        description: vegetarian ? 'Beets, spinach, and citrus dressing to support circulation.' : 'Low-sodium turkey with avocado and sprouts.'
      },
      {
        title: vegetarian ? 'Roasted Vegetable Bowl' : 'Grilled Fish with Greens',
        category: 'Dinner',
        description: vegetarian ? 'Roasted root vegetables with lentils and tahini.' : 'Grilled fish, quinoa, and sautéed kale.'
      }
    ]
  };

  return meals[condition] || [];
};

const computeAllowedTypes = (condition, vegetarian) => {
  const veg = vegetarian ? 'Vegetarian' : 'Non-Vegetarian';
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

const mockAiRecommendation = (prompt, vegetarian, condition, dietType) => {
  const veg = vegetarian ? 'Veg' : 'Non-veg';
  const healthTag = condition !== 'None' ? condition : 'General wellness';
  const categoryLabel = `${veg} plan • ${healthTag}`;

  const meals = healthPlanStyle(condition, vegetarian).length
    ? healthPlanStyle(condition, vegetarian)
    : [
        {
          title: vegetarian ? 'Chickpea Avocado Toast' : 'Smoked Salmon Toast',
          category: 'Breakfast',
          description: vegetarian
            ? 'Protein-rich toast with creamy avocado and tangy lemon.'
            : 'Smoked salmon, greens, and whole-grain bread to start the day.'
        },
        {
          title: vegetarian ? 'Power Grain Bowl' : 'Grilled Chicken Salad',
          category: 'Lunch',
          description: vegetarian
            ? 'Quinoa, roasted veggies, feta, and tahini for balanced fuel.'
            : 'Lean chicken breast, kale, carrots, and sweet potato cubes.'
        },
        {
          title: vegetarian ? 'Savoury Tofu Stir-Fry' : 'Turkey Veggie Stir-Fry',
          category: 'Dinner',
          description: vegetarian
            ? 'Crispy tofu, bok choy, and brown rice with sesame notes.'
            : 'Turkey strips, broccoli, bell peppers, and a light ginger glaze.'
        }
      ];

  const allowed = computeAllowedTypes(condition, vegetarian);

  return {
    prompt,
    vegetarian,
    healthCondition: condition,
    dietType,
    categoryLabel,
    meals,
    snacks: [
      {
        title: 'Crunchy Seed Mix',
        description: 'Pumpkin seeds, almonds, and dried berries with sea salt.'
      },
      {
        title: 'Greek Yogurt Parfait',
        description: 'Creamy yogurt with granola, berries, and chia crunch.'
      }
    ],
    drinks: [
      {
        title: 'Matcha Mint Refresher',
        description: 'Light green tea with cooling mint and a squeeze of lime.'
      },
      {
        title: 'Immunity Berry Smoothie',
        description: 'Berry-rich smoothie with collagen, oats, and almond milk.'
      }
    ],
    dailyMacros: baseChartData.todayMacros,
    weeklyCalories: baseChartData.weeklyCalories,
    monthAdherence: baseChartData.monthAdherence,
    threeMonthAdherence: baseChartData.threeMonthAdherence,
    allowedFoodTypes: allowed.allowedFoodTypes,
    allowedDrinkTypes: allowed.allowedDrinkTypes,
    summary: `AI Nutrition guidance for ${veg} ${healthTag} support that matches your goals with a ${dietType.toLowerCase()} approach.`
  };
};

const reminderMessages = [
  'You skipped protein today — aim for a lean source at your next meal.',
  'Drink water now to stay hydrated and support recovery.',
  'Keep sodium low and focus on whole foods if you have high blood pressure.'
];

function App() {
  const [prompt, setPrompt] = useState('I am craving something crunchy but I want to keep it under 300 calories. I eat veg.');
  const [vegetarian, setVegetarian] = useState(true);
  const [selectedCondition, setSelectedCondition] = useState('None');
  const [selectedDiet, setSelectedDiet] = useState('Specific Diet');
  const [age, setAge] = useState('29');
  const [gender, setGender] = useState('Female');
  const [email, setEmail] = useState('');
  const [targetCalories, setTargetCalories] = useState('1900');
  const [registered, setRegistered] = useState(false);
  const [profile, setProfile] = useState({});
  const [selectedRange, setSelectedRange] = useState('today');
  const [checkedItems, setCheckedItems] = useState({});
  const [recommendation, setRecommendation] = useState({
    ...mockAiRecommendation(prompt, true, 'None', 'Specific Diet'),
    source: 'Fallback'
  });
  const [loading, setLoading] = useState(false);

  const chartData = useMemo(() => {
    if (selectedRange === 'today') return recommendation.dailyMacros;
    if (selectedRange === 'week') return recommendation.weeklyCalories;
    if (selectedRange === 'month') return recommendation.monthAdherence;
    return recommendation.threeMonthAdherence;
  }, [selectedRange, recommendation]);

  const mealTrackingItems = useMemo(() => {
    const mealKeys = (recommendation.meals || []).map((item) => `${item.category}:${item.title}`);
    const drinkKeys = (recommendation.drinks || []).map((item) => `Drink:${item.title}`);
    return [...mealKeys, ...drinkKeys];
  }, [recommendation.meals, recommendation.drinks]);

  const consumedCount = mealTrackingItems.filter((key) => checkedItems[key]).length;
  const adherenceScore = mealTrackingItems.length ? Math.round((consumedCount / mealTrackingItems.length) * 100) : 0;
  const progressRadius = 44;
  const circumference = 2 * Math.PI * progressRadius;
  const progressOffset = circumference - (adherenceScore / 100) * circumference;

  useEffect(() => {
    setCheckedItems({});
  }, [recommendation]);

  const handleRegister = () => {
    setProfile({
      email,
      age,
      gender,
      dietPreference: vegetarian ? 'Vegetarian' : 'Non-Vegetarian',
      healthCondition: selectedCondition,
      targetCalories: Number(targetCalories)
    });
    setRegistered(true);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const payload = {
      prompt,
      vegetarian,
      condition: selectedCondition,
      dietType: selectedDiet,
      age,
      gender,
      email,
      targetCalories: Number(targetCalories)
    };

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const baseRecommendation = mockAiRecommendation(prompt, vegetarian, selectedCondition, selectedDiet);

      if (response.ok) {
        const data = await response.json();
        setRecommendation({
          ...baseRecommendation,
          ...data,
          allowedFoodTypes: data.allowedFoodTypes || baseRecommendation.allowedFoodTypes,
          allowedDrinkTypes: data.allowedDrinkTypes || baseRecommendation.allowedDrinkTypes,
          source: data.source || 'AI'
        });
      } else {
        setRecommendation({ ...baseRecommendation, source: 'Fallback' });
      }
    } catch (error) {
      setRecommendation({ ...mockAiRecommendation(prompt, vegetarian, selectedCondition, selectedDiet), source: 'Fallback' });
    }

    setLoading(false);
  };

  const summaryStats = {
    calories: 1980,
    protein: 44,
    adherence: 87,
    mood: 'Energized'
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 rounded-3xl bg-white/90 p-8 shadow-soft backdrop-blur-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">NutriMind AI</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Personalized nutrition, powered by smart coaching.
              </h1>
              <p className="mt-4 max-w-2xl text-slate-600">
                Enter your craving, health preference, and diet type for recommendations tailored to your lifestyle.
              </p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-6 text-slate-900 shadow-soft md:w-[380px]">
              <p className="text-sm font-semibold uppercase text-emerald-700">Daily snapshot</p>
              <div className="mt-5 grid gap-4">
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase text-slate-500">Water intake</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">6 cups</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-xs uppercase text-slate-500">Protein check</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">On track</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-soft">
          <div className="flex items-center gap-6 text-slate-700">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-semibold text-slate-900 hover:text-emerald-600">
                {item.label}
              </a>
            ))}
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Health Mode: {selectedCondition}</div>
        </nav>

        <section id="dashboard" className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-soft" id="home">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">AI Nutrition Prompt</h2>
                  <p className="mt-2 text-slate-600">Describe your craving, calorie preference, and special diet.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">{selectedDiet}</div>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="mt-5 h-32 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setVegetarian(true)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      vegetarian ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Vegetarian
                  </button>
                  <button
                    onClick={() => setVegetarian(false)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      !vegetarian ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Non-Vegetarian
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-slate-700">Health condition mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    {healthConditions.map((condition) => (
                      <button
                        key={condition}
                        onClick={() => setSelectedCondition(condition)}
                        className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                          selectedCondition === condition ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-slate-200 bg-slate-100 text-slate-700 hover:border-emerald-400'
                        }`}
                      >
                        {condition}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setSelectedDiet('Specific Diet')}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedDiet === 'Specific Diet' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Specific Diet
                  </button>
                  <button
                    onClick={() => setSelectedDiet('Flexible Plan')}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedDiet === 'Flexible Plan' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Flexible Plan
                  </button>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Generating...' : 'Create Recommendation'}
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">AI Summary</h3>
                    <p className="mt-2 text-slate-600">Smart meal planning based on your cravings and your health condition.</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{recommendation.categoryLabel}</div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                      {recommendation.source || 'AI'}
                    </div>
                  </div>
                </div>
                <p className="mt-5 text-slate-700">{recommendation.summary}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-slate-900">Wellness metrics</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Target mood</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{summaryStats.mood}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Protein</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{summaryStats.protein}g</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Allowed Food & Drink Types</h2>
              <p className="mt-2 text-slate-600">Based on your profile selection, these are the food and drink categories recommended for you.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Food Types</p>
                  <div className="mt-4 space-y-2">
                    {(recommendation.allowedFoodTypes || []).map((item) => (
                      <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Drink Types</p>
                  <div className="mt-4 space-y-2">
                    {(recommendation.allowedDrinkTypes || []).map((item) => (
                      <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">NutriMind Results Dashboard</h2>
                  <p className="mt-2 text-slate-600">Real-time AI diet planning using your profile and selected health condition.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                    {recommendation.source || 'AI'}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    {selectedCondition}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <div className="space-y-5">
                  <div className="grid gap-5 lg:grid-cols-2">
                    {(recommendation.meals || []).map((meal) => {
                      const mealKey = `${meal.category}:${meal.title}`;
                      return (
                        <div key={mealKey} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{meal.category}</p>
                              <h3 className="mt-2 text-lg font-semibold text-slate-900">{meal.title}</h3>
                            </div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <input
                                type="checkbox"
                                checked={!!checkedItems[mealKey]}
                                onChange={() => setCheckedItems((prev) => ({ ...prev, [mealKey]: !prev[mealKey] }))}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              Eaten
                            </label>
                          </div>
                          <p className="mt-4 text-slate-700">{meal.description}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Hydration / Drinks</p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">Smart drink pairings</h3>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{recommendation.drinks?.length || 0} items</span>
                    </div>
                    <div className="mt-4 space-y-4">
                      {(recommendation.drinks || []).map((drink) => {
                        const drinkKey = `Drink:${drink.title}`;
                        return (
                          <div key={drink.title} className="rounded-3xl bg-white p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4 className="text-base font-semibold text-slate-900">{drink.title}</h4>
                                <p className="mt-2 text-slate-600">{drink.description}</p>
                              </div>
                              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={!!checkedItems[drinkKey]}
                                  onChange={() => setCheckedItems((prev) => ({ ...prev, [drinkKey]: !prev[drinkKey] }))}
                                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                Drank
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-3xl bg-emerald-600 p-6 text-white shadow-soft">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Interactive adherence</p>
                        <h3 className="mt-2 text-3xl font-semibold">{adherenceScore}%</h3>
                      </div>
                      <div className="relative h-28 w-28">
                        <svg className="rotate-[-90deg]" width="110" height="110" viewBox="0 0 110 110">
                          <circle cx="55" cy="55" r="44" className="fill-none stroke-slate-200" strokeWidth="10" />
                          <circle
                            cx="55"
                            cy="55"
                            r="44"
                            className="fill-none stroke-white stroke-[10]"
                            strokeDasharray={circumference}
                            strokeDashoffset={progressOffset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 grid place-items-center">
                          <span className="text-xl font-semibold">{adherenceScore}%</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-slate-200">Mark your meals and drinks as consumed to build a daily adherence score that updates in real time.</p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">Diet Chart</h3>
                    <p className="mt-2 text-slate-600">A disease-specific daily plan based on your selected condition.</p>
                    <div className="mt-5 space-y-3">
                      {(healthConditionDietChart[selectedCondition || 'None'] || []).map((item) => (
                        <div key={item.name} className="rounded-3xl bg-white p-4 shadow-sm">
                          <p className="text-sm uppercase tracking-[0.16em] text-slate-500">{item.name}</p>
                          <p className="mt-2 text-slate-700">{item.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">Food & Drink Guide</h3>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-3xl bg-white p-4 shadow-sm">
                        <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Recommended foods</p>
                        <div className="mt-3 grid gap-2">
                          {(healthConditionRecommendations[selectedCondition || 'None'].food || []).map((item) => (
                            <span key={item} className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{item}</span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-3xl bg-white p-4 shadow-sm">
                        <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Recommended drinks</p>
                        <div className="mt-3 grid gap-2">
                          {(healthConditionRecommendations[selectedCondition || 'None'].drinks || []).map((item) => (
                            <span key={item} className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft" id="specific-diet">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Specific Diet Mode</h2>
                  <p className="mt-2 text-slate-600">Specialized plans for diabetes, thyroid, cholesterol, IBS, heart disease, PCOS, and high blood pressure.</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">{selectedCondition}</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {['Diabetes', 'PCOS', 'High BP'].map((condition) => (
                  <div key={condition} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{condition}</p>
                    <p className="mt-3 text-slate-700">{healthConditionNotes[condition]}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Condition-specific foods</h3>
                    <p className="mt-2 text-sm text-slate-600">Foods and drinks tailored to your selected health issue.</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                    {selectedCondition || 'General'}
                  </span>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recommended foods</p>
                    <div className="mt-4 space-y-2">
                      {healthConditionRecommendations[selectedCondition || 'None'].food.map((item) => (
                        <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recommended drinks</p>
                    <div className="mt-4 space-y-2">
                      {healthConditionRecommendations[selectedCondition || 'None'].drinks.map((item) => (
                        <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Track your wellness</h2>
                  <p className="mt-2 text-slate-600">Water, meals, calories and AI reminders to keep you on track.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{selectedDiet}</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-emerald-50 p-5 text-slate-900 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-emerald-700">Water intake</p>
                  <p className="mt-3 text-3xl font-semibold">6 cups</p>
                  <p className="mt-2 text-sm text-slate-700">Goal: 8 cups</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Meals logged</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">3</p>
                  <p className="mt-2 text-sm text-slate-600">Breakfast, Lunch, Dinner</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Calories today</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">1,320 kcal</p>
                  <p className="mt-2 text-sm text-slate-600">Recommended 1,900 kcal</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {reminderMessages.map((reminder) => (
                  <div key={reminder} className="rounded-3xl bg-slate-100 p-4 text-slate-700 shadow-sm">
                    <p className="text-sm font-semibold text-emerald-700">AI Reminder</p>
                    <p className="mt-2 text-sm">{reminder}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Tracking Dashboard</h2>
                  <p className="mt-2 text-slate-600">Time-based analytics for calories, macros and progress.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Live</div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {rangeTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedRange(tab.key)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedRange === tab.key
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="mt-6 h-[340px] rounded-3xl bg-slate-50 p-4 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedRange === 'today' ? (
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={4}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}g`} />
                    </PieChart>
                  ) : selectedRange === 'week' ? (
                    <BarChart data={chartData} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value) => `${value} kcal`} />
                      <ReferenceLine y={2000} stroke="#16a34a" strokeDasharray="4 4" label={{ position: 'top', value: 'Target', fill: '#16a34a', fontSize: 12 }} />
                      <Bar dataKey="calories" fill="#059669" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" hide />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value) => (typeof value === 'number' ? `${value}` : value)} />
                      <Legend verticalAlign="top" height={36} />
                      <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="weight" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Weekly goal</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">2000 kcal</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Long-term score</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{selectedRange === '3months' ? '89%' : '84%'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-slate-900">Macro break down</h3>
              <div className="mt-4 space-y-3">
                {baseChartData.todayMacros.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{item.value}g</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow-soft" id="login">
          <h2 className="text-xl font-semibold text-slate-900">Login / Register</h2>
          <p className="mt-2 text-slate-600">Register your profile to personalize NutriMind AI results.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="Email"
            />
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="Age"
              type="number"
              min="12"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
            </select>
            <input
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              placeholder="Target calories"
              type="number"
              min="800"
            />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handleRegister}
              className="rounded-full bg-slate-800 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-slate-900"
            >
              Register Profile
            </button>
            {registered && (
              <div className="rounded-3xl bg-emerald-50 p-4 text-slate-900 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">Profile registered</p>
                <p className="mt-2 text-sm">{profile.age} yrs / {profile.gender} / {profile.dietPreference}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
