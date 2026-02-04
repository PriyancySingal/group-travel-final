import { useState } from "react";
import MicrositeHeader from "../../components/booking/MicrositeHeader";
import PackageSelection from "../../components/booking/PackageSelection";
import AddOns from "../../components/booking/AddOns";
import GuestForm from "../../components/booking/GuestForm";
import RoomSelection from "../../components/booking/RoomSelection";
import Checkout from "../../components/booking/Checkout";
import Confirmation from "../../components/booking/Confirmation";

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState("packages");
  const [bookingData, setBookingData] = useState({
    bookingId: null,
    package: "standard",
    selectedAddOns: [],
    selectedRoom: null,
    guestData: {},
    totalAmount: 0
  });

  const steps = [
    { id: "packages", name: "Package", icon: "📦" },
    { id: "addons", name: "Add-ons", icon: "➕" },
    { id: "guest", name: "Guest Info", icon: "👤" },
    { id: "room", name: "Room", icon: "🏠" },
    { id: "checkout", name: "Payment", icon: "💳" },
    { id: "confirmation", name: "Confirmed", icon: "✅" }
  ];

  const handlePackageSelect = (pkg) => {
    setBookingData(prev => ({ ...prev, package: pkg.id }));
    setCurrentStep("addons");
  };

  const handleAddOnChange = (newAddOns) => {
    setBookingData(prev => ({ ...prev, selectedAddOns: newAddOns }));
  };

  const handleFormChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      guestData: { ...prev.guestData, [field]: value }
    }));
  };

  const handleRoomSelect = (roomId) => {
    setBookingData(prev => ({ ...prev, selectedRoom: roomId }));
    setCurrentStep("checkout");
  };

  const handlePaymentComplete = () => {
    // Generate booking ID
    const bookingId = "DGTE" + Math.random().toString(36).substr(2, 9).toUpperCase();
    setBookingData(prev => ({ 
      ...prev, 
      bookingId,
      totalAmount: calculateTotal()
    }));
    setCurrentStep("confirmation");
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Package prices
    const packagePrices = {
      standard: 15000,
      premium: 25000,
      luxury: 45000
    };
    total += packagePrices[bookingData.package] || 0;
    
    // Add-ons
    const addOnPrices = {
      spa: 3000,
      transport: 2000,
      dining: 4000,
      photography: 2500,
      excursion: 1500,
      late_checkout: 1000
    };
    bookingData.selectedAddOns.forEach(addOnId => {
      total += addOnPrices[addOnId] || 0;
    });
    
    // Room price (3 nights)
    const roomPrices = {
      101: 8000, 102: 8000, 103: 8000,
      201: 8500, 202: 8500,
      301: 15000, 302: 15000,
      401: 16000,
      501: 35000, 502: 35000,
      601: 40000
    };
    if (bookingData.selectedRoom) {
      total += (roomPrices[bookingData.selectedRoom] || 0) * 3;
    }
    
    return total;
  };

  const canProceedToNext = () => {
    switch(currentStep) {
      case "packages":
        return bookingData.package;
      case "addons":
        return true; // Add-ons are optional
      case "guest":
        return bookingData.guestData.firstName && 
               bookingData.guestData.lastName && 
               bookingData.guestData.email && 
               bookingData.guestData.phone;
      case "room":
        return bookingData.selectedRoom;
      default:
        return true;
    }
  };

  const getStepIndex = () => steps.findIndex(step => step.id === currentStep);
  const canGoBack = getStepIndex() > 0;
  const canGoForward = canProceedToNext() && currentStep !== "confirmation";

  const goToNext = () => {
    if (canProceedToNext()) {
      const nextIndex = getStepIndex() + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].id);
      }
    }
  };

  const goToPrevious = () => {
    if (canGoBack) {
      const prevIndex = getStepIndex() - 1;
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case "packages":
        return (
          <PackageSelection 
            selectedPackage={bookingData.package}
            onPackageSelect={handlePackageSelect}
          />
        );
      case "addons":
        return (
          <AddOns 
            selectedAddOns={bookingData.selectedAddOns}
            onAddOnChange={handleAddOnChange}
          />
        );
      case "guest":
        return (
          <GuestForm 
            formData={bookingData.guestData}
            onFormChange={handleFormChange}
          />
        );
      case "room":
        return (
          <RoomSelection 
            selectedRoom={bookingData.selectedRoom}
            onRoomSelect={handleRoomSelect}
            selectedPackage={bookingData.package}
          />
        );
      case "checkout":
        return (
          <Checkout
            selectedPackage={bookingData.package}
            selectedAddOns={bookingData.selectedAddOns}
            selectedRoom={bookingData.selectedRoom}
            guestData={bookingData.guestData}
            onPaymentComplete={handlePaymentComplete}
          />
        );
      case "confirmation":
        return <Confirmation bookingData={bookingData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MicrositeHeader 
        eventName="Tech Conference 2026"
        eventDate="March 15-18, 2026"
        eventLocation="Mumbai, India"
      />

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    getStepIndex() >= index
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {getStepIndex() > index ? "✓" : index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    getStepIndex() >= index ? "text-purple-600" : "text-gray-500"
                  }`}>
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`ml-8 w-8 h-0.5 ${
                      getStepIndex() > index ? "bg-purple-600" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="py-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      {currentStep !== "confirmation" && (
        <div className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
            <button
              onClick={goToPrevious}
              disabled={!canGoBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <button
              onClick={goToNext}
              disabled={!canGoForward}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentStep === "checkout" ? "Complete Booking" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
