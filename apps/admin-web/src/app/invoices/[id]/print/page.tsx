'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function PrintInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      alert('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return <div className="p-8">Invoice not found</div>;
  }

  const customer = invoice.rental?.customer || {};

  return (
    <>
      {/* Print Button (Hidden when printing) */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-3">
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium shadow-lg"
        >
          ← Back
        </button>
        <button
          onClick={handlePrint}
          className="px-8 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-lg hover:shadow-xl transition font-bold shadow-lg"
        >
          🖨️ Print Invoice
        </button>
      </div>

      {/* Invoice Document - A4 Size */}
      <div className="min-h-screen bg-gray-100 print:bg-white py-8 print:py-0">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none" style={{ width: '210mm', minHeight: '297mm' }}>
          {/* Invoice Content */}
          <div className="p-12 print:p-16">
            {/* Header */}
            <div className="flex justify-between items-start mb-12 pb-8 border-b-4 border-primary-600">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-600 rounded-xl flex items-center justify-center print:bg-primary-600">
                    <span className="text-4xl">🏥</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-gray-800">VitalOps</h1>
                    <p className="text-primary-600 font-semibold">Medical Equipment</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📍 Delhi, India</p>
                  <p>📞 1800-123-4567</p>
                  <p>✉️ contact@vitalops.com</p>
                </div>
              </div>

              <div className="text-right">
                <h2 className="text-5xl font-black text-primary-600 mb-2">INVOICE</h2>
                <div className="bg-primary-50 px-6 py-3 rounded-lg inline-block">
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="text-2xl font-bold text-primary-700">{invoice.invoiceNumber}</p>
                </div>
              </div>
            </div>

            {/* Bill To & Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              {/* Bill To */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 bg-gray-100 px-3 py-2 rounded">
                  Bill To
                </h3>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-gray-800">{customer.name || 'Customer'}</p>
                  <p className="text-gray-600">📞 {customer.phone}</p>
                  {customer.email && <p className="text-gray-600">✉️ {customer.email}</p>}
                  {customer.address && (
                    <p className="text-gray-600 text-sm mt-2">
                      📍 {customer.address}
                      {customer.city && `, ${customer.city}`}
                      {customer.state && `, ${customer.state}`}
                      {customer.pincode && ` - ${customer.pincode}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Invoice Details */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 bg-gray-100 px-3 py-2 rounded">
                  Invoice Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Type:</span>
                    <span className="font-semibold text-gray-800">{invoice.type.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(invoice.issueDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-bold text-red-600">
                      {new Date(invoice.dueDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  {invoice.rental && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rental Ref:</span>
                      <span className="font-semibold text-primary-600">{invoice.rental.rentalNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Invoice Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-primary-600 to-emerald-600 print:bg-primary-600 text-white">
                    <th className="text-left p-4 font-bold">Description</th>
                    <th className="text-center p-4 font-bold w-20">Qty</th>
                    <th className="text-right p-4 font-bold w-32">Rate</th>
                    <th className="text-right p-4 font-bold w-32">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.invoiceItems?.map((item: any, index: number) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-4 border-b border-gray-200">
                        <div className="font-medium text-gray-800">{item.description}</div>
                      </td>
                      <td className="p-4 border-b border-gray-200 text-center text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="p-4 border-b border-gray-200 text-right text-gray-700">
                        ₹{Number(item.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 border-b border-gray-200 text-right font-bold text-gray-900">
                        ₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-80">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      ₹{Number(invoice.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  {Number(invoice.tax) > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Tax/GST:</span>
                      <span className="font-semibold">
                        ₹{Number(invoice.tax).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  
                  {Number(invoice.discount) > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span className="font-semibold">
                        -₹{Number(invoice.discount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-primary-600 to-emerald-600 print:bg-primary-600 text-white p-5 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Amount:</span>
                    <span className="text-3xl font-black">
                      ₹{Number(invoice.total).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-green-600">
                    <span>Paid:</span>
                    <span className="font-bold">
                      ₹{Number(invoice.paidAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600 font-bold text-lg">
                    <span>Amount Due:</span>
                    <span>
                      ₹{Number(invoice.dueAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mb-12 bg-gradient-to-br from-blue-50 to-blue-100 print:bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
              <h3 className="font-bold text-blue-900 mb-4 text-lg flex items-center gap-2">
                <span className="text-2xl">💳</span>
                Payment Methods
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-bold text-blue-800 mb-2">UPI Payment</p>
                  <p className="text-xs text-blue-700 mb-1">Scan QR or pay to:</p>
                  <p className="font-mono font-bold text-blue-900">yourbusiness@upi</p>
                  <div className="mt-3 bg-white p-3 rounded-lg inline-block">
                    <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      UPI QR Code
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-800 mb-2">Bank Transfer</p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p><strong>Bank:</strong> HDFC Bank</p>
                    <p><strong>A/C No:</strong> 1234567890</p>
                    <p><strong>IFSC:</strong> HDFC0001234</p>
                    <p><strong>Name:</strong> VitalOps Medical Equipment</p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-bold text-blue-800 mb-1">Cash Payment</p>
                    <p className="text-xs text-blue-700">Visit our office or pay to technician</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-lg">
                <p className="font-bold text-yellow-900 mb-2">📝 Notes:</p>
                <p className="text-sm text-yellow-800">{invoice.notes}</p>
              </div>
            )}

            {/* Terms & Conditions */}
            <div className="mb-8 text-xs text-gray-600 space-y-1 bg-gray-50 p-5 rounded-lg">
              <p className="font-bold text-gray-700 mb-2">Terms & Conditions:</p>
              <p>• Payment is due within the specified due date</p>
              <p>• Late payments may incur additional charges of ₹500 per month</p>
              <p>• All equipment remains the property of VitalOps Medical Equipment</p>
              <p>• Please retain this invoice for your records</p>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t-2 border-gray-200">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-500 mb-4">For any queries, please contact:</p>
                  <p className="text-sm font-semibold text-gray-700">📞 1800-123-4567</p>
                  <p className="text-sm font-semibold text-gray-700">✉️ support@vitalops.com</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-2">Authorized Signature</p>
                  <div className="border-b-2 border-gray-400 w-48 mb-1"></div>
                  <p className="text-sm font-semibold text-gray-700">VitalOps Medical Equipment</p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400">
                This is a computer-generated invoice and does not require a physical signature
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Thank you for your business! 🙏
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}



