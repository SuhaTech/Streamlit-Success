const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const ROLES = require("../constants/roles");
const {
  getMyNotifications, markAsRead, markAllAsRead, broadcast,
} = require("../controllers/notificationController");

router.get("/mine",         protect, getMyNotifications);
router.put("/:id/read",    protect, markAsRead);
router.put("/read-all",    protect, markAllAsRead);
router.post("/broadcast",  protect, authorize(ROLES.PLACEMENT_CELL), broadcast);

module.exports = router;
