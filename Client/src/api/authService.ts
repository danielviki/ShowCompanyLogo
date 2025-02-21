import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data;
  }
};

export const companyService = {
  getCompanies: async () => {
    const response = await apiClient.get('/companies');
    return response.data;
  },
  getCompanyLogo: async (companyId: number) => {
    const response = await apiClient.get(`/companies/${companyId}/logo`);
    return response.data;
  }
};
