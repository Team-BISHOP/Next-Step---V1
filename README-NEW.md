# NextStep - Career Development Platform 🚀

A comprehensive full-stack application connecting ICT students with industry professionals in Sri Lanka. Built with React, Node.js, Express, and MongoDB.

## 🌟 Features

### For Students
- **Personalized Learning Paths**: AI-driven career recommendations
- **Skill Assessment**: Interactive quizzes and skill tracking
- **Achievement System**: Points, levels, and gamification
- **Portfolio Management**: Showcase projects and skills
- **Industry Connections**: Browse and connect with professionals
- **Analytics Dashboard**: Track learning progress and performance

### For Industry Experts
- **Student Discovery**: Browse talented students by skills and interests
- **Company Profiles**: Showcase company culture and opportunities
- **Recruitment Tools**: Advanced filtering and search capabilities
- **Analytics**: Track engagement and recruitment metrics
- **Messaging System**: Direct communication with students

### Technical Features
- **Full-Stack Architecture**: React frontend with Node.js/Express backend
- **Authentication**: JWT-based authentication with role-based access control
- **Real-time Features**: Live updates and notifications
- **File Management**: Secure file uploads with Cloudinary integration
- **Database**: MongoDB with Mongoose ODM
- **Security**: Rate limiting, CORS, input validation, and security headers
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **React Router** for navigation
- **React Hook Form** for form management
- **Sonner** for notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for file uploads
- **Nodemailer** for email notifications
- **Express-validator** for input validation
- **Helmet** for security headers
- **Express-rate-limit** for rate limiting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-step-v1
   ```

2. **Run the setup script**
   ```bash
   npm run setup
   ```

3. **Configure environment variables**
   - Copy `server/.env.example` to `server/.env`
   - Update the required environment variables:
     ```env
     MONGODB_URI=mongodb://localhost:27017/nextstep_dev
     JWT_SECRET=your-super-secret-jwt-key
     CLOUDINARY_CLOUD_NAME=your-cloudinary-name
     CLOUDINARY_API_KEY=your-api-key
     CLOUDINARY_API_SECRET=your-api-secret
     ```

4. **Install dependencies**
   ```bash
   npm run install:all
   ```

5. **Start the development servers**
   ```bash
   npm run dev:fullstack
   ```

   Or start them separately:
   ```bash
   # Backend (port 5000)
   npm run server:dev
   
   # Frontend (port 5173)
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
📦 NextStep
├── 📁 public/              # Static assets
├── 📁 src/                 # Frontend source code
│   ├── 📁 components/      # React components
│   │   ├── 📁 ui/         # shadcn/ui components
│   │   └── ...            # Custom components
│   ├── 📁 hooks/          # Custom React hooks
│   ├── 📁 lib/            # Utility functions and API client
│   ├── 📁 pages/          # Page components
│   └── 📁 integrations/   # External service integrations
├── 📁 server/             # Backend source code
│   ├── 📁 models/         # MongoDB models
│   ├── 📁 routes/         # API routes
│   ├── 📁 middleware/     # Express middleware
│   ├── 📁 uploads/        # File upload directory
│   └── server.js          # Main server file
└── 📄 setup.js           # Project setup script
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `PUT /auth/change-password` - Change password

### Profiles
- `GET /profiles/me` - Get user profile
- `PUT /profiles/me` - Update user profile
- `GET /profiles/:id` - Get public profile

### Users
- `GET /users/students` - Browse students (Industry experts only)
- `GET /users/leaderboard` - Get student leaderboard

### Achievements
- `GET /achievements/me` - Get user achievements
- `POST /achievements/check` - Check for new achievements

### Analytics
- `GET /analytics/me` - Get user analytics
- `POST /analytics/activity` - Log user activity

### File Upload
- `POST /upload/avatar` - Upload profile picture
- `POST /upload/project` - Upload project files

### Courses & Quizzes
- `GET /courses` - Get available courses
- `POST /quiz/submit` - Submit quiz answers
- `GET /quiz/:id/results` - Get quiz results

## 🔐 Authentication & Authorization

The application uses JWT-based authentication with role-based access control:

- **Students**: Can access learning materials, take quizzes, and view industry experts
- **Industry Experts**: Can browse students, view analytics, and access recruitment tools

Protected routes automatically redirect unauthenticated users to the login page.

## 📊 Database Schema

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'industry_expert',
  fullName: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

### Profile Model
```javascript
{
  userId: ObjectId (ref: User),
  // Student fields
  university: String,
  yearOfStudy: Number,
  major: String,
  skills: [String],
  careerInterests: [String],
  githubUsername: String,
  linkedinUrl: String,
  points: Number,
  level: Number,
  // Industry Expert fields
  company: String,
  position: String,
  industry: String,
  experience: String,
  // Common fields
  bio: String,
  avatarUrl: String,
  location: String
}
```

## 🔧 Development

### Adding New Features

1. **Frontend**: Add new components in `src/components/`
2. **Backend**: Create new routes in `server/routes/`
3. **Database**: Add new models in `server/models/`

### Testing

```bash
# Frontend tests
npm test

# Backend tests
cd server && npm test
```

### Building for Production

```bash
# Build frontend
npm run build

# The build output will be in the 'dist' folder
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy the `server` folder
3. Ensure MongoDB is accessible

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-secure-jwt-secret
CLIENT_URL=your-frontend-domain
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@nextstep.lk or join our Slack channel.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the amazing development experience

---

Built with ❤️ for the Sri Lankan ICT community
