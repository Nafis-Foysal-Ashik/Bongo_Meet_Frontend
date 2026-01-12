import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

  // Create new meeting
  const createMeeting = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${roomId}`);
  };

  // Join existing meeting
  const joinMeeting = () => {
    if (!roomCode.trim()) return;
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-10">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left Section */}
        <div>
          <h1 className="text-4xl md:text-5xl font-medium mb-6">
            Video calls and meetings for everyone
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Connect, collaborate, and celebrate from anywhere with your meeting
            app.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={createMeeting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              New meeting
            </button>

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
            Meeting Illustration
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
