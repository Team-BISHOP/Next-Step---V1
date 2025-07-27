const express = require('express');
const multer = require('multer');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   POST /api/upload/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', [auth, upload.single('avatar')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // In a production environment, you would upload to cloud storage (Cloudinary, AWS S3, etc.)
    // For this example, we'll simulate a successful upload
    
    const fileName = `avatar_${req.user._id}_${Date.now()}.${req.file.mimetype.split('/')[1]}`;
    const avatarUrl = `/uploads/avatars/${fileName}`;

    // Here you would typically:
    // 1. Upload file to cloud storage
    // 2. Get the public URL
    // 3. Update user profile with the URL

    // For demo purposes, we'll return a mock URL
    const mockAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.user._id}`;

    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl: mockAvatarUrl
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB' });
    }
    
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// @route   POST /api/upload/project
// @desc    Upload project files
// @access  Private
router.post('/project', [auth, upload.array('files', 5)], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map(file => {
      const fileName = `project_${req.user._id}_${Date.now()}_${file.originalname}`;
      return {
        originalName: file.originalname,
        fileName,
        size: file.size,
        mimetype: file.mimetype,
        url: `/uploads/projects/${fileName}`
      };
    });

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload project error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

module.exports = router;
