const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const ROLES = require("../constants/roles");
const {
  createLog, getMyLogs, getStudentLogs, reviewLog, sendLogReminder,
} = require("../controllers/logController");

router.post("/",              protect, authorize(ROLES.STUDENT), createLog);
router.get("/mine",           protect, authorize(ROLES.STUDENT), getMyLogs);
router.get("/students",       protect, authorize(ROLES.INTERNAL_GUIDE), getStudentLogs);
router.get("/student/:studentId", protect, authorize(ROLES.INTERNAL_GUIDE), getStudentLogs);
router.put("/:id/review",    protect, authorize(ROLES.INTERNAL_GUIDE), reviewLog);
router.post("/reminder",      protect, authorize(ROLES.INTERNAL_GUIDE), sendLogReminder);

module.exports = router;
