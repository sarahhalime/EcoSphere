import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Leaf, 
  MapPin, 
  Bird, 
  Calculator, 
  CloudRain, 
  TreePine, 
  GraduationCap,
  Menu,
  X,
  Bell,
  User,
  Search,
    Brain,
  MessageCircle
} from 'lucide-react';
import { SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react';

interface LayoutProps {
  children: React.ReactNode;
}



const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const {user, isSignedIn} = useUser();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: MapPin },
    { name: 'Forest Monitor', href: '/forest', icon: TreePine },
    { name: 'Biodiversity', href: '/biodiversity', icon: Bird },
    { name: 'Climate Alerts', href: '/climate', icon: CloudRain },
    { name: 'EcoAI Chat', href: '/ecoai', icon: Brain },
    isSignedIn ? { name: 'My Inbox', href: '/my-inbox', icon: MessageCircle } : null,
    // { name: 'My Inbox', href: '/my-inbox', icon: MessageCircle },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/50">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EcoSphere</h1>
              <p className="text-xs text-slate-400">Climate & Land Action</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-emerald-400' : 'text-slate-400'
                  }`} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User profile */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/50">
              <div className="flex-1 min-w-0">
                {isSignedIn?
                <div className="p-2 bg-gradient-to-br flex  gap-2 iems-center justify-center from-blue-500 to-purple-600 rounded-lg">
                  <UserButton/>
                  <SignOutButton>
                    <button className="text-sm font-medium text-white truncate">
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
                :
                <div className="p-2 bg-gradient-to-br flex  gap-2 iems-center justify-center from-blue-500 to-purple-600 rounded-lg">
                  <User className="h-4 w-4 text-white" />
                  <SignInButton mode='modal'>
                    <button className="text-sm font-medium text-white truncate">
                      Sign In/Sign Up
                    </button>
                  </SignInButton>
                </div>
                  }
              </div>
            </div>



        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/50">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 lg:hidden transition-colors"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;