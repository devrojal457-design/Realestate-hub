import React, { useEffect, useState } from "react";
import api from "../services/api";
import PropertyCard from "../components/PropertyCard";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await api.get("/favorites/my");
        setFavorites(data.filter((f) => f.property));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : favorites.length === 0 ? (
        <p className="text-gray-500">You haven't saved any properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((f) => (
            <PropertyCard key={f._id} property={f.property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
