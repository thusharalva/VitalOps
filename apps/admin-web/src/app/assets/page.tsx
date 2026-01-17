'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AssetsPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const response: any = await api.getAssets();
      setAssets(response.data?.assets || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load assets');
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
            <h1 className="text-3xl font-bold text-primary-600">Assets</h1>
            <p className="text-gray-600">Manage your medical equipment inventory</p>
          </div>
          <button
            onClick={() => router.push('/assets/new')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            + Add Asset
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
            <p className="text-gray-500">Loading assets...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No assets yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first asset</p>
            <button
              onClick={() => router.push('/assets/new')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Add First Asset
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{asset.name}</h3>
                    <p className="text-sm text-gray-500">{asset.assetCode}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    asset.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                    asset.status === 'RENTED' ? 'bg-blue-100 text-blue-800' :
                    asset.status === 'SOLD' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {asset.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Category:</span> {asset.category?.name}</p>
                  <p><span className="font-medium">Condition:</span> {asset.condition}</p>
                  <p><span className="font-medium">Value:</span> ₹{asset.currentValue}</p>
                </div>
                <button
                  onClick={() => router.push(`/assets/${asset.id}`)}
                  className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition"
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



