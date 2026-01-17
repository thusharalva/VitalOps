'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { differenceInMonths, differenceInDays } from 'date-fns';

export default function ReturnAssetPage() {
  const router = useRouter();
  const params = useParams();
  const [rental, setRental] = useState<any>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [calculations, setCalculations] = useState<any>({});

  useEffect(() => {
    if (params.id) {
      loadRental();
    }
  }, [params.id]);

  useEffect(() => {
    if (rental && returnDate) {
      calculateRent();
    }
  }, [selectedAssets, returnDate, rental]);

  const loadRental = async () => {
    try {
      const response: any = await api.getRentalById(params.id as string);
      setRental(response.data);
      
      // Auto-select all active assets
      const activeAssetIds = response.data.rentalItems
        ?.filter((item: any) => !item.returnedAt)
        .map((item: any) => item.assetId) || [];
      setSelectedAssets(activeAssetIds);
    } catch (err: any) {
      setError(err.message || 'Failed to load rental');
    } finally {
      setLoading(false);
    }
  };

  const calculateRent = () => {
    if (!rental || selectedAssets.length === 0) {
      setCalculations({});
      return;
    }

    const startDate = new Date(rental.startDate);
    const endDate = new Date(returnDate);

    // Calculate complete months
    let months = differenceInMonths(endDate, startDate);
    
    // If there are extra days (partial month), count as full month
    const remainingDays = differenceInDays(endDate, new Date(startDate).setMonth(startDate.getMonth() + months));
    if (remainingDays > 0) {
      months += 1; // Round up to next month
    }

    // Ensure at least 1 month
    if (months < 1) {
      months = 1;
    }

    const monthlyRent = Number(rental.monthlyRent);
    const totalRent = monthlyRent * months;
    const deposit = Number(rental.securityDeposit);

    setCalculations({
      months,
      monthlyRent,
      totalRent,
      deposit,
      finalAmount: totalRent, // Can deduct deposit if needed
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
    });
  };

  const toggleAsset = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleReturn = async () => {
    if (selectedAssets.length === 0) {
      setError('Please select at least one asset to return');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Return each selected asset
      for (const assetId of selectedAssets) {
        await api.returnAsset(rental.id, {
          assetId,
          location: 'Warehouse',
        });
      }

      // Show success and redirect
      alert(`Assets returned successfully!\n\nTotal Rent: ₹${calculations.totalRent}\nMonths: ${calculations.months}\n\nCreate invoice for final payment.`);
      router.push(`/rentals/${rental.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to return assets');
    } finally {
      setProcessing(false);
    }
  };

  const handleReturnAndInvoice = async () => {
    if (selectedAssets.length === 0) {
      setError('Please select at least one asset to return');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Return each selected asset
      for (const assetId of selectedAssets) {
        await api.returnAsset(rental.id, {
          assetId,
          location: 'Warehouse',
        });
      }

      // Redirect to invoice creation with pre-filled data
      const rentalItems = rental.rentalItems
        ?.filter((item: any) => selectedAssets.includes(item.assetId))
        .map((item: any) => item.asset?.name)
        .join(', ') || 'Equipment';

      // Store calculation data in sessionStorage
      sessionStorage.setItem('invoiceData', JSON.stringify({
        type: 'RENTAL_MONTHLY',
        rentalId: rental.id,
        customerName: rental.customer?.name,
        items: [{
          description: `Final Settlement - ${rentalItems}`,
          quantity: calculations.months,
          unitPrice: calculations.monthlyRent,
          amount: calculations.totalRent,
        }],
        notes: `Rental period: ${calculations.startDate} to ${calculations.endDate} (${calculations.months} months)`,
      }));

      router.push('/invoices/new?fromReturn=true');
    } catch (err: any) {
      setError(err.message || 'Failed to return assets');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const activeAssets = rental.rentalItems?.filter((item: any) => !item.returnedAt) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-primary-600">Return Assets</h1>
              <p className="text-gray-600">{rental.rentalNumber} - {rental.customer?.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Asset Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Select Assets to Return ({selectedAssets.length}/{activeAssets.length})
              </h2>
              
              {activeAssets.length === 0 ? (
                <p className="text-gray-500">No active assets to return</p>
              ) : (
                <div className="space-y-3">
                  {activeAssets.map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => toggleAsset(item.assetId)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedAssets.includes(item.assetId)
                          ? 'border-orange-600 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.asset?.name}</h3>
                          <p className="text-sm text-gray-600">{item.asset?.assetCode}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Rented: {new Date(item.rentedAt).toLocaleDateString()}
                            {item.rentedLocation && ` - ${item.rentedLocation}`}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedAssets.includes(item.assetId)}
                          onChange={() => {}}
                          className="w-5 h-5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Return Date */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Return Date</h2>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Set the date when assets are being returned
              </p>
            </div>
          </div>

          {/* Right - Rent Calculation */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">💰 Rent Calculation</h2>
              
              {calculations.months ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 mb-2">Rental Period</p>
                    <p className="text-xs text-blue-700">
                      {calculations.startDate} to {calculations.endDate}
                    </p>
                    <p className="text-2xl font-bold text-blue-900 mt-2">
                      {calculations.months} {calculations.months === 1 ? 'Month' : 'Months'}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Rent</span>
                      <span className="font-semibold">₹{calculations.monthlyRent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">× Months</span>
                      <span className="font-semibold">{calculations.months}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-medium text-gray-700">Total Rent</span>
                      <span className="font-bold text-gray-900">₹{calculations.totalRent}</span>
                    </div>
                    <div className="flex justify-between text-xs pt-2 border-t">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="text-green-600">₹{calculations.deposit}</span>
                    </div>
                  </div>

                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-primary-800 mb-1">Final Amount Due</p>
                    <p className="text-3xl font-bold text-primary-900">
                      ₹{calculations.finalAmount}
                    </p>
                    <p className="text-xs text-primary-700 mt-2">
                      (Deposit can be refunded separately)
                    </p>
                  </div>

                  <div className="pt-4 space-y-3">
                    <button
                      onClick={handleReturnAndInvoice}
                      disabled={processing || selectedAssets.length === 0}
                      className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50"
                    >
                      🔄 Return & Create Invoice
                    </button>
                    
                    <button
                      onClick={handleReturn}
                      disabled={processing || selectedAssets.length === 0}
                      className="w-full px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition font-medium disabled:opacity-50"
                    >
                      {processing ? 'Returning...' : 'Return Assets Only'}
                    </button>

                    <button
                      onClick={() => router.back()}
                      className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                    <p className="text-xs text-yellow-800">
                      💡 <strong>Note:</strong> Rent is calculated by complete months. Any partial month counts as full month.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Select assets and return date to calculate rent</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

