import { useState } from "react";

export default function Checkout({ 
  selectedPackage, 
  selectedAddOns, 
  selectedRoom, 
  guestData,
  onPaymentComplete 
}) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const packages = {
    standard: { name: "Standard Package", price: 15000 },
    premium: { name: "Premium Package", price: 25000 },
    luxury: { name: "Luxury Package", price: 45000 }
  };

  const addOns = [
    { id: "spa", name: "Spa & Wellness Package", price: 3000 },
    { id: "transport", name: "Premium Transport", price: 2000 },
    { id: "dining", name: "Fine Dining Experience", price: 4000 },
    { id: "photography", name: "Professional Photography", price: 2500 },
    { id: "excursion", name: "City Tour & Excursion", price: 1500 },
    { id: "late_checkout", name: "Late Check-out", price: 1000 }
  ];

  const rooms = {
    101: { price: 8000, name: "Room 101" },
    102: { price: 8000, name: "Room 102" },
    103: { price: 8000, name: "Room 103" },
    201: { price: 8500, name: "Room 201" },
    202: { price: 8500, name: "Room 202" },
    301: { price: 15000, name: "Room 301" },
    302: { price: 15000, name: "Room 302" },
    401: { price: 16000, name: "Room 401" },
    501: { price: 35000, name: "Room 501" },
    502: { price: 35000, name: "Room 502" },
    601: { price: 40000, name: "Room 601" }
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Package price
    total += packages[selectedPackage]?.price || 0;
    
    // Add-ons
    selectedAddOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId);
      if (addOn) total += addOn.price;
    });
    
    // Room price (assuming 3 nights)
    if (selectedRoom && rooms[selectedRoom]) {
      total += rooms[selectedRoom].price * 3;
    }
    
    return total;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    onPaymentComplete();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const total = calculateTotal();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h2>
        <p className="text-lg text-gray-600">Review your booking details and complete payment</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Booking Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Name:</span>
                <span className="ml-2 text-gray-900">
                  {guestData?.firstName} {guestData?.lastName}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <span className="ml-2 text-gray-900">{guestData?.email}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Phone:</span>
                <span className="ml-2 text-gray-900">{guestData?.phone}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Address:</span>
                <span className="ml-2 text-gray-900">{guestData?.address || "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Package:</span>
                <span className="font-medium text-gray-900">
                  {packages[selectedPackage]?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium text-gray-900">
                  {rooms[selectedRoom]?.name || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium text-gray-900">3 Nights</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium text-gray-900">March 15, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium text-gray-900">March 18, 2026</span>
              </div>
            </div>
          </div>

          {/* Add-ons */}
          {selectedAddOns.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-ons</h3>
              <div className="space-y-2">
                {selectedAddOns.map(addOnId => {
                  const addOn = addOns.find(a => a.id === addOnId);
                  return (
                    <div key={addOnId} className="flex justify-between">
                      <span className="text-gray-600">{addOn?.name}</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(addOn?.price || 0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="space-y-6">
          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Credit/Debit Card</div>
                  <div className="text-sm text-gray-500">Visa, Mastercard, Amex</div>
                </div>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">UPI</div>
                  <div className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</div>
                </div>
              </label>

              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300">
                <input
                  type="radio"
                  name="payment"
                  value="netbanking"
                  checked={paymentMethod === "netbanking"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium text-gray-900">Net Banking</div>
                  <div className="text-sm text-gray-500">All major banks</div>
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Package:</span>
                <span className="text-gray-900">
                  {formatPrice(packages[selectedPackage]?.price || 0)}
                </span>
              </div>
              
              {selectedRoom && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Room (3 nights):</span>
                  <span className="text-gray-900">
                    {formatPrice((rooms[selectedRoom]?.price || 0) * 3)}
                  </span>
                </div>
              )}
              
              {selectedAddOns.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Add-ons:</span>
                  <span className="text-gray-900">
                    {formatPrice(
                      selectedAddOns.reduce((sum, addOnId) => {
                        const addOn = addOns.find(a => a.id === addOnId);
                        return sum + (addOn?.price || 0);
                      }, 0)
                    )}
                  </span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-purple-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || !selectedRoom}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </div>
            ) : (
              `Pay ${formatPrice(total)}`
            )}
          </button>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
