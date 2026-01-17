'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const response: any = await api.getInvoices();
      setInvoices(response.data?.invoices || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = async (invoiceId: string, invoiceNumber: string, customerName: string) => {
    setSending(invoiceId);
    setError('');

    try {
      await api.sendInvoiceViaWhatsApp(invoiceId);
      
      // Show success message
      alert(`✅ Invoice ${invoiceNumber} sent via WhatsApp to ${customerName}!\n\n(Note: WhatsApp integration needs to be configured in backend)`);
      
      // Reload invoices to update status
      await loadInvoices();
    } catch (err: any) {
      setError(err.message || 'Failed to send invoice');
      alert(`❌ Failed to send invoice: ${err.message}`);
    } finally {
      setSending(null);
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
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary-600">Invoices</h1>
            <p className="text-gray-600">Manage billing and invoices</p>
          </div>
          <button
            onClick={() => router.push('/invoices/new')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            + Create Invoice
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No invoices yet</h3>
            <p className="text-gray-600 mb-6">Create your first invoice to start billing</p>
            <button
              onClick={() => router.push('/invoices/new')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Create First Invoice
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{invoice.invoiceNumber}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Type</p>
                        <p className="text-gray-600">{invoice.type.replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Total</p>
                        <p className="text-gray-900 font-semibold">₹{invoice.total}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Paid</p>
                        <p className="text-green-600">₹{invoice.paidAmount}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Due</p>
                        <p className="text-red-600">₹{invoice.dueAmount}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Due Date</p>
                        <p className="text-gray-600">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => router.push(`/invoices/${invoice.id}`)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
                      className="px-4 py-2 bg-primary-100 hover:bg-primary-200 rounded text-primary-700 font-medium transition"
                    >
                      ✏️ Edit
                    </button>
                    {invoice.status !== 'PAID' && (
                      <button
                        onClick={() => handleSendWhatsApp(
                          invoice.id, 
                          invoice.invoiceNumber,
                          invoice.rental?.customer?.name || 'Customer'
                        )}
                        disabled={sending === invoice.id}
                        className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded text-green-700 font-medium transition disabled:opacity-50"
                        title="Send via WhatsApp"
                      >
                        {sending === invoice.id ? '⏳' : '📱'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Cards */}
        {invoices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{invoices.reduce((sum, inv) => sum + Number(inv.total), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{invoices.reduce((sum, inv) => sum + Number(inv.paidAmount), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-red-600">
                ₹{invoices.reduce((sum, inv) => sum + Number(inv.dueAmount), 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

