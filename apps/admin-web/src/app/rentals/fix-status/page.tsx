'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function FixRentalStatusPage() {
  const router = useRouter();
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fixing, setFixing] = useState(false);

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      const response: any = await api.getRentals();
      setRentals(response.data?.rentals || []);
    } catch (err: any) {
      console.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const fixRentalStatus = async (rentalId: string, newStatus: string) => {
    setFixing(true);
    try {
      await api.updateRental(rentalId, { status: newStatus });
      alert(`✅ Rental status updated to ${newStatus}`);
      await loadRentals();
    } catch (err: any) {
      alert(`❌ Failed: ${err.message}`);
    } finally {
      setFixing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">🔧 Fix Rental Status</h1>
          <p className="text-gray-600 mb-4">
            This page helps you fix rentals that show as ACTIVE even though devices are returned.
          </p>
          <button
            onClick={() => router.push('/rentals')}
            className="text-primary-600 hover:text-primary-700"
          >
            ← Back to Rentals
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => {
              const activeAssets = rental.rentalItems?.filter((item: any) => !item.returnedAt).length || 0;
              const totalAssets = rental.rentalItems?.length || 0;

              return (
                <div key={rental.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{rental.rentalNumber}</h3>
                      <p className="text-sm text-gray-600">{rental.customer?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rental.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rental.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <p className="text-sm mb-2">
                      <strong>Assets:</strong> {activeAssets} active / {totalAssets} total
                    </p>
                    {rental.rentalItems?.map((item: any) => (
                      <div key={item.id} className="text-xs text-gray-600 ml-4">
                        • {item.asset?.assetCode} - {item.returnedAt ? '✅ Returned' : '⏳ Active'}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {activeAssets === 0 && rental.status === 'ACTIVE' && (
                      <button
                        onClick={() => fixRentalStatus(rental.id, 'COMPLETED')}
                        disabled={fixing}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                      >
                        ✅ Mark as COMPLETED
                      </button>
                    )}
                    {rental.status === 'COMPLETED' && activeAssets > 0 && (
                      <button
                        onClick={() => fixRentalStatus(rental.id, 'ACTIVE')}
                        disabled={fixing}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        ↩️ Mark as ACTIVE
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/rentals/${rental.id}`)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}



