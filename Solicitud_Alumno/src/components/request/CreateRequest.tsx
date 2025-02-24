import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRequest } from '../../service/request';
import { useAuth } from '../login/AuthContexType';
import api from '../../api';
import { ICompany } from '../../interfaces/ICompany';

const CreateRequest: React.FC = () => {
  const [companyId, setCompanyId] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
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
      fetchCompanies();
    }
  }, [isAuthenticated, role]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        await createRequest(userId, companyId, question);
        navigate('/request'); // Redirige a la lista de solicitudes después de crear una nueva
      }
    } catch (error) {
      setError('Error al crear la solicitud');
      console.error('Error al crear la solicitud:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Crear Solicitud</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
            Compañía
          </label>
          <select
            id="companyId"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Seleccione una compañía</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            Pregunta
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Crear Solicitud
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRequest;