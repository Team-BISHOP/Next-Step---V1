import { useState, useEffect, createContext, useContext } from 'react';

// User roles
export type UserRole = 'student' | 'industry_expert';

// Enhanced User interface with role and profile data
interface User {
  id: string;
  email?: string;
  role: UserRole;
  fullName: string;
  profileData?: {
    bio?: string;
    avatar?: string;
    location?: string;
    phone?: string;
    // Student specific fields
    university?: string;
    degree?: string;
    yearOfStudy?: string;
    careerPath?: string;
    skills?: string[];
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    // Industry expert specific fields
    company?: string;
    position?: string;
    industry?: string;
    experience?: string;
  };
}

interface Session {
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole, additionalData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<User['profileData']>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user session
    const storedUser = localStorage.getItem('nextStep_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setSession({ user: userData });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('nextStep_user');
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: UserRole, additionalData?: any) => {
    try {
      // Create mock user with role-based data
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email: email,
        role: role,
        fullName: fullName,
        profileData: {
          bio: '',
          avatar: '',
          location: '',
          phone: '',
          ...additionalData
        }
      };
      
      // Store in localStorage
      localStorage.setItem('nextStep_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setSession({ user: mockUser });
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Registration failed. Please try again.' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, create a mock user based on email
      const role: UserRole = email.includes('expert') || email.includes('company') || email.includes('hr') 
        ? 'industry_expert' 
        : 'student';
      
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email: email,
        role: role,
        fullName: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        profileData: {
          bio: role === 'student' 
            ? 'Passionate ICT student exploring career opportunities' 
            : 'Industry professional seeking talented students',
          avatar: '',
          location: 'Sri Lanka',
          ...(role === 'student' && {
            university: 'University of Colombo',
            degree: 'Computer Science',
            yearOfStudy: '3rd Year',
            skills: ['JavaScript', 'React', 'Node.js', 'Python'],
            linkedinUrl: 'https://linkedin.com/in/student',
            githubUrl: 'https://github.com/student'
          }),
          ...(role === 'industry_expert' && {
            company: 'Tech Solutions Lanka',
            position: 'Senior Software Engineer',
            industry: 'Information Technology',
            experience: '5+ years'
          })
        }
      };
      
      // Store in localStorage
      localStorage.setItem('nextStep_user', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setSession({ user: mockUser });
      
      return { error: null };
    } catch (error) {
      return { error: { message: 'Login failed. Please check your credentials.' } };
    }
  };

  const signOut = async () => {
    // Clear localStorage and state
    localStorage.removeItem('nextStep_user');
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (profileData: Partial<User['profileData']>) => {
    if (!user) {
      return { error: { message: 'No user logged in' } };
    }

    try {
      const updatedUser = {
        ...user,
        profileData: {
          ...user.profileData,
          ...profileData
        }
      };

      localStorage.setItem('nextStep_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSession({ user: updatedUser });

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to update profile' } };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};