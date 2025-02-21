import api from "../api";

const API_URL = "/requests";

const getAuthToken = () => localStorage.getItem('authToken');

export const getCompanies = async () => {
  try {
    const response = await api.get('/company', {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener las compañías:", error);
    throw error;
  }
};

export const createRequest = async (studentId: string, companyId: string, question: string) => {
  try {
    const response = await api.post(API_URL, {
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