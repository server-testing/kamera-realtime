/* eslint-disable no-undef */
// import { useEffect } from "react"
import Layout from "./Layout"
// import { jwtDecode } from "jwt-decode"
import { RxHamburgerMenu } from "react-icons/rx"

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
import { useNavigate } from "react-router-dom";
import ServiceCamera from "../../api/service/Camera.service";
import SweetAlertService from "../../helper/sweetalertService";

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// eslint-disable-next-line react/prop-types
const LocationMarker = ({ setLatLng }) => {
  useMapEvents({
    click(e) {
      setLatLng([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const AddCameraPage = () => {
  const mapRef = useRef(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [latLng, setLatLng] = useState([-5.3867, 105.2609]);

  const navigate = useNavigate()

  const handleMarkerDrag = (e) => {
    const newLatLng = [e.target.getLatLng().lat, e.target.getLatLng().lng];
    setLatLng(newLatLng);
  };
  
  const handleAddCamera = async () => {
    try {
      const data = {
        NAME: name,
        LOCATION: location,
        COORDINATE: {
          LATITUDE: latLng[0],
          LONGITUDE: latLng[1]
        }
      }
      console.log(data)
      const response = await ServiceCamera.addCam(data)
      if(response.status === true){
        // localStorage.setItem('accessToken', response.data.accessToken)
        SweetAlertService.showSuccess('Success', 'Success Insert Data Camera')
        return navigate('/profile-page/rename/asd')
      }
      return SweetAlertService.showError('Error', response.message)
    } catch (error) {
      return SweetAlertService.showError('Error !!', error)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <>
      <Layout>
        <div className="w-full h-15 bg-blue-gray-100 mt-15 rounded-md flex flex-row items-center justify-start px-5 gap-3">
          <RxHamburgerMenu className="text-xl font-semibold" />
          <p className="font-semibold text-blue-gray-800">Add New Camera</p>
        </div>
        <div className="w-full flex flex-row gap-4 mt-5 p-4 bg-blue-gray-100 rounded-md">
  {/* MAP */}
  <div className="basis-3/5 h-[444px] rounded-md overflow-hidden bg-blue-gray-200">
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

  {/* FORM */}
  <div className="basis-2/5 bg-white rounded-md shadow-md p-5 flex flex-col gap-4">
    <p className="text-lg font-semibold text-blue-gray-700">Form Add Camera</p>
    
    <div>
      <label className="text-sm font-medium mb-1 block">Nama</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama Kamera"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />
    </div>

    <div>
      <label className="text-sm font-medium mb-1 block">Location</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Nama Lokasi"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />
    </div>

    <div>
      <label className="text-sm font-medium mb-1 block">Latitude</label>
      <input
        type="text"
        value={latLng[0]}
        readOnly
        className="w-full bg-gray-100 text-gray-700 rounded px-3 py-2 text-sm border"
      />
    </div>

    <div>
      <label className="text-sm font-medium mb-1 block">Longitude</label>
      <input
        type="text"
        value={latLng[1]}
        readOnly
        className="w-full bg-gray-100 text-gray-700 rounded px-3 py-2 text-sm border"
      />
    </div>

    <button
      onClick={handleAddCamera}
      className="mt-2 w-full bg-blue-gray-700 hover:bg-blue-gray-800 text-white py-2 px-4 rounded-md"
    >
      Tambah Kamera
    </button>
  </div>
</div>

      </Layout>
    </>
  )
}

export default AddCameraPage