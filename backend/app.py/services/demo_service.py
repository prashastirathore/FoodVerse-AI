import random
from typing import Dict, Any, List

class DemoService:
    @staticmethod
    def get_demo_nutrition_analysis(food_hint: str = "") -> Dict[str, Any]:
        """Realistic sample food nutrition analysis with full macro & micro breakdowns."""
        samples = [
            {
                "title": "Mediterranean Grilled Salmon & Quinoa Bowl",
                "summary": "A nutrient-dense, heart-healthy dish packed with omega-3 fatty acids, complex carbohydrates, and vibrant colorful vegetables.",
                "health_score": 94,
                "dietary_classification": ["High Protein", "Heart Healthy", "Gluten-Free Friendly", "Mediterranean"],
                "macronutrients": {
                    "calories": 585.0,
                    "protein_g": 42.5,
                    "carbohydrates_g": 48.0,
                    "fats_g": 22.0,
                    "fiber_g": 8.5,
                    "sugar_g": 4.2,
                    "sodium_mg": 460.0
                },
                "micronutrients": {
                    "Omega-3 Fatty Acids": "2.6g (High)",
                    "Vitamin D": "85% DV",
                    "Vitamin B12": "110% DV",
                    "Iron": "22% DV",
                    "Potassium": "680mg"
                },
                "items": [
                    {
                        "name": "Pan-Seared Atlantic Salmon Fillet",
                        "portion_size": "1 fillet (approx 160g)",
                        "estimated_weight_g": 160.0,
                        "calories": 310.0,
                        "protein_g": 34.0,
                        "carbs_g": 0.0,
                        "fats_g": 18.0,
                        "fiber_g": 0.0,
                        "glycemic_index": "Low (0)",
                        "confidence_score": 0.96
                    },
                    {
                        "name": "Herbed Quinoa Base",
                        "portion_size": "3/4 cup cooked (approx 135g)",
                        "estimated_weight_g": 135.0,
                        "calories": 165.0,
                        "protein_g": 6.0,
                        "carbs_g": 30.0,
                        "fats_g": 2.5,
                        "fiber_g": 3.8,
                        "glycemic_index": "Low (53)",
                        "confidence_score": 0.93
                    },
                    {
                        "name": "Roasted Asparagus & Cherry Tomatoes",
                        "portion_size": "1 cup mixed (approx 120g)",
                        "estimated_weight_g": 120.0,
                        "calories": 55.0,
                        "protein_g": 2.5,
                        "carbs_g": 10.0,
                        "fats_g": 1.0,
                        "fiber_g": 4.2,
                        "glycemic_index": "Very Low (15)",
                        "confidence_score": 0.95
                    },
                    {
                        "name": "Lemon Tahini Drizzle & Olive Oil",
                        "portion_size": "1 tablespoon",
                        "estimated_weight_g": 15.0,
                        "calories": 55.0,
                        "protein_g": 0.0,
                        "carbs_g": 8.0,
                        "fats_g": 0.5,
                        "fiber_g": 0.5,
                        "glycemic_index": "Low (30)",
                        "confidence_score": 0.88
                    }
                ],
                "insights": [
                    "Excellent protein-to-calorie ratio, ideal for muscle maintenance and long-lasting satiety.",
                    "High in EPA and DHA omega-3s promoting cardiovascular and cognitive health.",
                    "Low glycemic index ingredients prevent sharp blood sugar spikes."
                ],
                "recommendations": [
                    "Consider pairing with a glass of lemon-infused water to maximize plant-based iron absorption.",
                    "If aiming for strict keto, substitute quinoa with cauliflower rice to reduce net carbs to under 12g."
                ]
            },
            {
                "title": "Avocado & Poached Egg Artisanal Toast",
                "summary": "Crisp whole grain sourdough topped with mashed Hass avocado, poached organic eggs, chili flakes, and microgreens.",
                "health_score": 88,
                "dietary_classification": ["Vegetarian", "High Fiber", "Healthy Fats"],
                "macronutrients": {
                    "calories": 440.0,
                    "protein_g": 18.0,
                    "carbohydrates_g": 34.0,
                    "fats_g": 26.0,
                    "fiber_g": 9.2,
                    "sugar_g": 2.5,
                    "sodium_mg": 380.0
                },
                "micronutrients": {
                    "Vitamin E": "35% DV",
                    "Choline": "45% DV",
                    "Folate": "28% DV",
                    "Lutein & Zeaxanthin": "High"
                },
                "items": [
                    {
                        "name": "Artisanal Sourdough Toast",
                        "portion_size": "1 large slice (60g)",
                        "estimated_weight_g": 60.0,
                        "calories": 160.0,
                        "protein_g": 6.0,
                        "carbs_g": 30.0,
                        "fats_g": 1.5,
                        "fiber_g": 2.2,
                        "glycemic_index": "Medium (54)",
                        "confidence_score": 0.95
                    },
                    {
                        "name": "Fresh Hass Avocado",
                        "portion_size": "1/2 medium avocado (75g)",
                        "estimated_weight_g": 75.0,
                        "calories": 140.0,
                        "protein_g": 2.0,
                        "carbs_g": 4.0,
                        "fats_g": 13.5,
                        "fiber_g": 7.0,
                        "glycemic_index": "Low (15)",
                        "confidence_score": 0.98
                    },
                    {
                        "name": "Poached Free-Range Egg",
                        "portion_size": "1 large egg (50g)",
                        "estimated_weight_g": 50.0,
                        "calories": 72.0,
                        "protein_g": 6.3,
                        "carbs_g": 0.4,
                        "fats_g": 4.8,
                        "fiber_g": 0.0,
                        "glycemic_index": "Zero",
                        "confidence_score": 0.94
                    }
                ],
                "insights": [
                    "Avocado monounsaturated oleic acid supports healthy cholesterol levels.",
                    "Egg yolk provides bioavailable choline essential for nervous system health."
                ],
                "recommendations": [
                    "Add hemp hearts or chia seeds on top for an extra 4g of plant protein and crunch."
                ]
            }
        ]
        
        # Pick sample matching hint if possible
        if "egg" in food_hint.lower() or "toast" in food_hint.lower() or "avocado" in food_hint.lower():
            sample = samples[1]
        else:
            sample = samples[0]

        return {
            **sample,
            "is_demo": True,
            "ai_model_used": "Gemini Multimodal Simulator (Demo Mode)"
        }

    @staticmethod
    def get_demo_freshness_analysis(item_hint: str = "") -> Dict[str, Any]:
        """Realistic food freshness evaluation with visible cues and shelf-life guidance."""
        if "banana" in item_hint.lower():
            return {
                "item_name": "Ripe Cavendish Bananas",
                "category": "Fruit",
                "freshness_status": "Consume Soon",
                "freshness_index": 72,
                "confidence": 0.94,
                "estimated_shelf_life": "2 - 3 days at ambient room temperature",
                "visible_signs": [
                    {"category": "Bruising", "observed": True, "severity": "Low", "details": "Minor superficial pressure spots on peel; pulp likely intact."},
                    {"category": "Discoloration", "observed": True, "severity": "Moderate", "details": "Sugar freckling (brown speckles) indicates peak natural sweetness and high starch-to-sugar conversion."},
                    {"category": "Mold Patterns", "observed": False, "severity": "None", "details": "No fungal mycelium or white/black fuzzy sporulation observed on stem or skin."},
                    {"category": "Wilting / Dehydration", "observed": False, "severity": "None", "details": "Peel retains natural moisture with no severe shrinkage."},
                    {"category": "Structural Integrity", "observed": True, "severity": "Low", "details": "Stem shows drying consistent with normal post-harvest aging."}
                ],
                "observations": [
                    "The fruit has reached peak enzymatic sweetness with yellow skin and evenly dispersed sugar speckles.",
                    "Stem junction is slightly brown but firm, showing no weeping moisture or rot."
                ],
                "storage_recommendation": "Keep separated from other ethylene-sensitive produce. If unable to consume within 48 hours, peel, slice, and freeze for smoothies or bake into banana bread.",
                "culinary_rescue_tips": "Ideal for healthy banana pancakes, oat smoothies, or freezing into guilt-free nice-cream.",
                "is_demo": True,
                "ai_model_used": "Gemini Multimodal Simulator (Demo Mode)"
            }
        elif "spinach" in item_hint.lower() or "salad" in item_hint.lower() or "greens" in item_hint.lower():
            return {
                "item_name": "Fresh Organic Baby Spinach Leaves",
                "category": "Vegetable",
                "freshness_status": "Optimal Freshness",
                "freshness_index": 92,
                "confidence": 0.95,
                "estimated_shelf_life": "5 - 7 days in crisper drawer (38°F / 3°C)",
                "visible_signs": [
                    {"category": "Bruising", "observed": False, "severity": "None", "details": "No leaf mechanical crushing or bruised venation."},
                    {"category": "Discoloration", "observed": False, "severity": "None", "details": "Uniform deep chlorophyll green with no yellowing (chlorosis)."},
                    {"category": "Mold Patterns", "observed": False, "severity": "None", "details": "Completely clean leaf margins, zero mold sporulation."},
                    {"category": "Wilting / Dehydration", "observed": False, "severity": "None", "details": "High turgor pressure; stems and leaves are crisp and upright."},
                    {"category": "Slime / Wet Rot", "observed": False, "severity": "None", "details": "Dry leaf surfaces without moisture pooling or bacterial breakdown."}
                ],
                "observations": [
                    "Vibrant chlorophyll pigmentation indicating optimal vitamin K, folate, and iron density.",
                    "Crisp cellular structure with no wilting along leaf edges."
                ],
                "storage_recommendation": "Line container with dry paper towels to absorb excess condensation and seal in an airtight container in the vegetable crisper.",
                "culinary_rescue_tips": "If leaves begin wilting in upcoming days, blanch immediately and submerge in ice water before freezing.",
                "is_demo": True,
                "ai_model_used": "Gemini Multimodal Simulator (Demo Mode)"
            }
        else:
            return {
                "item_name": "Crisp Honeycrisp Apple",
                "category": "Fruit",
                "freshness_status": "Optimal Freshness",
                "freshness_index": 95,
                "confidence": 0.97,
                "estimated_shelf_life": "2 - 3 weeks under refrigeration (34°F - 38°F)",
                "visible_signs": [
                    {"category": "Bruising", "observed": False, "severity": "None", "details": "Smooth, firm skin with no indentations or soft spots."},
                    {"category": "Discoloration", "observed": False, "severity": "None", "details": "Vibrant natural bicolored crimson and golden-yellow striations."},
                    {"category": "Mold Patterns", "observed": False, "severity": "None", "details": "Stem cavity and calyx are completely clean of fungal growth."},
                    {"category": "Wilting / Dehydration", "observed": False, "severity": "None", "details": "Taut skin showing zero wrinkling or moisture loss."}
                ],
                "observations": [
                    "Excellent outer skin luster and tight cellular turgidity.",
                    "Stem is intact, dry, and firmly anchored to the fruit."
                ],
                "storage_recommendation": "Store unwashed in the produce crisper drawer. Keep away from ethylene-sensitive leafy greens for longest storage life.",
                "culinary_rescue_tips": "Perfect for raw eating, pairing with sharp cheddar cheese, or crisp salad additions.",
                "is_demo": True,
                "ai_model_used": "Gemini Multimodal Simulator (Demo Mode)"
            }

    @staticmethod
    def get_demo_hygiene_audit(kitchen_hint: str = "") -> Dict[str, Any]:
        """Realistic commercial restaurant and kitchen hygiene inspection."""
        return {
            "location_name": "Commercial Kitchen - Prep & Line Station #2",
            "overall_score": 88,
            "grade": "Grade B (Good Compliance)",
            "risk_level": "Low-to-Moderate Risk",
            "executive_summary": "Overall kitchen sanitation is good with well-maintained stainless steel counters and designated equipment. Minor corrective actions required regarding towel placement and utensil separation.",
            "checklist_breakdown": [
                {
                    "category_name": "Surface Sanitization & Cleanliness",
                    "status": "Pass",
                    "score": 92,
                    "notes": "Food contact stainless steel surfaces show proper degreasing with no visible organic food debris."
                },
                {
                    "category_name": "Cross-Contamination Prevention",
                    "status": "Minor Issue",
                    "score": 82,
                    "notes": "A cutting board was observed adjacent to an unwashed prep bowl; ensure distinct color-coded boards are maintained."
                },
                {
                    "category_name": "Storage & Labeling Compliance",
                    "status": "Pass",
                    "score": 90,
                    "notes": "Containers on bottom rack are elevated at least 6 inches off floor level."
                },
                {
                    "category_name": "Waste & Clutter Management",
                    "status": "Pass",
                    "score": 88,
                    "notes": "Trash receptacles are covered and under 75% capacity."
                }
            ],
            "findings": [
                {
                    "area": "Secondary Prep Table",
                    "issue": "Damp cleaning cloth resting directly on food contact surface instead of sanitizing quat bucket.",
                    "severity": "Medium",
                    "description": "Sanitizer cloth must be submerged in approved 200ppm quaternary solution between uses to prevent bacterial biofilm colonization."
                },
                {
                    "area": "Handwash Sink Splash Guard",
                    "issue": "Minor water splash residue near paper towel dispenser.",
                    "severity": "Low",
                    "description": "Wipe dry to prevent moisture accumulation near paper towel supply."
                }
            ],
            "corrective_actions": [
                {
                    "priority": "Immediate (Within 30 mins)",
                    "action": "Remove damp wiping cloths from countertops and place in freshly tested sanitizing solution bucket.",
                    "target_timeline": "Immediate"
                },
                {
                    "priority": "High (By Shift Change)",
                    "action": "Verify color-coded cutting boards (Red=Raw Meat, Green=Produce, Yellow=Poultry) are organized on drying rack.",
                    "target_timeline": "End of current shift"
                },
                {
                    "priority": "Routine (Weekly Review)",
                    "action": "Calibrate refrigerator thermometer and inspect silicone door gasket seals for airtight closure.",
                    "target_timeline": "Weekly sanitation log"
                }
            ],
            "positive_observations": [
                "Stainless steel workstations are well-polished and free of carbon buildup.",
                "Floors are clean and dry, minimizing slip hazard and microbial harborages.",
                "No signs of open insect or rodent entry points."
            ],
            "is_demo": True,
            "ai_model_used": "Gemini Multimodal Simulator (Demo Mode)"
        }

    @staticmethod
    def get_demo_cooking_assistant_response(query: str) -> Dict[str, Any]:
        """Realistic interactive cooking assistance, substitutions, and recipe creation."""
        q = query.lower()
        if "substitute" in q or "substitut" in q:
            return {
                "reply": "Here are the best culinary substitutions tailored for your dish:",
                "substitutions": [
                    {"original": "Heavy Cream", "substitute": "Full-fat canned coconut milk (1:1) or Greek yogurt blended with milk", "flavor_profile": "Rich, creamy, slightly tangy with yogurt"},
                    {"original": "All-Purpose Flour", "substitute": "1:1 Gluten-free baking blend or oat flour (adds nutty nuance)", "flavor_profile": "Neutral to hearty"},
                    {"original": "Eggs (in baking)", "substitute": "1 tbsp ground flaxseed + 3 tbsp warm water (flax egg) per egg", "flavor_profile": "Mildly nutty, retains moisture"},
                    {"original": "Buttermilk", "substitute": "1 cup milk + 1 tbsp fresh lemon juice or white vinegar (let sit 5 mins)", "flavor_profile": "Tangy and tenderizing"}
                ],
                "follow_up_suggestions": [
                    "Can I substitute sour cream for Greek yogurt?",
                    "What can I replace soy sauce with for gluten-free?",
                    "Suggest a 20-minute dinner using these ingredients"
                ],
                "is_demo": True,
                "ai_model_used": "Gemini AI (Demo Simulation)"
            }
        else:
            return {
                "reply": "Chef FoodVerse at your service! Based on your query, here is an exceptional, vibrant, high-protein recipe crafted with balanced nutrition in mind.",
                "suggested_recipe": {
                    "title": "Lemon Herb Pan-Seared Chicken with Mint Quinoa",
                    "description": "Tender golden chicken cutlets infused with zesty lemon, garlic, and thyme, served over a fluffy mint-speckled quinoa pilaf.",
                    "cuisine": "Mediterranean Fusion",
                    "prep_time_minutes": 15,
                    "cook_time_minutes": 20,
                    "servings": 2,
                    "difficulty": "Easy",
                    "calories_per_serving": 490,
                    "dietary_tags": ["High Protein", "Gluten-Free", "Clean Eating"],
                    "ingredients": [
                        {"name": "Boneless skinless chicken breasts", "amount": "2 breasts (approx 350g)", "substitution": "Firm tofu cutlets or salmon fillets"},
                        {"name": "Organic quinoa", "amount": "1 cup rinsed", "substitution": "Brown basmati or cauliflower rice"},
                        {"name": "Fresh mint & flat-leaf parsley", "amount": "1/2 cup finely chopped", "substitution": "Cilantro and dill"},
                        {"name": "Extra virgin olive oil", "amount": "2 tablespoons", "substitution": "Avocado oil"},
                        {"name": "Fresh lemon", "amount": "1 whole (juice & zest)", "substitution": "Lime"},
                        {"name": "Garlic cloves", "amount": "3 minced", "substitution": "1 tsp garlic powder"},
                        {"name": "Sea salt and cracked black pepper", "amount": "To taste", "substitution": None}
                    ],
                    "steps": [
                        {"step_number": 1, "instruction": "Cook quinoa in 2 cups of salted water or vegetable broth. Bring to a boil, then cover and simmer on low for 15 minutes until liquid is absorbed. Fluff with a fork.", "duration_minutes": 15, "tip": "Toast dry quinoa in the pot for 2 minutes before adding water for a deep nutty aroma."},
                        {"step_number": 2, "instruction": "Pat chicken breasts dry with paper towels. Season both sides generously with salt, black pepper, oregano, and minced garlic.", "duration_minutes": 3, "tip": "Pounding breasts to an even 1/2-inch thickness ensures uniform cooking."},
                        {"step_number": 3, "instruction": "Heat 1 tbsp olive oil in a heavy stainless steel or cast iron skillet over medium-high heat. Sear chicken undisturbed for 5-6 minutes until golden brown crust forms.", "duration_minutes": 6, "tip": "Don't move the meat during the first 4 minutes to allow a delicious Maillard crust to develop."},
                        {"step_number": 4, "instruction": "Flip and cook remaining side for 4-5 minutes until internal temperature hits 165°F (74°C). Deglaze pan with fresh lemon juice and remove from heat.", "duration_minutes": 5, "tip": "Let chicken rest on a cutting board for 4 minutes before slicing to lock in flavorful juices."},
                        {"step_number": 5, "instruction": "Fold fresh chopped mint, lemon zest, and remaining olive oil into the warm quinoa. Slice chicken diagonally and serve on top.", "duration_minutes": 2, "tip": "Garnish with a drizzle of cold-pressed olive oil and crushed red pepper flakes."}
                    ],
                    "chef_notes": "A complete nutritional powerhouse: lean bioavailable protein paired with slow-burning complex carbs and digestive-soothing fresh mint."
                },
                "substitutions": [
                    {"original": "Chicken", "substitute": "Pressed extra-firm tofu or wild-caught cod"},
                    {"original": "Quinoa", "substitute": "Farro or riced cauliflower for low carb"}
                ],
                "follow_up_suggestions": [
                    "How many grams of protein does this have?",
                    "How can I meal prep this for 4 days?",
                    "Suggest a low-calorie sauce to pair with this"
                ],
                "is_demo": True,
                "ai_model_used": "Gemini AI (Demo Simulation)"
            }

    @staticmethod
    def get_demo_meal_plan(req: Dict[str, Any]) -> Dict[str, Any]:
        """Realistic structured 7-day personalized meal plan with categorized grocery list."""
        pref = req.get("dietary_preference", "Balanced")
        cal = req.get("target_calories_daily", 2000)
        
        days_data = [
            {
                "day": "Day 1 (Monday)",
                "total_calories": cal,
                "meals": [
                    {
                        "id": "m1",
                        "name": "Creamy Greek Yogurt Berry Parfait with Chia Seeds",
                        "meal_type": "Breakfast",
                        "calories": 420,
                        "protein_g": 28,
                        "carbs_g": 45,
                        "fats_g": 14,
                        "prep_time_minutes": 5,
                        "ingredients_summary": ["0% Greek yogurt", "Chia seeds", "Blueberries", "Raw almonds", "Honey"],
                        "quick_recipe": "Layer yogurt, mixed berries, and chia seeds. Top with toasted almonds and a light drizzle of honey.",
                        "alternative_suggestion": "Warm Steel-Cut Oatmeal with Almond Butter"
                    },
                    {
                        "id": "m2",
                        "name": "Mediterranean Chickpea & Grilled Chicken Grain Bowl",
                        "meal_type": "Lunch",
                        "calories": 610,
                        "protein_g": 44,
                        "carbs_g": 56,
                        "fats_g": 22,
                        "prep_time_minutes": 15,
                        "ingredients_summary": ["Herb chicken breast", "Canned chickpeas", "Cucumbers", "Kalamata olives", "Tahini lemon dressing"],
                        "quick_recipe": "Toss rinsed chickpeas, diced cucumber, and sliced grilled chicken with lemon tahini and fresh parsley.",
                        "alternative_suggestion": "Tuna Avocado Salad Wrap"
                    },
                    {
                        "id": "m3",
                        "name": "Oven-Roasted Lemon Garlic Salmon with Sweet Potato",
                        "meal_type": "Dinner",
                        "calories": 680,
                        "protein_g": 46,
                        "carbs_g": 52,
                        "fats_g": 28,
                        "prep_time_minutes": 25,
                        "ingredients_summary": ["Atlantic salmon", "Medium sweet potato", "Broccoli florets", "Garlic butter", "Olive oil"],
                        "quick_recipe": "Bake cubed sweet potato and broccoli at 400°F for 20 mins. Add salmon with garlic butter for final 12 mins.",
                        "alternative_suggestion": "Grass-Fed Beef Stir Fry with Snap Peas"
                    },
                    {
                        "id": "m4",
                        "name": "Matcha Protein Smoothie & Walnuts",
                        "meal_type": "Snack",
                        "calories": 290,
                        "protein_g": 22,
                        "carbs_g": 18,
                        "fats_g": 14,
                        "prep_time_minutes": 5,
                        "ingredients_summary": ["Almond milk", "Plant protein powder", "Matcha powder", "Raw walnuts", "Baby spinach"],
                        "quick_recipe": "Blend milk, protein, matcha, and a handful of spinach until frothy. Enjoy with a small handful of walnuts.",
                        "alternative_suggestion": "Apple slices with 1 tbsp natural peanut butter"
                    }
                ]
            },
            {
                "day": "Day 2 (Tuesday)",
                "total_calories": cal,
                "meals": [
                    {
                        "id": "m5",
                        "name": "Spinach & Feta Egg White Frittata with Avocado",
                        "meal_type": "Breakfast",
                        "calories": 390,
                        "protein_g": 32,
                        "carbs_g": 16,
                        "fats_g": 22,
                        "prep_time_minutes": 15,
                        "ingredients_summary": ["Pasture eggs", "Baby spinach", "Crumbled feta", "Avocado", "Sourdough toast"],
                        "quick_recipe": "Whisk eggs with spinach and feta; bake in a skillet for 10 mins until set. Serve with sliced avocado.",
                        "alternative_suggestion": "Overnight Protein Oats with Berries"
                    },
                    {
                        "id": "m6",
                        "name": "Smoked Turkey & Hummus Whole Wheat Wrap",
                        "meal_type": "Lunch",
                        "calories": 540,
                        "protein_g": 38,
                        "carbs_g": 48,
                        "fats_g": 18,
                        "prep_time_minutes": 8,
                        "ingredients_summary": ["Smoked turkey breast", "Garlic hummus", "Whole wheat wrap", "Shredded carrots", "Arugula"],
                        "quick_recipe": "Spread hummus over wrap, add greens, shredded carrots, and sliced turkey. Roll tightly and slice.",
                        "alternative_suggestion": "Quinoa Tabbouleh with Grilled Haloumi"
                    },
                    {
                        "id": "m7",
                        "name": "Sheet Pan Sesame Ginger Shrimp with Bok Choy",
                        "meal_type": "Dinner",
                        "calories": 620,
                        "protein_g": 42,
                        "carbs_g": 58,
                        "fats_g": 20,
                        "prep_time_minutes": 20,
                        "ingredients_summary": ["Jumbo shrimp", "Baby bok choy", "Jasmine brown rice", "Sesame oil", "Tamari ginger glaze"],
                        "quick_recipe": "Roast seasoned shrimp and halved bok choy for 8-10 minutes. Serve over steamed jasmine brown rice.",
                        "alternative_suggestion": "Spicy Thai Basil Ground Chicken Bowl"
                    },
                    {
                        "id": "m8",
                        "name": "Cottage Cheese with Sliced Peaches & Cinnamon",
                        "meal_type": "Snack",
                        "calories": 250,
                        "protein_g": 24,
                        "carbs_g": 22,
                        "fats_g": 6,
                        "prep_time_minutes": 3,
                        "ingredients_summary": ["Low-fat cottage cheese", "Fresh or canned peaches in juice", "Ceylon cinnamon"],
                        "quick_recipe": "Scoop cottage cheese into bowl, top with peaches and a dust of cinnamon.",
                        "alternative_suggestion": "Edamame beans steamed with sea salt"
                    }
                ]
            },
            {
                "day": "Day 3 (Wednesday)",
                "total_calories": cal,
                "meals": [
                    {
                        "id": "m9",
                        "name": "Golden Turmeric Oatmeal with Hemp Hearts",
                        "meal_type": "Breakfast",
                        "calories": 430,
                        "protein_g": 20,
                        "carbs_g": 58,
                        "fats_g": 14,
                        "prep_time_minutes": 10,
                        "ingredients_summary": ["Rolled oats", "Turmeric & ginger", "Almond milk", "Hemp hearts", "Sliced banana"],
                        "quick_recipe": "Simmer oats with spices and milk. Top with banana coins and hemp hearts.",
                        "alternative_suggestion": "Scrambled Tofu with Nutritional Yeast & Peppers"
                    },
                    {
                        "id": "m10",
                        "name": "Grilled Lemon Herb Chicken & Wild Rice Salad",
                        "meal_type": "Lunch",
                        "calories": 590,
                        "protein_g": 45,
                        "carbs_g": 52,
                        "fats_g": 18,
                        "prep_time_minutes": 15,
                        "ingredients_summary": ["Chicken breast", "Cooked wild rice", "Cranberries", "Baby spinach", "Vinaigrette"],
                        "quick_recipe": "Toss cooled wild rice with greens, chicken slices, and tart dried cranberries with light dressing.",
                        "alternative_suggestion": "Lentil Vegetable Soup with Crusty Rye Bread"
                    },
                    {
                        "id": "m11",
                        "name": "Grass-Fed Beef Kofta with Mint Yogurt & Roasted Peppers",
                        "meal_type": "Dinner",
                        "calories": 690,
                        "protein_g": 48,
                        "carbs_g": 38,
                        "fats_g": 34,
                        "prep_time_minutes": 25,
                        "ingredients_summary": ["Lean ground beef", "Cumin & coriander", "Bell peppers", "Greek yogurt mint sauce", "Warm pita"],
                        "quick_recipe": "Shape spiced ground beef into patties; grill 4 mins per side. Serve with roasted peppers and mint yogurt dip.",
                        "alternative_suggestion": "Roasted Cauliflower & Chickpea Curry"
                    },
                    {
                        "id": "m12",
                        "name": "Dark Chocolate Square & Handful of Roasted Almonds",
                        "meal_type": "Snack",
                        "calories": 240,
                        "protein_g": 7,
                        "carbs_g": 14,
                        "fats_g": 18,
                        "prep_time_minutes": 1,
                        "ingredients_summary": ["85% dark chocolate", "Dry roasted almonds"],
                        "quick_recipe": "Enjoy mindfully as an antioxidant-rich afternoon treat.",
                        "alternative_suggestion": "Celery sticks with almond butter"
                    }
                ]
            }
        ]

        grocery = [
            {
                "category": "Fresh Produce",
                "items": ["Blueberries (1 pint)", "Hass Avocados (3)", "Baby Spinach (1 large tub)", "Sweet Potatoes (2 lbs)", "Lemons (4)", "Baby Bok Choy (3 heads)", "Peaches or seasonal stone fruit", "Cucumbers & Cherry Tomatoes", "Fresh Mint & Flat-Leaf Parsley"]
            },
            {
                "category": "Quality Proteins",
                "items": ["Wild Atlantic Salmon Fillets (2 count / 350g)", "Free-range boneless chicken breasts (1.5 lbs)", "Jumbo Raw Shrimp (1 lb)", "Lean Ground Beef or Turkey (1 lb)", "Pasture-Raised Eggs (1 dozen)", "Organic Plain Greek Yogurt (32 oz)", "Low-fat Cottage Cheese"]
            },
            {
                "category": "Grains & Pantry Staples",
                "items": ["Organic Quinoa (1 lb bag)", "Jasmine Brown Rice", "Rolled Oats", "Canned Chickpeas (2 cans)", "Tahini & Extra Virgin Olive Oil", "Chia Seeds & Hemp Hearts", "Dark Chocolate 85%"]
            },
            {
                "category": "Spices & Condiments",
                "items": ["Tamari (Gluten-Free Soy Sauce)", "Toasted Sesame Oil", "Ceylon Cinnamon & Ground Turmeric", "Garlic cloves & fresh ginger"]
            }
        ]

        return {
            "title": f"Personalized 7-Day {pref} Nutritional Blueprint",
            "dietary_type": pref,
            "daily_calorie_target": cal,
            "weekly_overview": f"A balanced, anti-inflammatory meal structure calibrated to your target of {cal} kcal/day with a balanced distribution: 30% Protein, 40% Clean Carbs, 30% Healthy Fats.",
            "days": days_data,
            "grocery_list": grocery,
            "macro_targets": {
                "Protein Target": f"{int(cal * 0.3 / 4)}g / day (30%)",
                "Carbohydrates Target": f"{int(cal * 0.4 / 4)}g / day (40%)",
                "Healthy Fats Target": f"{int(cal * 0.3 / 9)}g / day (30%)",
                "Hydration Goal": "2.5 - 3.0 Liters water daily"
            },
            "is_demo": True,
            "ai_model_used": "Gemini AI (Demo Simulation)"
        }
