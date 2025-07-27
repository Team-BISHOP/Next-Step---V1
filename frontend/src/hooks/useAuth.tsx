import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api';

export type UserRole = 'student' | 'industry_expert';

interface User {
    id: number;
    fullName: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>;
    signUp: (email: string, password: string, role: UserRole, fullName: string) => Promise<{ error?: { message: string } }>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const token = localStorage.getItem('nextStep_token');
        if (token) {
            // For now, we'll trust the token exists
            // Later you can add token validation
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const response = await apiClient.login({ email, password });

            if (response.success && response.data?.data) {
                const userData = response.data.data;
                setUser(userData.user);
                return {};
            } else {
                return { error: { message: response.message || 'Login failed' } };
            }
        } catch (error: any) {
            return { error: { message: error.message || 'Login failed' } };
        }
    };

    const signUp = async (email: string, password: string, role: UserRole, fullName: string) => {
        try {
            const response = await apiClient.register({
                email,
                password,
                role,
                fullName
            });

            if (response.success && response.data?.data) {
                const userData = response.data.data;
                setUser(userData.user);
                return {};
            } else {
                return { error: { message: response.message || 'Registration failed' } };
            }
        } catch (error: any) {
            return { error: { message: error.message || 'Registration failed' } };
        }
    };

    const signOut = () => {
        localStorage.removeItem('nextStep_token');
        apiClient.setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
