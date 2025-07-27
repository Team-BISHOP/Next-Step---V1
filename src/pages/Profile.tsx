import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, Mail, School, Trophy, Github, Linkedin, Save, Loader2, LogOut, Share2, Home, ArrowLeft, Building, Briefcase, Users } from "lucide-react";
import Header from "@/components/Header";
import AvatarUpload from "@/components/AvatarUpload";
import UserAnalytics from "@/components/UserAnalytics";
import Navigation from "@/components/Navigation";

interface Profile {
  // Common fields
  full_name?: string;
  avatar_url?: string;
  
  // Student specific fields
  university?: string;
  year_of_study?: number;
  major?: string;
  skills?: string[];
  career_interests?: string[];
  github_username?: string;
  linkedin_url?: string;
  points?: number;
  level?: number;
  
  // Industry expert specific fields
  company?: string;
  position?: string;
  industry?: string;
  experience?: string;
  company_website?: string;
  company_size?: string;
  bio?: string;
}

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      // Initialize profile with user data if available
      setProfile({
        full_name: user.fullName || '',
        avatar_url: user.profileData?.avatar || '',
        // Student fields
        university: user.profileData?.university || '',
        major: user.profileData?.degree || '',
        github_username: user.profileData?.githubUrl?.split('/').pop() || '',
        linkedin_url: user.profileData?.linkedinUrl || '',
        // Industry expert fields
        company: user.profileData?.company || '',
        position: user.profileData?.position || '',
        industry: user.profileData?.industry || '',
        experience: user.profileData?.experience || '',
        bio: user.profileData?.bio || '',
      });
      
      fetchProfile();
    }
  }, [user]);

    const fetchProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Supabase removed: fetch profile logic should be implemented here
      // For now, using empty profile object
      setProfile({});
    } catch (error: any) {
      toast.error("Error loading profile: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

    const updateProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Supabase removed: update profile logic should be implemented here
      // For now, just simulate successful update
      
      toast.success("Profile updated successfully!");
      
      // Redirect to home page after successful save
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (error: any) {
      toast.error("Error updating profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({
      ...profile,
      skills: profile.skills?.filter(s => s !== skill) || []
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.career_interests?.includes(newInterest.trim())) {
      setProfile({
        ...profile,
        career_interests: [...(profile.career_interests || []), newInterest.trim()]
      });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setProfile({
      ...profile,
      career_interests: profile.career_interests?.filter(i => i !== interest) || []
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        <Navigation title="Profile Settings" />
        
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="glass-card">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-white">
                    {profile.full_name?.split(' ').map(n => n[0]).join('') || user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile.full_name || 'Complete your profile'}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </CardDescription>
                  
                  {/* Role-specific information */}
                  {user.role === 'student' && (
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{profile.points || 0} points</span>
                      </div>
                      <Badge variant="secondary">Level {profile.level || 1}</Badge>
                    </div>
                  )}
                  
                  {user.role === 'industry_expert' && profile.company && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Building className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{profile.company}</span>
                      {profile.position && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{profile.position}</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(`${window.location.origin}/public-profile/${user.id}`, '_blank')}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Avatar Upload */}
          <AvatarUpload 
            userId={user.id}
            currentAvatarUrl={profile.avatar_url}
            onAvatarUpdate={(url) => setProfile({...profile, avatar_url: url})}
          />

          {/* Profile Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>
                {user.role === 'student' ? 'Student Profile' : 'Company Profile'}
              </CardTitle>
              <CardDescription>
                {user.role === 'student' 
                  ? 'Update your information to get personalized career recommendations'
                  : 'Manage your company information and recruitment preferences'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Common Fields */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    className="pl-10"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  />
                </div>
              </div>

              {/* Student Specific Fields */}
              {user.role === 'student' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <div className="relative">
                        <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="university"
                          placeholder="Your university"
                          className="pl-10"
                          value={profile.university || ''}
                          onChange={(e) => setProfile({...profile, university: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year of Study</Label>
                      <Select value={profile.year_of_study?.toString() || ''} onValueChange={(value) => setProfile({...profile, year_of_study: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="5">5th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="major">Major/Specialization</Label>
                      <Input
                        id="major"
                        placeholder="Computer Science, IT, etc."
                        value={profile.major || ''}
                        onChange={(e) => setProfile({...profile, major: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub Username</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="github"
                          placeholder="your-username"
                          className="pl-10"
                          value={profile.github_username || ''}
                          onChange={(e) => setProfile({...profile, github_username: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="linkedin"
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="pl-10"
                          value={profile.linkedin_url || ''}
                          onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Skills Section */}
                  <div className="space-y-4">
                    <Label>Technical Skills</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a skill (e.g., JavaScript, Python)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button onClick={addSkill} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills?.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Career Interests Section */}
                  <div className="space-y-4">
                    <Label>Career Interests</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add career interest (e.g., Web Development, AI)"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                      />
                      <Button onClick={addInterest} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.career_interests?.map((interest, index) => (
                        <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeInterest(interest)}>
                          {interest} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Industry Expert Specific Fields */}
              {user.role === 'industry_expert' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company"
                          placeholder="Your company name"
                          className="pl-10"
                          value={profile.company || ''}
                          onChange={(e) => setProfile({...profile, company: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Your Position</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="position"
                          placeholder="e.g., Senior Software Engineer, HR Manager"
                          className="pl-10"
                          value={profile.position || ''}
                          onChange={(e) => setProfile({...profile, position: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        placeholder="e.g., Information Technology, Fintech"
                        value={profile.industry || ''}
                        onChange={(e) => setProfile({...profile, industry: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <Select value={profile.experience || ''} onValueChange={(value) => setProfile({...profile, experience: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2 years">1-2 years</SelectItem>
                          <SelectItem value="3-5 years">3-5 years</SelectItem>
                          <SelectItem value="5-10 years">5-10 years</SelectItem>
                          <SelectItem value="10+ years">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Company Website</Label>
                      <Input
                        id="companyWebsite"
                        placeholder="https://yourcompany.com"
                        value={profile.company_website || ''}
                        onChange={(e) => setProfile({...profile, company_website: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select value={profile.company_size || ''} onValueChange={(value) => setProfile({...profile, company_size: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Company Description</Label>
                    <Textarea
                      id="bio"
                      placeholder="Brief description of your company and what you're looking for in candidates..."
                      rows={4}
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="pl-10"
                        value={profile.linkedin_url || ''}
                        onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                
                <Button onClick={updateProfile} disabled={isSaving} variant="hero">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Analytics Section - Only for Students */}
          {user.role === 'student' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Analytics</h2>
                <p className="text-muted-foreground">
                  Track your learning progress and skill development
                </p>
              </div>
              
              <UserAnalytics 
                userId={user.id}
                skills={profile.skills}
                careerInterests={profile.career_interests}
                points={profile.points}
                level={profile.level}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;