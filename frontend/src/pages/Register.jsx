import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "buyer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="name"
              required
              className="input-field"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="input-field"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="input-field"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              name="phone"
              className="input-field"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
            <select name="role" className="input-field" value={form.role} onChange={handleChange}>
              <option value="buyer">Buyer / Renter</option>
              <option value="owner">Property Owner</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
