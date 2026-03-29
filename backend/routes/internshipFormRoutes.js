const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  submitForm,
  getForms,
  approveForm,
  getGuides,
  deleteFormById,
} = require("../controllers/internshipFormController");

router.post("/", protect, submitForm);
router.get("/", protect, getForms);
router.get("/guides", protect, getGuides);
router.put("/:id/approve", protect, approveForm);
router.delete("/:id", protect, authorize("placement_cell", "admin"), deleteFormById);

module.exports = router;
