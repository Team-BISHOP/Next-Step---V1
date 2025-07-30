const API_BASE_URL = "https://localhost:7010/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: string;
    profileData?: any;
  };
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return await response.json();
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    return this.handleResponse<LoginResponse>(response);
  }

  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse<LoginResponse>(response);
  }

  // Courses
  async getCourses(
    level?: string,
    category?: string
  ): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (level) params.append("level", level);
    if (category) params.append("category", category);

    const response = await fetch(`${API_BASE_URL}/Courses?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getCourse(courseId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Courses/${courseId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async enrollInCourse(courseId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Courses/${courseId}/enroll`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async updateCourseProgress(
    courseId: number,
    progress: number
  ): Promise<ApiResponse<any>> {
    const response = await fetch(
      `${API_BASE_URL}/Courses/${courseId}/progress`,
      {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ progress }),
      }
    );
    return this.handleResponse<any>(response);
  }

  async completeCourse(courseId: number): Promise<ApiResponse<any>> {
    const response = await fetch(
      `${API_BASE_URL}/Courses/${courseId}/complete`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<any>(response);
  }

  // Profile
  async getMyProfile(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Profiles/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async updateMyProfile(profileData: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Profiles/me`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return this.handleResponse<any>(response);
  }

  async getPublicProfile(userId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Profiles/${userId}/public`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async getStudentProfiles(
    page = 1,
    pageSize = 20
  ): Promise<ApiResponse<any[]>> {
    const response = await fetch(
      `${API_BASE_URL}/Profiles/students?page=${page}&pageSize=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<any[]>(response);
  }

  // Projects
  async getProjects(userId?: number): Promise<ApiResponse<any[]>> {
    const params = userId ? `?userId=${userId}` : "";
    const response = await fetch(`${API_BASE_URL}/Projects${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any[]>(response);
  }

  async getProject(projectId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Projects/${projectId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  async createProject(projectData: any): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Projects`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return this.handleResponse<any>(response);
  }

  async updateProject(
    projectId: number,
    projectData: any
  ): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Projects/${projectId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(projectData),
    });
    return this.handleResponse<any>(response);
  }

  async deleteProject(projectId: number): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Projects/${projectId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  // Leaderboard
  async getLeaderboard(page = 1, pageSize = 50): Promise<ApiResponse<any[]>> {
    const response = await fetch(
      `${API_BASE_URL}/Leaderboard?page=${page}&pageSize=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse<any[]>(response);
  }

  async getMyRank(): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Leaderboard/my-rank`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<any>(response);
  }

  // Subscription
  async subscribe(subscriptionData: {
    email: string;
    fullName?: string;
    serviceType?: string;
  }): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Subscription/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscriptionData),
    });
    return this.handleResponse<any>(response);
  }

  async unsubscribe(unsubscribeData: {
    email: string;
    serviceType?: string;
  }): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/Subscription/unsubscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(unsubscribeData),
    });
    return this.handleResponse<any>(response);
  }
}

export const apiService = new ApiService();
export default apiService;
