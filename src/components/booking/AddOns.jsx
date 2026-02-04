import { useState } from "react";

export default function AddOns({ selectedAddOns, onAddOnChange }) {
  const addOns = [
    {
      id: "spa",
      name: "Spa & Wellness Package",
      price: 3000,
      description: "Full day spa access with wellness treatments",
      image: "🧖‍♀️"
    },
    {
      id: "transport",
      name: "Premium Transport",
      price: 2000,
      description: "Luxury vehicle transfers for entire stay",
      image: "🚗"
    },
    {
      id: "dining",
      name: "Fine Dining Experience",
      price: 4000,
      description: "Exclusive dinner at our partner restaurant",
      image: "🍽️"
    },
    {
      id: "photography",
      name: "Professional Photography",
      price: 2500,
      description: "Event coverage with professional photographer",
      image: "📸"
    },
    {
      id: "excursion",
      name: "City Tour & Excursion",
      price: 1500,
      description: "Guided city tour with local attractions",
      image: "🏛️"
    },
    {
      id: "late_checkout",
      name: "Late Check-out",
      price: 1000,
      description: "Extended check-out until 6 PM",
      image: "⏰"
    }
  ];

  const toggleAddOn = (addOnId) => {
    if (selectedAddOns.includes(addOnId)) {
      onAddOnChange(selectedAddOns.filter(id => id !== addOnId));
    } else {
      onAddOnChange([...selectedAddOns, addOnId]);
    }
  };

  const calculateTotal = () => {
    return addOns
      .filter(addOn => selectedAddOns.includes(addOn.id))
      .reduce((total, addOn) => total + addOn.price, 0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Enhance Your Experience</h2>
        <p className="text-lg text-gray-600">Add premium services to make your stay memorable</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {addOns.map((addOn) => (
          <div
            key={addOn.id}
            className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all ${
              selectedAddOns.includes(addOn.id)
                ? "border-purple-500 shadow-lg"
                : "border-gray-200 hover:border-purple-300"
            }`}
            onClick={() => toggleAddOn(addOn.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{addOn.image}</div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  ₹{addOn.price.toLocaleString()}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {addOn.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4">
              {addOn.description}
            </p>

            <div className="flex items-center justify-between">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                selectedAddOns.includes(addOn.id)
                  ? "bg-purple-600 border-purple-600"
                  : "border-gray-300"
              }`}>
                {selectedAddOns.includes(addOn.id) && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {selectedAddOns.includes(addOn.id) ? "Added" : "Add"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add-ons Total</h3>
            <p className="text-sm text-gray-600">Selected {selectedAddOns.length} add-on(s)</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-600">
              ₹{calculateTotal().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
