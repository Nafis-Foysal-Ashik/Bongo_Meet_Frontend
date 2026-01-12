import { useEffect, useRef } from "react";

function Room() {
  const videoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <div>
      <h2>Meeting Room</h2>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default Room;
