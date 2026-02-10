import client from './client';

export const dashboardService = {
    getAdminStats: () => client.get('/dashboard/stats'),
    getCandidateStats: (userId: number) => client.get(`/dashboard/candidate/${userId}`),
};

export const authService = {
    login: (credentials: any) => client.post('/auth/login', credentials),
    // Add more auth methods here
};
