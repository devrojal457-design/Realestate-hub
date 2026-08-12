import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
