# 🥗 FoodVerse AI – Multimodal Food Intelligence Agent

**FoodVerse AI** is an advanced full-stack multimodal food intelligence platform powered by **React.js, Vite, Vanilla CSS, Python FastAPI, MongoDB, and Google Gemini AI**. 

It provides an end-to-end intelligent food ecosystem spanning visual food recognition, calorie & macro analysis, non-destructive freshness and spoilage assessment, commercial kitchen hygiene compliance auditing, interactive culinary chef assistance with voice integration, and personalized macro-calibrated meal planning with smart grocery checklists.

---

## 🎨 Design System & Aesthetics
- **Forest Green, Mint Green, and Cream Palette:**
  - Deep Forest Greens: `#081C13`, `#0D2B1E`, `#123C2A`
  - Mint Greens: `#10B981`, `#34D399`, `#B2EFD5`, `#F0FDF8`
  - Cream & Warm Ivory: `#FAF7F2`, `#F3EEE3`, `#FFFFFF`
- **Modern Typography:** Styled with Google Fonts **Outfit** and **Plus Jakarta Sans**.
- **Aesthetic Elements:** Responsive sidebar navigation, glowing state indicators, glassmorphic card elevation, SVG charts, micro-animations, and celebratory feedback.
- **Scientific & Safety Disclaimers:** Visible notices communicating that nutrition values are visual AI estimates and that visual food-safety assessments cannot establish microbiological contamination or guarantee safety.

---

## 🚀 Core Features

### 1. 🍽️ Food Recognition & Nutrition Analysis
- Upload any meal photo or click instant curated sample presets (e.g. *Mediterranean Salmon Bowl*, *Avocado Toast*).
- Multimodal vision AI identifies individual meal components, portion sizes, estimated weight (grams), glycemic index, and health score (0-100).
- Calculates macronutrients (**Calories, Protein, Carbohydrates, Fats, Dietary Fiber**) and key micronutrients (Omega-3, Iron, Vitamin D, Potassium).
- Interactive nutrient breakdown cards, progress meters, and component tables.
- Prominent **Nutritional Estimation Advisory** banner.

### 2. 🍎 Food Freshness & Spoilage Detection
- Upload images of fresh produce, baked goods, meats, or dairy.
- Vision AI analyzes visible indicators: **bruising, discoloration, mold-like mycelium patterns, wilting, and cellular dehydration**.
- Computes **Freshness Index (0-100)**, confidence level, and shelf-life estimations under proper storage.
- Visible degradation inspection checklist (with severity ratings: None, Low, Moderate, Severe).
- Generates zero-waste **Culinary Rescue Tips** for slightly overripe produce.
- Prominent **Food Safety & Freshness Notice** banner.

### 3. 🧼 Restaurant & Kitchen Hygiene Monitoring
- Inspects commercial line cook stations, prep tables, sinks, and storage racks.
- Evaluates surface degreasing, cross-contamination hazards, clutter, and elevation standards.
- Issues an **Audit Hygiene Score (0-100)** and letter grade (**Grade A, Grade B, Grade C, Needs Attention**).
- Area sanitation compliance breakdown checklist.
- Prioritized **Corrective Action Plan** categorized by urgency (*Immediate, Shift Change, Routine*).
- Prominent **Compliance Advisory** banner.

### 4. 👨‍🍳 Smart Cooking Assistant (Chef FoodVerse AI)
- Conversational culinary agent for recipes, substitutions, and culinary technique questions.
- Generates complete recipe cards with preparation times, cooking times, difficulty, servings, calorie estimates, ingredient substitutions, and chef tips.
- **Voice Recognition (Web Speech API):** Hands-free speech-to-text dictation via the microphone button.
- **Speech Synthesis (Read Aloud):** Audio playback of step-by-step cooking instructions.
- Save AI-generated recipes directly to your personal cookbook.

### 5. 📅 Personalized Multi-Day Meal Planner
- Calibrates 1-day, 3-day, or 7-day plans based on **dietary preference** (*Balanced, High Protein, Mediterranean, Vegan, Keto, etc.*), **daily calorie goal** (1,200 - 3,500 kcal), **allergies/intolerances**, and **budget level**.
- Provides day-by-day tabs for Breakfast, Lunch, Dinner, and Snacks with macro breakdowns.
- **1-Click Meal Swap:** Dynamically replaces any individual dish with an alternative matched to calories and dietary rules.
- **Smart Categorized Grocery Checklist:** Interactive produce, protein, grain, and spice list with strike-through checkboxes.

### 📊 FoodTech Command Dashboard
- High-level KPI cards: Total Food Scans, Freshness Checks, Kitchen Audits, Daily Calorie Goal.
- Weekly Nutrition Trends interactive SVG chart comparing daily calorie intake against targets.
- Quick-launch feature cards to all 5 core modules.
- Live recent activity timeline.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, JavaScript, Vanilla CSS Design System, Lucide Icons, Canvas Confetti |
| **Backend** | Python 3.9+, FastAPI, Uvicorn, Pydantic v2, Python-Multipart |
| **AI / Multimodal** | Google Gemini Vision AI (`gemini-1.5-flash`), Gemini Pro / Simulator |
| **Database** | MongoDB Server (`motor`, `pymongo`) + Resilient Local JSON Document Store fallback |
| **Security** | JWT Authentication (`python-jose`), Password Hashing (`passlib`, `bcrypt`) |

---

## 📦 Project Structure

```
FoodVerse/
├── frontend/
│   ├── index.html                  # HTML entry with Plus Jakarta Sans & Outfit fonts
│   ├── package.json
│   ├── vite.config.js              # Vite server & backend /api reverse proxy
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Master application coordinator
│       ├── index.css               # Forest green, mint, cream design system
│       ├── api/                    # Axios API integration
│       │   ├── client.js           # Base client with JWT interceptor & FormData handling
│       │   ├── authApi.js
│       │   ├── nutritionApi.js
│       │   ├── freshnessApi.js
│       │   ├── hygieneApi.js
│       │   ├── assistantApi.js
│       │   └── mealApi.js
│       ├── context/
│       │   └── AuthContext.jsx     # User state, JWT, and system status
│       ├── components/
│       │   ├── Sidebar.jsx         # Navigation sidebar with status badges
│       │   ├── TopNav.jsx          # Mode indicator (Live AI vs Demo)
│       │   ├── ImageUploader.jsx   # Drag & drop upload + clickable instant samples
│       │   ├── NutritionCharts.jsx # Macro breakdown & portion tables
│       │   ├── FreshnessScorecard.jsx # Freshness index & degradation checklist
│       │   ├── HygieneScorecard.jsx   # Cleanliness grade & corrective actions
│       │   ├── DisclaimerBanner.jsx   # Required safety & estimation notices
│       │   └── AuthModal.jsx       # Register, Login & 1-Click Guest access
│       └── pages/
│           ├── Dashboard.jsx
│           ├── NutritionAnalysis.jsx
│           ├── FreshnessDetection.jsx
│           ├── HygieneAudit.jsx
│           ├── CookingAssistant.jsx
│           ├── MealPlanner.jsx
│           ├── History.jsx
│           └── Settings.jsx
├── backend/
│   ├── main.py                     # FastAPI application & router mounting
│   ├── requirements.txt            # Python dependencies
│   ├── .env.example
│   ├── .env
│   └── app/
│       ├── config.py               # Environment configuration
│       ├── database.py             # MongoDB Motor connection + resilient fallback
│       ├── security.py             # JWT token generation & password verification
│       ├── schemas/                # Pydantic validation schemas
│       ├── services/
│       │   ├── gemini_service.py   # Multimodal Gemini API calls
│       │   └── demo_service.py     # High-fidelity realistic sample intelligence
│       └── routers/                # REST endpoints
│           ├── auth_router.py
│           ├── nutrition_router.py
│           ├── freshness_router.py
│           ├── hygiene_router.py
│           ├── assistant_router.py
│           ├── meal_router.py
│           └── dashboard_router.py
├── .gitignore
├── .env.example
└── README.md
```

---

## ⚡ Quick Start Instructions

### Prerequisites
- **Node.js** (v18+) and **npm**
- **Python** (v3.9+) with `pip`
- **MongoDB** (running locally or via MongoDB Atlas URI). *Note: If MongoDB is not active, the system automatically runs using its resilient local document store fallback.*

---

### 1. Backend Setup & Run

Open a terminal in the root directory:

```bash
# Navigate to backend
cd backend

# Install Python requirements
py -m pip install -r requirements.txt

# Start FastAPI server on port 8000
py -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The FastAPI backend will start at:
- **API Base:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
- **Health Check:** `http://127.0.0.1:8000/health`

---

### 2. Frontend Setup & Run

Open a second terminal in the root directory:

```bash
# Navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Start Vite dev server on port 5173
npm run dev -- --host 127.0.0.1 --port 5173
```

Access the application in your browser:
- **Frontend URL:** `http://127.0.0.1:5173`

---

## 🔑 Demo Mode & Live Gemini AI Configuration

1. **Zero-Config Demo Simulation Mode:**
   - Out of the box, FoodVerse operates in **Demo Mode**.
   - No Google API key is required. All 5 core features include instant clickable sample items (e.g. *Mediterranean Salmon Bowl*, *Cavendish Bananas*, *Commercial Prep Line*).
   - Results are clearly flagged with `Demo Simulation Mode` badges.

2. **Activating Live Gemini Multimodal AI:**
   - Go to **Settings & Gemini Key** in the sidebar.
   - Enter your free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Click **Save & Activate Live AI**.
   - The status badge will switch to `🟢 Live Gemini Vision AI Active`.
   - Alternatively, add your key to `backend/.env`:
     ```env
     GEMINI_API_KEY=AIzaSyYourKeyHere
     GEMINI_MODEL=gemini-1.5-flash
     ```

---

## 🧪 Verification & End-to-End Test Results

All primary workflows have been verified via automated browser subagent testing and API endpoint calls:
- ✅ **Dashboard:** Verified KPI metrics, recent activity feed, and weekly SVG calorie chart.
- ✅ **Food Recognition & Nutrition:** Verified portion identification, calories (585 kcal), macronutrient progress bars, and estimation disclaimers.
- ✅ **Food Freshness Detection:** Verified Freshness Index (72/100), visible signs checklist, and safety notice.
- ✅ **Restaurant Hygiene Monitoring:** Verified Grade B score (88/100), area checklist, and prioritized corrective actions.
- ✅ **Smart Cooking Assistant:** Verified recipe generation for 20-min dinner, ingredients list, and voice read-aloud buttons.
- ✅ **Personalized Meal Planner:** Verified 7-day meal plan generation, 1-click meal swap, and grocery checklist items.
- ✅ **Database Resilience:** Tested native MongoDB persistence with zero-exception fallback.

---

## 📜 Legal & Safety Disclaimers
1. **Nutrition Estimates:** Nutritional values, calories, and portion measurements are approximate visual AI calculations and must not be used as clinical or medical dietary advice.
2. **Food Safety:** Photographic AI analysis cannot establish microscopic bacterial contamination, viral pathogens, odorless toxins, or chemical adulteration. When in doubt regarding odor, temperature, or safety, discard the food.
3. **Hygiene Compliance:** Automated image analysis is an assistive monitoring tool and does not replace official municipal health department inspections or microbiological swab tests.
