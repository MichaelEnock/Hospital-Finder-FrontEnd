export function Header({ connected, facilityCount }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 w-full px-4 py-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🏥 Health Facility Finder</h1>
        <p className="text-base text-blue-100 mb-2">Find nearest health facilities in Malawi</p>
        <div className={`inline-block px-3 py-1 rounded-full text-xs ${
          connected ? 'bg-green-500 text-white' : 'bg-white bg-opacity-90 text-gray-800'
        }`}>
          {connected ? `● Connected - ${facilityCount} facilities` : '● Connecting...'}
        </div>
      </div>
    </div>
  );
}