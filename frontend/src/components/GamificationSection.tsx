import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target,
  Crown,
  Medal,
  Award,
  TrendingUp,
  Users,
  Flame
} from "lucide-react";

const GamificationSection = () => {
  const [selectedTab, setSelectedTab] = useState("leaderboard");

  const topStudents = [
    {
      rank: 1,
      name: "Ashan Wijesinghe",
      points: 2850,
      level: "Expert",
      badge: "Full-Stack Master",
      streak: 45,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      rank: 2, 
      name: "Dilini Rajapaksa",
      points: 2720,
      level: "Advanced",
      badge: "Data Science Pro",
      streak: 38,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b9f9d95e?w=150&h=150&fit=crop&crop=face"
    },
    {
      rank: 3,
      name: "Mahesh Fernando",
      points: 2650,
      level: "Advanced", 
      badge: "Security Expert",
      streak: 42,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      rank: 4,
      name: "Sachini Perera",
      points: 2420,
      level: "Intermediate",
      badge: "AI Enthusiast",
      streak: 28,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      rank: 5,
      name: "Kamal Silva",
      points: 2380,
      level: "Intermediate",
      badge: "Cloud Architect",
      streak: 33,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const achievements = [
    {
      title: "First Steps",
      description: "Complete your first course",
      icon: Target,
      earned: true,
      rarity: "Common",
      points: 50
    },
    {
      title: "Quiz Master", 
      description: "Score 90% or higher on 5 quizzes",
      icon: Zap,
      earned: true,
      rarity: "Uncommon",
      points: 150
    },
    {
      title: "Project Pioneer",
      description: "Submit your first project",
      icon: Award,
      earned: true,
      rarity: "Common",
      points: 100
    },
    {
      title: "Streak Legend",
      description: "Maintain a 30-day learning streak",
      icon: Flame,
      earned: false,
      rarity: "Rare",
      points: 300
    },
    {
      title: "Community Helper",
      description: "Help 10 fellow students",
      icon: Users,
      earned: false,
      rarity: "Epic",
      points: 500
    },
    {
      title: "Course Crusher",
      description: "Complete 10 courses with excellence",
      icon: Crown,
      earned: false,
      rarity: "Legendary",
      points: 1000
    }
  ];

  const userStats = {
    level: 12,
    points: 1850,
    nextLevelPoints: 2000,
    streak: 15,
    completedCourses: 8,
    projectsSubmitted: 12,
    rank: 23
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold">#{rank}</span>;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-100 text-gray-700";
      case "Uncommon": return "bg-green-100 text-green-700";
      case "Rare": return "bg-blue-100 text-blue-700";
      case "Epic": return "bg-purple-100 text-purple-700";
      case "Legendary": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <section id="leaderboard" className="py-20 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-6">
            <Trophy className="w-4 h-4 text-accent animate-glow" />
            <span className="text-sm font-medium">Gamification & Rewards</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Level Up Your <span className="gradient-text">Learning Journey</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Earn points, unlock achievements, and compete with fellow students. 
            Make learning engaging and track your progress in real-time.
          </p>
        </div>

        {/* User Stats Overview */}
        <Card className="glass-card p-6 md:p-8 mb-12 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-glow">
                  <span className="text-white font-bold text-lg">{userStats.level}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Level {userStats.level}</h3>
                  <p className="text-muted-foreground">Intermediate Learner</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Progress to Level {userStats.level + 1}</span>
                  <span className="text-sm text-muted-foreground">
                    {userStats.points}/{userStats.nextLevelPoints} XP
                  </span>
                </div>
                <Progress 
                  value={(userStats.points / userStats.nextLevelPoints) * 100} 
                  className="h-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Points", value: userStats.points.toLocaleString(), icon: Star },
                { label: "Learning Streak", value: `${userStats.streak} days`, icon: Flame },
                { label: "Courses Done", value: userStats.completedCourses, icon: Trophy },
                { label: "Global Rank", value: `#${userStats.rank}`, icon: TrendingUp }
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4 text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-lg font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="glass-card p-2 rounded-lg">
            <div className="flex space-x-2">
              {[
                { id: "leaderboard", label: "Leaderboard", icon: Trophy },
                { id: "achievements", label: "Achievements", icon: Award }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  variant={selectedTab === tab.id ? "hero" : "ghost"}
                  onClick={() => setSelectedTab(tab.id)}
                  className="flex items-center space-x-2"
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === "leaderboard" ? (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-center mb-8">🏆 Top Performers This Month</h3>
            
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <Card 
                  key={student.name}
                  className={`glass-card p-6 transition-all duration-300 hover:scale-105 ${
                    student.rank <= 3 ? 'ring-2 ring-primary/50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-6">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getRankIcon(student.rank)}
                    </div>

                    {/* Avatar */}
                    <div 
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex-shrink-0"
                      style={{
                        backgroundImage: `url(${student.avatar})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />

                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold">{student.name}</h4>
                        <div className="text-2xl font-bold text-primary">
                          {student.points.toLocaleString()} XP
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary">{student.level}</Badge>
                        <Badge className={getRarityColor("Epic")}>{student.badge}</Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span>{student.streak} day streak</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-center mb-8">🏅 Your Achievements</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <Card 
                  key={achievement.title}
                  className={`glass-card p-6 text-center transition-all duration-300 hover:scale-105 ${
                    achievement.earned ? 'ring-2 ring-green-400/50' : 'opacity-75'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    achievement.earned 
                      ? 'bg-gradient-to-r from-primary to-secondary animate-glow' 
                      : 'bg-muted'
                  }`}>
                    <achievement.icon className={`w-8 h-8 ${
                      achievement.earned ? 'text-white' : 'text-muted-foreground'
                    }`} />
                  </div>
                  
                  <h4 className="text-lg font-bold mb-2">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    <div className="text-sm font-medium text-primary">
                      +{achievement.points} XP
                    </div>
                  </div>
                  
                  {achievement.earned && (
                    <div className="mt-4">
                      <Badge variant="default" className="bg-green-100 text-green-700">
                        ✓ Unlocked
                      </Badge>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Card className="glass-card p-8 md:p-12 text-center mt-16 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto animate-glow">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-3xl font-bold">Join the Competition!</h3>
            
            <p className="text-muted-foreground text-lg">
              Start earning points today and climb the leaderboard. Complete quizzes, 
              submit projects, and help others to unlock amazing achievements.
            </p>
            
            <Button variant="hero" size="lg">
              Start Earning Points
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default GamificationSection;