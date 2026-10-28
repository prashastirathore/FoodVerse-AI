import os
import json
import re
import io
from typing import Dict, Any, Optional
from PIL import Image
from app.config import settings
from app.services.demo_service import DemoService

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self._init_sdk()

    def _init_sdk(self):
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.configured = True
            except Exception as e:
                print(f">>> Failed to configure Gemini SDK: {e}")
                self.configured = False
        else:
            self.configured = False

    def update_api_key(self, key: str):
        self.api_key = key
        self._init_sdk()

    def is_live_ai_available(self) -> bool:
        return bool(self.api_key and self.configured)

    def _clean_json_response(self, text: str) -> Dict[str, Any]:
        """Extract and parse JSON from model output safely."""
        text = text.strip()
        # Remove markdown fences ```json ... ```
        if "```" in text:
            match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
            if match:
                text = match.group(1).strip()
        try:
            return json.loads(text)
        except Exception:
            # Fallback regex search for { ... }
            start = text.find("{")
            end = text.rfind("}")
            if start != -1 and end != -1:
                return json.loads(text[start:end+1])
            raise ValueError(f"Could not parse valid JSON from Gemini output: {text[:200]}")

    async def analyze_food_nutrition(self, image_bytes: Optional[bytes] = None, prompt_hint: str = "") -> Dict[str, Any]:
        """Multimodal food recognition & comprehensive nutritional breakdown."""
        if not self.is_live_ai_available() or not image_bytes:
            return DemoService.get_demo_nutrition_analysis(prompt_hint)

        try:
            import google.generativeai as genai
            model = genai.GenerativeModel(settings.GEMINI_MODEL)
            img = Image.open(io.BytesIO(image_bytes))

            prompt = f"""
            Analyze the provided food dish or meal image carefully.
            User additional hint/notes: "{prompt_hint}".
            
            Return a STRICT JSON object with this exact structure:
            {{
                "title": "Dish or Food Item Name",
                "summary": "1-2 sentence nutritional description",
                "health_score": integer between 0 and 100,
                "dietary_classification": ["e.g. High Protein", "Gluten-Free", "Low Carb"],
                "macronutrients": {{
                    "calories": float,
                    "protein_g": float,
                    "carbohydrates_g": float,
                    "fats_g": float,
                    "fiber_g": float,
                    "sugar_g": float,
                    "sodium_mg": float
                }},
                "micronutrients": {{
                    "Vitamin C": "X% DV",
                    "Iron": "X% DV",
                    "Potassium": "X mg"
                }},
                "items": [
                    {{
                        "name": "Food Component Name",
                        "portion_size": "e.g. 1 cup or 150g",
                        "estimated_weight_g": float,
                        "calories": float,
                        "protein_g": float,
                        "carbs_g": float,
                        "fats_g": float,
                        "fiber_g": float,
                        "glycemic_index": "Low / Medium / High",
                        "confidence_score": float between 0.0 and 1.0
                    }}
                ],
                "insights": ["Nutritional observation 1", "Observation 2"],
                "recommendations": ["Culinary or diet suggestion 1", "Suggestion 2"]
            }}
            Respond with ONLY the JSON object. Do not add conversational markdown outside the JSON.
            """

            response = model.generate_content([prompt, img])
            data = self._clean_json_response(response.text)
            data["is_demo"] = False
            data["ai_model_used"] = f"Live Google {settings.GEMINI_MODEL}"
            return data
        except Exception as e:
            print(f">>> Gemini API Vision error: {e}. Falling back to sample intelligence.")
            demo = DemoService.get_demo_nutrition_analysis(prompt_hint)
            demo["disclaimer"] = demo.get("disclaimer", "") + (
                f" (Note: Live AI request switched to sample demo mode: {str(e)[:90]})"
            )
            return demo

    async def analyze_food_freshness(self, image_bytes: Optional[bytes] = None, item_hint: str = "") -> Dict[str, Any]:
        """Detect visible cues of bruising, discoloration, wilting, and mold-like patterns."""
        if not self.is_live_ai_available() or not image_bytes:
            return DemoService.get_demo_freshness_analysis(item_hint)

        try:
            import google.generativeai as genai
            model = genai.GenerativeModel(settings.GEMINI_MODEL)
            img = Image.open(io.BytesIO(image_bytes))

            prompt = f"""
            Analyze this food image for visible signs of freshness or degradation.
            User hint: "{item_hint}".
            
            Look closely for:
            1. Bruising & mechanical tissue damage
            2. Discoloration (oxidation, browning, yellowing, enzymatic freckles)
            3. Mold-like mycelium or fungal spore patterns
            4. Wilting / dehydration / loss of cellular turgor
            5. Slime, weeping moisture, or textural integrity
            
            Return STRICT JSON:
            {{
                "item_name": "Identified Food Item",
                "category": "Fruit / Vegetable / Meat / Dairy / Bakery / Prepared",
                "freshness_status": "Optimal Freshness / Consume Soon / Questionable Quality / Spoiled / High Risk",
                "freshness_index": integer between 0 and 100,
                "confidence": float between 0.0 and 1.0,
                "estimated_shelf_life": "Estimated time remaining with proper storage",
                "visible_signs": [
                    {{
                        "category": "Bruising / Discoloration / Mold Patterns / Wilting / Texture",
                        "observed": boolean,
                        "severity": "None / Low / Moderate / Severe",
                        "details": "Explanation of visual evidence observed"
                    }}
                ],
                "observations": ["Visible observation 1", "Observation 2"],
                "storage_recommendation": "Concrete storage temperature, airflow, and preservation advice",
                "culinary_rescue_tips": "Safe cooking/preservation ideas if ripe (or caution if spoiled)"
            }}
            Respond with ONLY the JSON object.
            """

            response = model.generate_content([prompt, img])
            data = self._clean_json_response(response.text)
            data["is_demo"] = False
            data["ai_model_used"] = f"Live Google {settings.GEMINI_MODEL}"
            return data
        except Exception as e:
            print(f">>> Gemini Freshness Vision error: {e}. Falling back to sample intelligence.")
            demo = DemoService.get_demo_freshness_analysis(item_hint)
            return demo

    async def audit_kitchen_hygiene(self, image_bytes: Optional[bytes] = None, location_hint: str = "") -> Dict[str, Any]:
        """Inspect kitchen & food prep station for sanitation, cross-contamination, and clutter."""
        if not self.is_live_ai_available() or not image_bytes:
            return DemoService.get_demo_hygiene_audit(location_hint)

        try:
            import google.generativeai as genai
            model = genai.GenerativeModel(settings.GEMINI_MODEL)
            img = Image.open(io.BytesIO(image_bytes))

            prompt = f"""
            Perform an objective visual hygiene audit of the commercial or residential food preparation environment in this image.
            Location notes: "{location_hint}".
            
            Check for:
            1. Surface cleanliness & grease/residue buildup
            2. Cross-contamination hazards (e.g. raw and cooked items near each other, cloth sanitization)
            3. Clutter & workflow organization
            4. Food storage heights and protective coverings
            5. Hand hygiene and paper towel supplies
            
            Return STRICT JSON:
            {{
                "location_name": "Identified Area (e.g. Prep Counter, Grill Line, Cold Storage)",
                "overall_score": integer between 0 and 100,
                "grade": "Grade A (90-100) / Grade B (80-89) / Grade C (70-79) / Needs Attention (<70)",
                "risk_level": "Low Risk / Moderate Risk / Elevated Risk / Critical Risk",
                "executive_summary": "Summary of visual sanitary conditions",
                "checklist_breakdown": [
                    {{
                        "category_name": "Category Name",
                        "status": "Pass / Minor Issue / Fail",
                        "score": integer 0-100,
                        "notes": "Specific detail"
                    }}
                ],
                "findings": [
                    {{
                        "area": "Specific location in image",
                        "issue": "Observed issue",
                        "severity": "Low / Medium / High / Critical",
                        "description": "Risk details"
                    }}
                ],
                "corrective_actions": [
                    {{
                        "priority": "Immediate / High / Routine",
                        "action": "Corrective step",
                        "target_timeline": "e.g. Within 30 minutes, End of shift"
                    }}
                ],
                "positive_observations": ["Good practice 1", "Good practice 2"]
            }}
            Respond with ONLY the JSON object.
            """

            response = model.generate_content([prompt, img])
            data = self._clean_json_response(response.text)
            data["is_demo"] = False
            data["ai_model_used"] = f"Live Google {settings.GEMINI_MODEL}"
            return data
        except Exception as e:
            print(f">>> Gemini Hygiene Vision error: {e}. Falling back to sample intelligence.")
            demo = DemoService.get_demo_hygiene_audit(location_hint)
            return demo

    async def cooking_assistant_chat(self, message: str, conversation_history: list = None, dietary_preferences: list = None, available_ingredients: list = None) -> Dict[str, Any]:
        """Interactive culinary intelligence, recipe creation, step-by-step cooking, and ingredient substitutions."""
        if not self.is_live_ai_available():
            return DemoService.get_demo_cooking_assistant_response(message)

        try:
            import google.generativeai as genai
            model = genai.GenerativeModel(settings.GEMINI_MODEL)

            history_str = ""
            if conversation_history:
                for msg in conversation_history[-6:]:
                    history_str += f"{msg.get('role', 'user')}: {msg.get('content', '')}\n"

            prompt = f"""
            You are FoodVerse Chef AI, an expert executive chef, clinical nutritionist, and food scientist.
            
            Conversation history:
            {history_str}
            
            User message: "{message}"
            User dietary preferences: {dietary_preferences or []}
            Available ingredients on hand: {available_ingredients or []}
            
            Instructions:
            - Provide friendly, inspiring, precise culinary answers.
            - If user asks for a recipe or cooking guidance, generate a complete structured recipe with steps, timing, and chef tips.
            - If user asks for substitutions, provide concrete alternatives with flavor & ratio notes.
            
            Return STRICT JSON:
            {{
                "reply": "Conversational assistant reply with helpful explanation",
                "suggested_recipe": null OR {{
                    "title": "Recipe Name",
                    "description": "Short culinary description",
                    "cuisine": "Cuisine style",
                    "prep_time_minutes": int,
                    "cook_time_minutes": int,
                    "servings": int,
                    "difficulty": "Easy / Medium / Advanced",
                    "calories_per_serving": int,
                    "dietary_tags": ["tag1", "tag2"],
                    "ingredients": [
                        {{"name": "Ingredient name", "amount": "quantity", "substitution": "optional alt"}}
                    ],
                    "steps": [
                        {{"step_number": 1, "instruction": "Step detail", "duration_minutes": 5, "tip": "Chef secret tip"}}
                    ],
                    "chef_notes": "Flavor balance & plating advice"
                }},
                "substitutions": [
                    {{"original": "item", "substitute": "alternative", "flavor_profile": "notes"}}
                ],
                "follow_up_suggestions": ["Follow-up question 1", "Question 2", "Question 3"]
            }}
            Respond with ONLY the JSON object.
            """

            response = model.generate_content(prompt)
            data = self._clean_json_response(response.text)
            data["is_demo"] = False
            data["ai_model_used"] = f"Live Google {settings.GEMINI_MODEL}"
            return data
        except Exception as e:
            print(f">>> Gemini Assistant chat error: {e}. Falling back to sample intelligence.")
            demo = DemoService.get_demo_cooking_assistant_response(message)
            return demo

    async def generate_personalized_meal_plan(self, req: Dict[str, Any]) -> Dict[str, Any]:
        """Personalized meal plan generation with macro targets and categorized grocery list."""
        if not self.is_live_ai_available():
            return DemoService.get_demo_meal_plan(req)

        try:
            import google.generativeai as genai
            model = genai.GenerativeModel(settings.GEMINI_MODEL)

            prompt = f"""
            Generate a personalized meal plan based on these parameters:
            - Dietary Preference: {req.get('dietary_preference')}
            - Target Daily Calories: {req.get('target_calories_daily')} kcal
            - Duration: {req.get('duration_days', 3)} days (generate detailed days)
            - Allergies to AVOID: {req.get('allergies', [])}
            - Preferred Cuisines: {req.get('cuisine_preferences', [])}
            - Budget: {req.get('budget_level')}
            - Available Pantry Items: {req.get('available_pantry', '')}
            
            Return STRICT JSON:
            {{
                "title": "Meal Plan Title",
                "dietary_type": "{req.get('dietary_preference')}",
                "daily_calorie_target": {req.get('target_calories_daily')},
                "weekly_overview": "Summary of plan and nutrition philosophy",
                "days": [
                    {{
                        "day": "Day 1 (Monday)",
                        "total_calories": int,
                        "meals": [
                            {{
                                "id": "m1",
                                "name": "Dish Name",
                                "meal_type": "Breakfast / Lunch / Dinner / Snack",
                                "calories": int,
                                "protein_g": int,
                                "carbs_g": int,
                                "fats_g": int,
                                "prep_time_minutes": int,
                                "ingredients_summary": ["ing1", "ing2"],
                                "quick_recipe": "1-2 sentence preparation steps",
                                "alternative_suggestion": "Alternative dish name"
                            }}
                        ]
                    }}
                ],
                "grocery_list": [
                    {{
                        "category": "Produce / Proteins / Dairy & Alternatives / Pantry / Spices",
                        "items": ["Item name with quantity", "Item 2"]
                    }}
                ],
                "macro_targets": {{
                    "Protein Target": "X g / day",
                    "Carbohydrates Target": "X g / day",
                    "Healthy Fats Target": "X g / day"
                }}
            }}
            Respond with ONLY the JSON object.
            """

            response = model.generate_content(prompt)
            data = self._clean_json_response(response.text)
            data["is_demo"] = False
            data["ai_model_used"] = f"Live Google {settings.GEMINI_MODEL}"
            return data
        except Exception as e:
            print(f">>> Gemini Meal Plan error: {e}. Falling back to sample intelligence.")
            demo = DemoService.get_demo_meal_plan(req)
            return demo

gemini_service = GeminiService()
