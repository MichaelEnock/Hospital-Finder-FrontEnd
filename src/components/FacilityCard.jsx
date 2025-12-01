export function FacilityCard({ facility, index, onRoute }) {
  return (
    <div className="bg-[#1A1A1A] p-4 rounded-lg hover:bg-[#222222] transition-colors border-l-4 border-green-500">
      <h3 className="text-[#E0E0E0] font-bold text-base mb-1">
        {index !== undefined && `${index + 1}. `}{facility.name}
      </h3>
      
      <p className="text-[#B0B0B0] text-sm mb-1">
         {facility.type} • {facility.district}
      </p>
      
      <p className="text-[#B0B0B0] text-sm mb-2">
        👥 {facility.ownership}
      </p>

      {facility.distance && (
        <div className="text-purple-400 font-bold text-base mb-2">
           {facility.distance}
        </div>
      )}

      {/* Services */}
      {facility.services && facility.services.length > 0 && (
        <div className="mt-2 p-2 bg-[#2A2A2A] rounded">
          <h4 className="text-purple-400 text-xs font-semibold mb-1">🏥 Services:</h4>
          <div className="space-y-0.5">
            {facility.services.slice(0, 4).map((svc, idx) => (
              <div key={idx} className="text-[#B0B0B0] text-xs">
                • {svc}
              </div>
            ))}
            {facility.services.length > 4 && (
              <div className="text-[#B0B0B0] text-xs">• And more...</div>
            )}
          </div>
        </div>
      )}

      {/* Working Hours */}
      {facility.working_hours && (
        <div className="mt-2 p-2 bg-orange-900 bg-opacity-30 rounded text-xs">
          <div className="text-orange-300">
            <strong>🕐 Hours:</strong><br />
            Weekdays: {facility.working_hours.weekdays || 'N/A'}<br />
            {facility.working_hours.saturday && `Saturday: ${facility.working_hours.saturday}`}<br />
            {facility.working_hours.emergency && `Emergency: ${facility.working_hours.emergency}`}
          </div>
        </div>
      )}

      {/* Route Button */}
      <button
        onClick={() => onRoute(facility)}
        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-2 rounded transition-colors"
      >
        🗺️ Show Route
      </button>
    </div>
  );
}