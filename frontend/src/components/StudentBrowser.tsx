import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Leaderboard from "@/components/Leaderboard";
import { 
  Search, 
  Filter, 
  MapPin, 
  GraduationCap, 
  Award, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  Phone,
  TrendingUp,
  Trophy,
  Calendar,
  BookOpen,
  Code,
  Briefcase,
  Star,
  Eye,
  Users,
  BarChart3
} from "lucide-react";

// Enhanced interfaces for student data
interface SkillProgress {
  name: string;
  level: number;
  category: 'programming' | 'design' | 'data' | 'management' | 'soft';
  certifications: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'certification' | 'award' | 'project' | 'hackathon' | 'competition';
  issuer: string;
  credentialUrl?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  completedDate: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

interface LearningProgress {
  totalHours: number;
  completedCourses: number;
  inProgressCourses: number;
  skillsAcquired: number;
  projectsCompleted: number;
  certificationsEarned: number;
  monthlyProgress: { month: string; hours: number; }[];
  learningStreak: number;
  lastActiveDate: string;
}

interface Student {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  bio: string;
  avatar?: string;
  location: string;
  university: string;
  degree: string;
  yearOfStudy: string;
  careerPath: string;
  gpa?: number;
  skills: SkillProgress[];
  achievements: Achievement[];
  projects: Project[];
  learningProgress: LearningProgress;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  joinedDate: string;
  lastActive: string;
  isAvailableForWork: boolean;
  preferredJobTypes: string[];
  expectedSalary?: string;
  rating: number;
  totalViews: number;
  profileCompleteness: number;
}

// Mock student data with comprehensive profiles
const mockStudents: Student[] = [
  {
    id: "1",
    fullName: "Kavitha Perera",
    email: "kavitha.perera@uoc.lk",
    phone: "+94 77 123 4567",
    bio: "Passionate full-stack developer with a keen interest in AI and machine learning. Currently pursuing my final year in Computer Science with a focus on modern web technologies and data science.",
    avatar: "/api/placeholder/150/150",
    location: "Colombo, Sri Lanka",
    university: "University of Colombo",
    degree: "Computer Science",
    yearOfStudy: "4th Year",
    careerPath: "Full Stack Development",
    gpa: 3.8,
    skills: [
      { name: "React", level: 90, category: 'programming', certifications: ["React Developer Certification"] },
      { name: "Node.js", level: 85, category: 'programming', certifications: [] },
      { name: "Python", level: 80, category: 'programming', certifications: ["Python Institute PCAP"] },
      { name: "TypeScript", level: 75, category: 'programming', certifications: [] },
      { name: "MongoDB", level: 70, category: 'data', certifications: [] },
      { name: "UI/UX Design", level: 65, category: 'design', certifications: ["Google UX Design Certificate"] },
      { name: "Team Leadership", level: 80, category: 'soft', certifications: [] },
      { name: "Problem Solving", level: 90, category: 'soft', certifications: [] }
    ],
    achievements: [
      {
        id: "a1",
        title: "Best Final Year Project",
        description: "Awarded for developing an AI-powered learning management system",
        date: "2024-12-15",
        type: 'award',
        issuer: "University of Colombo",
        credentialUrl: "#"
      },
      {
        id: "a2",
        title: "AWS Solutions Architect Associate",
        description: "Cloud computing certification",
        date: "2024-10-20",
        type: 'certification',
        issuer: "Amazon Web Services",
        credentialUrl: "#"
      },
      {
        id: "a3",
        title: "Hackathon Winner",
        description: "1st place in Sri Lanka Tech Challenge 2024",
        date: "2024-08-15",
        type: 'hackathon',
        issuer: "Tech Lanka Foundation",
        credentialUrl: "#"
      }
    ],
    projects: [
      {
        id: "p1",
        title: "EduTrack - Learning Management System",
        description: "A comprehensive LMS with AI-powered personalized learning paths, real-time collaboration, and analytics dashboard",
        technologies: ["React", "Node.js", "MongoDB", "Socket.io", "TensorFlow.js"],
        githubUrl: "https://github.com/kavitha/edutrack",
        liveUrl: "https://edutrack-demo.vercel.app",
        image: "/api/placeholder/300/200",
        completedDate: "2024-12-10",
        complexity: 'advanced'
      },
      {
        id: "p2",
        title: "TaskMaster Pro",
        description: "A sophisticated project management tool with Kanban boards, time tracking, and team collaboration features",
        technologies: ["React", "Express.js", "PostgreSQL", "Redis"],
        githubUrl: "https://github.com/kavitha/taskmaster",
        liveUrl: "https://taskmaster-pro.netlify.app",
        image: "/api/placeholder/300/200",
        completedDate: "2024-09-20",
        complexity: 'intermediate'
      }
    ],
    learningProgress: {
      totalHours: 1250,
      completedCourses: 25,
      inProgressCourses: 3,
      skillsAcquired: 15,
      projectsCompleted: 12,
      certificationsEarned: 8,
      monthlyProgress: [
        { month: "Jan", hours: 80 },
        { month: "Feb", hours: 95 },
        { month: "Mar", hours: 110 },
        { month: "Apr", hours: 120 },
        { month: "May", hours: 105 },
        { month: "Jun", hours: 130 }
      ],
      learningStreak: 45,
      lastActiveDate: "2024-12-20"
    },
    linkedinUrl: "https://linkedin.com/in/kavitha-perera",
    githubUrl: "https://github.com/kavitha-perera",
    portfolioUrl: "https://kavitha-portfolio.dev",
    resumeUrl: "/resumes/kavitha-perera.pdf",
    joinedDate: "2024-01-15",
    lastActive: "2024-12-20",
    isAvailableForWork: true,
    preferredJobTypes: ["Full-time", "Internship", "Remote"],
    expectedSalary: "LKR 80,000 - 120,000",
    rating: 4.9,
    totalViews: 342,
    profileCompleteness: 95
  },
  {
    id: "2",
    fullName: "Dinesh Silva",
    email: "dinesh.silva@sliit.lk",
    phone: "+94 71 987 6543",
    bio: "Data science enthusiast with strong analytical skills and experience in machine learning. Passionate about extracting insights from complex datasets and building predictive models.",
    avatar: "/api/placeholder/150/150",
    location: "Kandy, Sri Lanka",
    university: "SLIIT",
    degree: "Data Science",
    yearOfStudy: "3rd Year",
    careerPath: "Data Science & Analytics",
    gpa: 3.9,
    skills: [
      { name: "Python", level: 95, category: 'programming', certifications: ["Python Institute PCEP", "PCAP"] },
      { name: "R", level: 80, category: 'programming', certifications: [] },
      { name: "Machine Learning", level: 85, category: 'data', certifications: ["Google ML Crash Course"] },
      { name: "SQL", level: 90, category: 'data', certifications: ["MySQL Certification"] },
      { name: "Tableau", level: 75, category: 'data', certifications: ["Tableau Desktop Specialist"] },
      { name: "TensorFlow", level: 80, category: 'data', certifications: [] },
      { name: "Statistical Analysis", level: 85, category: 'data', certifications: [] },
      { name: "Communication", level: 85, category: 'soft', certifications: [] }
    ],
    achievements: [
      {
        id: "a4",
        title: "Google Data Analytics Certificate",
        description: "Professional certificate in data analytics",
        date: "2024-11-30",
        type: 'certification',
        issuer: "Google",
        credentialUrl: "#"
      },
      {
        id: "a5",
        title: "Data Science Competition Winner",
        description: "2nd place in National Data Science Challenge",
        date: "2024-09-10",
        type: 'competition',
        issuer: "Data Science Society Sri Lanka",
        credentialUrl: "#"
      }
    ],
    projects: [
      {
        id: "p3",
        title: "COVID-19 Prediction Model",
        description: "Machine learning model to predict COVID-19 spread patterns using epidemiological data",
        technologies: ["Python", "Scikit-learn", "Pandas", "Matplotlib", "Streamlit"],
        githubUrl: "https://github.com/dinesh/covid-prediction",
        liveUrl: "https://covid-ml-model.streamlit.app",
        image: "/api/placeholder/300/200",
        completedDate: "2024-11-15",
        complexity: 'advanced'
      }
    ],
    learningProgress: {
      totalHours: 980,
      completedCourses: 18,
      inProgressCourses: 4,
      skillsAcquired: 12,
      projectsCompleted: 8,
      certificationsEarned: 6,
      monthlyProgress: [
        { month: "Jan", hours: 70 },
        { month: "Feb", hours: 85 },
        { month: "Mar", hours: 90 },
        { month: "Apr", hours: 100 },
        { month: "May", hours: 95 },
        { month: "Jun", hours: 110 }
      ],
      learningStreak: 32,
      lastActiveDate: "2024-12-19"
    },
    linkedinUrl: "https://linkedin.com/in/dinesh-silva",
    githubUrl: "https://github.com/dinesh-silva",
    portfolioUrl: "https://dinesh-ds.portfolio.dev",
    joinedDate: "2024-02-20",
    lastActive: "2024-12-19",
    isAvailableForWork: true,
    preferredJobTypes: ["Full-time", "Part-time", "Project-based"],
    expectedSalary: "LKR 70,000 - 100,000",
    rating: 4.7,
    totalViews: 198,
    profileCompleteness: 88
  },
  {
    id: "3",
    fullName: "Amara Wickramasinghe",
    email: "amara.w@moratuwa.ac.lk",
    phone: "+94 76 555 7890",
    bio: "Creative UI/UX designer and front-end developer with a passion for creating beautiful, user-centered digital experiences. Specializing in modern design principles and accessibility.",
    avatar: "/api/placeholder/150/150",
    location: "Moratuwa, Sri Lanka",
    university: "University of Moratuwa",
    degree: "Computer Science & Engineering",
    yearOfStudy: "2nd Year",
    careerPath: "UI/UX Design",
    gpa: 3.7,
    skills: [
      { name: "Figma", level: 95, category: 'design', certifications: ["Figma Academy Certificate"] },
      { name: "Adobe XD", level: 85, category: 'design', certifications: [] },
      { name: "React", level: 70, category: 'programming', certifications: [] },
      { name: "HTML/CSS", level: 90, category: 'programming', certifications: [] },
      { name: "JavaScript", level: 75, category: 'programming', certifications: [] },
      { name: "User Research", level: 80, category: 'design', certifications: ["UX Research Certificate"] },
      { name: "Prototyping", level: 90, category: 'design', certifications: [] },
      { name: "Creative Thinking", level: 95, category: 'soft', certifications: [] }
    ],
    achievements: [
      {
        id: "a6",
        title: "Best Design Portfolio",
        description: "University award for outstanding design portfolio",
        date: "2024-10-05",
        type: 'award',
        issuer: "University of Moratuwa",
        credentialUrl: "#"
      },
      {
        id: "a7",
        title: "Google UX Design Certificate",
        description: "Professional certificate in UX design",
        date: "2024-08-20",
        type: 'certification',
        issuer: "Google",
        credentialUrl: "#"
      }
    ],
    projects: [
      {
        id: "p4",
        title: "MediCare Mobile App",
        description: "Healthcare app redesign focusing on elderly users with accessibility features",
        technologies: ["Figma", "React Native", "User Testing"],
        githubUrl: "https://github.com/amara/medicare-app",
        liveUrl: "https://medicare-prototype.figma.com",
        image: "/api/placeholder/300/200",
        completedDate: "2024-10-30",
        complexity: 'intermediate'
      }
    ],
    learningProgress: {
      totalHours: 756,
      completedCourses: 14,
      inProgressCourses: 2,
      skillsAcquired: 10,
      projectsCompleted: 6,
      certificationsEarned: 4,
      monthlyProgress: [
        { month: "Jan", hours: 60 },
        { month: "Feb", hours: 75 },
        { month: "Mar", hours: 80 },
        { month: "Apr", hours: 85 },
        { month: "May", hours: 90 },
        { month: "Jun", hours: 95 }
      ],
      learningStreak: 28,
      lastActiveDate: "2024-12-18"
    },
    linkedinUrl: "https://linkedin.com/in/amara-wickramasinghe",
    githubUrl: "https://github.com/amara-w",
    portfolioUrl: "https://amara-design.portfolio.dev",
    joinedDate: "2024-03-10",
    lastActive: "2024-12-18",
    isAvailableForWork: false,
    preferredJobTypes: ["Internship", "Part-time"],
    rating: 4.8,
    totalViews: 267,
    profileCompleteness: 92
  }
];

const StudentBrowser = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCareerPath, setFilterCareerPath] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeView, setActiveView] = useState<string>("browse");

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         student.careerPath.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCareerPath = filterCareerPath === "all" || student.careerPath === filterCareerPath;
    const matchesYear = filterYear === "all" || student.yearOfStudy === filterYear;
    const matchesLocation = filterLocation === "all" || student.location.includes(filterLocation);

    return matchesSearch && matchesCareerPath && matchesYear && matchesLocation;
  });

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
    }
  };

  const getSkillColor = (category: string) => {
    switch (category) {
      case 'programming': return 'bg-blue-500';
      case 'design': return 'bg-purple-500';
      case 'data': return 'bg-green-500';
      case 'management': return 'bg-orange-500';
      case 'soft': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'certification': return <Award className="w-4 h-4" />;
      case 'award': return <Trophy className="w-4 h-4" />;
      case 'hackathon': return <Code className="w-4 h-4" />;
      case 'competition': return <Star className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Student Talent Hub</h1>
        <p className="text-muted-foreground">
          Discover and connect with skilled ICT students ready to contribute to your organization
        </p>
      </div>

      {/* Main Navigation Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="browse" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Browse Students</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, or career path..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Select value={filterCareerPath} onValueChange={setFilterCareerPath}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Career Path" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Career Paths</SelectItem>
                  <SelectItem value="Full Stack Development">Full Stack Development</SelectItem>
                  <SelectItem value="Data Science & Analytics">Data Science & Analytics</SelectItem>
                  <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                  <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                  <SelectItem value="DevOps & Cloud">DevOps & Cloud</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Year of Study" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Colombo">Colombo</SelectItem>
                  <SelectItem value="Kandy">Kandy</SelectItem>
                  <SelectItem value="Moratuwa">Moratuwa</SelectItem>
                  <SelectItem value="Galle">Galle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredStudents.length} of {students.length} students
            </p>
            <Button variant="outline" size="sm" onClick={() => setActiveView("leaderboard")}>
              <BarChart3 className="w-4 h-4 mr-1" />
              View Rankings
            </Button>
          </div>

          {/* Student Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
          <Card key={student.id} className="glass-card hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={student.avatar} alt={student.fullName} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                      {student.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{student.fullName}</CardTitle>
                    <CardDescription className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{student.location}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{student.rating}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Career Path & Year */}
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {student.yearOfStudy}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {student.careerPath}
                </Badge>
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {student.bio}
              </p>

              {/* Top Skills */}
              <div>
                <h4 className="text-sm font-medium mb-2">Top Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {student.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill.name} variant="outline" className="text-xs">
                      {skill.name} ({skill.level}%)
                    </Badge>
                  ))}
                  {student.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{student.skills.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-primary">{student.projects.length}</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">{student.achievements.length}</div>
                  <div className="text-xs text-muted-foreground">Awards</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-primary">{student.totalViews}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedStudent(student)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Student Profile</DialogTitle>
                    </DialogHeader>
                    
                    {selectedStudent && (
                      <div className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                          <Avatar className="w-24 h-24">
                            <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.fullName} />
                            <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-2xl">
                              {selectedStudent.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold">{selectedStudent.fullName}</h2>
                            <p className="text-muted-foreground mb-2">{selectedStudent.careerPath}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{selectedStudent.location}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>{selectedStudent.university}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{selectedStudent.yearOfStudy}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{selectedStudent.rating}/5.0</span>
                              </div>
                              <Badge variant={selectedStudent.isAvailableForWork ? "default" : "secondary"}>
                                {selectedStudent.isAvailableForWork ? "Available for Work" : "Not Available"}
                              </Badge>
                              <div className="text-sm text-muted-foreground">
                                Profile {selectedStudent.profileCompleteness}% complete
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contact & Social Links */}
                        <div className="flex flex-wrap gap-2">
                          {selectedStudent.email && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`mailto:${selectedStudent.email}`}>
                                <Mail className="w-4 h-4 mr-2" />
                                Email
                              </a>
                            </Button>
                          )}
                          {selectedStudent.phone && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${selectedStudent.phone}`}>
                                <Phone className="w-4 h-4 mr-2" />
                                Call
                              </a>
                            </Button>
                          )}
                          {selectedStudent.linkedinUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={selectedStudent.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-4 h-4 mr-2" />
                                LinkedIn
                              </a>
                            </Button>
                          )}
                          {selectedStudent.githubUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={selectedStudent.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="w-4 h-4 mr-2" />
                                GitHub
                              </a>
                            </Button>
                          )}
                          {selectedStudent.portfolioUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={selectedStudent.portfolioUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Portfolio
                              </a>
                            </Button>
                          )}
                          {selectedStudent.resumeUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={selectedStudent.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Resume
                              </a>
                            </Button>
                          )}
                        </div>

                        {/* Detailed Tabs */}
                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="skills">Skills & Progress</TabsTrigger>
                            <TabsTrigger value="achievements">Achievements</TabsTrigger>
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-3">About</h3>
                              <p className="text-muted-foreground">{selectedStudent.bio}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Academic Info */}
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Academic Information</h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">University:</span>
                                    <span className="font-medium">{selectedStudent.university}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Degree:</span>
                                    <span className="font-medium">{selectedStudent.degree}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Year:</span>
                                    <span className="font-medium">{selectedStudent.yearOfStudy}</span>
                                  </div>
                                  {selectedStudent.gpa && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">GPA:</span>
                                      <span className="font-medium">{selectedStudent.gpa}/4.0</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Work Preferences */}
                              <div>
                                <h3 className="text-lg font-semibold mb-3">Work Preferences</h3>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-muted-foreground text-sm">Preferred Job Types:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {selectedStudent.preferredJobTypes.map((type) => (
                                        <Badge key={type} variant="outline" className="text-xs">
                                          {type}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {selectedStudent.expectedSalary && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Expected Salary:</span>
                                      <span className="font-medium">{selectedStudent.expectedSalary}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Learning Analytics Summary */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">Learning Analytics</h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-primary/5 rounded-lg">
                                  <div className="text-2xl font-bold text-primary">{selectedStudent.learningProgress.totalHours}</div>
                                  <div className="text-sm text-muted-foreground">Learning Hours</div>
                                </div>
                                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                                  <div className="text-2xl font-bold text-secondary">{selectedStudent.learningProgress.completedCourses}</div>
                                  <div className="text-sm text-muted-foreground">Courses Completed</div>
                                </div>
                                <div className="text-center p-4 bg-green-500/5 rounded-lg">
                                  <div className="text-2xl font-bold text-green-500">{selectedStudent.learningProgress.projectsCompleted}</div>
                                  <div className="text-sm text-muted-foreground">Projects Done</div>
                                </div>
                                <div className="text-center p-4 bg-purple-500/5 rounded-lg">
                                  <div className="text-2xl font-bold text-purple-500">{selectedStudent.learningProgress.learningStreak}</div>
                                  <div className="text-sm text-muted-foreground">Day Streak</div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="skills" className="space-y-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Skills & Proficiency</h3>
                              <div className="space-y-4">
                                {selectedStudent.skills.map((skill) => (
                                  <div key={skill.name} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${getSkillColor(skill.category)}`}></div>
                                        <span className="font-medium">{skill.name}</span>
                                        <Badge variant="outline" className="text-xs capitalize">
                                          {skill.category}
                                        </Badge>
                                      </div>
                                      <span className="text-sm font-medium">{skill.level}%</span>
                                    </div>
                                    <Progress value={skill.level} className="h-2" />
                                    {skill.certifications.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {skill.certifications.map((cert) => (
                                          <Badge key={cert} variant="secondary" className="text-xs">
                                            <Award className="w-3 h-3 mr-1" />
                                            {cert}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Monthly Progress Chart */}
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Monthly Learning Progress</h3>
                              <div className="flex items-end space-x-2 h-32">
                                {selectedStudent.learningProgress.monthlyProgress.map((month, index) => (
                                  <div key={month.month} className="flex-1 flex flex-col items-center">
                                    <div 
                                      className="w-full bg-primary rounded-t" 
                                      style={{ 
                                        height: `${(month.hours / Math.max(...selectedStudent.learningProgress.monthlyProgress.map(m => m.hours))) * 100}%`,
                                        minHeight: '20px'
                                      }}
                                    ></div>
                                    <span className="text-xs text-muted-foreground mt-1">{month.month}</span>
                                    <span className="text-xs font-medium">{month.hours}h</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="achievements" className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Achievements & Certifications</h3>
                              <div className="space-y-4">
                                {selectedStudent.achievements.map((achievement) => (
                                  <Card key={achievement.id} className="p-4">
                                    <div className="flex items-start space-x-3">
                                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        {getAchievementIcon(achievement.type)}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <h4 className="font-semibold">{achievement.title}</h4>
                                          <Badge variant="outline" className="text-xs capitalize">
                                            {achievement.type}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {achievement.description}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                          <span className="text-xs text-muted-foreground">
                                            {achievement.issuer} • {new Date(achievement.date).toLocaleDateString()}
                                          </span>
                                          {achievement.credentialUrl && (
                                            <Button variant="ghost" size="sm" asChild>
                                              <a href={achievement.credentialUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-3 h-3 mr-1" />
                                                View
                                              </a>
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="projects" className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Projects Portfolio</h3>
                              <div className="grid gap-6">
                                {selectedStudent.projects.map((project) => (
                                  <Card key={project.id} className="p-6">
                                    <div className="flex items-start space-x-4">
                                      {project.image && (
                                        <img 
                                          src={project.image} 
                                          alt={project.title}
                                          className="w-24 h-16 object-cover rounded-lg"
                                        />
                                      )}
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <h4 className="font-semibold text-lg">{project.title}</h4>
                                          <Badge variant="outline" className="capitalize">
                                            {project.complexity}
                                          </Badge>
                                        </div>
                                        <p className="text-muted-foreground mt-2">
                                          {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-3">
                                          {project.technologies.map((tech) => (
                                            <Badge key={tech} variant="secondary" className="text-xs">
                                              {tech}
                                            </Badge>
                                          ))}
                                        </div>
                                        <div className="flex items-center space-x-4 mt-4">
                                          <span className="text-sm text-muted-foreground">
                                            Completed: {new Date(project.completedDate).toLocaleDateString()}
                                          </span>
                                          <div className="flex space-x-2">
                                            {project.githubUrl && (
                                              <Button variant="ghost" size="sm" asChild>
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                                  <Github className="w-4 h-4 mr-1" />
                                                  Code
                                                </a>
                                              </Button>
                                            )}
                                            {project.liveUrl && (
                                              <Button variant="ghost" size="sm" asChild>
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                  <ExternalLink className="w-4 h-4 mr-1" />
                                                  Live Demo
                                                </a>
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                <Button variant="default" size="sm" className="flex-1">
                  <Briefcase className="w-4 h-4 mr-1" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

          {/* No Results */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters to find more students.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard onStudentSelect={handleStudentSelect} />
        </TabsContent>
      </Tabs>

      {/* Student Profile Dialog */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Student Profile</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={selectedStudent.avatar} alt={selectedStudent.fullName} />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-2xl">
                    {selectedStudent.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{selectedStudent.fullName}</h2>
                  <p className="text-muted-foreground mb-2">{selectedStudent.careerPath}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedStudent.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{selectedStudent.university}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedStudent.yearOfStudy}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedStudent.rating}/5.0</span>
                    </div>
                    <Badge variant={selectedStudent.isAvailableForWork ? "default" : "secondary"}>
                      {selectedStudent.isAvailableForWork ? "Available for Work" : "Not Available"}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Profile {selectedStudent.profileCompleteness}% complete
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Social Links */}
              <div className="flex flex-wrap gap-2">
                {selectedStudent.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${selectedStudent.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
                {selectedStudent.phone && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${selectedStudent.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
                {selectedStudent.linkedinUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedStudent.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {selectedStudent.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedStudent.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {selectedStudent.portfolioUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedStudent.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Portfolio
                    </a>
                  </Button>
                )}
                {selectedStudent.resumeUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedStudent.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Resume
                    </a>
                  </Button>
                )}
              </div>

              {/* Detailed Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="skills">Skills & Progress</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-muted-foreground">{selectedStudent.bio}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Academic Info */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Academic Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">University:</span>
                          <span className="font-medium">{selectedStudent.university}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Degree:</span>
                          <span className="font-medium">{selectedStudent.degree}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Year:</span>
                          <span className="font-medium">{selectedStudent.yearOfStudy}</span>
                        </div>
                        {selectedStudent.gpa && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">GPA:</span>
                            <span className="font-medium">{selectedStudent.gpa}/4.0</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Work Preferences */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Work Preferences</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-muted-foreground text-sm">Preferred Job Types:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedStudent.preferredJobTypes.map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedStudent.expectedSalary && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expected Salary:</span>
                            <span className="font-medium">{selectedStudent.expectedSalary}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Learning Analytics Summary */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Learning Analytics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{selectedStudent.learningProgress.totalHours}</div>
                        <div className="text-sm text-muted-foreground">Learning Hours</div>
                      </div>
                      <div className="text-center p-4 bg-secondary/5 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">{selectedStudent.learningProgress.completedCourses}</div>
                        <div className="text-sm text-muted-foreground">Courses Completed</div>
                      </div>
                      <div className="text-center p-4 bg-green-500/5 rounded-lg">
                        <div className="text-2xl font-bold text-green-500">{selectedStudent.learningProgress.projectsCompleted}</div>
                        <div className="text-sm text-muted-foreground">Projects Done</div>
                      </div>
                      <div className="text-center p-4 bg-purple-500/5 rounded-lg">
                        <div className="text-2xl font-bold text-purple-500">{selectedStudent.learningProgress.learningStreak}</div>
                        <div className="text-sm text-muted-foreground">Day Streak</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Skills & Proficiency</h3>
                    <div className="space-y-4">
                      {selectedStudent.skills.map((skill) => (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${getSkillColor(skill.category)}`}></div>
                              <span className="font-medium">{skill.name}</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {skill.category}
                              </Badge>
                            </div>
                            <span className="text-sm font-medium">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                          {skill.certifications.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {skill.certifications.map((cert) => (
                                <Badge key={cert} variant="secondary" className="text-xs">
                                  <Award className="w-3 h-3 mr-1" />
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Progress Chart */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Monthly Learning Progress</h3>
                    <div className="flex items-end space-x-2 h-32">
                      {selectedStudent.learningProgress.monthlyProgress.map((month, index) => (
                        <div key={month.month} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-primary rounded-t" 
                            style={{ 
                              height: `${(month.hours / Math.max(...selectedStudent.learningProgress.monthlyProgress.map(m => m.hours))) * 100}%`,
                              minHeight: '20px'
                            }}
                          ></div>
                          <span className="text-xs text-muted-foreground mt-1">{month.month}</span>
                          <span className="text-xs font-medium">{month.hours}h</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="achievements" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Achievements & Certifications</h3>
                    <div className="space-y-4">
                      {selectedStudent.achievements.map((achievement) => (
                        <Card key={achievement.id} className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              {getAchievementIcon(achievement.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">{achievement.title}</h4>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {achievement.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {achievement.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {achievement.issuer} • {new Date(achievement.date).toLocaleDateString()}
                                </span>
                                {achievement.credentialUrl && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={achievement.credentialUrl} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      View
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Projects Portfolio</h3>
                    <div className="grid gap-6">
                      {selectedStudent.projects.map((project) => (
                        <Card key={project.id} className="p-6">
                          <div className="flex items-start space-x-4">
                            {project.image && (
                              <img 
                                src={project.image} 
                                alt={project.title}
                                className="w-24 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-lg">{project.title}</h4>
                                <Badge variant="outline" className="capitalize">
                                  {project.complexity}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mt-2">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-3">
                                {project.technologies.map((tech) => (
                                  <Badge key={tech} variant="secondary" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center space-x-4 mt-4">
                                <span className="text-sm text-muted-foreground">
                                  Completed: {new Date(project.completedDate).toLocaleDateString()}
                                </span>
                                <div className="flex space-x-2">
                                  {project.githubUrl && (
                                    <Button variant="ghost" size="sm" asChild>
                                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                        <Github className="w-4 h-4 mr-1" />
                                        Code
                                      </a>
                                    </Button>
                                  )}
                                  {project.liveUrl && (
                                    <Button variant="ghost" size="sm" asChild>
                                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-4 h-4 mr-1" />
                                        Live Demo
                                      </a>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudentBrowser;
