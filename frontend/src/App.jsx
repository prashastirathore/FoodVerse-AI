import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import AuthModal from './components/AuthModal';

import Dashboard from './pages/Dashboard';
import NutritionAnalysis from './pages/NutritionAnalysis';
import FreshnessDetection from './pages/FreshnessDetection';
import HygieneAudit from './pages/HygieneAudit';
import CookingAssistant from './pages/CookingAssistant';
import MealPlanner from './pages/MealPlanner';
import History from './pages/History';
import Settings from './pages/Settings';

const FoodVerseApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'nutrition':
        return <NutritionAnalysis />;
      case 'freshness':
        return <FreshnessDetection />;
      case 'hygiene':
        return <HygieneAudit />;
      case 'assistant':
        return <CookingAssistant />;
      case 'meal_planner':
        return <MealPlanner />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <TopNav
          activeTab={activeTab}
          setMobileOpen={setMobileOpen}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenSettings={() => setActiveTab('settings')}
        />
        <div className="content-body">
          {renderContent()}
        </div>
      </main>

      {/* Authentication & Profile Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <FoodVerseApp />
    </AuthProvider>
  );
}
