const express = require('express');
const { body, validationResult } = require('express-validator');
const Activity = require('../models/Activity');
const Profile = require('../models/Profile');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Mock quiz questions
const quizQuestions = [
  {
    id: 1,
    question: "What interests you most about technology?",
    options: [
      "Building websites and applications",
      "Protecting systems from cyber threats",
      "Analyzing data to find patterns",
      "Creating intelligent systems and AI"
    ]
  },
  {
    id: 2,
    question: "How do you prefer to work?",
    options: [
      "In teams, collaborating on projects",
      "Independently, focusing on security",
      "With data and numbers",
      "On cutting-edge research and development"
    ]
  },
  {
    id: 3,
    question: "What type of problems do you enjoy solving?",
    options: [
      "User experience and interface challenges",
      "Security vulnerabilities and threats",
      "Complex data analysis puzzles",
      "Algorithm optimization and AI challenges"
    ]
  },
  {
    id: 4,
    question: "Which work environment appeals to you?",
    options: [
      "Startup or tech company",
      "Government or security firm",
      "Research institution or corporation",
      "AI/ML company or tech giant"
    ]
  },
  {
    id: 5,
    question: "What motivates you most?",
    options: [
      "Creating useful applications for people",
      "Keeping organizations safe from threats",
      "Discovering insights from data",
      "Pushing the boundaries of what's possible with AI"
    ]
  }
];

const careerPaths = [
  "Software Engineer",
  "Cybersecurity Specialist",
  "Data Scientist",
  "AI/ML Engineer"
];

// @route   GET /api/quiz/questions
// @desc    Get quiz questions
// @access  Public
router.get('/questions', (req, res) => {
  try {
    res.json({
      questions: quizQuestions,
      totalQuestions: quizQuestions.length
    });
  } catch (error) {
    console.error('Get quiz questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/quiz/submit
// @desc    Submit quiz answers and get career recommendation
// @access  Public (can be taken by non-authenticated users)
router.post('/submit', [
  body('answers')
    .isArray({ min: 5, max: 5 })
    .withMessage('Must provide exactly 5 answers'),
  body('answers.*')
    .isInt({ min: 0, max: 3 })
    .withMessage('Each answer must be between 0 and 3')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { answers } = req.body;

    // Calculate career path based on answers
    const answerCounts = answers.reduce((acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {});

    const maxIndex = Object.keys(answerCounts).reduce((a, b) => 
      answerCounts[parseInt(a)] > answerCounts[parseInt(b)] ? a : b
    );

    const recommendedPath = careerPaths[parseInt(maxIndex)];

    // Career path details
    const pathDetails = {
      "Software Engineer": {
        description: "Build applications, websites, and software systems that solve real-world problems.",
        skills: ["JavaScript", "Python", "React", "Node.js", "Database Design"],
        averageSalary: "LKR 600,000 - 2,000,000",
        jobGrowth: "High",
        companies: ["Virtusa", "WSO2", "IFS", "CodeGen"]
      },
      "Cybersecurity Specialist": {
        description: "Protect organizations from cyber threats and ensure data security.",
        skills: ["Network Security", "Ethical Hacking", "Risk Assessment", "Incident Response"],
        averageSalary: "LKR 800,000 - 2,500,000",
        jobGrowth: "Very High",
        companies: ["Dialog", "SLT", "Commercial Bank", "Sampath Bank"]
      },
      "Data Scientist": {
        description: "Analyze complex data to extract insights and drive business decisions.",
        skills: ["Python", "R", "Machine Learning", "Statistics", "SQL"],
        averageSalary: "LKR 700,000 - 2,200,000",
        jobGrowth: "Very High",
        companies: ["John Keells", "MAS Holdings", "Brandix", "Hemas"]
      },
      "AI/ML Engineer": {
        description: "Develop intelligent systems and machine learning applications.",
        skills: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "Neural Networks"],
        averageSalary: "LKR 900,000 - 3,000,000",
        jobGrowth: "Extremely High",
        companies: ["99X Technology", "Pearson", "WSO2", "Sysco Labs"]
      }
    };

    const result = {
      recommendedPath,
      confidence: Math.max(...Object.values(answerCounts)) / answers.length,
      details: pathDetails[recommendedPath],
      allPaths: careerPaths.map(path => ({
        name: path,
        score: (answerCounts[careerPaths.indexOf(path)] || 0) / answers.length,
        details: pathDetails[path]
      })).sort((a, b) => b.score - a.score)
    };

    // If user is authenticated, save the quiz completion
    if (req.user) {
      // Create activity
      await new Activity({
        user: req.user._id,
        type: 'quiz_completed',
        description: `Completed career assessment quiz - Recommended: ${recommendedPath}`,
        pointsEarned: 100,
        metadata: {
          recommendedPath,
          confidence: result.confidence,
          answers
        }
      }).save();

      // Add points to profile
      const profile = await Profile.findOne({ user: req.user._id });
      if (profile) {
        await profile.addPoints(100);
      }
    }

    res.json({
      message: 'Quiz completed successfully',
      result
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/quiz/results/:userId
// @desc    Get user's quiz results history
// @access  Private
router.get('/results/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if user can access this data
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const quizResults = await Activity.find({
      user: userId,
      type: 'quiz_completed'
    }).sort({ createdAt: -1 });

    res.json({
      results: quizResults.map(result => ({
        id: result._id,
        completedAt: result.createdAt,
        recommendedPath: result.metadata?.recommendedPath,
        confidence: result.metadata?.confidence,
        pointsEarned: result.pointsEarned
      }))
    });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
