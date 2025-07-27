const express = require('express');
const { auth, optional } = require('../middleware/auth');

const router = express.Router();

// Mock courses data
const coursesData = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    instructor: "Prof. Kasun Perera",
    description: "Learn to build complete web applications from frontend to backend using modern technologies.",
    duration: "12 weeks",
    level: "Intermediate",
    rating: 4.9,
    students: 1250,
    price: "Free",
    tags: ["JavaScript", "React", "Node.js", "MongoDB"],
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop",
    syllabus: [
      "HTML5 & CSS3 Fundamentals",
      "JavaScript ES6+",
      "React.js & State Management",
      "Node.js & Express",
      "Database Design & MongoDB",
      "Authentication & Security",
      "Deployment & DevOps"
    ]
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    instructor: "Dr. Sanduni Silva",
    description: "Introduction to machine learning concepts, algorithms, and practical applications.",
    duration: "10 weeks",
    level: "Advanced",
    rating: 4.8,
    students: 890,
    price: "LKR 15,000",
    tags: ["Python", "Machine Learning", "Data Science", "AI"],
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=250&fit=crop",
    syllabus: [
      "Introduction to ML",
      "Python for Data Science",
      "Supervised Learning",
      "Unsupervised Learning",
      "Deep Learning Basics",
      "Model Evaluation",
      "Real-world Projects"
    ]
  },
  {
    id: 3,
    title: "Cybersecurity Essentials",
    instructor: "Eng. Nuwan Fernando",
    description: "Learn the fundamentals of cybersecurity and how to protect digital assets.",
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.9,
    students: 1100,
    price: "LKR 12,000",
    tags: ["Security", "Network Security", "Ethical Hacking"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
    syllabus: [
      "Cybersecurity Foundations",
      "Network Security",
      "Cryptography Basics",
      "Web Application Security",
      "Incident Response",
      "Ethical Hacking",
      "Security Best Practices"
    ]
  },
  {
    id: 4,
    title: "Mobile App Development",
    instructor: "Eng. Chamara Rajapaksa",
    description: "Build cross-platform mobile applications using React Native.",
    duration: "14 weeks",
    level: "Intermediate",
    rating: 4.7,
    students: 750,
    price: "LKR 18,000",
    tags: ["React Native", "Mobile Development", "iOS", "Android"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    syllabus: [
      "React Native Fundamentals",
      "Navigation & UI Components",
      "State Management",
      "Native Device Features",
      "API Integration",
      "Testing & Debugging",
      "App Store Deployment"
    ]
  },
  {
    id: 5,
    title: "Data Analytics with Python",
    instructor: "Dr. Priyanka Wijesinghe",
    description: "Learn data analysis and visualization techniques using Python.",
    duration: "9 weeks",
    level: "Intermediate",
    rating: 4.8,
    students: 980,
    price: "Free",
    tags: ["Python", "Data Analysis", "Pandas", "Visualization"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    syllabus: [
      "Python Data Structures",
      "Pandas & NumPy",
      "Data Cleaning",
      "Exploratory Data Analysis",
      "Data Visualization",
      "Statistical Analysis",
      "Business Intelligence"
    ]
  }
];

// @route   GET /api/courses
// @desc    Get all courses with filtering and pagination
// @access  Public
router.get('/', optional, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      level, 
      tags, 
      instructor, 
      search,
      sortBy = 'rating'
    } = req.query;

    let filteredCourses = [...coursesData];

    // Apply filters
    if (level) {
      filteredCourses = filteredCourses.filter(course => 
        course.level.toLowerCase() === level.toLowerCase()
      );
    }

    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim().toLowerCase());
      filteredCourses = filteredCourses.filter(course =>
        course.tags.some(tag => tagList.includes(tag.toLowerCase()))
      );
    }

    if (instructor) {
      filteredCourses = filteredCourses.filter(course =>
        course.instructor.toLowerCase().includes(instructor.toLowerCase())
      );
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        filteredCourses.sort((a, b) => b.rating - a.rating);
        break;
      case 'students':
        filteredCourses.sort((a, b) => b.students - a.students);
        break;
      case 'title':
        filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'duration':
        filteredCourses.sort((a, b) => {
          const aDuration = parseInt(a.duration.split(' ')[0]);
          const bDuration = parseInt(b.duration.split(' ')[0]);
          return aDuration - bDuration;
        });
        break;
      default:
        filteredCourses.sort((a, b) => b.rating - a.rating);
    }

    // Apply pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    res.json({
      courses: paginatedCourses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredCourses.length,
        pages: Math.ceil(filteredCourses.length / parseInt(limit))
      },
      filters: {
        levels: ['Beginner', 'Intermediate', 'Advanced'],
        allTags: [...new Set(coursesData.flatMap(course => course.tags))],
        instructors: [...new Set(coursesData.map(course => course.instructor))]
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', optional, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = coursesData.find(c => c.id === courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get related courses (same tags or level)
    const relatedCourses = coursesData
      .filter(c => 
        c.id !== courseId && 
        (c.level === course.level || 
         c.tags.some(tag => course.tags.includes(tag)))
      )
      .slice(0, 3);

    res.json({
      course,
      relatedCourses
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private (students only)
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = coursesData.find(c => c.id === courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }

    // In a real application, you would:
    // 1. Check if user is already enrolled
    // 2. Process payment if required
    // 3. Create enrollment record
    // 4. Send confirmation email

    // Create activity
    const Activity = require('../models/Activity');
    await new Activity({
      user: req.user._id,
      type: 'course_started',
      description: `Enrolled in course: ${course.title}`,
      pointsEarned: 50,
      metadata: {
        courseId: course.id,
        courseTitle: course.title,
        instructor: course.instructor
      }
    }).save();

    // Add points to profile
    const Profile = require('../models/Profile');
    const profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      await profile.addPoints(50);
    }

    res.json({
      message: 'Successfully enrolled in course',
      course: {
        id: course.id,
        title: course.title,
        instructor: course.instructor,
        enrolledAt: new Date()
      }
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/featured
// @desc    Get featured courses
// @access  Public
router.get('/featured/list', (req, res) => {
  try {
    // Get top rated courses
    const featuredCourses = coursesData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);

    res.json({
      courses: featuredCourses
    });
  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
