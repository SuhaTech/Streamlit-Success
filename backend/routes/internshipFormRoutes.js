const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  submitForm,
  getForms,
  approveForm,
  getGuides
} = require("../controllers/internshipFormController");

router.post("/", protect, submitForm);
router.get("/", protect, getForms);
router.get("/guides", protect, getGuides);
router.put("/:id/approve", protect, approveForm);

module.exports = router;
