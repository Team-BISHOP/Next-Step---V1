const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7000/api';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

class ApiClient {
    private baseURL: string;
    private token: string | null;

    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('nextStep_token');
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('nextStep_token', token);
        } else {
            localStorage.removeItem('nextStep_token');
        }
    }

    getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        return headers;
    }

    async request(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
        const url = `${this.baseURL}${endpoint}`;
        const config: RequestInit = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'API request failed'
                };
            }

            return {
                success: true,
                data,
                message: data.message
            };
        } catch (error: any) {
            console.error('API request error:', error);
            return {
                success: false,
                message: error.message || 'Network error'
            };
        }
    }

    // Generic HTTP methods
    async get(endpoint: string): Promise<ApiResponse> {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint: string, data?: any): Promise<ApiResponse> {
        return this.request(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put(endpoint: string, data?: any): Promise<ApiResponse> {
        return this.request(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete(endpoint: string): Promise<ApiResponse> {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Auth endpoints
    async register(userData: any): Promise<ApiResponse> {
        return this.post('/auth/register', userData);
    }

    async login(credentials: any): Promise<ApiResponse> {
        const response = await this.post('/auth/login', credentials);

        if (response.success && response.data?.data?.token) {
            // Backend returns { success: true, data: { token: "...", user: {...} } }
            this.setToken(response.data.data.token);
        }

        return response;
    }

    async logout(): Promise<ApiResponse> {
        try {
            const response = await this.post('/auth/logout');
            return response;
        } finally {
            this.setToken(null);
        }
    }

    async getCurrentUser(): Promise<ApiResponse> {
        return this.get('/auth/me');
    }

    async changePassword(passwordData: any): Promise<ApiResponse> {
        return this.put('/auth/change-password', passwordData);
    }

    // Profile endpoints
    async getMyProfile(): Promise<ApiResponse> {
        return this.get('/profiles/me');
    }

    async updateMyProfile(profileData: any): Promise<ApiResponse> {
        return this.put('/profiles/me', profileData);
    }

    async getUserProfile(userId: string): Promise<ApiResponse> {
        return this.get(`/profiles/${userId}`);
    }

    async getStudentProfiles(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/profiles?${queryString}`);
    }

    async addSkill(skill: string): Promise<ApiResponse> {
        return this.post('/profiles/skills', { skill });
    }

    // Analytics endpoints
    async getMyAnalytics(): Promise<ApiResponse> {
        return this.get('/analytics/me');
    }

    async getUserAnalytics(userId: string): Promise<ApiResponse> {
        return this.get(`/analytics/user/${userId}`);
    }

    // Achievements endpoints
    async getMyAchievements(): Promise<ApiResponse> {
        return this.get('/achievements/me');
    }

    async getUserAchievements(userId: string): Promise<ApiResponse> {
        return this.get(`/achievements/user/${userId}`);
    }

    async getAchievementTemplates(): Promise<ApiResponse> {
        return this.get('/achievements/templates');
    }

    // Leaderboard endpoints
    async getLeaderboard(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/leaderboard?${queryString}`);
    }

    async getUserRank(userId: string, category = 'overall'): Promise<ApiResponse> {
        return this.get(`/leaderboard/user/${userId}/rank?category=${category}`);
    }

    // Courses endpoints
    async getCourses(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryString = new URLSearchParams(params).toString();
        return this.get(`/courses?${queryString}`);
    }

    async getCourse(courseId: string): Promise<ApiResponse> {
        return this.get(`/courses/${courseId}`);
    }

    async enrollInCourse(courseId: string): Promise<ApiResponse> {
        return this.post(`/courses/${courseId}/enroll`);
    }

    async getFeaturedCourses(): Promise<ApiResponse> {
        return this.get('/courses/featured/list');
    }

    // Quiz endpoints
    async getQuizQuestions(): Promise<ApiResponse> {
        return this.get('/quiz/questions');
    }

    async submitQuiz(answers: any): Promise<ApiResponse> {
        return this.post('/quiz/submit', { answers });
    }

    async getQuizResults(userId: string): Promise<ApiResponse> {
        return this.get(`/quiz/results/${userId}`);
    }

    // Upload endpoints
    async uploadAvatar(file: File): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append('avatar', file);

        return this.request('/upload/avatar', {
            method: 'POST',
            headers: {
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
            },
            body: formData,
        });
    }

    async uploadProjectFiles(files: File[]): Promise<ApiResponse> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        return this.request('/upload/project', {
            method: 'POST',
            headers: {
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
            },
            body: formData,
        });
    }

    // Users endpoints
    async updateUser(userData: any): Promise<ApiResponse> {
        return this.put('/users/me', userData);
    }

    async deactivateAccount(): Promise<ApiResponse> {
        return this.delete('/users/me');
    }

    async getPlatformStats(): Promise<ApiResponse> {
        return this.get('/users/stats');
    }

    // Health check
    async healthCheck(): Promise<ApiResponse> {
        return this.get('/health');
    }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
