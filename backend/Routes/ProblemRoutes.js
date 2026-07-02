const express = require('express');
const router = express.Router();
const { verifyUser, requireRole } = require("../middleware/VerifyUser");
const Problem = require("../models/problem");
const Registration = require("../models/Registartion"); // ✅ Added for city check

// ✅ POST route to create a new problem with city check
router.post("/create", verifyUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { City } = req.body;

    // 🔍 1. Find user registration data
    const regData = await Registration.findOne({ user: userId });

    if (!regData) {
      return res.status(404).json({ msg: "User not registered. Please complete registration." });
    }

    // 🔐 2. Check city match
    if (City !== regData.city) {
      return res.status(403).json({
        msg: `❌ You can only create problems in your registered city: ${regData.city}`,
      });
    }

    // ✅ 3. Create the problem
    const newProblem = new Problem({
      ...req.body,
      PostedBy: userId
    });

    await newProblem.save();
    res.status(201).json({ message: "✅ Problem created", problem: newProblem });

  } catch (error) {
    console.error("❌ Problem creation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET all problems
router.get('/problems', async (req, res) => {
  try {
    const problems = await Problem.find().populate('PostedBy', 'username isAnonymous');
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});
router.get('/my-problems', verifyUser, async (req, res) => {
  try {
    const userId = req.userId;
    const myproblem = await Problem.find({ PostedBy: userId })
                                   .populate('PostedBy', 'username'); // ✅ this line
    res.json(myproblem);
  } catch (err) {
    console.error("❌ Error fetching my problems:", err);
    res.status(500).json({ msg: 'data not found' });
  }
});


// ✅ GET problem by ID
router.get('/problems/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json({
      ...problem.toObject(),
      Likes: problem.Likes,
      Dislikes: problem.Dislikes
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

router.put('/problems/:id/edit', verifyUser, async (req, res) => {
  try {
    const userId = req.userId;
    const updates = req.body;

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const isCreator = problem.PostedBy.toString() === userId.toString();
    const isAdmin = req.role === 'admin';
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "You are not allowed to edit this card." });
    }

    Object.assign(problem, updates); // Merge the updated fields
    await problem.save(); // Save the updated document

    res.status(201).json({ message: "✅ Data updated successfully", updated: problem });

  } catch (err) {
    console.error("❌ Edit error:", err);
    res.status(500).json({ message: "Server error while editing", error: err.message });
  }
});


// routes/problem.js ya jaha bhi vote logic likhte ho

router.post('/vote/:id', verifyUser, async (req, res) => {
  try {
    const userId = req.userId;
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Prevent creator from voting on their own problem
    if (problem.PostedBy.toString() === userId.toString()) {
      return res.status(403).json({ message: "You cannot vote on your own problem." });
    }

    // Check if user already voted
    if (problem.Votes.includes(userId)) {
      return res.status(400).json({ message: "You have already voted." });
    }

    // Check if user's city matches problem's city
    const Registration = require('../models/Registartion');
    const regData = await Registration.findOne({ user: userId });
    if (!regData) {
      return res.status(403).json({ message: "User registration not found." });
    }
    if (regData.city.toLowerCase() !== problem.City.toLowerCase()) {
      return res.status(403).json({ message: `You can only vote on problems in your registered city: ${regData.city}` });
    }

    // Add vote
    problem.Votes.push(userId);
    await problem.save();

    res.status(200).json({ message: "Vote added successfully." });
  } catch (err) {
    console.error("❌ Voting Error:", err);
    res.status(500).json({ message: "Server error while voting." });
  }
});

// Remove vote (dislike)
router.post('/unvote/:id', verifyUser, async (req, res) => {
  try {
    const userId = req.userId;
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Check if user has voted
    if (!problem.Votes.includes(userId)) {
      return res.status(400).json({ message: "You have not voted on this problem." });
    }

    // Remove vote
    problem.Votes = problem.Votes.filter(voterId => voterId.toString() !== userId.toString());
    await problem.save();

    res.status(200).json({ message: "Vote removed successfully.", votes: problem.Votes.length });
  } catch (err) {
    console.error("❌ Unvote Error:", err);
    res.status(500).json({ message: "Server error while removing vote." });
  }
});

// Like a problem
router.post('/like/:id', verifyUser, async (req, res) => {
  try {
    const userId = req.userId;
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    // Add to Likes, remove from Dislikes
    if (!problem.Likes.includes(userId)) {
      problem.Likes.push(userId);
    }
    problem.Dislikes = problem.Dislikes.filter(id => id.toString() !== userId.toString());
    await problem.save();
    res.status(200).json({ message: "Liked", likes: problem.Likes.length, dislikes: problem.Dislikes.length });
  } catch (err) {
    console.error("❌ Like error:", err);
    res.status(500).json({ message: "Server error while liking." });
  }
});

// Dislike (boycott) a problem
router.post('/dislike/:id', verifyUser, async (req, res) => {
  try {
    const userId = req.userId;
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    // Add to Dislikes, remove from Likes
    if (!problem.Dislikes.includes(userId)) {
      problem.Dislikes.push(userId);
    }
    problem.Likes = problem.Likes.filter(id => id.toString() !== userId.toString());
    await problem.save();
    res.status(200).json({ message: "Disliked", likes: problem.Likes.length, dislikes: problem.Dislikes.length });
  } catch (err) {
    console.error("❌ Dislike error:", err);
    res.status(500).json({ message: "Server error while disliking." });
  }
});







// ✅ PATCH: Enable voting by creator only
router.patch('/enable-voting/:id', verifyUser, async (req, res) => {
  try {
    const userId = req.userId;
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
 console.log("🔍 Backend userId:", userId);
    console.log("🔍 problem.PostedBy:", problem.PostedBy);
    // 🔐 Only creator can enable voting
    if (problem.PostedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not allowed to enable voting on this problem." });
    }

    problem.isVotingEnabled = true; //coting enable ho jayegi
    await problem.save();

    res.status(200).json({ message: "✅ Voting enabled successfully." });
  } catch (err) {
    console.error("❌ Enable voting error:", err);
    res.status(500).json({ message: "Server error while enabling voting." });
  }
});

// PATCH: Disable voting by creator only
router.patch('/disable-voting/:id', verifyUser, async (req, res) => {
  try {
    const userId = req.userId;
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    // Only creator can disable voting
    if (problem.PostedBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not allowed to disable voting on this problem." });
    }
    problem.isVotingEnabled = false;//voting`disable ho jayegi
    await problem.save();
    res.status(200).json({ message: "🚫 Voting disabled successfully." });
  } catch (err) {
    console.error("❌ Disable voting error:", err);
    res.status(500).json({ message: "Server error while disabling voting." });
  }
});

router.delete('/problem/:id', verifyUser, async (req, res) => {
  try {
    const userId = req.userId;
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "problem is not found" });
    }
    const isCreator = problem.PostedBy.toString() === userId.toString();
    const isAdmin = req.role === 'admin';
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "You are not creator so you are no delete the problem" });
    }
    await Problem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "problem deleted successfully" });
  } catch (err) {
    console.error("❌ Delete problem error:", err);
    res.status(500).json({ message: "Server error while deleting problem." });
  }
});

router.patch('/problems/:id/status', verifyUser, requireRole('admin', 'mla', 'govt_employee'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const allowedStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    if (req.role === 'mla' || req.role === 'govt_employee') {
      const regData = await Registration.findOne({ user: req.userId });
      if (!regData) {
        return res.status(403).json({ message: "User registration not found." });
      }
      if (regData.city.toLowerCase() !== problem.City.toLowerCase()) {
        return res.status(403).json({
          message: `You can only manage problems in your registered city: ${regData.city}`,
        });
      }
    }

    problem.status = status;
    if (remarks !== undefined) {
      problem.remarks = remarks;
    }
    await problem.save();

    res.status(200).json({ message: "Status updated successfully", problem });
  } catch (err) {
    console.error("❌ Status update error:", err);
    res.status(500).json({ message: "Server error while updating status." });
  }
});










module.exports = router;
