const Notification = require("../models/Notification");
const User = require("../models/User");

// GET /api/notifications/mine
exports.getMyNotifications = async (req, res) => {
  try {
    const { read, type, limit } = req.query;
    const filter = { userId: req.user._id };

    if (read === 'true') filter.read = true;
    if (read === 'false') filter.read = false;
    if (type) filter.type = type;

    const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 50));

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parsedLimit),
      Notification.countDocuments({ userId: req.user._id, read: false }),
    ]);

    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Not found' });
    res.json({ notification: notif });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/notifications/read-all
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/notifications/broadcast — placement_cell only
exports.broadcast = async (req, res) => {
  try {
    const { title, message, targetRole } = req.body;
    const filter = targetRole ? { role: targetRole } : {};
    const users = await User.find(filter).select('_id');

    const notifications = users.map(u => ({
      userId: u._id, type: 'announcement', title, message, link: '',
    }));

    await Notification.insertMany(notifications);
    res.json({ message: `Broadcast sent to ${users.length} users` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
