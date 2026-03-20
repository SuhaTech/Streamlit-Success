const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const DepartmentMentor = require("../models/DepartmentMentor");
const {
  applyToJob, getMyApplications, getApplicants, updateApplicationStatus,
  getAllApplications, quickApply, mentorApproveApplication, mentorRejectApplication,
  getMyScheduledInterviews
} = require("../controllers/applicationController");

router.post("/quick",        protect, authorize("student"),                          quickApply);
router.post("/:jobId/apply", protect, authorize("student"),                          applyToJob);
router.post("/",             protect, authorize("student"),                          applyToJob);
router.get("/mine", protect, async (req,res)=>{
  
  const applications = await Application
  .find({ studentId:req.user._id })
  .populate("jobId","title company location stipend")
  .sort({createdAt:-1})

  res.json({ applications })

}),
router.get("/all",           protect, authorize("mentor", "placement_cell", "hod", "dean"), getAllApplications);
router.get("/job/:jobId",    protect, authorize("recruiter"),                        getApplicants)
router.get("/scheduled/mine", protect, authorize("recruiter", "placement_cell"),    getMyScheduledInterviews);
router.put("/:id/mentor-approve", protect, authorize("mentor"),                      mentorApproveApplication);
router.put("/:id/mentor-reject",  protect, authorize("mentor"),                      mentorRejectApplication);
router.put("/:id/status",    protect, authorize("recruiter"),                        updateApplicationStatus);
router.put("/schedule-interview/:jobId", protect, authorize("recruiter", "placement_cell"), async (req, res) => {
  try {

    const { date, time, mode, meetingLink, location } = req.body;
    const jobId = req.params.jobId;

    // Fetch targeted applications before update to notify exact users.
    const targetApplications = await Application.find({ jobId, status: "interview" })
      .populate("studentId", "_id department")
      .populate("jobId", "title company");

    if (!targetApplications.length) {
      return res.status(404).json({ message: "No interview-ready applications found for this job" });
    }

    const applicationIds = targetApplications.map((app) => app._id);

    const applications = await Application.updateMany(
      { _id: { $in: applicationIds } },
      {
        status: "interview_scheduled",
        interviewScheduled: true,
        interviewScheduledBy: req.user?._id,
        interview: {
          date,
          time,
          mode,
          meetingLink,
          location
        }
      }
    );

    const interviewMeta = [date, time, mode].filter(Boolean).join(" | ");

    // Notify students whose interviews were scheduled.
    const studentNotifications = targetApplications
      .filter((app) => app.studentId?._id)
      .map((app) => {
        const roleText = app.jobId?.title || "Job";
        const companyText = app.jobId?.company || "Company";
        return Notification.send(
          app.studentId._id,
          "interview_scheduled",
          "Interview Scheduled",
          `Your interview for ${roleText} at ${companyText} is scheduled${interviewMeta ? ` (${interviewMeta})` : ""}.`,
          "/student/dashboard"
        );
      });

    // Notify mentors of impacted departments once per department.
    const impactedDepartments = [
      ...new Set(
        targetApplications
          .map((app) => app.studentId?.department)
          .filter(Boolean)
      ),
    ];

    const mentorAssignments = await DepartmentMentor.find({ department: { $in: impactedDepartments } })
      .select("mentorId department");

    const mentorNotifications = mentorAssignments
      .filter((assignment) => assignment.mentorId)
      .map((assignment) =>
        Notification.send(
          assignment.mentorId,
          "interview_scheduled",
          "Students Interview Scheduled",
          `Interviews have been scheduled for students in ${assignment.department}${interviewMeta ? ` (${interviewMeta})` : ""}.`,
          "/mentor/dashboard"
        )
      );

    await Promise.all([...studentNotifications, ...mentorNotifications]);

    res.json({
      message: "Interview scheduled for selected students",
      applications
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
