import { useState } from "react";

export default function PackageSelection({ selectedPackage, onPackageSelect }) {
  const packages = [
    {
      id: "standard",
      name: "Standard Package",
      price: 15000,
      duration: "3 Days",
      includes: [
        "Standard Room Accommodation",
        "Daily Breakfast",
        "Event Access",
        "Basic Amenities"
      ],
      popular: false
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 25000,
      duration: "3 Days",
      includes: [
        "Deluxe Room Accommodation",
        "All Meals Included",
        "Event Access + VIP Areas",
        "Airport Transfers",
        "Welcome Kit"
      ],
      popular: true
    },
    {
      id: "luxury",
      name: "Luxury Package",
      price: 45000,
      duration: "3 Days",
      includes: [
        "Suite Accommodation",
        "All Meals + Fine Dining",
        "Full Event Access",
        "Airport Transfers",
        "Personal Concierge",
        "Spa Access",
        "Gift Package"
      ],
      popular: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Package</h2>
        <p className="text-lg text-gray-600">Select the perfect package for your event experience</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 ${
              selectedPackage === pkg.id
                ? "border-purple-500 shadow-purple-200"
                : "border-gray-200 hover:border-purple-300"
            }`}
          >
            {pkg.popular && (
              <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                Most Popular
              </div>
            )}

            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold text-purple-600">
                  ₹{pkg.price.toLocaleString()}
                </div>
                <div className="text-gray-500">{pkg.duration}</div>
              </div>

              <div className="space-y-3 mb-6">
                {pkg.includes.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onPackageSelect(pkg)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  selectedPackage === pkg.id
                    ? "bg-purple-600 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {selectedPackage === pkg.id ? "Selected" : "Select Package"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
