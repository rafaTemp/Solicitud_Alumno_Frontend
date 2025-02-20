import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../login/AuthContexType';
import api from '../../api';
import Company from './Company';
import { ICompany, ICompanyData } from '../../interfaces/ICompany';

interface CompaniesListProps {
  onCompaniesLoaded: (companies: ICompanyData[]) => void;
}

export default function CompanyList({ onCompaniesLoaded }: CompaniesListProps) {
  const [companies, setCompanies] = useState<ICompanyData[]>([]);
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Esta validación ya se maneja en PrivateRoute, pero la dejamos por seguridad
    if (!isAuthenticated || role !== 'teacher') {
      navigate('/login');
      return;
    }

    api.get<ICompany>('/company')
      .then(response => {
        if (Array.isArray(response.data.data)) {
          setCompanies(response.data.data);
          onCompaniesLoaded(response.data.data);
        } else {
          console.error('Unexpected response data:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [isAuthenticated, role, navigate, onCompaniesLoaded]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Lista de Empresas</h1>
      <ul className="divide-y divide-gray-300">
        {companies.map(company => (
          <li key={company.NIF} className="py-2 flex items-center border-b border-gray-200">
            <Company {...company} />
          </li>
        ))}
      </ul>
    </div>
  );
}
