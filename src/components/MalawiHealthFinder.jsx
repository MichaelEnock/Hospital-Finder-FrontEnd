import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MapView } from './MapView';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export default function App() {
  const [facilities, setFacilities] = useState([]);
  const [allFacilities, setAllFacilities] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [routeTarget, setRouteTarget] = useState(null);
  const [connected, setConnected] = useState(false);
  const [facilityCount, setFacilityCount] = useState(0);
  const [message, setMessage] = useState(null);
  const [functionalOnly, setFunctionalOnly] = useState(true);

  // Load all facilities on mount
  useEffect(() => {
    loadFacilities();
  }, [functionalOnly]);

  // Try to get user location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPos([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Initial geolocation failed, using default Malawi view');
        }
      );
    }
  }, []);

  const loadFacilities = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/facilities?functional_only=${functionalOnly}`
      );
      const result = await response.json();

      if (result.success) {
        const facilitiesData = result.data.map(f => ({
          id: f.id,
          name: f.name,
          type: f.facility_type,
          district: f.district,
          ownership: f.ownership,
          services: f.services || [],
          status: f.status,
          coords: [f.lat, f.lng],
          lat: f.lat,
          lng: f.lng,
          working_hours: f.working_hours
        })).filter(f => f.lat && f.lng);

        setAllFacilities(facilitiesData);
        setConnected(true);
        setFacilityCount(result.count);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
      setConnected(false);
      showMessage('Failed to connect to backend. Check if server is running.', 'error');
    }
  };

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      showMessage('Getting your location...', 'info');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPos([position.coords.latitude, position.coords.longitude]);
          showMessage('✓ Location detected successfully!', 'info');
        },
        (error) => {
          showMessage('Unable to get your location. Please search or click on map.', 'error');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      showMessage('Geolocation is not supported by your browser.', 'error');
    }
  };

  const handleLocationSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      showMessage('Please enter a location to search', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/geocode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: searchTerm })
      });

      const result = await response.json();

      if (result.success) {
        const { lat, lng, name } = result.data;
        setUserPos([lat, lng]);
        showMessage(`✓ Found: ${name}`, 'info');
      } else {
        showMessage(result.error, 'error');
      }
    } catch (error) {
      showMessage('Search failed. Try: Lilongwe, Blantyre, Mzuzu, etc.', 'error');
    }
  };

  const handleFind = async (count) => {
    if (!userPos) {
      showMessage('Please set your location first', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/nearest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: userPos[0],
          lng: userPos[1],
          limit: count,
          functional_only: functionalOnly
        })
      });

      const result = await response.json();

      if (result.success && result.data.length > 0) {
        const nearestFacilities = result.data.map(f => ({
          id: f.id,
          name: f.name,
          type: f.facility_type,
          district: f.district,
          ownership: f.ownership,
          services: f.services || [],
          distance: `${f.distance_km} km`,
          coords: [f.lat, f.lng],
          lat: f.lat,
          lng: f.lng,
          working_hours: f.working_hours
        }));

        setFacilities(nearestFacilities);
        showMessage(`Found ${result.data.length} facilities`, 'info');
      } else {
        showMessage('No facilities found. Try different filters.', 'error');
      }
    } catch (error) {
      showMessage('Search failed. Check backend connection.', 'error');
    }
  };

  const handleRoute = (facility) => {
    if (!userPos) {
      showMessage('Please set your location first', 'error');
      return;
    }
    setRouteTarget(facility);
    showMessage(`Route to ${facility.name} displayed`, 'info');
  };

  const handleMapClick = (latlng) => {
    setUserPos([latlng.lat, latlng.lng]);
    showMessage('Location set from map click', 'info');
  };

  const handleFunctionalToggle = (value) => {
    setFunctionalOnly(value);
    setFacilities([]); // Clear results when filter changes
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212]">
      <Header connected={connected} facilityCount={facilityCount} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          facilities={facilities}
          onFind={handleFind}
          onRoute={handleRoute}
          onUseMyLocation={handleUseMyLocation}
          onLocationSearch={handleLocationSearch}
          message={message}
          functionalOnly={functionalOnly}
          onFunctionalToggle={handleFunctionalToggle}
          hasUserLocation={!!userPos}
        />
        <MapView
          userPosition={userPos}
          allFacilities={allFacilities}
          nearestFacilities={facilities}
          routeTo={routeTarget}
          onMapClick={handleMapClick}
        />
      </div>
    </div>
  );
}