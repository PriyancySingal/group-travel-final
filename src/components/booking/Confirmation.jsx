import { useState } from "react";

export default function Confirmation({ bookingData }) {
  const [emailSent, setEmailSent] = useState(false);

  const sendEmail = () => {
    // Simulate sending confirmation email
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const downloadVoucher = () => {
    // Simulate downloading voucher
    const voucherData = {
      bookingId: bookingData.bookingId,
      guestName: `${bookingData.guestData?.firstName} ${bookingData.guestData?.lastName}`,
      email: bookingData.guestData?.email,
      phone: bookingData.guestData?.phone,
      package: bookingData.package,
      room: bookingData.room,
      checkIn: "March 15, 2026",
      checkOut: "March 18, 2026",
      totalAmount: bookingData.totalAmount,
      bookingDate: new Date().toLocaleDateString(),
      status: "Confirmed"
    };

    const dataStr = JSON.stringify(voucherData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `DGTE_Booking_${bookingData.bookingId}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Your reservation has been successfully confirmed
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">Booking Confirmation</h2>
                <p className="text-purple-100">Booking ID: #{bookingData?.bookingId || "DGTE" + Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">₹{(bookingData?.totalAmount || 0).toLocaleString()}</div>
                <p className="text-purple-100 text-sm">Total Amount</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-6">
            {/* Guest Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Guest Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Name:</span>
                    <p className="text-gray-900 font-medium">
                      {bookingData?.guestData?.firstName} {bookingData?.guestData?.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <p className="text-gray-900 font-medium">{bookingData?.guestData?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Phone:</span>
                    <p className="text-gray-900 font-medium">{bookingData?.guestData?.phone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Address:</span>
                    <p className="text-gray-900 font-medium">
                      {bookingData?.guestData?.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Package:</span>
                    <p className="text-gray-900 font-medium capitalize">{bookingData?.package}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Room:</span>
                    <p className="text-gray-900 font-medium">Room {bookingData?.room}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Check-in:</span>
                    <p className="text-gray-900 font-medium">March 15, 2026</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Check-out:</span>
                    <p className="text-gray-900 font-medium">March 18, 2026</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Duration:</span>
                    <p className="text-gray-900 font-medium">3 Nights</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Booking Date:</span>
                    <p className="text-gray-900 font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add-ons */}
            {bookingData?.selectedAddOns && bookingData.selectedAddOns.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Add-ons</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {bookingData.selectedAddOns.map((addOnId, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-900">{addOnId}</span>
                        <span className="text-gray-900 font-medium">
                          ₹{bookingData.addOnPrices?.[addOnId] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Important Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Please carry a valid ID proof at check-in</li>
                <li>• Check-in time: 2:00 PM, Check-out time: 11:00 AM</li>
                <li>• For any changes, contact us 48 hours before check-in</li>
                <li>• Cancellation policy applies as per terms and conditions</li>
                <li>• Keep this confirmation email handy for check-in</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={sendEmail}
                disabled={emailSent}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {emailSent ? "Email Sent!" : "Email Confirmation"}
              </button>
              <button
                onClick={downloadVoucher}
                className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Download Voucher
              </button>
            </div>
            
            <button
              onClick={() => window.print()}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Print
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-3">📧</div>
              <h4 className="font-semibold text-gray-900 mb-2">Check Your Email</h4>
              <p className="text-sm text-gray-600">
                We've sent a confirmation email with all booking details
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold text-gray-900 mb-2">Save Confirmation</h4>
              <p className="text-sm text-gray-600">
                Download or screenshot this page for your records
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-3">📞</div>
              <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600">
                Contact our support team for any assistance
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">Questions about your booking?</p>
          <div className="flex justify-center gap-6 text-sm">
            <span>📧 support@dgte.events</span>
            <span>📞 +91-9876543210</span>
            <span>💬 Live Chat Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
