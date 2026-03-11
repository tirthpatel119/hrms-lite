import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, UserPlus, Sparkles } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Directory', href: '/', icon: Users },
    { name: 'Onboard', href: '/add-employee', icon: UserPlus },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 flex flex-col transition-all duration-300 shadow-sm z-10">
        <div className="flex h-20 items-center px-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
               <Sparkles className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
               HRMS Lite
             </h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="space-y-2">
            <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</div>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100/50' 
                      : 'text-slate-600 hover:bg-slate-50/80 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon
                    className={`
                      flex-shrink-0 mr-4 h-5 w-5 transition-colors duration-200
                      ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}
                    `}
                    aria-hidden="true"
                  />
                  {item.name}
                  {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-50 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                    A
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-700">Admin User</p>
                    <p className="text-xs text-slate-500">System Administrator</p>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10"></div>
        <header className="bg-white/40 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200/50">
          <div className="max-w-7xl mx-auto py-5 px-8 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
              {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
