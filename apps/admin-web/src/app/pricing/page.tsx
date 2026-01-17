'use client';

import { useRouter } from 'next/navigation';

// Centralized Fixed Pricing
export const FIXED_PRICES = {
  // Rental Prices (Monthly)
  rental: {
    'CPAP Machine': 5000,
    'Oxygen Concentrator': 4000,
    'BiPAP Machine': 6000,
    'Sleep Study Device': 3000,
    'Wheelchair': 2000,
    'Hospital Bed': 3500,
    'Nebulizer': 1500,
  },
  
  // Service Charges
  service: {
    'Installation': 1000,
    'Pickup': 500,
    'Delivery': 500,
    'Service/Repair': 1500,
    'Calibration': 800,
    'Emergency Support': 2000,
    'Training Session': 1200,
  },
  
  // Sleep Study
  sleepStudy: {
    'Basic Sleep Study': 3000,
    'Advanced Sleep Study': 5000,
    'Device Rental (per night)': 2000,
    'Report Analysis': 1500,
    'Doctor Consultation': 1000,
    'Follow-up Consultation': 500,
  },
  
  // Other
  other: {
    'Security Deposit': '2x Monthly Rent',
    'Late Payment Fee': 500,
    'Equipment Damage Fee': 'Actual Cost',
    'Cleaning Charges': 300,
  },
};

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-600">Fixed Pricing</h1>
            <p className="text-gray-600">Standard prices for all services and rentals</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">💡 About Fixed Pricing</h3>
          <p className="text-blue-800 text-sm">
            These prices are automatically used when creating rentals, invoices, and sleep studies. 
            You can override them if needed, but these are the recommended standard rates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rental Prices */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔑</span>
              <span>Monthly Rental Prices</span>
            </h2>
            <div className="space-y-3">
              {Object.entries(FIXED_PRICES.rental).map(([item, price]) => (
                <div key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item}</span>
                  <span className="text-xl font-bold text-primary-600">₹{price}/mo</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Charges */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔧</span>
              <span>Service Charges</span>
            </h2>
            <div className="space-y-3">
              {Object.entries(FIXED_PRICES.service).map(([item, price]) => (
                <div key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item}</span>
                  <span className="text-xl font-bold text-green-600">₹{price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sleep Study Prices */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>😴</span>
              <span>Sleep Study Prices</span>
            </h2>
            <div className="space-y-3">
              {Object.entries(FIXED_PRICES.sleepStudy).map(([item, price]) => (
                <div key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item}</span>
                  <span className="text-xl font-bold text-purple-600">₹{price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Other Fees */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📋</span>
              <span>Other Fees</span>
            </h2>
            <div className="space-y-3">
              {Object.entries(FIXED_PRICES.other).map(([item, price]) => (
                <div key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">{item}</span>
                  <span className="text-lg font-bold text-gray-600">{price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📌 How Fixed Pricing Works</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✅ <strong>Rentals:</strong> When you select assets, monthly rent auto-calculates based on equipment type</p>
            <p>✅ <strong>Security Deposit:</strong> Automatically set to 2x monthly rent</p>
            <p>✅ <strong>Sleep Studies:</strong> Fixed ₹3000 fee pre-filled</p>
            <p>✅ <strong>Invoices:</strong> Service prices shown for reference</p>
            <p>✅ <strong>Customizable:</strong> You can manually change any price if needed</p>
          </div>
        </div>
      </main>
    </div>
  );
}



