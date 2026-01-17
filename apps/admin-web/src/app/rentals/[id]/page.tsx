'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function RentalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [rental, setRental] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      loadRental();
    }
  }, [params.id]);

  const loadRental = async () => {
    try {
      const response: any = await api.getRentalById(params.id as string);
      setRental(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load rental');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading rental...</p>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Rental not found'}</p>
          <button
            onClick={() => router.push('/rentals')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg"
          >
            Back to Rentals
          </button>
        </div>
      </div>
    );
  }

  const activeAssets = rental.rentalItems?.filter((item: any) => !item.returnedAt) || [];
  const returnedAssets = rental.rentalItems?.filter((item: any) => item.returnedAt) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-primary-600">{rental.rentalNumber}</h1>
                <p className="text-gray-600">Rental Details</p>
              </div>
            </div>
            {activeAssets.length > 0 && (
              <button
                onClick={() => router.push(`/rentals/${rental.id}/return`)}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
              >
                🔄 Return Assets
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rental Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{rental.customer?.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{rental.customer?.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-600">Address</p>
                  <p className="font-semibold text-gray-900">{rental.customer?.address}</p>
                </div>
              </div>
            </div>

            {/* Active Assets */}
            {activeAssets.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Active Assets ({activeAssets.length})
                </h2>
                <div className="space-y-3">
                  {activeAssets.map((item: any) => (
                    <div key={item.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.asset?.name}</h3>
                          <p className="text-sm text-gray-600">{item.asset?.assetCode}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Rented: {new Date(item.rentedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Returned Assets */}
            {returnedAssets.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Returned Assets ({returnedAssets.length})
                </h2>
                <div className="space-y-3">
                  {returnedAssets.map((item: any) => (
                    <div key={item.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.asset?.name}</h3>
                          <p className="text-sm text-gray-600">{item.asset?.assetCode}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Returned: {new Date(item.returnedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
                          RETURNED
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Financial Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Rent</span>
                  <span className="font-bold text-gray-900">₹{rental.monthlyRent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-bold text-gray-900">₹{rental.securityDeposit}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-600">Start Date</span>
                  <span className="font-semibold">{new Date(rental.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing Day</span>
                  <span className="font-semibold">{rental.billingDay} of each month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rental.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {rental.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Invoices */}
            {rental.invoices && rental.invoices.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Invoices</h2>
                <div className="space-y-2">
                  {rental.invoices.slice(0, 5).map((invoice: any) => (
                    <div key={invoice.id} className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{invoice.invoiceNumber}</span>
                        <span className="font-semibold">₹{invoice.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}



