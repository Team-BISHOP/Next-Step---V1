import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import API from '../lib/api';

export type UserRole = 'student' | 'industry_expert';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  profileData: {
    bio: string;
    avatar: string;
    location: string;
    university?: string;
    degree?: string;
    yearOfStudy?: string;
    skills?: string[];
    linkedinUrl?: string;
    githubUrl?: string;
    company?: string;
    position?: string;
    industry?: string;
    experience?: string;
  };
}

interface AuthSession {
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  signUp: (email: string, password: string, role: UserRole, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<User['profileData']>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('nextStep_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await API.get('/auth/me');
      if (response.success) {
        setUser(response.data.user);
        setSession({ user: response.data.user });
      } else {
        localStorage.removeItem('nextStep_token');
      }
    } catch (error) {
      localStorage.removeItem('nextStep_token');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, fullName: string) => {
    try {
      const response = await API.post('/auth/register', {
        email,
        password,
        role,
        fullName
      });

      if (response.success) {
        localStorage.setItem('nextStep_token', response.data.token);
        setUser(response.data.user);
        setSession({ user: response.data.user });
        return { error: null };
      } else {
        return { error: { message: response.message || 'Registration failed' } };
      }
    } catch (error: any) {
      return { error: { message: error.message || 'Registration failed. Please try again.' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await API.post('/auth/login', {
        email,
        password
      });

      if (response.success) {
        localStorage.setItem('nextStep_token', response.data.token);
        setUser(response.data.user);
        setSession({ user: response.data.user });
        return { error: null };
      } else {
        return { error: { message: response.message || 'Login failed' } };
      }
    } catch (error: any) {
      return { error: { message: error.message || 'Login failed. Please check your credentials.' } };
    }
  };

  const signOut = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('nextStep_token');
      setUser(null);
      setSession(null);
    }
  };

  const updateProfile = async (profileData: Partial<User['profileData']>) => {
    if (!user) {
      return { error: { message: 'No user logged in' } };
    }

    try {
      const response = await API.put('/profiles/me', profileData);
      
      if (response.success) {
        const updatedUser = {
          ...user,
          profileData: {
            ...user.profileData,
            ...profileData
          }
        };
        
        setUser(updatedUser);
        setSession({ user: updatedUser });
        return { error: null };
      } else {
        return { error: { message: response.message || 'Failed to update profile' } };
      }
    } catch (error: any) {
      return { error: { message: error.message || 'Failed to update profile' } };
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