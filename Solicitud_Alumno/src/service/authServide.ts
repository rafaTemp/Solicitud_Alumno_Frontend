import api from '../api';

export const loginUser = async (email: string, password: string, role: 'teacher' | 'student') => {
  try {
    const response = await api.post('/login', { type: role, email, password });
    return response.data;
  } catch (error) {
    console.error('Error en la autenticación:', error);
    throw error;
  }
};