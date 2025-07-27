const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up NextStep Full-Stack Application...\n');

// Create .env file from example
const envExamplePath = path.join(__dirname, 'server', '.env.example');
const envPath = path.join(__dirname, 'server', '.env');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Created server/.env file');
  console.log('⚠️  Please update the environment variables in server/.env\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Install dependencies
console.log('📦 Installing dependencies...');

try {
  console.log('Installing root dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  
  console.log('Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, 'frontend') });
  
  console.log('Installing backend dependencies...');
  execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, 'server') });
  
  console.log('\n✅ All dependencies installed successfully!\n');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Create README for setup instructions
const setupInstructions = `# NextStep - Full-Stack Application Setup

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

## Quick Setup

1. **Environment Configuration**
   - Copy \`server/.env.example\` to \`server/.env\`
   - Update the following variables in \`server/.env\`:
     - \`MONGODB_URI\`: Your MongoDB connection string
     - \`JWT_SECRET\`: A secure random string
     - \`CLOUDINARY_*\`: Your Cloudinary credentials (for file uploads)
     - \`SMTP_*\`: Your email service credentials

2. **Database Setup**
   - Make sure MongoDB is running
   - The application will create the database automatically

3. **Start the Application**
   \`\`\`bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately:
   # Backend (port 5000)
   npm run server
   
   # Frontend (port 5173)
   npm run client
   \`\`\`

## Features Included

### Authentication System
- JWT-based authentication
- Role-based access (Student/Industry Expert)
- Protected routes and middleware

### Student Features
- Profile management with skills and interests
- Achievement system with points and levels
- Learning analytics and progress tracking
- Course management and quiz system
- Leaderboard functionality

### Industry Expert Features
- Company profile management
- Student browsing and recruitment tools
- Analytics dashboard
- Messaging system

### Technical Features
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- File upload with Cloudinary
- Email notifications
- Rate limiting and security middleware
- Input validation and error handling

## API Endpoints

### Authentication
- \`POST /auth/register\` - User registration
- \`POST /auth/login\` - User login
- \`POST /auth/logout\` - User logout
- \`GET /auth/me\` - Get current user

### Profiles
- \`GET /profiles/me\` - Get user profile
- \`PUT /profiles/me\` - Update user profile
- \`GET /profiles/:id\` - Get public profile

### Users (Industry Experts only)
- \`GET /users/students\` - Browse students
- \`GET /users/leaderboard\` - Get student leaderboard

### Achievements
- \`GET /achievements/me\` - Get user achievements
- \`POST /achievements/check\` - Check for new achievements

### Analytics
- \`GET /analytics/me\` - Get user analytics
- \`POST /analytics/activity\` - Log user activity

### Additional Features
- File upload endpoints
- Course management
- Quiz system
- And more...

## Troubleshooting

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in .env

2. **Port Conflicts**
   - Frontend runs on port 5173
   - Backend runs on port 5000
   - Change ports in vite.config.ts and server/.env if needed

3. **Environment Variables**
   - Make sure all required variables are set in server/.env
   - Restart the server after changing environment variables

## Production Deployment

1. **Build the Frontend**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Set Production Environment Variables**
   - Update NODE_ENV to 'production'
   - Use production MongoDB URI
   - Set secure JWT_SECRET
   - Configure production CORS settings

3. **Deploy**
   - Frontend: Deploy to Vercel, Netlify, or similar
   - Backend: Deploy to Heroku, Railway, or similar
   - Database: Use MongoDB Atlas or similar cloud service

For more detailed information, check the documentation in the codebase.
`;

fs.writeFileSync(path.join(__dirname, 'SETUP.md'), setupInstructions);

console.log('📚 Setup Instructions:');
console.log('1. Update environment variables in server/.env');
console.log('2. Ensure MongoDB is running');
console.log('3. Run: npm run dev');
console.log('\n📖 For detailed setup instructions, see SETUP.md');
console.log('\n🎉 Setup complete! Your full-stack application is ready to use.');
