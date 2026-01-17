'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function SleepStudiesPage() {
  const router = useRouter();
  const [studies, setStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudies();
  }, []);

  const loadStudies = async () => {
    try {
      const response: any = await api.getJobs({ type: 'SLEEP_STUDY_SETUP' });
      setStudies(response.data?.jobs || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load sleep studies');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'ASSIGNED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-600">Sleep Studies</h1>
            <p className="text-gray-600">Manage patient sleep studies and device rentals</p>
          </div>
          <button
            onClick={() => router.push('/sleep-studies/new')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            + New Sleep Study
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading sleep studies...</p>
          </div>
        ) : studies.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">😴</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No sleep studies yet</h3>
            <p className="text-gray-600 mb-6">Book your first sleep study</p>
            <button
              onClick={() => router.push('/sleep-studies/new')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Book First Sleep Study
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {studies.map((study) => (
              <div key={study.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{study.customerName}</h3>
                    <p className="text-sm text-gray-500">{study.jobNumber}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(study.status)}`}>
                    {study.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Phone:</span> {study.customerPhone}</p>
                  <p><span className="font-medium">Scheduled:</span> {new Date(study.scheduledDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Address:</span> {study.address}</p>
                  {study.amountToCollect && (
                    <p><span className="font-medium">Fee:</span> ₹{study.amountToCollect}</p>
                  )}
                </div>

                <button
                  onClick={() => router.push(`/sleep-studies/${study.id}`)}
                  className="mt-4 w-full py-2 bg-primary-100 hover:bg-primary-200 rounded text-primary-700 font-medium transition"
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



