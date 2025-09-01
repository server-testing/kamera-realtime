import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle map clicks (optional, currently not used)
const LocationMarker = ({ setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const FormAddUser = ({ onClose }) => {
  const mapRef = useRef(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [latLng, setLatLng] = useState([51.505, -0.09]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleMarkerDrag = (e) => {
    const newLatLng = [e.target.getLatLng().lat, e.target.getLatLng().lng];
    setLatLng(newLatLng);
  };

  const handleSubmit = () => {
    const cameraData = {
      name,
      location,
      latitude: latLng[0],
      longitude: latLng[1],
    };
    console.log("Camera Data:", cameraData);
    // Tambahkan logic penyimpanan di sini
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-6 uppercase">
          Add Camera
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map */}
          <div className="h-96 w-full rounded-md overflow-hidden">
            <MapContainer
              center={latLng}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              whenCreated={(mapInstance) => {
                mapRef.current = mapInstance;
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={latLng}
                draggable={true}
                eventHandlers={{ dragend: handleMarkerDrag }}
              >
                <Popup>Drag me to set location</Popup>
              </Marker>
              <LocationMarker setLatLng={setLatLng} />
            </MapContainer>
          </div>

          {/* Form Inputs */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama User"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Lokasi"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                value={latLng[0]}
                readOnly
                className="w-full bg-gray-100 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                value={latLng[1]}
                readOnly
                className="w-full bg-gray-100 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormAddUser;
