const API_BASE_URL = "http://localhost:3001/api";

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  amount: string;
  description: string;
  date: string;
  createdAt: string;
  category: Category;
}

class ApiClient {
  private getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      ...this.getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(url, {
      headers: headers as Record<string, string>,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async getExpenses(): Promise<Expense[]> {
    return this.request("/expenses");
  }

  async createExpense(
    amount: number,
    description: string,
    categoryId: string
  ): Promise<Expense> {
    return this.request("/expenses", {
      method: "POST",
      body: JSON.stringify({ amount, description, categoryId }),
    });
  }

  async getCategories(): Promise<Category[]> {
    return this.request("/categories");
  }
}

export const apiClient = new ApiClient();
