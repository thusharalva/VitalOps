'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InvoiceTemplatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    showLogo: true,
    showQRCode: true,
    showBankDetails: true,
    showTerms: true,
    colorScheme: 'emerald',
    fontSize: 'medium',
    includeSignature: true,
    footer Text: 'Thank you for your business!',
  });

  const handleSave = () => {
    setSaving(true);
    // TODO: Save to backend
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-white/80 hover:text-white">
              ← Back
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                <span className="text-5xl">📄</span>
                Invoice Template Settings
              </h1>
              <p className="text-purple-100 text-lg">Customize your invoice format and appearance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Display Options */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">👁️</span>
                Display Options
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                  <span className="text-gray-700 font-medium">Show Company Logo</span>
                  <input
                    type="checkbox"
                    checked={settings.showLogo}
                    onChange={(e) => setSettings({ ...settings, showLogo: e.target.checked })}
                    className="w-6 h-6 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                  <span className="text-gray-700 font-medium">Show UPI QR Code</span>
                  <input
                    type="checkbox"
                    checked={settings.showQRCode}
                    onChange={(e) => setSettings({ ...settings, showQRCode: e.target.checked })}
                    className="w-6 h-6 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                  <span className="text-gray-700 font-medium">Show Bank Details</span>
                  <input
                    type="checkbox"
                    checked={settings.showBankDetails}
                    onChange={(e) => setSettings({ ...settings, showBankDetails: e.target.checked })}
                    className="w-6 h-6 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                  <span className="text-gray-700 font-medium">Show Terms & Conditions</span>
                  <input
                    type="checkbox"
                    checked={settings.showTerms}
                    onChange={(e) => setSettings({ ...settings, showTerms: e.target.checked })}
                    className="w-6 h-6 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                  <span className="text-gray-700 font-medium">Include Signature Area</span>
                  <input
                    type="checkbox"
                    checked={settings.includeSignature}
                    onChange={(e) => setSettings({ ...settings, includeSignature: e.target.checked })}
                    className="w-6 h-6 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Design Options */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                Design Options
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Color Scheme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Emerald', value: 'emerald', gradient: 'from-emerald-500 to-emerald-600' },
                      { name: 'Blue', value: 'blue', gradient: 'from-blue-500 to-blue-600' },
                      { name: 'Purple', value: 'purple', gradient: 'from-purple-500 to-purple-600' },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSettings({ ...settings, colorScheme: color.value })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          settings.colorScheme === color.value
                            ? 'border-primary-600 ring-4 ring-primary-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`h-8 bg-gradient-to-r ${color.gradient} rounded-lg mb-2`}></div>
                        <p className="text-xs font-medium text-gray-700">{color.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Font Size</label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                  >
                    <option value="small">Small (Easy to fit more content)</option>
                    <option value="medium">Medium (Recommended)</option>
                    <option value="large">Large (Better readability)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Footer Message</label>
                  <input
                    type="text"
                    value={settings.footerText}
                    onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition"
                    placeholder="Thank you message"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full btn-primary py-4 rounded-xl font-bold text-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : saved ? '✅ Saved!' : '💾 Save Template Settings'}
            </button>
          </div>

          {/* Preview Panel */}
          <div className="glass-card rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">👁️</span>
              Live Preview
            </h2>
            
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-inner" style={{ transform: 'scale(0.8)', transformOrigin: 'top' }}>
              {/* Mini Invoice Preview */}
              {settings.showLogo && (
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                    settings.colorScheme === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                    settings.colorScheme === 'blue' ? 'from-blue-500 to-blue-600' :
                    'from-purple-500 to-purple-600'
                  } flex items-center justify-center`}>
                    <span className="text-lg">🏥</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">VitalOps</p>
                    <p className="text-xs text-gray-500">Medical Equipment</p>
                  </div>
                </div>
              )}

              <div className="border-t-2 border-gray-200 pt-3 mb-3">
                <p className="text-right text-lg font-bold text-primary-600">INVOICE</p>
                <p className="text-right text-xs text-gray-500">INV-2024-001</p>
              </div>

              <div className="text-xs space-y-1 mb-3">
                <p className="font-semibold">Bill To: Customer Name</p>
                <p className="text-gray-600">📞 9876543210</p>
              </div>

              <table className="w-full text-xs mb-3">
                <thead>
                  <tr className={`bg-gradient-to-r ${
                    settings.colorScheme === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                    settings.colorScheme === 'blue' ? 'from-blue-500 to-blue-600' :
                    'from-purple-500 to-purple-600'
                  } text-white`}>
                    <th className="text-left p-2">Item</th>
                    <th className="text-right p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">Monthly Rent - CPAP</td>
                    <td className="text-right p-2">₹5,000</td>
                  </tr>
                </tbody>
              </table>

              <div className={`bg-gradient-to-r ${
                settings.colorScheme === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                settings.colorScheme === 'blue' ? 'from-blue-500 to-blue-600' :
                'from-purple-500 to-purple-600'
              } text-white p-3 rounded-lg mb-3`}>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-bold ${settings.fontSize === 'large' ? 'text-base' : settings.fontSize === 'small' ? 'text-xs' : 'text-sm'}`}>
                    Total:
                  </span>
                  <span className={`font-black ${settings.fontSize === 'large' ? 'text-xl' : settings.fontSize === 'small' ? 'text-sm' : 'text-lg'}`}>
                    ₹5,000
                  </span>
                </div>
              </div>

              {settings.showQRCode && (
                <div className="bg-blue-50 p-2 rounded mb-3">
                  <p className="text-xs font-semibold text-blue-900 mb-1">UPI Payment</p>
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">
                    QR
                  </div>
                </div>
              )}

              {settings.showBankDetails && (
                <div className="text-xs text-gray-600 mb-2">
                  <p className="font-semibold">Bank: HDFC Bank</p>
                  <p>A/C: 1234567890</p>
                </div>
              )}

              {settings.showTerms && (
                <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 mb-2">
                  <p className="font-semibold mb-1">Terms:</p>
                  <p>• Payment due within 7 days</p>
                </div>
              )}

              {settings.includeSignature && (
                <div className="border-t pt-2 mt-3">
                  <p className="text-xs text-gray-500">Authorized Signature</p>
                  <div className="border-b border-gray-400 w-24 mt-2"></div>
                </div>
              )}

              <p className="text-center text-xs text-gray-400 mt-3">{settings.footerText}</p>
            </div>

            <div className="mt-4 bg-primary-50 border border-primary-200 rounded-lg p-3">
              <p className="text-xs text-primary-800">
                ✨ Changes you make will be applied to all future invoices when you print or download
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



