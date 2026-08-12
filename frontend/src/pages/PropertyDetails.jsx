import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { getUploadsUrl } from "../services/api";
import { useAuth } from "../context/AuthContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState("");
  const [inquiryError, setInquiryError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;
      try {
        const { data } = await api.get("/favorites/my");
        setIsFavorite(data.some((f) => f.property?._id === id));
      } catch (error) {
        console.error(error);
      }
    };
    checkFavorite();
  }, [user, id]);

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    setInquiryError("");
    setInquirySuccess("");
    if (!user) {
      navigate("/login");
      return;
    }
    setSending(true);
    try {
      await api.post("/inquiries", { propertyId: id, message });
      setInquirySuccess("Inquiry sent successfully! The owner will contact you soon.");
      setMessage("");
    } catch (error) {
      setInquiryError(error.response?.data?.message || "Failed to send inquiry");
    } finally {
      setSending(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center py-16 text-gray-500">Loading...</p>;
  if (!property) return <p className="text-center py-16 text-gray-500">Property not found.</p>;

  const images = property.images && property.images.length > 0 ? property.images : [];
  const mainImage = images.length > 0 ? `${getUploadsUrl()}${images[activeImage]}` : "https://placehold.co/800x500?text=No+Image";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/properties" className="text-primary text-sm hover:underline">
        ← Back to Properties
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Left: images + details */}
        <div className="lg:col-span-2">
          <div className="rounded-xl overflow-hidden bg-gray-100 h-96">
            <img src={mainImage} alt={property.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={`${getUploadsUrl()}${img}`}
                  onClick={() => setActiveImage(idx)}
                  className={`h-20 w-28 object-cover rounded-lg cursor-pointer border-2 ${
                    idx === activeImage ? "border-primary" : "border-transparent"
                  }`}
                  alt={`thumbnail-${idx}`}
                />
              ))}
            </div>
          )}

          <div className="mt-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{property.title}</h1>
                <p className="text-gray-500">
                  {property.location?.address}, {property.location?.city}
                  {property.location?.state ? `, ${property.location.state}` : ""}
                </p>
              </div>
              <button onClick={toggleFavorite} className="text-2xl">
                {isFavorite ? "❤️" : "🤍"}
              </button>
            </div>

            <p className="text-primary text-3xl font-bold mt-3">
              ${property.price?.toLocaleString()}
              {property.type === "rent" && <span className="text-base font-normal">/mo</span>}
            </p>

            <div className="flex gap-6 mt-4 text-gray-700">
              <span>🛏 {property.bedrooms} Bedrooms</span>
              <span>🛁 {property.bathrooms} Bathrooms</span>
              <span>📐 {property.area} sqft</span>
            </div>

            <h3 className="font-semibold mt-6 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{property.description}</p>

            {property.amenities && property.amenities.length > 0 && (
              <>
                <h3 className="font-semibold mt-6 mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: owner + inquiry */}
        <div>
          <div className="bg-white shadow-md rounded-xl p-5 mb-4">
            <h3 className="font-semibold mb-2">Listed By</h3>
            <p className="text-gray-800 font-medium">{property.owner?.name}</p>
            <p className="text-gray-500 text-sm">{property.owner?.email}</p>
            {property.owner?.phone && (
              <p className="text-gray-500 text-sm">{property.owner.phone}</p>
            )}
          </div>

          {user?._id !== property.owner?._id && (
            <div className="bg-white shadow-md rounded-xl p-5">
              <h3 className="font-semibold mb-3">Interested? Send an Inquiry</h3>
              {inquirySuccess && (
                <div className="bg-green-50 text-green-700 text-sm p-2 rounded mb-3">
                  {inquirySuccess}
                </div>
              )}
              {inquiryError && (
                <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-3">{inquiryError}</div>
              )}
              <form onSubmit={handleSendInquiry}>
                <textarea
                  required
                  rows={4}
                  placeholder="Hi, I'm interested in this property..."
                  className="input-field mb-3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" disabled={sending} className="btn-primary w-full">
                  {sending ? "Sending..." : user ? "Send Inquiry" : "Login to Inquire"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
