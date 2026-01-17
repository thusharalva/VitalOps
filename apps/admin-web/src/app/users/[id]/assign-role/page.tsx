'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function AssignRolePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('TECHNICIAN');

  const handleAssign = async () => {
    setLoading(true);
    setError('');

    try {
      // Update user with role
      await api.updateUser(params.id as string, {
        role: selectedRole,
        isActive: true,
      });

      alert(`✅ Role assigned successfully!\n\nUser can now login with ${selectedRole} permissions.`);
      router.push('/users');
    } catch (err: any) {
      setError(err.message || 'Failed to assign role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Assign User Role</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Role
            </label>
            <div className="space-y-2">
              {[
                { value: 'TECHNICIAN', label: 'Technician', desc: 'Field worker - Job assignments, QR scanning' },
                { value: 'MANAGER', label: 'Manager', desc: 'Manage operations, rentals, customers' },
                { value: 'ACCOUNTANT', label: 'Accountant', desc: 'Billing, invoices, payments only' },
                { value: 'SALES_REP', label: 'Sales Rep', desc: 'Customer & sales management' },
                { value: 'ADMIN', label: 'Admin', desc: 'Full system access' },
              ].map((role) => (
                <label
                  key={role.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedRole === role.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{role.label}</div>
                    <div className="text-sm text-gray-600">{role.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Assign Role & Activate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



