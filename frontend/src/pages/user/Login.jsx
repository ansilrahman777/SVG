import React, { useState } from "react";
import PublicAPI from "../../api/publicApi";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await PublicAPI.post("login/", { email, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user_email", res.data.user.email);

      alert("Login Successful!");
      navigate("/user/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto mt-12 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full p-2 bg-blue-600 text-white rounded">Login</button>
      </form>

      {/* Forgot Password link */}
      <div className="mt-4 text-center">
        <Link to="/user/request-otp" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
