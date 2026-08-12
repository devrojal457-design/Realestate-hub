import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-white text-xl font-bold mb-2">RealEstateHub</h3>
          <p className="text-sm text-gray-400">
            Find, list, and manage properties for rent or sale — all in one place.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="text-sm space-y-1 text-gray-400">
            <li>Browse Properties</li>
            <li>List Your Property</li>
            <li>How It Works</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <p className="text-sm text-gray-400">support@realestatehub.com</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-800">
        © {new Date().getFullYear()} RealEstate Hub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
