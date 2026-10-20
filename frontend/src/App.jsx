import { useState, useEffect } from 'react';
import { X, Menu, Sun, Moon, ArrowLeft, Home, Zap, Settings, User, LogOut } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { TOOLS } from './data/tools';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import Login from './pages/Login';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const { theme, toggle, mounted } = useTheme();
  const [view, setView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toolId, setToolId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('vladschool_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const isMobile = window.innerWidth < 768;
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = (target, id = null) => {
    setView(target);
    setToolId(id);
    if (isMobile) setSidebarOpen(false);
  };

  const handleLogin = (u) => { setUser(u); localStorage.setItem('vladschool_user', JSON.stringify(u)); navigate('home'); };
  const handleLogout = () => { setUser(null); localStorage.removeItem('vladschool_user'); navigate('home'); };

  if (!mounted) return null;

  return (
    <div className="min-h-screen transition-colors duration-300 relative overflow-hidden">
      {/* Decorative glow blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -z-10"></div>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={navigate}
        user={user}
        onLogout={handleLogout}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`${sidebarOpen || isMobile ? 'lg:pl-0' : 'lg:pl-64'} relative z-10`}>
        <Header
          theme={theme}
          onToggleTheme={toggle}
          onOpenSidebar={() => setSidebarOpen(true)}
          user={user}
          onLogout={handleLogout}
        />

        <main className="min-h-[calc(100vh-64px)] pb-8">
          {view === 'home' && <Home onToolSelect={navigate} user={user} />}
          {view === 'tool' && toolId && <ToolPage toolId={toolId} onBack={() => navigate('home')} user={user} />}
          {view === 'login' && <Login onLogin={handleLogin} onBack={() => navigate('home')} />}
          {view === 'settings' && <SettingsPage user={user} onLogout={handleLogout} onBack={() => navigate('home')} />}
        </main>
      </div>

      <Toast />
    </div>
  );
}
