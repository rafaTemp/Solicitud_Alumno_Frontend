import { ICompany } from "../interfaces/ICompany";
import api from "../api";

const API_URL = "/company";

const getAuthToken = () => localStorage.getItem('authToken');

export const getCompanies = async (): Promise<ICompany[]> => {
  try {
    const response = await api.get(API_URL, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener las compañías:", error);
    throw error;
  }
};

export const getCompanyById = async (id: number): Promise<ICompany> => {
  try {
    const response = await api.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener la compañía:", error);
    throw error;
  }
};

export const createCompany = async (companyData: ICompany): Promise<ICompany> => {
  try {
    const response = await api.post(API_URL, companyData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al crear la compañía:", error);
    throw error;
  }
};

export const updateCompany = async (id: number, companyData: ICompany): Promise<ICompany> => {
  try {
    const response = await api.put(`${API_URL}/${id}`, companyData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error al actualizar la compañía:", error);
    throw error;
  }
};

export const deleteCompany = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
  } catch (error) {
    console.error("Error al eliminar la compañía:", error);
    throw error;
  }
};