import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getUploadsUrl } from "../services/api";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/properties/my/listings");
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link to="/add-property" className="btn-primary">
          + Add Property
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : properties.length === 0 ? (
        <p className="text-gray-500">You haven't listed any properties yet.</p>
      ) : (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Price</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={
                        p.images?.[0]
                          ? `${getUploadsUrl()}${p.images[0]}`
                          : "https://placehold.co/100x70?text=No+Image"
                      }
                      className="w-16 h-12 object-cover rounded-md"
                      alt={p.title}
                    />
                    <span className="font-medium">{p.title}</span>
                  </td>
                  <td className="p-4">₹{p.price?.toLocaleString('en-IN')}</td>
                  <td className="p-4 capitalize">{p.type}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        p.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-3">
                    <Link to={`/properties/${p._id}`} className="text-primary text-sm hover:underline">
                      View
                    </Link>
                    <Link to={`/edit-property/${p._id}`} className="text-blue-600 text-sm hover:underline">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
