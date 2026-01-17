'use client';

import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  const menuItems = [
    {
      icon: '🏢',
      title: 'Company Details',
      description: 'Update business name, address, contact info',
      path: '/settings/company',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '📄',
      title: 'Invoice Templates',
      description: 'Customize invoice format and design',
      path: '/settings/invoice-template',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '💳',
      title: 'Payment Settings',
      description: 'Configure UPI, bank details, payment methods',
      path: '/settings/payment',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: '💰',
      title: 'Pricing & Rates',
      description: 'Edit fixed prices for rentals and services',
      path: '/settings/pricing',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: '📱',
      title: 'WhatsApp Integration',
      description: 'Configure WhatsApp API for messaging',
      path: '/settings/whatsapp',
      color: 'from-green-600 to-green-700',
    },
    {
      icon: '🔔',
      title: 'Notifications',
      description: 'Set up reminders and alerts',
      path: '/settings/notifications',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: '👥',
      title: 'User Management',
      description: 'Manage roles and permissions',
      path: '/users',
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: '🔧',
      title: 'System Settings',
      description: 'Advanced configuration options',
      path: '/settings/system',
      color: 'from-gray-500 to-gray-600',
    },
  ];

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg flex items-center gap-3">
              <span className="text-5xl">⚙️</span>
              <span>Settings</span>
            </h1>
            <p className="text-purple-100 text-lg">Configure your VitalOps system</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {menuItems.map((item, index) => (
            <div
              key={item.path}
              onClick={() => router.push(item.path)}
              className="group glass-card rounded-2xl p-6 cursor-pointer card-hover animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} shadow-lg mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-4xl">{item.icon}</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {item.description}
              </p>

              <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:gap-2 transition-all">
                <span>Configure</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Info */}
        <div className="mt-8 glass-card rounded-2xl p-6 border-l-4 border-primary-600">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Quick Tip
          </h3>
          <p className="text-gray-600 text-sm">
            Start by configuring <strong>Company Details</strong> and <strong>Invoice Templates</strong> to personalize your invoices.
            Then set up <strong>Payment Settings</strong> for UPI and bank information.
          </p>
        </div>
      </main>
    </div>
  );
}



