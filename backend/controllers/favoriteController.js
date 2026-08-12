const Favorite = require("../models/Favorite");

// @desc    Add property to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const existing = await Favorite.findOne({
      user: req.user._id,
      property: req.params.propertyId,
    });
    if (existing) {
      return res.status(400).json({ message: "Property already in favorites" });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property: req.params.propertyId,
    });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private
const removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user._id,
      property: req.params.propertyId,
    });
    res.json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's favorites
// @route   GET /api/favorites/my
// @access  Private
const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate({
      path: "property",
      populate: { path: "owner", select: "name email phone" },
    });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addFavorite, removeFavorite, getMyFavorites };
