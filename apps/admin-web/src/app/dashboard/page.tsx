'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response: any = await api.getDashboardOverview();
      setStats(response.data);
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
      setStats({
        assets: { total: 0, available: 0, rented: 0, utilizationRate: 0 },
        rentals: { active: 0 },
        customers: { total: 0 },
        invoices: { pending: 0, overdue: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Modern Header with Gradient */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-emerald-600 to-teal-700"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Welcome Back! 👋
            </h1>
            <p className="text-primary-100 text-lg">Here's what's happening with your business today</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <ModernStatCard
            title="Total Assets"
            value={stats?.assets?.total || 0}
            subtitle={`${stats?.assets?.available || 0} available`}
            icon="📦"
            gradient="from-blue-500 to-blue-600"
            onClick={() => router.push('/assets')}
          />
          <ModernStatCard
            title="Active Rentals"
            value={stats?.rentals?.active || 0}
            subtitle="Currently earning"
            icon="🔑"
            gradient="from-green-500 to-emerald-600"
            onClick={() => router.push('/rentals')}
          />
          <ModernStatCard
            title="Customers"
            value={stats?.customers?.total || 0}
            subtitle="Total registered"
            icon="👥"
            gradient="from-purple-500 to-purple-600"
            onClick={() => router.push('/customers')}
          />
          <ModernStatCard
            title="Pending Bills"
            value={stats?.invoices?.pending || 0}
            subtitle={`${stats?.invoices?.overdue || 0} overdue`}
            icon="📄"
            gradient="from-orange-500 to-red-600"
            onClick={() => router.push('/invoices')}
          />
        </div>

        {/* Quick Actions - Modern Cards */}
        <div className="glass-card rounded-2xl p-8 mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <span>Quick Actions</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <QuickActionCard title="Add Asset" icon="📦" onClick={() => router.push('/assets/new')} />
            <QuickActionCard title="New Rental" icon="🔑" onClick={() => router.push('/rentals/new')} />
            <QuickActionCard title="Add Customer" icon="👤" onClick={() => router.push('/customers/new')} />
            <QuickActionCard title="Sleep Study" icon="😴" onClick={() => router.push('/sleep-studies/new')} />
            <QuickActionCard title="Create Invoice" icon="📄" onClick={() => router.push('/invoices/new')} />
          </div>
        </div>

        {/* Recent Activity - Modern Design */}
        <div className="glass-card rounded-2xl p-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <span>Recent Activity</span>
          </h2>
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📭</div>
            <p className="text-gray-500">No recent activity to display</p>
            <p className="text-sm text-gray-400 mt-2">Activity will appear here as you use the system</p>
          </div>
        </div>
      </main>

      {/* Add background pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}

function ModernStatCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
  onClick,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  gradient: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative glass-card rounded-2xl p-6 cursor-pointer card-hover overflow-hidden"
    >
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
            <span className="filter drop-shadow-lg">{icon}</span>
          </div>
        </div>
        
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">{title}</h3>
        <p className="text-4xl font-bold text-gray-900 mb-2">{value}</p>
        <p className="text-sm text-gray-600">{subtitle}</p>
        
        {/* Arrow indicator on hover */}
        <div className="absolute bottom-6 right-6 text-primary-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          →
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, icon, onClick }: { title: string; icon: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative glass-card rounded-xl p-6 hover:bg-gradient-to-br hover:from-primary-50 hover:to-emerald-50 transition-all duration-300 card-hover text-center"
    >
      <div className="text-5xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
        {icon}
      </div>
      <p className="font-semibold text-gray-700 group-hover:text-primary-700 transition-colors">
        {title}
      </p>
      <div className="absolute inset-0 rounded-xl ring-2 ring-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
}
