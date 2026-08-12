import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { getUploadsUrl } from "../services/api";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          type: data.type,
          category: data.category,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.area,
          amenities: (data.amenities || []).join(", "),
          city: data.location?.city || "",
          address: data.location?.address || "",
          state: data.location?.state || "",
          zipCode: data.location?.zipCode || "",
          status: data.status,
        });
        setExistingImages(data.images || []);
      } catch (err) {
        setError("Failed to load property");
      }
    };
    fetchProperty();
  }, [id]);

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

      await api.put(`/properties/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/properties/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update property");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <p className="text-center py-16 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Property</h1>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}

        {existingImages.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {existingImages.map((img, idx) => (
              <img
                key={idx}
                src={`${getUploadsUrl()}${img}`}
                className="h-20 w-28 object-cover rounded-lg"
                alt={`existing-${idx}`}
              />
            ))}
          </div>
        )}

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
              <label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" className="input-field" value={form.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="sold">Sold</option>
              </select>
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
              className="input-field"
              value={form.amenities}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input name="city" required className="input-field" value={form.city} onChange={handleChange} />
            </div>
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Add More Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="input-field" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
