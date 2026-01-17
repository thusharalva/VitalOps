'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function RentalsPage() {
  const router = useRouter();
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      const response: any = await api.getRentals();
      setRentals(response.data?.rentals || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Modern Header with Gradient */}
      <header className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg flex items-center gap-3">
                <span className="text-5xl">🔑</span>
                <span>Rentals</span>
              </h1>
              <p className="text-green-100 text-lg">Manage rental contracts and agreements</p>
            </div>
            <button
              onClick={() => router.push('/rentals/new')}
              className="px-8 py-4 bg-white text-green-700 rounded-xl hover:bg-green-50 transition-all duration-200 font-bold shadow-2xl hover:shadow-glow hover:scale-105 transform"
            >
              + New Rental
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-lg animate-slide-up">
            <p className="font-medium">❌ {error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 animate-pulse">Loading rentals...</p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center animate-scale-in">
            <div className="text-8xl mb-6 animate-bounce">🔑</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-3">No rentals yet</h3>
            <p className="text-gray-600 text-lg mb-8">Start by creating your first rental contract</p>
            <button
              onClick={() => router.push('/rentals/new')}
              className="btn-primary px-8 py-4 rounded-xl font-bold text-lg"
            >
              Create First Rental
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {rentals.map((rental, index) => {
              const activeAssets = rental.rentalItems?.filter((item: any) => !item.returnedAt).length || 0;
              const totalAssets = rental.rentalItems?.length || 0;
              
              return (
                <div
                  key={rental.id}
                  className="group glass-card rounded-2xl p-6 card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                          {rental.rentalNumber}
                        </h3>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                          rental.status === 'ACTIVE' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                          rental.status === 'COMPLETED' ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                          rental.status === 'PAUSED' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' :
                          'bg-gradient-to-r from-red-400 to-red-500 text-white'
                        }`}>
                          {rental.status}
                        </span>
                        {activeAssets === 0 && rental.status === 'ACTIVE' && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full border border-red-300 animate-pulse">
                            ⚠️ All Returned - Should be COMPLETED
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                          <p className="font-medium text-blue-700 text-xs uppercase tracking-wide mb-1">Customer</p>
                          <p className="text-gray-900 font-semibold">{rental.customer?.name}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                          <p className="font-medium text-green-700 text-xs uppercase tracking-wide mb-1">Monthly Rent</p>
                          <p className="text-gray-900 font-bold text-lg">₹{rental.monthlyRent}</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                          <p className="font-medium text-purple-700 text-xs uppercase tracking-wide mb-1">Deposit</p>
                          <p className="text-gray-900 font-bold text-lg">₹{rental.securityDeposit}</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                          <p className="font-medium text-orange-700 text-xs uppercase tracking-wide mb-1">Start Date</p>
                          <p className="text-gray-900 font-semibold">{new Date(rental.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      {/* Assets Display */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                          Assets ({activeAssets} active / {totalAssets} total)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {rental.rentalItems?.map((item: any) => (
                            <span
                              key={item.id}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium shadow-md ${
                                item.returnedAt
                                  ? 'bg-gray-300 text-gray-700'
                                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse'
                              }`}
                            >
                              <span className="font-mono">{item.asset?.assetCode}</span>
                              <span>{item.returnedAt ? '✅' : '🟢'}</span>
                            </span>
                          ))}
                          {(!rental.rentalItems || rental.rentalItems.length === 0) && (
                            <span className="text-xs text-red-600 font-semibold">⚠️ No assets found - Bad data!</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => router.push(`/rentals/${rental.id}`)}
                      className="ml-6 px-6 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl hover:from-primary-700 hover:to-emerald-700 font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fix Status Button */}
        {rentals.some(r => {
          const activeAssets = r.rentalItems?.filter((item: any) => !item.returnedAt).length || 0;
          return activeAssets === 0 && r.status === 'ACTIVE';
        }) && (
          <div className="mt-8 glass-card rounded-2xl p-6 border-2 border-orange-300 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-orange-900 mb-1 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <span>Incorrect Status Detected</span>
                </h3>
                <p className="text-sm text-orange-700">
                  Some rentals show as ACTIVE but all devices are returned. Click to fix.
                </p>
              </div>
              <button
                onClick={() => router.push('/rentals/fix-status')}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                🔧 Fix Now
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
