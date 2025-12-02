import { useState } from 'react';
import { MapPin, Search, Settings } from 'lucide-react';
import { FacilityCard } from './FacilityCard';

export function Sidebar({ 
  facilities = [], 
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
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      setIsSearching(true);
      onLocationSearch(query);
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFindClick = () => {
    if (hasUserLocation) {
      onFind(count);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white w-[450px] h-full flex flex-col shadow-xl">
      {/* apapa we have tima scrollable Content  nde sizoonanga kumeneko mn*/}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        
        {/* ive added the location Section in here */}
        <div className="bg-white border-2 border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-blue-600 font-bold text-lg">Your Location</h3>
          </div>
          
          {/* geolocation button */}
          <button
            onClick={onUseMyLocation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 mb-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <span className="text-lg">📍</span>
            Use My Current Location
          </button>

          {/* the search input */}
          <div className="relative mb-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search: Lilongwe, Blantyre, Mzuzu..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 text-gray-800 placeholder-gray-500 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs text-gray-500 font-medium"> OR </span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="text-xs text-gray-600 text-center p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <span className="font-medium">💡 Tip: </span> Click anywhere on the map to set location
          </div>
        </div>

        {/* app thats why ndapanga add ma search settings paja musapagwire abeg man*/}
        <div className="bg-white border-2 border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="text-blue-600 font-bold text-lg">Search Settings</h3>
          </div>

          {/* ka  functional only toggle */}
          <label className="flex items-center justify-between cursor-pointer mb-4 p-3 bg-gray-50 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-gray-800 text-sm font-medium">Functional facilities only</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={functionalOnly}
                onChange={(e) => onFunctionalToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-400 rounded-full peer-checked:bg-green-500 transition-all shadow-inner"></div>
              <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-6 shadow-md"></div>
            </div>
          </label>

          {/* Facility Count Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Number of facilities:
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 bg-gray-50 text-gray-800 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          {/* find button */}
          <button
            onClick={handleFindClick}
            disabled={!hasUserLocation}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Find Nearest Facilities
          </button>

          {!hasUserLocation && (
            <p className="text-xs text-amber-600 mt-2 text-center bg-amber-50 p-2 rounded border border-amber-200">
              ⚠️ Please you have to set your location first
            </p>
          )}
        </div>

        {/* it will display message  */}
        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium border-2 ${
            message.type === 'error' 
              ? 'bg-red-50 border-red-300 text-red-800' 
              : 'bg-blue-50 border-blue-300 text-blue-800'
          }`}>
            {message.type === 'error' ? '❌ ' : 'ℹ️ '}
            {message.text}
          </div>
        )}

        {/* Results List */}
        {facilities.length > 0 && (
          <div className="bg-white border-2 border-gray-200 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h3 className="text-blue-600 font-bold text-lg">Nearest Facilities</h3>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">
                {facilities.length} found
              </span>
            </div>
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

        {/* Empty State */}
        {facilities.length === 0 && hasUserLocation && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-8 rounded-xl text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-600 font-medium mb-1">No facilities found yet</p>
            <p className="text-xs text-gray-500">Click "Find Nearest Facilities" to search</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
