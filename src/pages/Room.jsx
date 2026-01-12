import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Room() {
  const videoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [handRaised, setHandRaised] = useState(false);

  const { roomId } = useParams();
  const navigate = useNavigate();

  // Get camera & microphone
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.error("Media error:", err);
      });
  }, []);

  // Toggle microphone
  const toggleAudio = () => {
    if (!stream) return;
    stream.getAudioTracks()[0].enabled =
      !stream.getAudioTracks()[0].enabled;
  };

  // Toggle camera
  const toggleVideo = () => {
    if (!stream) return;
    stream.getVideoTracks()[0].enabled =
      !stream.getVideoTracks()[0].enabled;
  };

  // Share meeting link
  const shareLink = () => {
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link);
    alert("Meeting link copied!");
  };

  // Screen sharing
  const startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setScreenStream(displayStream);
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = displayStream;
      }
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  // Raise hand
  const toggleHandRaise = () => {
    setHandRaised(!handRaised);
  };

  // Leave meeting
  const leaveMeeting = () => {
    stream?.getTracks().forEach((track) => track.stop());
    screenStream?.getTracks().forEach((track) => track.stop());
    navigate("/");
  };

  return (
    <div style={{ height: "100vh", background: "#000", color: "#fff" }}>
      {/* Video Area */}
      <div style={{ textAlign: "center", paddingTop: "20px" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "60%", borderRadius: "10px" }}
        />

        {screenStream && (
          <video
            ref={screenVideoRef}
            autoPlay
            playsInline
            style={{
              width: "60%",
              marginTop: "10px",
              borderRadius: "10px",
            }}
          />
        )}
      </div>

      {/* Bottom Control Bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          background: "#1f1f1f",
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          padding: "15px",
        }}
      >
        <button onClick={toggleAudio}>🎤</button>
        <button onClick={toggleVideo}>📷</button>
        <button onClick={shareLink}>🔗</button>
        <button onClick={startScreenShare}>🖥️</button>
        <button onClick={toggleHandRaise}>
          ✋ {handRaised ? "Lower" : "Raise"}
        </button>
        <button
          onClick={leaveMeeting}
          style={{ background: "red", color: "white" }}
        >
          ⛔ Leave
        </button>
      </div>
    </div>
  );
}

export default Room;
