import { useEffect, useState } from "react";
import Layout from "./Layout";
import { RxHamburgerMenu } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import ServiceCamera from "../../api/service/Camera.service";

const RenamePage = () => {
  const [dataCam, setDataCam] = useState([])
  const navigate = useNavigate()

  const [tooltip, setTooltip] = useState({
    visible: false,
    uuid: "",
    top: 0,
    left: 0,
  });

  const getKategori = async () => {
      try {
        const dataUser = await ServiceCamera.getCam()
        console.log(dataUser)
        setDataCam(dataUser.data)
      } catch (error) {
        console.log(error)
      }
    }

  const handleShowTooltip = (e, uuid) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      uuid,
      top: rect.bottom + 8,
      left: rect.left,
    });
  };

  const handleCloseTooltip = () => {
    setTooltip({ visible: false, uuid: "", top: 0, left: 0 });
  };

  const handleNavigateAddCamera = () => {
    return navigate(`/profile-page/rename/addCamera`)
  }

  const handleNavigateEditCamera = (idCamera) => {
    return navigate(`/profile-page/rename/editCamera/${idCamera}`)
  }

  useEffect(() => {
    getKategori()
  }, [])

  return (
    <>
      <Layout>
        {/* Tooltip floating di luar table */}
        {tooltip.visible && (
          <div
            className="fixed z-50 bg-white border border-gray-300 shadow-lg rounded-md px-4 py-2 text-sm max-w-xs break-words"
            style={{ top: tooltip.top, left: tooltip.left }}
          >
            <div className="font-mono">{tooltip.uuid}</div>
            <button
              onClick={handleCloseTooltip}
              className="text-xs text-blue-500 mt-2 hover:underline"
            >
              Close
            </button>
          </div>
        )}

        {/* Header */}
        <div className="w-full h-15 bg-blue-gray-100 mt-15 rounded-md flex flex-row items-center justify-start px-5 gap-3">
          <RxHamburgerMenu className="text-xl font-semibold" />
          <p className="font-semibold">Management Camera</p>
        </div>

        {/* Table */}
        <div className="w-full h-auto bg-blue-gray-100 mt-5 rounded-md flex flex-col items-start justify-start p-5 gap-3">
          <button className="bg-blue-gray-200 px-3 py-2 rounded-md" onClick={handleNavigateAddCamera}>
            Add Camera
          </button>
          <div className="w-full">
            <div className="overflow-x-auto w-full bg-blue-gray-50 rounded-xl shadow-md">
              <table className="w-full table-auto">
                <thead className="bg-gray-100 text-left text-gray-600 text-sm font-semibold">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">UUID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Latitude</th>
                    <th className="px-4 py-3">Longitude</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {dataCam.map((data, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold">{index +1}</td>

                      {/* UUID button */}
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => handleShowTooltip(e, data.IDCAMERA)}
                          className=""
                        >
                        {data.IDCAMERA}
                        </button>
                      </td>

                      <td className="px-4 py-3">{data.NAME}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => handleShowTooltip(e, data.LOCATION)}
                          className=""
                        >
                          {data.LOCATION}
                        </button>
                      </td>
                      <td 
                        onClick={(e) => handleShowTooltip(e, data.COORDINATE.LATITUDE)} 
                        className="px-4 py-3"
                      >
                        {parseFloat(data.COORDINATE.LATITUDE).toFixed(3)}...
                      </td>
                      <td 
                        onClick={(e) => handleShowTooltip(e, data.COORDINATE.LONGITUDE)} 
                        className="px-4 py-3"
                      >
                        {parseFloat(data.COORDINATE.LONGITUDE).toFixed(3)}...
                      </td>
                      <td className="px-4 py-3 font-medium flex flex-row gap-3">
                        <button className="bg-yellow-400 px-2 py-1 rounded-md" onClick={() => handleNavigateEditCamera(data.UUID)}>
                          Edit
                        </button>
                        <button className="bg-red-400 px-2 py-1 rounded-md">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default RenamePage;
