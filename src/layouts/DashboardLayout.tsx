import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Users, 
  UserCircle, 
  Stethoscope, 
  Video, 
  BarChart, 
  Menu, 
  X,
  BellRing,
  LogOut,
  ChevronDown,
  Settings
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Navigation items
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      name: 'Pacientes', 
      path: '/patients', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'Equipe Médica', 
      path: '/staff', 
      icon: <Stethoscope className="h-5 w-5" /> 
    },
    { 
      name: 'Telemedicina', 
      path: '/telemedicine', 
      icon: <Video className="h-5 w-5" /> 
    },
    { 
      name: 'Relatórios', 
      path: '/reports', 
      icon: <BarChart className="h-5 w-5" /> 
    },
  ];
  
  // Get the page title based on current path
  const getPageTitle = () => {
    const currentNav = navItems.find(item => item.path === location.pathname);
    return currentNav?.name || 'Dashboard';
  };
  
  // Common navigation link styles
  const navLinkClasses = (isActive: boolean) => twMerge(
    "flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all relative",
    isActive 
      ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] font-semibold" 
      : "text-white/70 hover:bg-white/5 hover:text-white"
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={twMerge(
          "fixed top-0 left-0 z-30 w-64 h-full bg-accent transition-transform transform shadow-[4px_0_24px_rgba(0,0,0,0.12)]",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <div className="flex items-center">
            <img 
              src="https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/vidaplus-logo.png" 
              alt="VidaPlus Logo" 
              className="h-8"
            />
          </div>
          <button 
            className="lg:hidden p-1 rounded-lg text-white/70 hover:bg-white/10"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Sidebar navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => navLinkClasses(isActive)}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
              {location.pathname === item.path && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] z-10 fixed top-0 right-0 left-0 lg:left-64">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left section with menu and page title */}
              <div className="flex items-center">
                <button 
                  className="p-1 mr-3 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
                  onClick={toggleSidebar}
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
              </div>
              
              {/* Right section with notifications and profile */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100 relative">
                  <BellRing className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
                
                {/* Profile dropdown */}
                <div className="relative">
                  <button 
                    className="flex items-center space-x-2 text-sm focus:outline-none"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle className="w-full h-full text-gray-500" />
                      )}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <ChevronDown className="hidden md:block h-4 w-4 text-gray-500" />
                  </button>
                  
                  {/* Dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1" role="none">
                        <NavLink 
                          to="/profile" 
                          className={({ isActive }) => twMerge(
                            "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                            isActive && "bg-gray-50 text-accent font-medium"
                          )}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserCircle className="mr-3 h-4 w-4" />
                          Perfil
                        </NavLink>
                        <NavLink 
                          to="/settings" 
                          className={({ isActive }) => twMerge(
                            "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                            isActive && "bg-gray-50 text-accent font-medium"
                          )}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Configurações
                        </NavLink>
                        <button 
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="py-20 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;