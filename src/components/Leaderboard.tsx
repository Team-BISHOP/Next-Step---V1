import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  TrendingUp, 
  Star, 
  Award, 
  Target, 
  Clock, 
  Users, 
  BookOpen,
  Code,
  Zap,
  Medal,
  Crown,
  Flame
} from "lucide-react";

interface LeaderboardStudent {
  id: string;
  rank: number;
  fullName: string;
  avatar?: string;
  university: string;
  careerPath: string;
  points: number;
  level: number;
  achievements: number;
  projectsCompleted: number;
  learningHours: number;
  streak: number;
  skillsAcquired: number;
  monthlyGrowth: number;
  competitionWins: number;
  mentorshipRating: number;
  profileViews: number;
}

const mockLeaderboardData: LeaderboardStudent[] = [
  {
    id: "1",
    rank: 1,
    fullName: "Kavitha Perera",
    avatar: "/api/placeholder/150/150",
    university: "University of Colombo",
    careerPath: "Full Stack Development",
    points: 12450,
    level: 28,
    achievements: 23,
    projectsCompleted: 12,
    learningHours: 1250,
    streak: 45,
    skillsAcquired: 15,
    monthlyGrowth: 18,
    competitionWins: 3,
    mentorshipRating: 4.9,
    profileViews: 342
  },
  {
    id: "2",
    rank: 2,
    fullName: "Dinesh Silva",
    avatar: "/api/placeholder/150/150",
    university: "SLIIT",
    careerPath: "Data Science & Analytics",
    points: 11890,
    level: 26,
    achievements: 19,
    projectsCompleted: 8,
    learningHours: 980,
    streak: 32,
    skillsAcquired: 12,
    monthlyGrowth: 22,
    competitionWins: 2,
    mentorshipRating: 4.7,
    profileViews: 198
  },
  {
    id: "3",
    rank: 3,
    fullName: "Amara Wickramasinghe",
    avatar: "/api/placeholder/150/150",
    university: "University of Moratuwa",
    careerPath: "UI/UX Design",
    points: 10675,
    level: 24,
    achievements: 16,
    projectsCompleted: 6,
    learningHours: 756,
    streak: 28,
    skillsAcquired: 10,
    monthlyGrowth: 15,
    competitionWins: 1,
    mentorshipRating: 4.8,
    profileViews: 267
  },
  {
    id: "4",
    rank: 4,
    fullName: "Thilina Rajapaksa",
    avatar: "/api/placeholder/150/150",
    university: "University of Peradeniya",
    careerPath: "Mobile Development",
    points: 9840,
    level: 22,
    achievements: 14,
    projectsCompleted: 9,
    learningHours: 890,
    streak: 25,
    skillsAcquired: 11,
    monthlyGrowth: 20,
    competitionWins: 1,
    mentorshipRating: 4.6,
    profileViews: 156
  },
  {
    id: "5",
    rank: 5,
    fullName: "Nimesha Fernando",
    avatar: "/api/placeholder/150/150",
    university: "University of Kelaniya",
    careerPath: "DevOps & Cloud",
    points: 9245,
    level: 21,
    achievements: 12,
    projectsCompleted: 7,
    learningHours: 720,
    streak: 19,
    skillsAcquired: 9,
    monthlyGrowth: 17,
    competitionWins: 0,
    mentorshipRating: 4.5,
    profileViews: 134
  }
];

interface LeaderboardProps {
  onStudentSelect?: (studentId: string) => void;
}

const Leaderboard = ({ onStudentSelect }: LeaderboardProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("overall");

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
            {rank}
          </div>
        );
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 25) return "text-purple-500";
    if (level >= 20) return "text-blue-500";
    if (level >= 15) return "text-green-500";
    if (level >= 10) return "text-yellow-500";
    return "text-gray-500";
  };

  const getProgressColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const sortedByCategory = (category: string) => {
    switch (category) {
      case "projects":
        return [...mockLeaderboardData].sort((a, b) => b.projectsCompleted - a.projectsCompleted);
      case "learning":
        return [...mockLeaderboardData].sort((a, b) => b.learningHours - a.learningHours);
      case "achievements":
        return [...mockLeaderboardData].sort((a, b) => b.achievements - a.achievements);
      case "growth":
        return [...mockLeaderboardData].sort((a, b) => b.monthlyGrowth - a.monthlyGrowth);
      default:
        return mockLeaderboardData;
    }
  };

  const leaderboardData = sortedByCategory(selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold gradient-text flex items-center justify-center space-x-2">
          <Trophy className="w-8 h-8" />
          <span>Student Leaderboard</span>
        </h2>
        <p className="text-muted-foreground">
          Top performing students ranked by various metrics
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overall" className="text-sm">
            <Trophy className="w-4 h-4 mr-1" />
            Overall
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-sm">
            <Code className="w-4 h-4 mr-1" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="learning" className="text-sm">
            <BookOpen className="w-4 h-4 mr-1" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="achievements" className="text-sm">
            <Award className="w-4 h-4 mr-1" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="growth" className="text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            Growth
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {leaderboardData.slice(0, 3).map((student, index) => (
              <Card 
                key={student.id} 
                className={`glass-card relative overflow-hidden ${
                  index === 0 ? 'border-yellow-500/50 shadow-yellow-500/20' :
                  index === 1 ? 'border-gray-400/50 shadow-gray-400/20' :
                  'border-amber-600/50 shadow-amber-600/20'
                } ${index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                }`}></div>
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-2">
                    {getRankIcon(student.rank)}
                  </div>
                  <Avatar className={`w-16 h-16 mx-auto mb-2 ${
                    index === 0 ? 'ring-4 ring-yellow-500/30' : ''
                  }`}>
                    <AvatarImage src={student.avatar} alt={student.fullName} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                      {student.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{student.fullName}</CardTitle>
                  <CardDescription>{student.university}</CardDescription>
                  <Badge variant="outline" className="text-xs">
                    {student.careerPath}
                  </Badge>
                </CardHeader>
                
                <CardContent className="text-center space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-primary">{student.points.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Points</div>
                  </div>
                  
                  <div className="flex justify-center items-center space-x-1">
                    <Zap className={`w-4 h-4 ${getLevelColor(student.level)}`} />
                    <span className={`font-bold ${getLevelColor(student.level)}`}>
                      Level {student.level}
                    </span>
                  </div>

                  {selectedCategory === "overall" && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="font-semibold text-sm">{student.achievements}</div>
                        <div className="text-muted-foreground">Awards</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{student.projectsCompleted}</div>
                        <div className="text-muted-foreground">Projects</div>
                      </div>
                    </div>
                  )}

                  {selectedCategory === "projects" && (
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-primary">{student.projectsCompleted}</div>
                      <div className="text-xs text-muted-foreground">Projects Completed</div>
                      <Progress value={(student.projectsCompleted / 15) * 100} className="h-2" />
                    </div>
                  )}

                  {selectedCategory === "learning" && (
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-primary">{student.learningHours}h</div>
                      <div className="text-xs text-muted-foreground">Learning Hours</div>
                      <div className="flex items-center justify-center space-x-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span className="text-xs">{student.streak} day streak</span>
                      </div>
                    </div>
                  )}

                  {selectedCategory === "achievements" && (
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-primary">{student.achievements}</div>
                      <div className="text-xs text-muted-foreground">Achievements Earned</div>
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs">{student.mentorshipRating}/5.0 rating</span>
                      </div>
                    </div>
                  )}

                  {selectedCategory === "growth" && (
                    <div className="space-y-2">
                      <div className="text-xl font-bold text-green-500">+{student.monthlyGrowth}%</div>
                      <div className="text-xs text-muted-foreground">Monthly Growth</div>
                      <Progress value={student.monthlyGrowth} className="h-2" />
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onStudentSelect?.(student.id)}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Remaining Rankings */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Full Rankings</h3>
            {leaderboardData.map((student, index) => (
              <Card key={student.id} className="glass-card hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getRankIcon(index + 1)}
                    </div>

                    {/* Avatar & Info */}
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={student.avatar} alt={student.fullName} />
                        <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-sm">
                          {student.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold truncate">{student.fullName}</h4>
                          <div className="flex items-center space-x-1">
                            <Zap className={`w-3 h-3 ${getLevelColor(student.level)}`} />
                            <span className={`text-xs font-medium ${getLevelColor(student.level)}`}>
                              L{student.level}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {student.university} • {student.careerPath}
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="hidden md:flex items-center space-x-6 text-sm">
                      {selectedCategory === "overall" && (
                        <>
                          <div className="text-center">
                            <div className="font-bold text-primary">{student.points.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Points</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{student.achievements}</div>
                            <div className="text-xs text-muted-foreground">Awards</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{student.projectsCompleted}</div>
                            <div className="text-xs text-muted-foreground">Projects</div>
                          </div>
                        </>
                      )}

                      {selectedCategory === "projects" && (
                        <>
                          <div className="text-center">
                            <div className="font-bold text-primary">{student.projectsCompleted}</div>
                            <div className="text-xs text-muted-foreground">Projects</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{student.skillsAcquired}</div>
                            <div className="text-xs text-muted-foreground">Skills</div>
                          </div>
                        </>
                      )}

                      {selectedCategory === "learning" && (
                        <>
                          <div className="text-center">
                            <div className="font-bold text-primary">{student.learningHours}h</div>
                            <div className="text-xs text-muted-foreground">Hours</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{student.streak}</div>
                            <div className="text-xs text-muted-foreground">Streak</div>
                          </div>
                        </>
                      )}

                      {selectedCategory === "achievements" && (
                        <>
                          <div className="text-center">
                            <div className="font-bold text-primary">{student.achievements}</div>
                            <div className="text-xs text-muted-foreground">Awards</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{student.competitionWins}</div>
                            <div className="text-xs text-muted-foreground">Wins</div>
                          </div>
                        </>
                      )}

                      {selectedCategory === "growth" && (
                        <>
                          <div className="text-center">
                            <div className="font-bold text-green-500">+{student.monthlyGrowth}%</div>
                            <div className="text-xs text-muted-foreground">Growth</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{student.profileViews}</div>
                            <div className="text-xs text-muted-foreground">Views</div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onStudentSelect?.(student.id)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
