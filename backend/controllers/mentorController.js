const User = require('../models/User');
const DepartmentMentor = require('../models/DepartmentMentor');

const DEPARTMENTS = ['SOCSET', 'SOTE', 'SOB', 'SAAD'];
const Application = require("../models/Application");

// Get all mentor assignments
exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await DepartmentMentor.find()
      .populate('mentorId', 'name email')
      .populate('assignedBy', 'name')
      .sort({ department: 1 });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mentors', error: err.message });
  }
};

// Get mentor for specific department
exports.getMentorByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    if (!DEPARTMENTS.includes(department)) {
      return res.status(400).json({ message: 'Invalid department' });
    }

    const mentor = await DepartmentMentor.findOne({ department })
      .populate('mentorId', 'name email')
      .populate('assignedBy', 'name');
    
    if (!mentor) {
      return res.status(404).json({ message: 'No mentor assigned for this department' });
    }

    res.json(mentor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch mentor', error: err.message });
  }
};

// Assign mentor to department
exports.assignMentor = async (req, res) => {
  try {
    const { department, mentorName, mentorEmail } = req.body;
    const placementCellUserId = req.user._id;

    // Validate department
    if (!DEPARTMENTS.includes(department)) {
      return res.status(400).json({ message: 'Invalid department' });
    }

    // Check if mentor already assigned to this department
    let existingMentor = await DepartmentMentor.findOne({ department });
    if (existingMentor) {
      return res.status(409).json({ message: 'Mentor already assigned to this department. Use update instead.' });
    }

    // Try to find user with this email
    let mentorUser = await User.findOne({ email: mentorEmail });

    // Create department mentor assignment
    const newMentor = new DepartmentMentor({
      department,
      mentorName,
      mentorEmail,
      mentorId: mentorUser ? mentorUser._id : null,
      assignedBy: placementCellUserId,
    });

    await newMentor.save();

    // If mentor user exists, update their role to mentor if not already
    if (mentorUser && mentorUser.role !== 'mentor') {
      mentorUser.role = 'mentor';
      mentorUser.department = department;
      await mentorUser.save();
    }

    res.status(201).json({
      message: 'Mentor assigned successfully',
      mentor: await newMentor.populate(['mentorId', 'assignedBy']),
    });
  } catch (err) {
    console.error('Error assigning mentor:', err);
    res.status(500).json({ message: 'Failed to assign mentor', error: err.message, details: err.toString() });
  }
};

// Update mentor for department
exports.updateMentor = async (req, res) => {
  try {
    const { department } = req.params;
    const { mentorName, mentorEmail } = req.body;

    // Validate department
    if (!DEPARTMENTS.includes(department)) {
      return res.status(400).json({ message: 'Invalid department' });
    }

    let mentor = await DepartmentMentor.findOne({ department });
    if (!mentor) {
      return res.status(404).json({ message: 'No mentor assignment found for this department' });
    }

    // Find new mentor user if email changed
    let mentorUser = await User.findOne({ email: mentorEmail });

    mentor.mentorName = mentorName;
    mentor.mentorEmail = mentorEmail;
    mentor.mentorId = mentorUser ? mentorUser._id : null;

    await mentor.save();

    // If mentor user exists, update department assignment
    if (mentorUser) {
      // Remove department assignment from old mentor if they exist
      const oldMentor = await User.findOne({ department, role: 'mentor' });
      if (oldMentor && oldMentor._id.toString() !== mentorUser._id.toString()) {
        oldMentor.department = undefined;
        await oldMentor.save();
      }

      // Assign new mentor to department
      mentorUser.role = 'mentor';
      mentorUser.department = department;
      await mentorUser.save();
    }

    res.json({
      message: 'Mentor updated successfully',
      mentor: await mentor.populate(['mentorId', 'assignedBy']),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update mentor', error: err.message });
  }
};

// Remove mentor assignment
exports.removeMentor = async (req, res) => {
  try {
    const { department } = req.params;

    // Validate department
    if (!DEPARTMENTS.includes(department)) {
      return res.status(400).json({ message: 'Invalid department' });
    }

    const mentor = await DepartmentMentor.findOne({ department });
    if (!mentor) {
      return res.status(404).json({ message: 'No mentor assignment found for this department' });
    }

    // Remove department assignment from mentor user
    if (mentor.mentorId) {
      await User.findByIdAndUpdate(mentor.mentorId, { $unset: { department: 1 } });
    }

    await DepartmentMentor.findByIdAndDelete(mentor._id);

    res.json({ message: 'Mentor assignment removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove mentor', error: err.message });
  }
};

// Get students for the mentor's own department
exports.getDepartmentStudents = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const department = req.user.department; // set by middleware/login

    if (!department) {
      return res.status(400).json({ message: 'Your mentor account is not associated with a department' });
    }

    // verify assignment still exists
    const mentorAssignment = await DepartmentMentor.findOne({ department, mentorId });
    if (!mentorAssignment) {
      return res.status(403).json({ message: 'You are not assigned to this department' });
    }

    // Fetch all students from this department
    const students = await User.find({ department, role: 'student' })
      .select('name email profile createdAt');

    res.json({ department, students });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch department students', error: err.message });
  }
};


exports.getInterviewStudents = async (req, res) => {
  try {
    // CRITICAL: Check if authentication middleware set req.user
    if (!req.user) {
      console.error('=== CRITICAL ERROR ===');
      console.error('req.user is undefined - authMiddleware failed to authenticate');
      console.error('Request headers:', {
        authorization: req.headers.authorization ? 'Present' : 'MISSING',
        cookie: req.headers.cookie ? 'Present' : 'MISSING'
      });
      return res.status(401).json({ 
        message: 'Authentication failed',
        debug: 'req.user is undefined - check if token was sent in Authorization header'
      });
    }

    const mentorId = req.user._id;
    let department = req.user.department;

    console.log('=== getInterviewStudents called ===');
    console.log('Step 1: mentorId:', mentorId, 'department from token:', department);

    // If no department in token, try to find it from DepartmentMentor collection
    if (!department) {
      console.log('Step 2a: No department in token, searching DepartmentMentor by mentorId...');
      const mentorAssignment = await DepartmentMentor.findOne({ mentorId });
      
      if (!mentorAssignment) {
        console.log('Step 2a ERROR: Mentor not found in any DepartmentMentor assignment');
        return res.status(403).json({ 
          message: 'Mentor not assigned to any department',
          debug: `No DepartmentMentor record for mentorId=${mentorId}`
        });
      }
      
      department = mentorAssignment.department;
      console.log('Step 2a SUCCESS: Found department from DepartmentMentor:', department);
    } else {
      console.log('Step 2b: Department found in token:', department);
    }

    // Now fetch students by department
    console.log('Step 3: Finding students with department:', department, ', role: student');
    const students = await User.find({ department, role: 'student' }).select('_id name email');
    console.log('Step 3 SUCCESS: Students found:', students.length);
    if (students.length > 0) {
      console.log('  Student names:', students.map(s => s.name).join(', '));
    }
    
    const studentIds = students.map((s) => s._id);

    if (!studentIds.length) {
      console.log('Step 4: No students in department - returning empty interviews');
      return res.json({ interviews: [], department });
    }

    console.log('Step 5: Building query for interviews with', studentIds.length, 'students');
    const queryFilter = {
      studentId: { $in: studentIds },
      $or: [
        { interviewScheduled: true },
        { 'interview.date': { $exists: true, $ne: null } },
      ],
    };
    console.log('Step 5: Query filter:', JSON.stringify(queryFilter, null, 2));

    console.log('Step 6: Executing find query...');
    const interviews = await Application.find(queryFilter);
    console.log('Step 6 SUCCESS: Found', interviews.length, 'applications with interview data');

    console.log('Step 7: Populating references...');
    const populatedInterviews = await Application.find(queryFilter)
      .populate('studentId', 'name email department')
      .populate('jobId', 'title company location')
      .sort({ 'interview.date': 1, 'interview.time': 1, createdAt: -1 })
      .lean();
    
    console.log('Step 7 SUCCESS: Populated interviews:', populatedInterviews.length);
    console.log('Step 8: Sending response to frontend...');
    res.json({ interviews: populatedInterviews, department });
    console.log('Step 8 SUCCESS: Response sent');
  } catch (err) {
    console.error('=== getInterviewStudents ERROR ===');
    console.error('Error message:', err.message);
    console.error('Error name:', err.name);
    console.error('Error stack:', err.stack);
    res.status(500).json({ 
      message: 'Failed to fetch scheduled interviews', 
      error: err.message
    });
  }
};