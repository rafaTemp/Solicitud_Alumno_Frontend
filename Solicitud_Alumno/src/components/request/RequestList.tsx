import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentRequests, deleteRequest, updateRequest, getRequestById, getStudentById } from '../../service/request';
import { useAuth } from '../login/AuthContexType';
import { FaEdit, FaSave, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../../api';
import { ICompany } from '../../interfaces/ICompany';

const RequestList: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await getStudentRequests(userId);
          const data = response.data;
          setRequests(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error al obtener las solicitudes:', error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await api.get('/company', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        setCompanies(response.data.data);
      } catch (error) {
        console.error('Error al obtener las compañías:', error);
      }
    };

    if (isAuthenticated && role === 'student') {
      fetchRequests();
      fetchCompanies();
    }
  }, [isAuthenticated, role]);

  const handleCreateRequest = () => {
    navigate('/requests/create');
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRequest(id);
      setRequests(requests.filter(request => request.id !== id));
    } catch (error) {
      console.error("Error al eliminar la solicitud:", error);
    }
  };

  const toggleRequestInfo = async (id: number) => {
    if (selectedRequest?.id === id) {
      setSelectedRequest(null);
    } else {
      try {
        const response = await getRequestById(id);
        const requestData = response.data;
        const studentResponse = await getStudentById(requestData.student_id);
        requestData.student = studentResponse;
        setSelectedRequest(requestData);
      } catch (error) {
        console.error("Error al obtener la solicitud:", error);
      }
    }
    setIsEditing(false);
  };

  const handleEditClick = async (id: number) => {
    if (!selectedRequest || selectedRequest.id !== id) {
      await toggleRequestInfo(id);
    }
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    setSelectedRequest({ ...selectedRequest, [field]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateRequest(selectedRequest.id, {
        question: selectedRequest.question,
        company_id: selectedRequest.company_id,
      });
  
      // Vuelve a obtener la lista de solicitudes actualizada
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await getStudentRequests(userId);
        setRequests(Array.isArray(response.data) ? response.data : []);
      }
  
      setIsEditing(false);
      setSelectedRequest(null);
      setErrors({});
    } catch (error: any) {
      console.error("Error al guardar la solicitud:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Lista de Solicitudes</h2>
      <button onClick={handleCreateRequest} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
        <FaPlus className="mr-2" /> Crear Solicitud
      </button>
      <ul className="divide-y divide-gray-300">
        {requests.map((request) => (
          <li key={request.id} className="p-4">
            <div className="flex justify-between items-center">
              <button onClick={() => toggleRequestInfo(request.id)} className="text-lg font-semibold text-blue-600 hover:underline">
                {request.company.name}
              </button>
              <div className="flex space-x-4">
                <button onClick={() => handleEditClick(request.id)} className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(request.id)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
                  <FaTrash />
                </button>
              </div>
            </div>
            {selectedRequest?.id === request.id && (
              <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Pregunta:</label>
                    <input
                      type="text"
                      value={selectedRequest.question || ""}
                      onChange={(e) => handleEditChange(e, 'question')}
                      className="border border-gray-300 rounded p-2 mt-1"
                      disabled={!isEditing}
                    />
                    {errors.question && <span className="text-red-500 text-sm">{errors.question}</span>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Compañía:</label>
                    {isEditing ? (
                      <select
                        value={selectedRequest.company_id || ""}
                        onChange={(e) => handleEditChange(e, "company_id")}
                        className="border border-gray-300 rounded p-2 mt-1"
                      >
                        <option value="">Seleccione una compañía</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={selectedRequest.company?.name || ""}
                        className="border border-gray-300 rounded p-2 mt-1"
                        disabled
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Estudiante:</label>
                    <input
                      type="text"
                      value={selectedRequest.student?.name || ""}
                      className="border border-gray-300 rounded p-2 mt-1"
                      disabled
                    />
                  </div>
                </div>
                {isEditing && (
                  <button onClick={handleSave} className="mt-6 flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    <FaSave className="mr-2" /> Guardar cambios
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestList;
