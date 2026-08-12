const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");

// @desc    Send inquiry about a property
// @route   POST /api/inquiries
// @access  Private
const createInquiry = async (req, res) => {
  try {
    const { propertyId, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot inquire about your own property" });
    }

    const inquiry = await Inquiry.create({
      property: propertyId,
      sender: req.user._id,
      receiver: property.owner,
      message,
    });

    const populated = await inquiry.populate([
      { path: "property", select: "title images" },
      { path: "sender", select: "name email phone" },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inquiries sent by logged-in user (as buyer)
// @route   GET /api/inquiries/sent
// @access  Private
const getSentInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ sender: req.user._id })
      .populate("property", "title images price")
      .populate("receiver", "name email phone")
      .sort("-createdAt");
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inquiries received by logged-in user (as owner)
// @route   GET /api/inquiries/received
// @access  Private
const getReceivedInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ receiver: req.user._id })
      .populate("property", "title images price")
      .populate("sender", "name email phone")
      .sort("-createdAt");
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to an inquiry (owner only)
// @route   PUT /api/inquiries/:id/reply
// @access  Private
const replyToInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    if (inquiry.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to reply to this inquiry" });
    }

    inquiry.reply = req.body.reply;
    inquiry.status = "replied";
    await inquiry.save();

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInquiry, getSentInquiries, getReceivedInquiries, replyToInquiry };
