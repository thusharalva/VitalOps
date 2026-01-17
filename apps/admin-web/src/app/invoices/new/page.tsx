'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

// Fixed Service Prices
const SERVICE_PRICES: Record<string, number> = {
  'Installation Charges': 1000,
  'Pickup Charges': 500,
  'Service/Repair': 1500,
  'Calibration': 800,
  'Emergency Support': 2000,
};

// Standard Invoice Descriptions (for analytics)
const STANDARD_DESCRIPTIONS = [
  'Monthly Rent - CPAP Machine',
  'Monthly Rent - Oxygen Concentrator',
  'Monthly Rent - BiPAP Machine',
  'Monthly Rent - Sleep Study Device',
  'Monthly Rent - Wheelchair',
  'Monthly Rent - Hospital Bed',
  'Monthly Rent - Nebulizer',
  'Security Deposit - CPAP Machine',
  'Security Deposit - Oxygen Concentrator',
  'Security Deposit - BiPAP Machine',
  'Security Deposit - Other Equipment',
  'Installation Charges',
  'Pickup Charges',
  'Delivery Charges',
  'Service/Repair Charges',
  'Calibration Charges',
  'Emergency Support',
  'Late Payment Fee',
  'Equipment Damage Fee',
  'Cleaning Charges',
  'Sleep Study Fee',
  'Sleep Study Device Rental',
  'Report Analysis Fee',
  'Doctor Consultation Fee',
  'Training Session',
  'Spare Parts',
  'Filter Replacement',
  'Mask Replacement',
  'Tubing Replacement',
  'Other Charges',
];

export default function NewInvoicePage() {
  const router = useRouter();
  const [rentals, setRentals] = useState<any[]>([]);
  const [sleepStudies, setSleepStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPriceHelper, setShowPriceHelper] = useState(true);

  const [items, setItems] = useState([
    { description: '', quantity: 1, unitPrice: 0, amount: 0 }
  ]);

  const [formData, setFormData] = useState({
    rentalId: '',
    sleepStudyId: '',
    linkedEntity: 'none', // 'rental', 'sleep_study', or 'none'
    type: 'RENTAL_MONTHLY',
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    dueDays: 7,
    notes: '',
  });

  useEffect(() => {
    loadData();
    
    // Check if coming from return asset page
    const savedData = sessionStorage.getItem('invoiceData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setFormData(prev => ({
        ...prev,
        type: data.type,
        rentalId: data.rentalId,
        notes: data.notes,
      }));
      setItems(data.items);
      sessionStorage.removeItem('invoiceData'); // Clear after loading
    }
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [items, formData.tax, formData.discount]);

  const loadData = async () => {
    try {
      const [rentalsRes, sleepStudiesRes]: any = await Promise.all([
        api.getRentals({ status: 'ACTIVE' }),
        api.getJobs({ type: 'SLEEP_STUDY_SETUP' }),
      ]);
      setRentals(rentalsRes.data?.rentals || []);
      setSleepStudies(sleepStudiesRes.data?.jobs || []);
    } catch (err: any) {
      console.error('Failed to load data');
    }
  };

  // Auto-fill when rental is selected
  const handleRentalSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rentalId = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      rentalId,
      sleepStudyId: '',
      linkedEntity: rentalId ? 'rental' : 'none',
      type: 'RENTAL_MONTHLY',
    }));

    if (rentalId) {
      const rental = rentals.find(r => r.id === rentalId);
      if (rental) {
        const firstAsset = rental.rentalItems?.[0]?.asset;
        const categoryName = firstAsset?.category?.name;
        let standardDesc = 'Monthly Rent - CPAP Machine';
        
        if (categoryName) {
          standardDesc = `Monthly Rent - ${categoryName}`;
        }
        
        setItems([{
          description: standardDesc,
          quantity: 1,
          unitPrice: Number(rental.monthlyRent),
          amount: Number(rental.monthlyRent),
        }]);
      }
    }
  };

  // Auto-fill when sleep study is selected
  const handleSleepStudySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sleepStudyId = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      sleepStudyId,
      rentalId: '',
      linkedEntity: sleepStudyId ? 'sleep_study' : 'none',
      type: 'SLEEP_STUDY',
    }));

    if (sleepStudyId) {
      const study = sleepStudies.find(s => s.id === sleepStudyId);
      if (study) {
        setItems([{
          description: 'Sleep Study Fee',
          quantity: 1,
          unitPrice: Number(study.amountToCollect) || 3000,
          amount: Number(study.amountToCollect) || 3000,
        }]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tax' || name === 'discount' || name === 'dueDays' ? parseFloat(value) || 0 : value
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    
    if (field === 'description') {
      newItems[index][field] = value;
      
      // Auto-fill price based on standard description
      if (SERVICE_PRICES[value]) {
        newItems[index].unitPrice = SERVICE_PRICES[value];
        newItems[index].amount = newItems[index].quantity * SERVICE_PRICES[value];
      }
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: parseFloat(value) || 0
      };
      newItems[index].amount = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal + formData.tax - formData.discount;
    setFormData(prev => ({
      ...prev,
      subtotal,
      total
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validItems = items.filter(item => item.description && item.amount > 0);
      
      if (validItems.length === 0) {
        setError('Please add at least one item');
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        rentalId: formData.rentalId || undefined,
        items: validItems,
      };

      await api.createInvoice(payload);
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/invoices');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Invoice Created Successfully!</h2>
          <p className="text-gray-600">Redirecting to invoices list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-primary-600">Create Invoice</h1>
              <p className="text-gray-600">Generate a new invoice</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Fixed Prices Reference */}
            {showPriceHelper && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">💰 Fixed Service Prices</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-800">
                      {Object.entries(SERVICE_PRICES).map(([service, price]) => (
                        <div key={service}>{service}: <strong>₹{price}</strong></div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPriceHelper(false)}
                    className="text-blue-700 hover:text-blue-900"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Invoice Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="RENTAL_MONTHLY">Monthly Rental</option>
                    <option value="RENTAL_DEPOSIT">Security Deposit</option>
                    <option value="SALE">Sale</option>
                    <option value="SERVICE">Service Charge</option>
                    <option value="SLEEP_STUDY">Sleep Study</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due in Days
                  </label>
                  <input
                    type="number"
                    name="dueDays"
                    value={formData.dueDays}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Link to Entity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Link to Service (Auto-fills invoice!)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔑 Link to Rental
                  </label>
                  <select
                    value={formData.rentalId}
                    onChange={handleRentalSelect}
                    disabled={formData.sleepStudyId !== ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select rental...</option>
                    {rentals.map((rental) => (
                      <option key={rental.id} value={rental.id}>
                        {rental.rentalNumber} - {rental.customer?.name} - ₹{rental.monthlyRent}/mo
                      </option>
                    ))}
                  </select>
                  {formData.rentalId && (
                    <p className="text-xs text-green-600 mt-1">✅ Rental linked - invoice auto-filled</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    😴 Link to Sleep Study
                  </label>
                  <select
                    value={formData.sleepStudyId}
                    onChange={handleSleepStudySelect}
                    disabled={formData.rentalId !== ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    <option value="">Select sleep study...</option>
                    {sleepStudies.map((study) => (
                      <option key={study.id} value={study.id}>
                        {study.jobNumber} - {study.customerName} - ₹{study.amountToCollect}
                      </option>
                    ))}
                  </select>
                  {formData.sleepStudyId && (
                    <p className="text-xs text-green-600 mt-1">✅ Sleep study linked - invoice auto-filled</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Select rental OR sleep study to auto-fill invoice details
              </p>
            </div>

            {/* Invoice Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Invoice Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition"
                >
                  + Add Item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-start">
                    <div className="col-span-5">
                      <select
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select description...</option>
                        <optgroup label="Monthly Rentals">
                          {STANDARD_DESCRIPTIONS.filter(d => d.includes('Monthly Rent')).map(desc => (
                            <option key={desc} value={desc}>{desc}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Security Deposits">
                          {STANDARD_DESCRIPTIONS.filter(d => d.includes('Security Deposit')).map(desc => (
                            <option key={desc} value={desc}>{desc}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Service Charges">
                          {STANDARD_DESCRIPTIONS.filter(d => d.includes('Charges') || d.includes('Fee') || d.includes('Support')).map(desc => (
                            <option key={desc} value={desc}>{desc}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Sleep Study">
                          {STANDARD_DESCRIPTIONS.filter(d => d.includes('Sleep Study') || d.includes('Doctor') || d.includes('Report')).map(desc => (
                            <option key={desc} value={desc}>{desc}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Parts & Accessories">
                          {STANDARD_DESCRIPTIONS.filter(d => d.includes('Replacement') || d.includes('Spare')).map(desc => (
                            <option key={desc} value={desc}>{desc}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Other">
                          {STANDARD_DESCRIPTIONS.filter(d => d.includes('Other') || d.includes('Training') || d.includes('Cleaning')).map(desc => (
                            <option key={desc} value={desc}>{desc}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium">
                        ₹{item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-6">
              <div className="max-w-md ml-auto space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{formData.subtotal.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tax (₹)</label>
                    <input
                      type="number"
                      name="tax"
                      value={formData.tax}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Discount (₹)</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold pt-4 border-t">
                  <span>Total:</span>
                  <span className="text-primary-600">₹{formData.total.toFixed(2)}</span>
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
                placeholder="Payment terms, special instructions..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                {loading ? 'Creating Invoice...' : 'Create Invoice'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

