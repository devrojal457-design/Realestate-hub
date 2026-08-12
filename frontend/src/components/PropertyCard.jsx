import React from "react";
import { Link } from "react-router-dom";
import { getUploadsUrl } from "../services/api";

const PropertyCard = ({ property }) => {
  const image =
    property.images && property.images.length > 0
      ? `${getUploadsUrl()}${property.images[0]}`
      : "https://placehold.co/600x400?text=No+Image";

  return (
    <Link to={`/properties/${property._id}`} className="card block">
      <div className="h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-lg text-gray-800 truncate">{property.title}</h3>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              property.type === "rent"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {property.type === "rent" ? "For Rent" : "For Sale"}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-2">
          {property.location?.city}, {property.location?.address}
        </p>
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
          <span>🛏 {property.bedrooms} Beds</span>
          <span>🛁 {property.bathrooms} Baths</span>
          <span>📐 {property.area} sqft</span>
        </div>
        <p className="text-primary font-bold text-xl">
          ${property.price?.toLocaleString()}
          {property.type === "rent" && <span className="text-sm font-normal">/mo</span>}
        </p>
      </div>
    </Link>
  );
};

export default PropertyCard;
