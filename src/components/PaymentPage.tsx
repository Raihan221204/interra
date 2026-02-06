import React, { useState } from 'react';
import { FurnitureItem } from '../types';

interface PaymentPageProps {
  item: FurnitureItem | null;
  onBack: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ item, onBack }) => {
  const [processing, setProcessing] = useState(false);

  if (!item) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
        alert("Payment Successful! Your order has been placed.");
        setProcessing(false);
        onBack();
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Results
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Secure Checkout</h2>
            <form onSubmit={handlePay} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="John Doe" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="john@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Information</label>
                    <div className="relative">
                        <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="0000 0000 0000 0000" />
                        <div className="absolute right-3 top-2.5 flex gap-2">
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                        <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="MM/YY" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                        <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="123" />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={processing}
                    className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-hover transition-colors disabled:opacity-70 flex items-center justify-center"
                >
                    {processing ? (
                        <>Processing...</>
                    ) : (
                        <>Pay {item.estimatedPrice}</>
                    )}
                </button>
            </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-8 rounded-2xl h-fit border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="flex items-start gap-4 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-primary">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
            </div>
            <div className="py-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{item.estimatedPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Taxes</span>
                    <span>Calculated at next step</span>
                </div>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-primary">{item.estimatedPrice}</span>
            </div>
            <div className="mt-8 flex items-center justify-center text-xs text-gray-400 gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure 256-bit SSL Encrypted payment
            </div>
        </div>
      </div>
    </div>
  );
};