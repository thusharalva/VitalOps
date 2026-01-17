'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import QuickCustomerModal from '@/components/QuickCustomerModal';

// Fixed Monthly Rental Prices by Category
const RENTAL_PRICES: Record<string, number> = {
  'CPAP Machine': 5000,
  'Oxygen Concentrator': 4000,
  'BiPAP Machine': 6000,
  'Sleep Study Device': 3000,
  'Wheelchair': 2000,
  'Hospital Bed': 3500,
  'Nebulizer': 1500,
};

export default function NewRentalPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const [formData, setFormData] = useState({
    customerId: '',
    startDate: '',
    monthlyRent: '',
    securityDeposit: '',
    billingDay: '1',
    location: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersRes, assetsRes]: any = await Promise.all([
        api.getCustomers(),
        api.getAssets({ status: 'AVAILABLE' }), // ONLY AVAILABLE assets
      ]);
      setCustomers(customersRes.data?.customers || []);
      setAssets(assetsRes.data?.assets || []);
      
      if (assetsRes.data?.assets?.length === 0) {
        setError('⚠️ No available assets! All assets are currently rented or not available.');
      }
    } catch (err: any) {
      setError('Failed to load data. Please refresh the page.');
    }
  };

  const handleCustomerCreated = (customer: any) => {
    setCustomers(prev => [...prev, customer]);
    setFormData(prev => ({ ...prev, customerId: customer.id }));
  };

  // Auto-calculate rent based on selected assets
  useEffect(() => {
    if (selectedAssets.length > 0) {
      const totalRent = selectedAssets.reduce((sum, assetId) => {
        const asset = assets.find(a => a.id === assetId);
        const categoryName = asset?.category?.name || '';
        return sum + (RENTAL_PRICES[categoryName] || 3000); // Default 3000 if not in list
      }, 0);
      
      setFormData(prev => ({
        ...prev,
        monthlyRent: totalRent.toString(),
        securityDeposit: (totalRent * 2).toString(), // 2x monthly rent as deposit
      }));
    }
  }, [selectedAssets, assets]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleAsset = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate
      if (!formData.customerId) {
        setError('Please select a customer');
        setLoading(false);
        return;
      }

      if (selectedAssets.length === 0) {
        setError('Please select at least one asset to rent');
        setLoading(false);
        return;
      }

      if (!formData.startDate || !formData.monthlyRent || !formData.securityDeposit) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        monthlyRent: parseFloat(formData.monthlyRent),
        securityDeposit: parseFloat(formData.securityDeposit),
        billingDay: parseInt(formData.billingDay),
        assetIds: selectedAssets,
      };

      await api.createRental(payload);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/rentals');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create rental');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Rental Created Successfully!</h2>
          <p className="text-gray-600">Redirecting to rentals list...</p>
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
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-primary-600">Create New Rental</h1>
                <p className="text-gray-600">Set up a new rental contract</p>
              </div>
            </div>
          </div>
        </header>

        {/* Form */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Fixed Pricing Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">💰 Fixed Monthly Rental Prices</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800">
                {Object.entries(RENTAL_PRICES).map(([category, price]) => (
                  <div key={category}>{category}: <strong>₹{price}/mo</strong></div>
                ))}
              </div>
              <p className="text-xs text-blue-700 mt-2">💡 Prices auto-calculate when you select assets</p>
            </div>

          {assets.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
              <p className="font-medium">No available assets!</p>
              <p className="text-sm mt-1">Please add assets with status "AVAILABLE" before creating a rental.</p>
              <button
                onClick={() => router.push('/assets/new')}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700 underline"
              >
                Add Asset Now
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer & Dates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer & Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleChange}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowCustomerModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium whitespace-nowrap"
                    >
                      + New
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Auto-calculated based on assets"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">💡 Auto-filled when you select assets</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Security Deposit (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Usually 2x monthly rent"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">💡 Auto-calculated as 2x monthly rent</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Day of Month
                  </label>
                  <input
                    type="number"
                    name="billingDay"
                    value={formData.billingDay}
                    onChange={handleChange}
                    min="1"
                    max="28"
                    placeholder="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Day when monthly rent is due (1-28)</p>
                </div>
              </div>
            </div>

            {/* Select Assets */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Select Assets <span className="text-red-500">*</span>
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (Only AVAILABLE assets shown)
                </span>
              </h3>
              {assets.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <p className="text-yellow-800 font-medium mb-2">⚠️ No available assets to rent!</p>
                  <p className="text-sm text-yellow-700 mb-4">
                    All assets are currently rented or not available. Please return assets or add new inventory.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/assets/new')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                  >
                    Add New Assets
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800">
                      ✅ Showing {assets.length} available asset(s). Already rented assets are hidden.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assets.map((asset) => (
                      <div
                        key={asset.id}
                        onClick={() => toggleAsset(asset.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                          selectedAssets.includes(asset.id)
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{asset.name}</h4>
                            <p className="text-sm text-gray-500">{asset.assetCode}</p>
                            <p className="text-sm text-gray-600 mt-1">{asset.category?.name}</p>
                            <p className="text-xs text-green-600 mt-1">✓ Available</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedAssets.includes(asset.id)}
                            onChange={() => {}}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedAssets.length > 0 && (
                    <p className="text-sm text-primary-600 mt-2 font-medium">
                      ✅ {selectedAssets.length} asset(s) selected
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Location & Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Customer's address or delivery location"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Any special terms, conditions, or notes about this rental..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
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
                disabled={loading || customers.length === 0 || assets.length === 0}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Rental...' : 'Create Rental'}
              </button>
            </div>
          </form>
        </div>
      </main>
      </div>
    </>
  );
}

