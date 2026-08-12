const Property = require("../models/Property");

// @desc    Get all properties with search/filter/pagination
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const {
      keyword,
      city,
      type,
      category,
      minPrice,
      maxPrice,
      bedrooms,
      status,
      page = 1,
      limit = 9,
      sort = "-createdAt",
    } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { "location.city": { $regex: keyword, $options: "i" } },
      ];
    }
    if (city) query["location.city"] = { $regex: city, $options: "i" };
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate("owner", "name email phone")
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Property.countDocuments(query),
    ]);

    res.json({
      properties,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email phone avatar"
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create property
// @route   POST /api/properties
// @access  Private (owner, admin)
const createProperty = async (req, res) => {
  try {
    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const {
      title,
      description,
      price,
      type,
      category,
      bedrooms,
      bathrooms,
      area,
      amenities,
      city,
      address,
      state,
      zipCode,
    } = req.body;

    const property = await Property.create({
      title,
      description,
      price,
      type,
      category,
      bedrooms,
      bathrooms,
      area,
      amenities: amenities ? amenities.split(",").map((a) => a.trim()) : [],
      location: { city, address, state, zipCode },
      images,
      owner: req.user._id,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (owner of property, admin)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this property" });
    }

    const updatableFields = [
      "title",
      "description",
      "price",
      "type",
      "category",
      "bedrooms",
      "bathrooms",
      "area",
      "status",
    ];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) property[field] = req.body[field];
    });

    if (req.body.amenities) {
      property.amenities = req.body.amenities.split(",").map((a) => a.trim());
    }

    if (req.body.city || req.body.address || req.body.state || req.body.zipCode) {
      property.location = {
        city: req.body.city || property.location.city,
        address: req.body.address || property.location.address,
        state: req.body.state || property.location.state,
        zipCode: req.body.zipCode || property.location.zipCode,
      };
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((f) => `/uploads/${f.filename}`);
      property.images = [...property.images, ...newImages];
    }

    const updated = await property.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (owner of property, admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this property" });
    }

    await property.deleteOne();
    res.json({ message: "Property removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get properties listed by logged-in owner
// @route   GET /api/properties/my/listings
// @access  Private (owner)
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort("-createdAt");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
