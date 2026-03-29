const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const {
  getAllUsers, getUserById, updateUserRole, deleteUser, getStats, assignMentorToStudent, getOfferLetterTracker, deleteStudentOfferLetter,
} = require("../controllers/adminController");

router.get("/users",           protect, authorize("placement_cell"), getAllUsers);
router.get("/users/:id",       protect, authorize("placement_cell"), getUserById);
router.put("/users/:id/role",  protect, authorize("placement_cell"), updateUserRole);
router.delete("/users/:id",    protect, authorize("placement_cell"), deleteUser);
router.get("/stats",           protect, authorize("placement_cell"), getStats);
router.get("/students/offer-letters", protect, authorize("placement_cell"), getOfferLetterTracker);
router.delete("/students/:studentId/offer-letter", protect, authorize("placement_cell", "admin"), deleteStudentOfferLetter);
router.put("/students/:studentId/assign-mentor", protect, authorize("placement_cell"), assignMentorToStudent);

module.exports = router;
