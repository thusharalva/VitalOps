'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import QuickCustomerModal from '@/components/QuickCustomerModal';

// Fixed Prices
const FIXED_PRICES = {
  sleepStudy: 3000,
  deviceRental: 2000,
  reportAnalysis: 1500,
  doctorConsultation: 1000,
};

export default function NewSleepStudyPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    patientAge: '',
    patientGender: 'Male',
    technicianId: '',
    scheduledDate: '',
    scheduledTime: '10:00 AM - 12:00 PM',
    address: '',
    studyFee: FIXED_PRICES.sleepStudy,
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersRes, usersRes]: any = await Promise.all([
        api.getCustomers(),
        api.getAllUsers(), // Get all users
      ]);
      setCustomers(customersRes.data?.customers || []);
      
      // Filter ONLY TECHNICIAN role and active users
      const allTechnicians = (usersRes.data || []).filter((user: any) => 
        user.role === 'TECHNICIAN' && user.isActive
      );
      
      setTechnicians(allTechnicians);
      
      if (allTechnicians.length === 0) {
        setError('No active technicians found! Please create technician accounts first.');
      }
    } catch (err: any) {
      console.error('Failed to load data');
      setError('Failed to load data. Please refresh the page.');
    }
  };

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    const customer = customers.find(c => c.id === customerId);
    
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId,
        customerName: customer.name,
        customerPhone: customer.phone,
        address: customer.address,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        customerId: '',
        customerName: '',
        customerPhone: '',
        address: '',
      }));
    }
  };

  const handleCustomerCreated = (customer: any) => {
    setCustomers(prev => [...prev, customer]);
    setFormData(prev => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      address: customer.address,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.customerName || !formData.customerPhone || !formData.scheduledDate || !formData.technicianId) {
        setError('Please fill in all required fields including technician');
        setLoading(false);
        return;
      }

      const payload = {
        type: 'SLEEP_STUDY_SETUP',
        technicianId: formData.technicianId,
        customerId: formData.customerId || null,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        address: formData.address,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        amountToCollect: formData.studyFee,
        description: `Sleep Study - ${formData.customerName} (Age: ${formData.patientAge}, Gender: ${formData.patientGender})`,
        notes: formData.notes,
      };

      await api.createJob(payload);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/sleep-studies');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create sleep study');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Sleep Study Booked!</h2>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <QuickCustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onCustomerCreated={handleCustomerCreated}
      />

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-primary-600">Book Sleep Study</h1>
                <p className="text-gray-600">Schedule a new sleep study appointment</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Fixed Prices Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">💰 Fixed Pricing</h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                <div>Sleep Study Fee: <strong>₹{FIXED_PRICES.sleepStudy}</strong></div>
                <div>Device Rental: <strong>₹{FIXED_PRICES.deviceRental}</strong></div>
                <div>Report Analysis: <strong>₹{FIXED_PRICES.reportAnalysis}</strong></div>
                <div>Doctor Consultation: <strong>₹{FIXED_PRICES.doctorConsultation}</strong></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient/Customer Details</h3>
                <div className="flex gap-2 mb-4">
                  <select
                    onChange={handleCustomerSelect}
                    value={formData.customerId}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select existing customer or add new</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCustomerModal(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium whitespace-nowrap"
                  >
                    + Add New Customer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      placeholder="9876543210"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="patientAge"
                      value={formData.patientAge}
                      onChange={handleChange}
                      placeholder="45"
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="patientGender"
                      value={formData.patientGender}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Study Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Study Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign Technician <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="technicianId"
                      value={formData.technicianId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select technician</option>
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.name} ({tech.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Study Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Slot
                    </label>
                    <select
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option>10:00 AM - 12:00 PM</option>
                      <option>2:00 PM - 4:00 PM</option>
                      <option>4:00 PM - 6:00 PM</option>
                      <option>6:00 PM - 8:00 PM</option>
                      <option>8:00 PM - 10:00 PM</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Patient's home address for device delivery"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Study Fee</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Sleep Study Fee (Fixed Price)</span>
                    <span className="text-2xl font-bold text-primary-600">₹{formData.studyFee}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Medical history, special instructions..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Book Sleep Study'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

