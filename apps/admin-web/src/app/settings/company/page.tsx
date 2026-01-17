'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CompanySettingsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({
    name: 'VitalOps Medical Equipment',
    address: '123 Medical Plaza, Connaught Place',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    phone: '1800-123-4567',
    email: 'contact@vitalops.com',
    website: 'www.vitalops.com',
    gst: 'GST123456789',
    pan: 'ABCDE1234F',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCompanyInfo({
      ...companyInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setSaving(true);
    // TODO: Save to backend
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      alert('✅ Company details saved!\n\nThese will appear on all invoices.');
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-white/80 hover:text-white">
              ← Back
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                <span className="text-5xl">🏢</span>
                Company Details
              </h1>
              <p className="text-blue-100 text-lg">Update your business information for invoices</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-2xl p-8">
          <form className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    name="name"
                    value={companyInfo.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={companyInfo.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={companyInfo.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={companyInfo.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                  <textarea
                    name="address"
                    value={companyInfo.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={companyInfo.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={companyInfo.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={companyInfo.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Tax & Legal</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">GST Number</label>
                  <input
                    type="text"
                    name="gst"
                    value={companyInfo.gst}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">PAN Number</label>
                  <input
                    type="text"
                    name="pan"
                    value={companyInfo.pan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.push('/settings')}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 btn-primary py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save Company Details'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}



