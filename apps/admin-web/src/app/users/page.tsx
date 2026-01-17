'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response: any = await api.getAllUsers();
      setUsers(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = (userId: string) => {
    router.push(`/users/${userId}/assign-role`);
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-purple-100 text-purple-800',
      MANAGER: 'bg-blue-100 text-blue-800',
      TECHNICIAN: 'bg-green-100 text-green-800',
      ACCOUNTANT: 'bg-yellow-100 text-yellow-800',
      SALES_REP: 'bg-orange-100 text-orange-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-600">Users & Technicians</h1>
            <p className="text-gray-600">Manage system users and technician accounts</p>
          </div>
          <button
            onClick={() => router.push('/users/new')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            + Add User/Technician
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
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.phone && (
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-gray-600">{user.isActive ? 'Active' : 'Inactive'}</span>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => handleAssignRole(user.id)}
                    className="w-full py-2 bg-primary-100 hover:bg-primary-200 rounded text-primary-700 font-medium transition text-sm"
                  >
                    Change Role
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Role Legend */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-4">User Roles</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">ADMIN</span>
              <span className="text-gray-600">Full access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">MANAGER</span>
              <span className="text-gray-600">Manage operations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">TECHNICIAN</span>
              <span className="text-gray-600">Field work</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">ACCOUNTANT</span>
              <span className="text-gray-600">Finance only</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">SALES_REP</span>
              <span className="text-gray-600">Sales tasks</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

