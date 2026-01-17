'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response: any = await api.getCustomers();
      setCustomers(response.data?.customers || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-600">Customers</h1>
            <p className="text-gray-600">Manage your customer database</p>
          </div>
          <button
            onClick={() => router.push('/customers/new')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            + Add Customer
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No customers yet</h3>
            <p className="text-gray-600 mb-6">Add your first customer to get started</p>
            <button
              onClick={() => router.push('/customers/new')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Add First Customer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                    {customer.email && (
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Address:</span></p>
                  <p className="text-sm">{customer.address}</p>
                  {customer.city && (
                    <p>{customer.city}, {customer.state} {customer.pincode}</p>
                  )}
                </div>

                <button
                  onClick={() => router.push(`/customers/${customer.id}`)}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}



