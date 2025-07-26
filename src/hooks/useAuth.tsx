import { useState, useEffect, createContext, useContext } from 'react';

// Mock User and Session types since we removed supabase
interface User {
  id: string;
  email?: string;
}

interface Session {
  user: User;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock auth state - simulate loading for a moment then set no user
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // Mock sign up - simulate success
    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      email: email
    };
    
    setUser(mockUser);
    setSession({ user: mockUser });
    
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Mock sign in - simulate success
    const mockUser: User = {
      id: Math.random().toString(36).substring(7),
      email: email
    };
    
    setUser(mockUser);
    setSession({ user: mockUser });
    
    return { error: null };
  };

  const signOut = async () => {
    // Mock sign out
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
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