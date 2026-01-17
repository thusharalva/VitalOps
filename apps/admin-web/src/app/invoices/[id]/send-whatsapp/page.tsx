'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function SendWhatsAppPage() {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (params.id) {
      loadInvoice();
    }
  }, [params.id]);

  const loadInvoice = async () => {
    try {
      const response: any = await api.getInvoiceById(params.id as string);
      const inv = response.data;
      setInvoice(inv);
      
      // Get customer phone from rental
      const customerPhone = inv.rental?.customer?.phone || '';
      setPhone(customerPhone);
      
      // Generate WhatsApp message
      const msg = generateMessage(inv);
      setMessage(msg);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const generateMessage = (inv: any) => {
    const customerName = inv.rental?.customer?.name || 'Customer';
    return `Dear ${customerName},

📄 *Invoice from VitalOps Medical Equipment*

Invoice Number: ${inv.invoiceNumber}
Amount: ₹${inv.total}
Due Date: ${new Date(inv.dueDate).toLocaleDateString()}

Payment Details:
💰 Total Amount: ₹${inv.total}
✅ Paid: ₹${inv.paidAmount}
❗ Due: ₹${inv.dueAmount}

Please pay via UPI or Cash.

Thank you for your business!
- VitalOps Team`;
  };

  const handleSend = async () => {
    setSending(true);
    setError('');

    try {
      await api.sendInvoiceViaWhatsApp(invoice.id);
      
      alert(`✅ Invoice sent to ${phone}!\n\n(Note: WhatsApp API integration needed in backend for actual sending)`);
      
      router.push('/invoices');
    } catch (err: any) {
      setError(err.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const openWhatsAppDirectly = () => {
    // Open WhatsApp with pre-filled message
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
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
              <h1 className="text-3xl font-bold text-primary-600">Send Invoice via WhatsApp</h1>
              <p className="text-gray-600">{invoice?.invoiceNumber}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8">
          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Message Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Preview
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            />
          </div>

          {/* Send Options */}
          <div className="space-y-3">
            <button
              onClick={openWhatsAppDirectly}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
            >
              <span>📱</span>
              <span>Open WhatsApp (Manual Send)</span>
            </button>

            <button
              onClick={handleSend}
              disabled={sending || !phone}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
            >
              {sending ? 'Sending...' : '🚀 Send via API (Requires WhatsApp API Setup)'}
            </button>

            <button
              onClick={() => router.back()}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 How WhatsApp Sending Works</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Option 1 (Quick):</strong> Opens WhatsApp Web with pre-filled message. You click send manually.</p>
              <p><strong>Option 2 (Automated):</strong> Requires Gupshup/Meta API configuration in backend .env file.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



