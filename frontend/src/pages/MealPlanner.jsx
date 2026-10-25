import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Sparkles,
  RefreshCw,
  ShoppingCart,
  Flame,
  Clock,
  Check,
  CheckCircle2,
  ChevronRight,
  Bookmark,
  Share2,
} from 'lucide-react';
import { mealApi } from '../api/mealApi';
import confetti from 'canvas-confetti';

const DIETARY_OPTIONS = [
  'Balanced',
  'High Protein',
  'Mediterranean',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Low Carb',
  'Paleo',
];

const ALLERGIES_LIST = ['Dairy', 'Gluten', 'Peanuts', 'Tree Nuts', 'Shellfish', 'Eggs', 'Soy'];

const MealPlanner = () => {
  const [dietaryPreference, setDietaryPreference] = useState('Balanced');
  const [targetCalories, setTargetCalories] = useState(2000);
  const [durationDays, setDurationDays] = useState(3);
  const [budgetLevel, setBudgetLevel] = useState('Standard');
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [pantryIngredients, setPantryIngredients] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [checkedGrocery, setCheckedGrocery] = useState({});
  const [swappingMealId, setSwappingMealId] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleAllergy = (allergy) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  const handleGeneratePlan = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await mealApi.generatePlan({
        duration_days: durationDays,
        dietary_preference: dietaryPreference,
        allergies: selectedAllergies,
        target_calories_daily: targetCalories,
        budget_level: budgetLevel,
        available_pantry: pantryIngredients,
      });
      setPlanResult(res);
      setActiveDayIndex(0);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      alert('Error generating meal plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Meal Swap
  const handleSwapMeal = async (dayIndex, mealIndex, currentMeal) => {
    setSwappingMealId(currentMeal.id);
    try {
      const res = await mealApi.swapMeal({
        meal_type: currentMeal.meal_type,
        current_dish: currentMeal.name,
        dietary_preference: dietaryPreference,
        target_calories: currentMeal.calories,
        avoid_ingredients: selectedAllergies,
      });

      // Update planResult state locally
      setPlanResult((prev) => {
        if (!prev) return prev;
        const newDays = [...prev.days];
        const dayMeals = [...newDays[dayIndex].meals];
        dayMeals[mealIndex] = res.replacement_dish;
        newDays[dayIndex] = { ...newDays[dayIndex], meals: dayMeals };
        return { ...prev, days: newDays };
      });
    } catch (err) {
      alert('Failed to swap meal: ' + err.message);
    } finally {
      setSwappingMealId(null);
    }
  };

  const toggleGroceryItem = (item) => {
    setCheckedGrocery((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // Generate an initial plan on mount if not yet generated
  useEffect(() => {
    handleGeneratePlan();
  }, []);

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '1.4rem' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-900)' }}>
          Personalized Multi-Day Meal Planner
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Calibrate nutritious meal schedules matching your daily calorie goals, dietary restrictions, and kitchen budget. Features 1-click dish swaps and categorized smart grocery checklists.
        </p>
      </div>

      {/* Generator Controls Card */}
      <div className="card" style={{ marginBottom: '1.8rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--forest-900)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--mint-500)" /> Calibrate Your Nutrition Blueprint
        </h3>

        <form onSubmit={handleGeneratePlan}>
          <div className="grid-3" style={{ marginBottom: '1.2rem' }}>
            {/* Dietary Style */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Dietary Preference</label>
              <select
                className="form-select"
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
              >
                {DIETARY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} Diet
                  </option>
                ))}
              </select>
            </div>

            {/* Target Daily Calories */}
            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Daily Calorie Goal</label>
                <span style={{ fontWeight: 800, color: 'var(--mint-600)', fontSize: '0.9rem' }}>
                  {targetCalories} kcal
                </span>
              </div>
              <input
                type="range"
                min="1200"
                max="3500"
                step="50"
                value={targetCalories}
                onChange={(e) => setTargetCalories(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--mint-500)', cursor: 'pointer' }}
              />
            </div>

            {/* Duration & Budget */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Plan Duration & Budget</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select
                  className="form-select"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                >
                  <option value={1}>1 Day Sprint</option>
                  <option value={3}>3-Day Plan</option>
                  <option value={7}>Full 7-Day Plan</option>
                </select>
                <select
                  className="form-select"
                  value={budgetLevel}
                  onChange={(e) => setBudgetLevel(e.target.value)}
                >
                  <option value="Budget-Friendly">Budget</option>
                  <option value="Standard">Standard</option>
                  <option value="Gourmet">Gourmet</option>
                </select>
              </div>
            </div>
          </div>

          {/* Allergies Chips */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label className="form-label">Allergies & Intolerances (Click to Avoid)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ALLERGIES_LIST.map((allg) => {
                const selected = selectedAllergies.includes(allg);
                return (
                  <button
                    type="button"
                    key={allg}
                    onClick={() => toggleAllergy(allg)}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: `1.5px solid ${selected ? 'var(--accent-rose)' : 'var(--cream-border)'}`,
                      background: selected ? 'var(--accent-rose-bg)' : '#FFFFFF',
                      color: selected ? '#B91C1C' : 'var(--forest-900)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    {selected ? `✕ Avoid ${allg}` : `+ ${allg}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pantry input */}
          <div style={{ marginBottom: '1.4rem' }}>
            <label className="form-label">Pantry Items to Incorporate (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Quinoa, sweet potatoes, eggs, spinach, chia seeds"
              value={pantryIngredients}
              onChange={(e) => setPantryIngredients(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '200px' }}>
              {loading ? (
                <>
                  <span className="pulse-indicator" style={{ marginRight: '6px' }} />
                  Generating Custom Plan...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Personalized Plan
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Meal Plan Display */}
      {planResult && (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {/* Header summary */}
          <div
            className="card card-forest"
            style={{
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-mint">{planResult.dietary_type}</span>
                <span className="badge badge-forest">{planResult.daily_calorie_target} kcal/day target</span>
                {planResult.is_demo && <span className="badge badge-amber">Demo Simulation</span>}
              </div>
              <h2 style={{ fontSize: '1.7rem', color: '#FFFFFF' }}>{planResult.title}</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.92rem', maxWidth: '750px', marginTop: '0.3rem' }}>
                {planResult.weekly_overview}
              </p>
            </div>

            {/* Macro Targets */}
            {planResult.macro_targets && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '1rem 1.4rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontSize: '0.84rem',
                }}
              >
                <div style={{ fontWeight: 800, color: 'var(--mint-300)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Macro Blueprint
                </div>
                {Object.entries(planResult.macro_targets).map(([k, v], i) => (
                  <div key={i} style={{ color: 'white', marginBottom: '0.2rem' }}>
                    <span style={{ opacity: 0.8 }}>{k}:</span> <strong>{v}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Days Tabs */}
          {planResult.days && planResult.days.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
                {planResult.days.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDayIndex(idx)}
                    style={{
                      padding: '0.7rem 1.4rem',
                      borderRadius: 'var(--radius-md)',
                      border: activeDayIndex === idx ? '2px solid var(--mint-500)' : '1px solid var(--cream-border)',
                      background: activeDayIndex === idx ? 'var(--forest-800)' : '#FFFFFF',
                      color: activeDayIndex === idx ? '#FFFFFF' : 'var(--forest-900)',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.92rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      whiteSpace: 'nowrap',
                      transition: 'var(--transition)',
                      boxShadow: activeDayIndex === idx ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    <span>{day.day}</span>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-pill)',
                        background: activeDayIndex === idx ? 'var(--mint-500)' : 'var(--cream-200)',
                        color: activeDayIndex === idx ? '#081C13' : 'var(--text-muted)',
                      }}
                    >
                      {day.total_calories} kcal
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meals for selected day */}
          {planResult.days?.[activeDayIndex] && (
            <div style={{ marginBottom: '2rem' }}>
              <div className="grid-2">
                {planResult.days[activeDayIndex].meals.map((meal, mIdx) => (
                  <div
                    key={meal.id || mIdx}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderTop: `4px solid ${
                        meal.meal_type === 'Breakfast'
                          ? '#F59E0B'
                          : meal.meal_type === 'Lunch'
                          ? 'var(--mint-500)'
                          : meal.meal_type === 'Dinner'
                          ? 'var(--forest-700)'
                          : '#8B5CF6'
                      }`,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className="badge badge-mint">{meal.meal_type}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', fontWeight: 700, color: 'var(--forest-900)' }}>
                          <Flame size={15} color="var(--accent-amber)" />
                          {meal.calories} kcal
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', color: 'var(--forest-900)', marginBottom: '0.4rem' }}>
                        {meal.name}
                      </h3>

                      {/* Macros row */}
                      <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.78rem', marginBottom: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>P: <strong style={{ color: 'var(--mint-600)' }}>{meal.protein_g}g</strong></span>
                        <span>•</span>
                        <span>C: <strong>{meal.carbs_g}g</strong></span>
                        <span>•</span>
                        <span>F: <strong>{meal.fats_g}g</strong></span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Clock size={12} /> {meal.prep_time_minutes}m
                        </span>
                      </div>

                      {/* Ingredients list */}
                      <div style={{ marginBottom: '0.8rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          Key Ingredients:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {meal.ingredients_summary.map((ing, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '0.74rem',
                                padding: '0.15rem 0.5rem',
                                background: 'var(--cream-100)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--cream-border)',
                              }}
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p style={{ fontSize: '0.84rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                        {meal.quick_recipe}
                      </p>
                    </div>

                    {/* Swap button */}
                    <div style={{ marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid var(--cream-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {meal.alternative_suggestion ? `Alt: ${meal.alternative_suggestion}` : 'Nutritionally matched'}
                      </span>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleSwapMeal(activeDayIndex, mIdx, meal)}
                        disabled={swappingMealId === meal.id}
                        title="Swap with an alternative matched dish"
                      >
                        <RefreshCw size={13} className={swappingMealId === meal.id ? 'spin' : ''} />
                        {swappingMealId === meal.id ? 'Swapping...' : 'Swap Meal'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorized Grocery List */}
          {planResult.grocery_list && planResult.grocery_list.length > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
                <ShoppingCart size={22} color="var(--forest-900)" />
                <h3 style={{ fontSize: '1.3rem', color: 'var(--forest-900)', margin: 0 }}>
                  Smart Categorized Grocery Checklist
                </h3>
              </div>

              <div className="grid-2">
                {planResult.grocery_list.map((cat, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      padding: '1.1rem',
                      background: 'var(--cream-50)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--cream-border)',
                    }}
                  >
                    <h4 style={{ fontSize: '1rem', color: 'var(--forest-900)', marginBottom: '0.6rem', fontWeight: 800 }}>
                      🛒 {cat.category}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {cat.items.map((item, i) => {
                        const isDone = !!checkedGrocery[item];
                        return (
                          <li
                            key={i}
                            onClick={() => toggleGroceryItem(item)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              padding: '0.4rem 0',
                              fontSize: '0.86rem',
                              color: isDone ? 'var(--text-muted)' : 'var(--text-dark)',
                              textDecoration: isDone ? 'line-through' : 'none',
                              cursor: 'pointer',
                              borderBottom: '1px dashed rgba(0,0,0,0.06)',
                            }}
                          >
                            <div
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                border: `1.5px solid ${isDone ? 'var(--mint-500)' : 'var(--cream-border)'}`,
                                background: isDone ? 'var(--mint-500)' : '#FFFFFF',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {isDone && <Check size={13} strokeWidth={3} />}
                            </div>
                            <span>{item}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
