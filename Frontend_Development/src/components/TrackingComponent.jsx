import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import polyline from "polyline";
import axios from "axios";
import { listLocation } from "/src/service/GPSService";
import truckIconImg from "/src/assets/van.png";
import startIconImg from "/src/assets/Start.png";
import endIconImg from "/src/assets/location.png";

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const GPSMap = () => {
    const [locations, setLocations] = useState([]);
    const [routes, setRoutes] = useState({});
    const [error, setError] = useState(null);

    const fetchLocations = useCallback(async () => {
        try {
            const response = await listLocation();
            if (response?.data) {
                setLocations(response.data);
            }
        } catch (err) {
            setError("Failed to load location data.");
        }
    }, []);

    useEffect(() => {
        fetchLocations();
        const interval = setInterval(fetchLocations, 10000);
        return () => clearInterval(interval);
    }, [fetchLocations]);

    const truckIcon = new L.Icon({ iconUrl: truckIconImg, iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40] });
    const startIcon = new L.Icon({ iconUrl: startIconImg, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });
    const endIcon = new L.Icon({ iconUrl: endIconImg, iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30] });

    return (
        <div className="min-h-screen flex flex-col ml-20">
            <p className="text-2xl font-semibold mb-5">🚛 Real-Time Truck Tracking & Geofencing</p>
            {error && <p className="text-red-600 font-bold bg-white p-2 rounded-md">{error}</p>}

            <MapContainer
                center={locations.length > 0 ? [locations[0].latitude, locations[0].longitude] : [9.9, 78.6]}
                zoom={10}
                className="rounded-lg transition-all duration-300 mr-10 shadow-lg"
                style={{ height: "500px", width: "calc(100% - 200px)" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {locations.map((loc, index) => (
                    <Marker key={index} position={[loc.latitude, loc.longitude]} icon={truckIcon}>
                        <Popup>
                            <strong>Truck {loc.vanId}</strong><br />
                            Lat: {loc.latitude.toFixed(5)}, Lon: {loc.longitude.toFixed(5)}<br />
                            Source: {loc.sourceLatitude}, {loc.sourceLongitude}<br />
                            Destination: {loc.destinationLatitude}, {loc.destinationLongitude}
                        </Popup>
                    </Marker>
                ))}

                {locations.map((loc, index) => (
                    <>
                        <Marker key={`start-${index}`} position={[loc.sourceLatitude, loc.sourceLongitude]} icon={startIcon}>
                            <Popup>Start</Popup>
                        </Marker>
                        <Marker key={`end-${index}`} position={[loc.destinationLatitude, loc.destinationLongitude]} icon={endIcon}>
                            <Popup>Destination</Popup>
                        </Marker>
                        <RouteLayer
                            key={`route-${index}`}
                            loc={loc}
                            onRoute={(coords) => {
                                const currentDistance = coords.reduce((min, [lat, lng]) => {
                                    const dist = getDistanceFromLatLonInMeters(lat, lng, loc.latitude, loc.longitude);
                                    return Math.min(min, dist);
                                }, Infinity);
                                if (currentDistance > 300) {
                                    alert(`⚠️ Truck ${loc.vanId} deviated from the route! (${Math.round(currentDistance)}m away)`);
                                }
                            }}
                        />
                    </>
                ))}
            </MapContainer>

            <div className="overflow-auto mt-5 pb-10">
                <table className="w-full border-collapse border rounded-lg shadow-lg overflow-hidden">
                    <thead className="bg-blue-200">
                        <tr className="text-black font-semibold">
                            <th className="p-3 border">Truck ID</th>
                            <th className="p-3 border">Shop ID</th>
                            <th className="p-3 border">Latitude</th>
                            <th className="p-3 border">Longitude</th>
                            <th className="p-3 border">Source</th>
                            <th className="p-3 border">Destination</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.length > 0 ? (
                            locations.map((row, index) => (
                                <tr key={index} className="text-center bg-white hover:bg-gray-100">
                                    <td className="p-3 border">{row.vanId}</td>
                                    <td className="p-3 border">{row.shopId}</td>
                                    <td className="p-3 border">{row.latitude.toFixed(5)}</td>
                                    <td className="p-3 border">{row.longitude.toFixed(5)}</td>
                                    <td className="p-3 border">{`${row.sourceLatitude}, ${row.sourceLongitude}`}</td>
                                    <td className="p-3 border">{`${row.destinationLatitude}, ${row.destinationLongitude}`}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="p-3 text-center">No data</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const RouteLayer = ({ loc, onRoute }) => {
    const map = useMap();

    useEffect(() => {
        const { sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude } = loc;
        axios
            .get(`https://router.project-osrm.org/route/v1/driving/${sourceLongitude},${sourceLatitude};${destinationLongitude},${destinationLatitude}?overview=full&geometries=polyline`)
            .then((res) => {
                if (res.data.routes?.length > 0) {
                    const route = polyline.decode(res.data.routes[0].geometry);
                    const latlngs = route.map(([lat, lng]) => [lat, lng]);
                    const polylineLayer = L.polyline(latlngs, { color: "#f98408", weight: 4 }).addTo(map);
                    map.fitBounds(polylineLayer.getBounds());
                    onRoute(latlngs);
                }
            })
            .catch((err) => console.error("Route fetch error:", err));
    }, [loc, map]);

    return null;
};

export default GPSMap;
