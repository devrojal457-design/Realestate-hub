import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import Dashboard from "./pages/Dashboard";
import MyInquiries from "./pages/MyInquiries";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />

          <Route
            path="/add-property"
            element={
              <PrivateRoute roles={["owner", "admin"]}>
                <AddProperty />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-property/:id"
            element={
              <PrivateRoute roles={["owner", "admin"]}>
                <EditProperty />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={["owner", "admin"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/inquiries"
            element={
              <PrivateRoute>
                <MyInquiries />
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
