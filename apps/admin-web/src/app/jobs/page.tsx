'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response: any = await api.getJobs();
      setJobs(response.data?.jobs || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
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
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-600">Technician Jobs</h1>
            <p className="text-gray-600">Manage installations, pickups, and service tasks</p>
          </div>
          <button
            onClick={() => alert('Create Job feature coming soon!')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            + Create Job
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
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No jobs yet</h3>
            <p className="text-gray-600 mb-6">Create technician jobs for installations and services</p>
            <button
              onClick={() => alert('Create Job feature coming soon!')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Create First Job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{job.jobNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {job.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium text-gray-700">Customer</p>
                        <p>{job.customerName}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Technician</p>
                        <p>{job.technician?.name}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Scheduled</p>
                        <p>{new Date(job.scheduledDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Amount</p>
                        <p>₹{job.amountToCollect || 0}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/jobs/${job.id}`)}
                    className="ml-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}



