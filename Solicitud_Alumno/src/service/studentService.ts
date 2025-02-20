import axios from "axios";
import { IStudent } from "../interfaces/IStudent";
import api from "../api";

const API_URL = "/student";

const getAuthToken = () => localStorage.getItem('authToken');

export const getStudents = async () => {
  try {
    const response = await api.get(API_URL, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los estudiantes:", error);
    throw error;
  }
};

export const getStudentById = async (id: number) => {
  try {
    const response = await api.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el estudiante:", error);
    throw error;
  }
};

export const createStudent = async (studentData: any) => {
  try {
    const response = await api.post(API_URL, studentData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear el estudiante:", error);
    throw error;
  }
};

export const updateStudent = async (id: number, studentData: Partial<IStudent>): Promise<IStudent> => {
  try {
    const response = await api.put(`${API_URL}/${id}`, studentData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el estudiante:", error);
    throw error;
  }
};

export const deleteStudent = async (id: number) => {
  try {
    await api.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
  } catch (error) {
    console.error("Error al eliminar el estudiante:", error);
    throw error;
  }
};