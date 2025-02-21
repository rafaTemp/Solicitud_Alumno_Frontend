import api from "../api";

const getAuthToken = () => localStorage.getItem('authToken');

export const getStudentRequests = async (studentId: string) => {
  try {
    const response = await api.get(`/students/${studentId}/requests`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener solicitudes del estudiante:', error);
    throw error;
  }
};

export const getRequestById = async (id: number) => {
  try {
    const response = await api.get(`/requests/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener la solicitud:", error);
    throw error;
  }
};

export const createRequest = async (studentId: string, companyId: string, question: string) => {
  try {
    const response = await api.post('/request', {
      student_id: studentId,
      company_id: companyId,
      question: question,
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    throw error;
  }
};

export const updateRequest = async (id: string, requestData: any) => {
  try {
    const response = await api.put(`/request/${id}`, requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la solicitud:", error);
    throw error;
  }
};

export const deleteRequest = async (id: number) => {
  try {
    const response = await api.delete(`/requests/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la solicitud:", error);
    throw error;
  }
};

export const getStudentById = async (id: string) => {
  try {
    const response = await api.get(`/student/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el estudiante:", error);
    throw error;
  }
};