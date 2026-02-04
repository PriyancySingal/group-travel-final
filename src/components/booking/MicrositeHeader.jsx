import { useState } from "react";

export default function MicrositeHeader({ eventName, eventDate, eventLocation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DGTE</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">Events</span>
          </div>

          {/* Event Info */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="text-gray-600">
              <span className="font-medium text-gray-900">{eventName}</span>
            </div>
            <div className="text-gray-600">
              {eventDate} • {eventLocation}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-gray-600 hover:text-gray-900 text-sm">
              Help
            </button>
            <button className="hidden md:block text-purple-600 hover:text-purple-700 text-sm font-medium">
              My Booking
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">{eventName}</span>
                <br />
                {eventDate} • {eventLocation}
              </div>
              <button className="block w-full text-left text-gray-600 hover:text-gray-900 py-2">
                Help
              </button>
              <button className="block w-full text-left text-purple-600 hover:text-purple-700 py-2 font-medium">
                My Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
