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


export const registerUser = async (name: string, email: string, password: string, dni: string, type: string, group: string = '', course: string = '') => {
  try {
    const response = await api.post('/register', {
      name,
      email,
      password,
      dni,
      type,
      group,
      course,
    });
    return response.data;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
};
export const registerTeacher = async (name: string, email: string, password: string, dni: string, type: string) => {
  try {
    const response = await api.post('/register', {
      name,
      email,
      password,
      dni,
      type
     
    });
    return response.data;
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
};


