import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Finance } from './pages/Finance';
import { TasksNotes } from './pages/TasksNotes';
import { DocumentVault } from './pages/DocumentVault';
import { StudyWorkspace } from './pages/StudyWorkspace';
import { OfficeWorkspace } from './pages/OfficeWorkspace';
import { HomeManagement } from './pages/HomeManagement';
import { SmartBox } from './pages/SmartBox';
import { GoalsWishlist } from './pages/GoalsWishlist';
import { Analytics } from './pages/Analytics';
import { Auth } from './pages/Auth';

const MainLayout = () => {
  const { activeTab } = useApp();

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'finance': return <Finance />;
      case 'tasks': return <TasksNotes />;
      case 'documents': return <DocumentVault />;
      case 'study': return <StudyWorkspace />;
      case 'office': return <OfficeWorkspace />;
      case 'home': return <HomeManagement />;
      case 'smartbox': return <SmartBox />;
      case 'goals': return <GoalsWishlist />;
      case 'analytics': return <Analytics />;
      case 'auth': return <Auth />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-body">
          {renderView()}
        </main>
      </div>
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
