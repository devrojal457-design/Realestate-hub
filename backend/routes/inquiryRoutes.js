const express = require("express");
const router = express.Router();
const {
  createInquiry,
  getSentInquiries,
  getReceivedInquiries,
  replyToInquiry,
} = require("../controllers/inquiryController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createInquiry);
router.get("/sent", protect, getSentInquiries);
router.get("/received", protect, getReceivedInquiries);
router.put("/:id/reply", protect, replyToInquiry);

module.exports = router;
