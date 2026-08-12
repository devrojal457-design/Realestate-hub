import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/PropertyCard";

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    city: "",
    type: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });

  const fetchProperties = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append("page", pageNum);
      params.append("limit", 9);

      const { data } = await api.get(`/properties?${params.toString()}`);
      setProperties(data.properties);
      setPages(data.pages);
      setPage(data.page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    fetchProperties(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchProperties(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Properties</h1>

      {/* Filters */}
      <form
        onSubmit={handleApplyFilters}
        className="bg-white shadow-sm rounded-xl p-4 mb-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3"
      >
        <input
          name="keyword"
          placeholder="Keyword"
          value={filters.keyword}
          onChange={handleFilterChange}
          className="input-field col-span-2"
        />
        <input
          name="city"
          placeholder="City"
          value={filters.city}
          onChange={handleFilterChange}
          className="input-field"
        />
        <select name="type" value={filters.type} onChange={handleFilterChange} className="input-field">
          <option value="">Any Type</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="input-field"
        >
          <option value="">Any Category</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>
        <input
          name="minPrice"
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="input-field"
        />
        <input
          name="maxPrice"
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="input-field"
        />
        <button type="submit" className="btn-primary col-span-2 md:col-span-1">
          Apply
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading properties...</p>
      ) : properties.length === 0 ? (
        <p className="text-gray-500">No properties found matching your criteria.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchProperties(p)}
                  className={`px-3 py-1 rounded-lg border ${
                    p === page ? "bg-primary text-white border-primary" : "border-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Properties;
