import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();

  // Frontend validation
  if (!name.trim()) {
    toast.error("Name is required");
    return;
  }

  if (!email.trim()) {
    toast.error("Email is required");
    return;
  }

  if (!password.trim()) {
    toast.error("Password is required");
    return;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name,
        email,
        password,
      }
    );

    toast.success(res.data.message);

    // Clear form
    setName("");
    setEmail("");
    setPassword("");

    // Optional redirect
    // navigate("/login");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Registration failed"
    );
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create your Bongo Meeting account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border  focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-black text-white py-3 font-medium transition"
          >
            Register
          </button>
        </form>

        {/* Already have account */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
