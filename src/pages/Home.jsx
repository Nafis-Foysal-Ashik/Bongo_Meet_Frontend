import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Instant meeting
  const createInstantMeeting = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${roomId}`);
  };

  // Meeting for later
  const createMeetingForLater = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link);
    alert("Meeting link copied for later!");
    setShowOptions(false);
  };

  // Join meeting
  const joinMeeting = () => {
    if (!roomCode.trim()) return;
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 🔹 TOP NAVBAR */}
      <div className="h-16 px-6 flex items-center justify-between border-b">
        {/* Left Logo */}
        <div className="flex cursor-pointer items-center gap-2">
          <img onClick={() => navigate('/')}
            src="https://img.freepik.com/premium-vector/m-letter-meeting-logo-template_1193009-58.jpg"
            alt="Meeting Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="font-semibold text-lg">Bongo Meet</span>
        </div>

        {/* Center Time & Date */}
        <div className="text-gray-600 text-sm md:text-base">
          {formattedTime} • {formattedDate}
        </div>

        {/* Right Profile */}
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
          alt="Profile"
          className="h-9 w-9 rounded-full cursor-pointer"
        />
      </div>

      {/* 🔹 MAIN CONTENT */}
      <div className="flex items-center justify-center px-10 h-[calc(100vh-4rem)]">

        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          
          {/* Left Section */}
          <div>
            <h1 className="text-4xl md:text-5xl font-medium mb-6">
              Video calls and meetings for everyone
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Connect, collaborate, and celebrate from anywhere with your
              meeting app.
            </p>

            <div className="flex flex-wrap items-center gap-4 relative">
              {/* New Meeting Button */}
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                New meeting
              </button>

              {/* Dropdown */}
              <div
  className={`
    absolute top-14 left-0 w-64 bg-white border rounded-lg shadow-lg z-10
    transform transition-all duration-200 ease-out
    ${showOptions ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
  `}
>
  <button
    onClick={createInstantMeeting}
    className="w-full text-left px-4 py-3 hover:bg-gray-100"
  >
    🚀 Create an instant meeting
  </button>
  <hr />
  <button
    onClick={createMeetingForLater}
    className="w-full text-left px-4 py-3 hover:bg-gray-100"
  >
    📅 Create a meeting for later
  </button>
</div>


              {/* Join Meeting */}
              <input
                type="text"
                placeholder="Enter a code or link"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="border border-gray-300 px-4 py-3 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={joinMeeting}
                className="text-blue-600 font-medium hover:underline"
              >
                Join
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex justify-center">
            <div className="w-72 h-72 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
              <img src="https://media.tenor.com/ACwD8kk3y1YAAAAm/meeting-time-meeting.webp" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
