import { useState } from "react";
import { MapPin, Search, Hospital, Menu } from "lucide-react";
import MapView from "./MapView";

export default function MapContainer() {
  const [location, setLocation] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="w-full bg-white shadow-md p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">Hospital Finder</h1>
        <Menu className="w-6 h-6 text-gray-700" />
      </header>

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-80 bg-white shadow-lg p-6 hidden md:block">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Nearest Hospital</h2>

          {/* Location Input */}
          <label className="text-gray-600 text-sm font-medium">Enter Location</label>
          <div className="flex items-center mt-1 bg-gray-200 rounded-lg px-3 py-2">
            <MapPin className="w-5 h-5 text-gray-600 mr-2" />
            <input
              type="text"
              placeholder="e.g. Blantyre, Malawi"
              className="bg-transparent outline-none flex-1 text-gray-800"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <button
            className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <Search className="w-5 h-5" /> Search
          </button>

          {/* Hospitals List */}
          <h3 className="mt-8 text-lg font-semibold text-gray-800">Nearby Hospitals</h3>
          <ul className="mt-3 space-y-3">
            <li className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
              <Hospital className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold text-gray-800">Queen Elizabeth Hospital</p>
                <p className="text-sm text-gray-600">Blantyre • 2.4 km away</p>
              </div>
            </li>
            <li className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
              <Hospital className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold text-gray-800">Mlambe Hospital</p>
                <p className="text-sm text-gray-600">Lunzu • 14 km away</p>
              </div>
            </li>
          </ul>
        </aside>

        {/* Map Area */}
        <main className="flex-1 bg-blue-50 flex items-center justify-center text-gray-500 text-lg">
             <MapView />
        </main>
      </div>
    </div>
  );
}
