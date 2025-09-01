import { useEffect, useState } from "react";
import Layout from "./Layout";
import { RxHamburgerMenu } from "react-icons/rx";

import markerIcon2x from "../../assets/images/marker-icon-2x.png";
import markerIcon from "../../assets/images/marker-icon.png";
import markerShadow from "../../assets/images/marker-shadow.png";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { FaCamera } from "react-icons/fa";
import LiveCam from "../../components/LiveCam/Index";
import ServiceCamera from "../../api/service/Camera.service";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const NilaiPage = () => {
  const [dataCam, setDataCam] = useState([])
  const [showLiveCam, setShowLiveCam] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);

  const getKategori = async () => {
      try {
        const dataUser = await ServiceCamera.getCam()
        console.log(dataUser)
        setDataCam(dataUser.data)
      } catch (error) {
        console.log(error)
      }
    }

  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
    setShowLiveCam(true);
  };

  useEffect(() => {
    getKategori()
  }, [])

  return (
    <>
      <Layout>
        <div className="w-full h-15 bg-blue-gray-100 mt-15 rounded-md flex flex-row items-center justify-start px-5 gap-3">
          <RxHamburgerMenu className="text-xl font-semibold" />
          <p className="font-semibold">Dashboard</p>
        </div>

        <div className="w-full h-auto bg-blue-gray-100 mt-5 rounded-md flex flex-row items-start justify-start p-5 gap-3">
          {/* Map or LiveCam */}
          <div className="w-auto h-auto bg-blue-gray-200 rounded-md flex flex-row items-start justify-start p-5 gap-3">
            {!showLiveCam ? (
              <MapingContainer />
            ) : (
              <LiveCam camera={selectedCamera} onBack={() => setShowLiveCam(false)} />
            )}
          </div>

          {/* Camera List */}
          <div
            className="w-full bg-blue-gray-200 rounded-md flex flex-col items-start justify-start p-5 gap-3"
            style={{ height: "444px" }}
          >
            <p className="text-base font-semibold">List Kamera</p>

            {dataCam.map((cam) => (
              <div
                key={cam.id}
                onClick={() => handleCameraClick(cam)}
                className="w-full h-auto bg-blue-gray-100 rounded-md flex flex-row items-start justify-between p-5 gap-3 cursor-pointer hover:bg-blue-gray-50"
              >
                <div className="flex flex-row gap-3">
                  <FaCamera className="text-xl" />
                  <p className="text-base font-semibold">{cam.NAME}</p>
                </div>
                <a href="#">
                  <p className="text-base text-blue-gray-700">History</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

const MapingContainer = () => {
  const position = [51.505, -0.09];

  return (
    <MapContainer zoom={13} center={position} style={{ height: "404px", width: "600px" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default NilaiPage;
