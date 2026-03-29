const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');
const {
	getReviewSchedule,
	upsertAttendance,
	getAttendanceHistory,
	deleteAttendanceRecord,
	notifyReviewSchedule,
	shareAttendanceReport,
	getSharedReports,
} = require('../controllers/reviewScheduleController');

router.get('/', protect, authorize('internal_guide'), getReviewSchedule);
router.get('/shared-reports/list', protect, authorize('dean', 'hod'), getSharedReports);
router.get('/history', protect, authorize('internal_guide'), getAttendanceHistory);
router.delete('/history/:id', protect, authorize('internal_guide'), deleteAttendanceRecord);
router.put('/attendance', protect, authorize('internal_guide'), upsertAttendance);
router.post('/notify', protect, authorize('internal_guide'), notifyReviewSchedule);
router.post('/share-report', protect, authorize('internal_guide'), shareAttendanceReport);

module.exports = router;
