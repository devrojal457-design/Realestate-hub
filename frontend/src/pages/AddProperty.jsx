import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const initialForm = {
  title: "",
  description: "",
  price: "",
  type: "rent",
  category: "apartment",
  bedrooms: "",
  bathrooms: "",
  area: "",
  amenities: "",
  city: "",
  address: "",
  state: "",
  zipCode: "",
};

const AddProperty = () => {
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files).slice(0, 6));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      images.forEach((img) => formData.append("images", img));

      const { data } = await api.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/properties/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">List a New Property</h1>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" required className="input-field" value={form.title} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              required
              rows={4}
              className="input-field"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input
                type="number"
                name="price"
                required
                className="input-field"
                value={form.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Listing Type</label>
              <select name="type" className="input-field" value={form.type} onChange={handleChange}>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select name="category" className="input-field" value={form.category} onChange={handleChange}>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Area (sqft)</label>
              <input type="number" name="area" className="input-field" value={form.area} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                className="input-field"
                value={form.bedrooms}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                className="input-field"
                value={form.bathrooms}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amenities (comma-separated)</label>
            <input
              name="amenities"
              placeholder="Parking, Pool, Gym, WiFi"
              className="input-field"
              value={form.amenities}
              onChange={handleChange}
            />
          </div>

          <hr />
          <h3 className="font-semibold">Location</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input name="city" required className="input-field" value={form.city} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input name="state" className="input-field" value={form.state} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                name="address"
                required
                className="input-field"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Zip Code</label>
              <input name="zipCode" className="input-field" value={form.zipCode} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Images (up to 6)</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="input-field" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Publishing..." : "Publish Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
