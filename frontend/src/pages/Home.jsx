import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/PropertyCard";

const Home = () => {
  const [keyword, setKeyword] = useState("");
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/properties?limit=6&sort=-createdAt");
        setFeatured(data.properties);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary to-primary-light text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-lg mb-8 text-teal-50">
            Browse thousands of listings for rent and sale, or list your own property in minutes.
          </p>
          <form
            onSubmit={handleSearch}
            className="max-w-xl mx-auto flex bg-white rounded-lg overflow-hidden shadow-lg"
          >
            <input
              type="text"
              placeholder="Search by city, title, or keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 px-4 py-3 text-gray-800 focus:outline-none"
            />
            <button type="submit" className="bg-primary-dark px-6 font-medium hover:bg-gray-900">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Featured listings */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Latest Listings</h2>
          <button
            onClick={() => navigate("/properties")}
            className="text-primary font-medium hover:underline"
          >
            View All →
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading properties...</p>
        ) : featured.length === 0 ? (
          <p className="text-gray-500">No properties listed yet. Be the first to add one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="font-semibold text-lg mb-1">Search Properties</h3>
            <p className="text-gray-500 text-sm">
              Filter by city, price, type, and amenities to find your ideal match.
            </p>
          </div>
          <div>
            <div className="text-4xl mb-2">💬</div>
            <h3 className="font-semibold text-lg mb-1">Inquire Instantly</h3>
            <p className="text-gray-500 text-sm">
              Message property owners directly and get quick responses.
            </p>
          </div>
          <div>
            <div className="text-4xl mb-2">🏠</div>
            <h3 className="font-semibold text-lg mb-1">List Your Property</h3>
            <p className="text-gray-500 text-sm">
              Owners can list and manage properties with an easy dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
