import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Checking Full-Stack Application Setup...\n');

// Check if all critical files exist
const criticalFiles = [
  'server/package.json',
  'server/server.js',
  'server/.env.example',
  'server/models/User.js',
  'server/models/Profile.js',
  'server/routes/auth.js',
  'server/routes/profiles.js',
  'server/middleware/auth.js',
  'src/lib/api.ts',
  'src/hooks/useAuth.tsx'
];

let allFilesExist = true;

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('\n📊 Setup Summary:');
console.log(`Files checked: ${criticalFiles.length}`);
console.log(`Status: ${allFilesExist ? '✅ All critical files present' : '❌ Some files missing'}`);

if (allFilesExist) {
  console.log('\n🎉 Full-Stack Application Setup Complete!');
  console.log('\n📝 Next Steps:');
  console.log('1. Copy server/.env.example to server/.env');
  console.log('2. Update environment variables in server/.env');
  console.log('3. Ensure MongoDB is running');
  console.log('4. Run: npm run dev:fullstack');
  console.log('\n🌐 Access your application at:');
  console.log('- Frontend: http://localhost:5173');
  console.log('- Backend API: http://localhost:5000');
} else {
  console.log('\n⚠️ Please check the missing files and run the setup again.');
}

// Show directory structure
console.log('\n📁 Project Structure:');
console.log('📦 NextStep (Full-Stack)');
console.log('├── 📁 src/ (React Frontend)');
console.log('│   ├── 📁 components/ (UI Components)');
console.log('│   ├── 📁 hooks/ (React Hooks)');
console.log('│   ├── 📁 lib/ (API Client)');
console.log('│   └── 📁 pages/ (Route Components)');
console.log('├── 📁 server/ (Express Backend)');
console.log('│   ├── 📁 models/ (MongoDB Models)');
console.log('│   ├── 📁 routes/ (API Routes)');
console.log('│   ├── 📁 middleware/ (Auth & Security)');
console.log('│   └── server.js (Main Server)');
console.log('├── 📄 package.json (Frontend deps)');
console.log('└── 📄 setup.js (Setup script)');

console.log('\n🔗 API Endpoints Available:');
console.log('- POST /auth/register - User registration');
console.log('- POST /auth/login - User login');
console.log('- GET /auth/me - Current user');
console.log('- GET /profiles/me - User profile');
console.log('- PUT /profiles/me - Update profile');
console.log('- GET /users/students - Browse students');
console.log('- GET /achievements/me - User achievements');
console.log('- GET /analytics/me - User analytics');
console.log('- And more...');
