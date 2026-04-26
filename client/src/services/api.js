import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('speakease_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('speakease_token');
            localStorage.removeItem('speakease_user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const googleAuth = (credential) => API.post('/auth/google', { credential });
export const getMe = () => API.get('/auth/me');
export const selectLanguage = (languageId) => API.put('/auth/select-language', { languageId });

// Languages
export const getLanguages = () => API.get('/languages');
export const getLanguage = (id) => API.get(`/languages/${id}`);
export const createLanguage = (data) => API.post('/languages', data);
export const updateLanguage = (id, data) => API.put(`/languages/${id}`, data);
export const deleteLanguage = (id) => API.delete(`/languages/${id}`);

// Lessons
export const getLessonsByLanguage = (langId) => API.get(`/lessons/language/${langId}`);
export const getLesson = (id) => API.get(`/lessons/${id}`);
export const getAllLessons = () => API.get('/lessons');
export const createLesson = (data) => API.post('/lessons', data);
export const updateLesson = (id, data) => API.put(`/lessons/${id}`, data);
export const deleteLesson = (id) => API.delete(`/lessons/${id}`);

// Quizzes
export const getQuizzesByLesson = (lessonId) => API.get(`/quizzes/lesson/${lessonId}`);
export const getQuiz = (id) => API.get(`/quizzes/${id}`);
export const getAllQuizzes = () => API.get('/quizzes');
export const createQuiz = (data) => API.post('/quizzes', data);
export const updateQuiz = (id, data) => API.put(`/quizzes/${id}`, data);
export const deleteQuiz = (id) => API.delete(`/quizzes/${id}`);

// Progress
export const getProgress = () => API.get('/progress');
export const completeLesson = (lessonId) => API.post('/progress/complete-lesson', { lessonId });
export const submitQuiz = (data) => API.post('/progress/submit-quiz', data);
export const getLeaderboard = () => API.get('/progress/leaderboard');

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = () => API.get('/admin/users');
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

export default API;
