import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Home() {
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  /* ---------------- TIME ---------------- */
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

  /* ---------------- AUTH GUARD ---------------- */
  const requireAuth = () => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return false;
    }
    return true;
  };

  /* ---------------- MEETING LOGIC ---------------- */
  const createInstantMeeting = () => {
    if (!requireAuth()) return;
    const roomId = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${roomId}`);
  };

  const createMeetingForLater = () => {
    if (!requireAuth()) return;
    const roomId = Math.random().toString(36).substring(2, 8);
    const link = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(link);
    toast.success("Meeting link copied!");
    setShowOptions(false);
  };

  const joinMeeting = () => {
    if (!requireAuth()) return;
    if (!roomCode.trim()) return;
    navigate(`/room/${roomCode}`);
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 🔹 TOP NAVBAR */}
      <div className="h-16 px-6 flex items-center justify-between border-b">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://img.freepik.com/premium-vector/m-letter-meeting-logo-template_1193009-58.jpg"
            alt="Meeting Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="font-semibold text-lg">Bongo Meet</span>
        </Link>

        {/* Time */}
        <div className="text-gray-600">
          {formattedTime} • {formattedDate}
        </div>

        {/* Profile / Login */}
        <div className="relative">
          {user ? (
            <>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="font-medium text-gray-800 hover:text-blue-600"
              >
                Hello , {user.name}
              </button>

              {/* Dropdown */}
              <div
                className={`absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg transform transition-all duration-200
                ${showProfileMenu ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
              >
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* 🔹 MAIN CONTENT */}
      <div className="flex items-center justify-center px-10 h-[calc(100vh-4rem)]">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          {/* Left */}
          <div>
            <h1 className="text-4xl md:text-5xl font-medium mb-6">
              Video calls and meetings for everyone
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Connect, collaborate, and celebrate from anywhere.
            </p>

            <div className="flex flex-wrap items-center gap-4 relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                New meeting
              </button>

              {/* Dropdown */}
              <div
                className={`absolute top-14 left-0 w-64 bg-white border rounded-lg shadow-lg transition-all duration-200
                ${showOptions ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
              >
                <button
                  onClick={createInstantMeeting}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100"
                >
                  Create an instant meeting
                </button>
                <button
                  onClick={createMeetingForLater}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100"
                >
                  Create a meeting for later
                </button>
              </div>

              <input
                type="text"
                placeholder="Enter meeting ID"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="border px-4 py-3 rounded-lg w-64"
              />

              <button
                onClick={joinMeeting}
                className="text-blue-600 hover:underline"
              >
                Join
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="flex justify-center">
            <div className="w-72 h-72 bg-blue-100 rounded-full flex items-center justify-center">
              <img
                src="https://media.tenor.com/ACwD8kk3y1YAAAAm/meeting-time-meeting.webp"
                alt=""
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
