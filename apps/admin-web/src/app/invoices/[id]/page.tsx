'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      loadInvoice();
    }
  }, [params.id]);

  const loadInvoice = async () => {
    try {
      const response: any = await api.getInvoiceById(params.id as string);
      setInvoice(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'PARTIALLY_PAID':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Invoice not found'}</p>
          <button
            onClick={() => router.push('/invoices')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
                ← Back
              </button>
              <div>
                <h1 className="text-3xl font-bold text-primary-600">{invoice.invoiceNumber}</h1>
                <p className="text-gray-600">Invoice Details</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/invoices/${invoice.id}/print`)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-xl transition font-bold"
              >
                🖨️ Print/PDF
              </button>
              <button
                onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition font-bold"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => router.push(`/invoices/${invoice.id}/send-whatsapp`)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-xl transition font-bold"
              >
                📱 WhatsApp
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Invoice Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">VitalOps Medical Equipment</h2>
              <p className="text-gray-600">Invoice Details</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
              {invoice.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-600">Invoice Number</p>
              <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Invoice Type</p>
              <p className="font-semibold text-gray-900">{invoice.type.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <p className="text-gray-600">Issue Date</p>
              <p className="font-semibold text-gray-900">{new Date(invoice.issueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Due Date</p>
              <p className="font-semibold text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Items</h3>
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left text-sm text-gray-600">
                <th className="pb-2">Description</th>
                <th className="pb-2 text-right">Qty</th>
                <th className="pb-2 text-right">Price</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.invoiceItems?.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">₹{item.unitPrice}</td>
                  <td className="py-3 text-right font-semibold">₹{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 ml-auto max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{invoice.subtotal}</span>
            </div>
            {Number(invoice.tax) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>₹{invoice.tax}</span>
              </div>
            )}
            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-red-600">-₹{invoice.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary-600">₹{invoice.total}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Paid</span>
              <span>₹{invoice.paidAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Due</span>
              <span>₹{invoice.dueAmount}</span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment History</h3>
            <div className="space-y-3">
              {invoice.payments.map((payment: any) => (
                <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{payment.paymentNumber}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.paymentDate).toLocaleDateString()} - {payment.paymentMethod}
                    </p>
                  </div>
                  <span className="font-bold text-green-600">₹{payment.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

