/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';

const LiveCam = ({ camera, onBack }) => {
  const imgRef = useRef(null);
  const wsRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // mulai loading tiap kali kamera berubah

    const ws = new WebSocket("ws://192.168.7.175:3000");
    ws.binaryType = 'arraybuffer';

    let currentUrl = null;

    ws.onopen = () => {
      // Kirim pesan subscribe kamera
      ws.send(JSON.stringify({ subscribe: camera.IDCAMERA }));
    };

    ws.onmessage = (event) => {
      const blob = new Blob([event.data], { type: 'image/jpeg' });
      if (imgRef.current) {
        // Bersihkan URL lama jika ada
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }
        currentUrl = URL.createObjectURL(blob);

        // Set loading false hanya setelah gambar selesai load
        imgRef.current.onload = () => {
          setLoading(false);
          imgRef.current.onload = null; // hapus listener setelah trigger
        };

        imgRef.current.src = currentUrl;
      }
    };

    ws.onerror = () => {
      setLoading(true); // jika error, tampilkan loading terus
    };

    wsRef.current = ws;

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [camera.IDCAMERA]);

  return (
    <div className="w-[600px] h-[404px] bg-white rounded-md shadow-md flex flex-col items-center justify-center gap-4">
      <p className="text-sm font-semibold">Live Cam - {camera?.NAME}</p>

      <div className="relative w-[420px] h-[340px] border rounded-xl bg-black flex items-center justify-center"
     style={{ backgroundColor: loading ? 'white' : 'black' }}>
  {loading && (
    <div className="absolute z-10 flex items-center justify-center text-black">
      <span>Loading...</span>
    </div>
  )}
  <img
    ref={imgRef}
    alt="Camera Stream"
    className="w-full h-full object-contain"
    style={{ 
      visibility: loading ? 'hidden' : 'visible',
      transition: 'visibility 0.3s ease'
    }}
  />
</div>

      <button
        onClick={onBack}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Map
      </button>
    </div>
  );
};

export default LiveCam;
