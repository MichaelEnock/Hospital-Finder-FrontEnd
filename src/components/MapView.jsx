import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

// Fix Leaflet default icon path issues
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Custom icons using color markers
const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const facilityIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const highlightIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map click handler component
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Routing control component
function RoutingControl({ waypoints, map }) {
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !waypoints || waypoints.length !== 2) return;

    // Remove existing routing control
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
    }

    // Create new routing control
    const control = L.Routing.control({
      waypoints: waypoints.map(([lat, lng]) => L.latLng(lat, lng)),
      lineOptions: { 
        styles: [{ color: "#667eea", weight: 5, opacity: 0.7 }] 
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: function() { return null; } // Don't create extra markers
    }).addTo(map);

    routingControlRef.current = control;

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [map, waypoints]);

  return null;
}

// Map effects component for zoom/bounds
function MapEffects({ userPosition, nearestFacilities, map }) {
  useEffect(() => {
    if (!map || !userPosition) return;

    if (nearestFacilities && nearestFacilities.length > 0) {
      // Fit bounds to show user and all nearest facilities
      const bounds = L.latLngBounds([userPosition]);
      nearestFacilities.forEach(f => bounds.extend(f.coords));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Just center on user
      map.setView(userPosition, 12);
    }
  }, [map, userPosition, nearestFacilities]);

  return null;
}

export function MapView({ 
  userPosition, 
  allFacilities = [], 
  nearestFacilities = [],
  routeTo,
  onMapClick 
}) {
  const mapRef = useRef(null);
  const center = userPosition || [-13.2543, 34.3015]; // Default to Malawi center
  
  // Get map instance
  const map = mapRef.current;

  // Determine waypoints for routing
  const waypoints = routeTo && userPosition 
    ? [userPosition, routeTo.coords] 
    : null;

  // Create set of nearest facility IDs for highlighting
  const nearestIds = new Set(nearestFacilities.map(f => f.id));

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={center} 
        zoom={7}
        className="w-full h-full"
        ref={mapRef}
        whenCreated={setMap => mapRef.current = setMap}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Map click handler */}
        <MapClickHandler onMapClick={onMapClick} />

        {/* Map effects for bounds/zoom */}
        <MapEffects 
          userPosition={userPosition}
          nearestFacilities={nearestFacilities}
          map={map}
        />

        {/* User Marker */}
        {userPosition && (
          <Marker position={userPosition} icon={userIcon}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {/* All Facility Markers */}
        {allFacilities.map((f, i) => {
          const isHighlighted = nearestIds.has(f.id);
          const icon = isHighlighted ? highlightIcon : facilityIcon;
          
          return (
            <Marker key={f.id || i} position={f.coords} icon={icon}>
              <Popup>
                <div className="text-sm">
                  <strong>{f.name}</strong><br />
                  Type: {f.type}<br />
                  District: {f.district}<br />
                  Status: {f.status}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Routing */}
        {waypoints && map && (
          <RoutingControl waypoints={waypoints} map={map} />
        )}
      </MapContainer>
    </div>
  );
}