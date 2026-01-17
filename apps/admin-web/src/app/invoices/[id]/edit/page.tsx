'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';

// Standard descriptions
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

const SERVICE_PRICES: Record<string, number> = {
  'Installation Charges': 1000,
  'Pickup Charges': 500,
  'Service/Repair Charges': 1500,
  'Calibration Charges': 800,
  'Emergency Support': 2000,
};

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    type: 'RENTAL_MONTHLY',
    status: 'DRAFT',
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    dueDate: '',
    notes: '',
  });

  useEffect(() => {
    if (params.id) {
      loadInvoice();
    }
  }, [params.id]);

  useEffect(() => {
    calculateTotals();
  }, [items, formData.tax, formData.discount]);

  const loadInvoice = async () => {
    try {
      const response: any = await api.getInvoiceById(params.id as string);
      const invoice = response.data;

      setFormData({
        type: invoice.type,
        status: invoice.status,
        subtotal: Number(invoice.subtotal),
        tax: Number(invoice.tax),
        discount: Number(invoice.discount),
        total: Number(invoice.total),
        dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
        notes: invoice.notes || '',
      });

      setItems(invoice.invoiceItems?.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        amount: Number(item.amount),
      })) || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal + formData.tax - formData.discount;
    setFormData(prev => ({
      ...prev,
      subtotal,
      total,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tax' || name === 'discount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    
    if (field === 'description') {
      newItems[index][field] = value;
      if (SERVICE_PRICES[value]) {
        newItems[index].unitPrice = SERVICE_PRICES[value];
        newItems[index].amount = newItems[index].quantity * SERVICE_PRICES[value];
      }
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: parseFloat(value) || 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const validItems = items.filter(item => item.description && item.amount > 0);

      if (validItems.length === 0) {
        setError('Please add at least one item');
        setSaving(false);
        return;
      }

      const payload = {
        type: formData.type,
        status: formData.status,
        tax: formData.tax,
        discount: formData.discount,
        dueDate: formData.dueDate,
        notes: formData.notes,
        // Note: Items update would require backend modification
        // For now, we update invoice metadata only
      };

      await api.updateInvoice(params.id as string, payload);

      setSuccess(true);
      setTimeout(() => {
        router.push('/invoices');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update invoice');
    } finally {
      setSaving(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Invoice Updated!</h2>
          <p className="text-gray-600">Redirecting...</p>
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
              <h1 className="text-3xl font-bold text-primary-600">Edit Invoice</h1>
              <p className="text-gray-600">{formData.type.replace(/_/g, ' ')}</p>
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
            {/* Invoice Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SENT">Sent</option>
                    <option value="PAID">Paid</option>
                    <option value="PARTIALLY_PAID">Partially Paid</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="RENTAL_MONTHLY">Monthly Rental</option>
                    <option value="RENTAL_DEPOSIT">Security Deposit</option>
                    <option value="SALE">Sale</option>
                    <option value="SERVICE">Service</option>
                    <option value="SLEEP_STUDY">Sleep Study</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg font-medium">
                        ₹{item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                disabled={saving}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
              >
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}



