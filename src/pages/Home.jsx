import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${roomId}`);
  };

  return (
    <div>
      <h2>Online Meeting</h2>
      <button onClick={createRoom}>Create Meeting</button>
    </div>
  );
}

export default Home;
