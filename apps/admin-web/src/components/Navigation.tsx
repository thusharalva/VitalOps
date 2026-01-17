'use client';

import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    api.logout();
  };

  // Don't show nav on login page
  if (pathname === '/login' || pathname === '/') {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Assets', path: '/assets', icon: '📦' },
    { name: 'Rentals', path: '/rentals', icon: '🔑' },
    { name: 'Customers', path: '/customers', icon: '👥' },
    { name: 'Sleep Studies', path: '/sleep-studies', icon: '😴' },
    { name: 'Invoices', path: '/invoices', icon: '📄' },
    { name: 'Jobs', path: '/jobs', icon: '🔧' },
    { name: 'Users', path: '/users', icon: '👤' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-gray-200/50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand - HOME BUTTON */}
          <div 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🏥</span>
            </div>
            <div className="text-2xl font-bold gradient-text">VitalOps</div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`px-4 py-2.5 rounded-xl transition-all duration-200 font-medium flex items-center gap-2 text-sm relative ${
                  pathname.startsWith(item.path)
                    ? 'bg-gradient-to-r from-primary-500 to-emerald-600 text-white shadow-lg shadow-primary-500/30'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
                {pathname.startsWith(item.path) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 font-medium transition-all duration-200 border border-gray-200 hover:border-transparent"
          >
            Logout
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex overflow-x-auto pb-2 gap-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition text-sm flex items-center gap-1.5 ${
                pathname.startsWith(item.path)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
