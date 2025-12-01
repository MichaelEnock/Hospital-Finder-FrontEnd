import { useState } from 'react';
import { SearchBar } from './SearchBar';
import { FacilityCard } from './FacilityCard';

export function Sidebar({ 
  facilities, 
  onFind, 
  onRoute, 
  onUseMyLocation,
  onLocationSearch,
  message,
  functionalOnly,
  onFunctionalToggle,
  hasUserLocation
}) {
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(5);

  const handleSearch = () => {
    if (query.trim()) {
      onLocationSearch(query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white w-[450px] p-4 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Location Section */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-blue-600 font-semibold mb-3">Your Location</h3>
          
          {/* Geolocation Button */}
          <button
            onClick={onUseMyLocation}
            className="w-full flex items-center justify-center px-4 py-2 mb-3 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            <span className="mr-2"></span>Use My Current Location
          </button>

          {/* Search Input */}
          <div className="relative mb-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Or search: Lilongwe, Blantyre, Mzuzu..."
              className="w-full px-3 py-2 pr-10 bg-white text-gray-800 placeholder-gray-500 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
            >
              🔍
            </button>
          </div>

          <div className="text-center text-gray-600 text-xs my-2">OR</div>
          <div className="text-xs text-gray-700 text-center p-2 bg-white border border-gray-300 rounded">
            Click anywhere on the map to set location
          </div>
        </div>

        {/* Search Settings */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-blue-600 font-semibold mb-3">⚙️ Search Settings</h3>

          {/* Functional Only Toggle */}
          <label className="flex items-center justify-between cursor-pointer mb-3 p-2 bg-white border border-gray-300 rounded">
            <span className="text-gray-800 text-sm">Functional facilities only</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={functionalOnly}
                onChange={(e) => onFunctionalToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-green-500 transition"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
            </div>
          </label>

          {/* Facility Count Input */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Number of facilities:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Find Button */}
          <button
            onClick={() => onFind(count)}
            disabled={!hasUserLocation}
            className="w-full mt-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded transition-all"
          >
            Find Nearest Facilities
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === 'error' 
              ? 'bg-red-900 bg-opacity-50 text-red-200' 
              : 'bg-blue-900 bg-opacity-50 text-blue-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Results List */}
        {facilities.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-blue-600 font-semibold mb-3">🎯 Nearest Facilities</h3>
            <div className="space-y-3">
              {facilities.map((fac, idx) => (
                <FacilityCard
                  key={fac.id || idx}
                  facility={fac}
                  index={idx}
                  onRoute={onRoute}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}