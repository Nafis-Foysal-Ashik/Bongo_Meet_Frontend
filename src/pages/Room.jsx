import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import {
  MicrophoneIcon,
  VideoCameraIcon,
  LinkIcon,
  ComputerDesktopIcon,
  HandRaisedIcon,
  PhoneXMarkIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";

/* 🔹 Create socket OUTSIDE component (IMPORTANT) */
const socket = io("http://localhost:5000", {
  autoConnect: false,
});

function Room() {
  const videoRef = useRef(null);
  const screenVideoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(1);

  const { roomId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  /* 🔒 Protect room */
  useEffect(() => {
    if (!user) {
      toast.error("Please login to join the meeting");
      navigate("/login");
      return;
    }
  }, [navigate, user]);

  /* 🎥 Camera & Mic */
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setIsAudioOn(mediaStream.getAudioTracks()[0]?.enabled ?? true);
        setIsVideoOn(mediaStream.getVideoTracks()[0]?.enabled ?? true);
      })
      .catch(() => toast.error("Camera or microphone access denied"));
  }, []);

  /* 🔌 Socket Join Room */
  useEffect(() => {
    if (!user) return;

    socket.connect();

    socket.emit("join-room", {
      roomId,
      userName: user.name,
    });

    socket.on("participants-update", (count) => {
      setParticipantsCount(count);
    });

    return () => {
      socket.off("participants-update");
      socket.disconnect();
    };
  }, [roomId, user]);

  /* 🎤 Toggle Audio */
  const toggleAudio = () => {
    if (!stream) return;

    const track = stream.getAudioTracks()[0];
    track.enabled = !track.enabled;

    setIsAudioOn(track.enabled);
    toast.success(track.enabled ? "Microphone unmuted" : "Microphone muted");
  };

  /* 📷 Toggle Video */
  const toggleVideo = () => {
    if (!stream) return;

    const track = stream.getVideoTracks()[0];
    track.enabled = !track.enabled;

    setIsVideoOn(track.enabled);
    toast(track.enabled ? "Camera turned on" : "Camera turned off", {
      icon: track.enabled ? "📷" : "🚫",
    });
  };

  /* ✋ Hand Raise */
  const toggleHandRaise = () => {
    setIsHandRaised((prev) => !prev);
    toast(isHandRaised ? "Hand lowered" : "Hand raised");
  };

  /* 🔗 Share Link */
  const shareLink = () => {
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link);
    toast.success("Meeting link copied");
  };

  /* 🖥️ Screen Share */
  const startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      setScreenStream(displayStream);

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = displayStream;
      }

      toast.success("Screen sharing started");
    } catch {
      toast.error("Screen sharing cancelled");
    }
  };

  /* 🚪 Leave Meeting */
  const leaveMeeting = () => {
    toast.error("You left the meeting");

    stream?.getTracks().forEach((t) => t.stop());
    screenStream?.getTracks().forEach((t) => t.stop());

    socket.disconnect();

    setTimeout(() => navigate("/"), 700);
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* 🎥 VIDEO AREA */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        {isVideoOn ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full max-w-4xl rounded-xl object-cover"
          />
        ) : (
          <img
            src="https://img.icons8.com/?size=1200&id=dJimH2tu43l4&format=jpg"
            alt="Camera off"
            className="w-40 h-40 rounded-full"
          />
        )}

        {screenStream && (
          <video
            ref={screenVideoRef}
            autoPlay
            playsInline
            className="w-full max-w-4xl rounded-xl border border-gray-700"
          />
        )}
      </div>

      {/* 🎛️ CONTROL BAR */}
      <div className="h-20 bg-gradient-to-r from-zinc-900 to-zinc-800 flex items-center justify-center gap-6">
        <IconButton onClick={toggleAudio} danger={!isAudioOn}>
          <MicrophoneIcon className="h-6 w-6" />
        </IconButton>

        <IconButton onClick={toggleVideo} danger={!isVideoOn}>
          <VideoCameraIcon className="h-6 w-6" />
        </IconButton>

        <IconButton onClick={shareLink}>
          <LinkIcon className="h-6 w-6" />
        </IconButton>

        <IconButton onClick={startScreenShare}>
          <ComputerDesktopIcon className="h-6 w-6" />
        </IconButton>

        <IconButton onClick={toggleHandRaise} active={isHandRaised}>
          <HandRaisedIcon className="h-6 w-6" />
        </IconButton>

        {/* 👥 PARTICIPANTS */}
        <IconButton>
          <div className="relative">
            <UsersIcon className="h-6 w-6" />
            <span className="absolute -top-1 -right-2 bg-blue-600 text-xs px-1.5 py-0.5 rounded-full">
              {participantsCount}
            </span>
          </div>
        </IconButton>

        {/* ⛔ LEAVE */}
        <button
          onClick={leaveMeeting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-medium transition-all hover:scale-105 active:scale-95"
        >
          <PhoneXMarkIcon className="h-5 w-5" />
          Leave
        </button>
      </div>
    </div>
  );
}

/* 🔘 ICON BUTTON */
function IconButton({ children, onClick, danger, active }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative h-12 w-12 rounded-full
        flex items-center justify-center
        transition-all duration-200
        ${danger ? "bg-red-600 hover:bg-red-700" : "bg-zinc-800 hover:bg-zinc-700"}
        ${active ? "ring-2 ring-yellow-400" : ""}
        hover:scale-110 active:scale-95
      `}
    >
      {children}
      {danger && (
        <span className="absolute w-8 h-[2px] bg-white rotate-45" />
      )}
    </button>
  );
}

export default Room;
