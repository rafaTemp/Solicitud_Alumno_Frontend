import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../login/AuthContexType';
import { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } from '../../service/companyService';
import { ICompany } from '../../interfaces/ICompany';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';


const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || role !== 'teacher') {
      navigate('/login');
      return;
    }
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        if (Array.isArray(data)) {
          setCompanies(data);
        } else {
          console.error("La respuesta de la API no es un array:", data);
          setCompanies([]);
        }
      } catch (error) {
        toast.error("Error al obtener las compañías");
        console.error("Error al obtener las compañías:", error);
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, [isAuthenticated, role, navigate,]);

  const handleDelete = async (id: number) => {
    try {
      await deleteCompany(id);
      setCompanies(companies.filter(company => company.id !== id));
    } catch (error) {
      toast.error("Error al eliminar la compañía");
      console.error("Error al eliminar la compañía:", error);
    }
  };

  const toggleCompanyInfo = async (id: number) => {
    if (selectedCompany && selectedCompany.id === id) {
      setSelectedCompany(null);
    } else {
      try {
        const company = await getCompanyById(id);
        
        setSelectedCompany(company);
        toast.success('Empresa seleccionada');
        console.log("Datos de la empresa seleccionada:", company);
      } catch (error) {
        toast.error('Error al obtener la empresa');
        console.error('Error al obtener la empresa:', error);
      }
    }
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleEditClick = async (id: number) => {
    if (!selectedCompany || selectedCompany.id !== id) {
      await toggleCompanyInfo(id);
    }
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    if (selectedCompany) {
      setSelectedCompany({ ...selectedCompany, [field]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const newCompany: ICompany = {
          id: selectedCompany?.id ?? 0,
          name: selectedCompany?.name ?? '',
          website: selectedCompany?.website ?? '',
          NIF: selectedCompany?.NIF ?? ''
        };
        
        toast.success('Empresa creada');
        const savedCompany = await createCompany(newCompany);
        setCompanies([...companies, savedCompany]);
        window.location.reload(); // Recargar la página después de crear una nueva empresa
      } else {
        if (selectedCompany) {
          await updateCompany(selectedCompany.id, selectedCompany);
          setCompanies(companies.map(company => company.id === selectedCompany.id ? selectedCompany : company));
        }
      }
      setIsEditing(false);
      setIsCreating(false);
      setSelectedCompany(null);
      setErrors({});
    } catch (error: any) {
      toast.error("Error al guardar la compañía");
      console.error("Error al guardar la compañía:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const handleCreateClick = () => {
    setSelectedCompany({ id: 0, name: "", website: "", NIF: "" });
    setIsCreating(true);
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-xl rounded-lg">
      <button onClick={handleCreateClick} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
        Crear Empresa
      </button>
      <div className="relative flex w-full flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
        <nav className="flex flex-col gap-1 p-1.5">
          {companies.map((company) => (
            <div
              key={company.id}
              role="button"
              className="text-slate-800 flex w-full items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
              onClick={() => toggleCompanyInfo(company.id)}
            >
              <div>
                <h6 className="text-slate-800 font-medium">{company.name}</h6>
                <p className="text-slate-500 text-sm">{company.website}</p>
              </div>
              <div className="ml-auto flex space-x-4">
                <button onClick={(e) => { e.stopPropagation(); handleEditClick(company.id); }} className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600">
                  <FaEdit />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(company.id); }} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </nav>
      </div>
      {selectedCompany && !isCreating && (
        <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "website", "NIF"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-gray-700 font-semibold capitalize">{field}:</label>
                <input
                  type="text"
                  value={selectedCompany[field as keyof ICompany] || "" } // Asegura que haya un valor
                  onChange={(e) => handleEditChange(e, field)}
                  className="border border-gray-300 rounded p-2 mt-1"
                  disabled={!isEditing}
                />
                {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
              </div>
            ))}
          </div>
          {isEditing && (
            <button onClick={handleSave} className="mt-6 flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Guardar cambios
            </button>
          )}
        </div>
      )}
      {isCreating && (
        <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "website", "NIF"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-gray-700 font-semibold capitalize">{field}:</label>
                <input
                  type="text"
                  value={selectedCompany ? selectedCompany[field as keyof ICompany] : ""}
                  onChange={(e) => handleEditChange(e, field)}
                  className="border border-gray-300 rounded p-2 mt-1"
                />
                {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
              </div>
            ))}
          </div>
          <button onClick={handleSave} className="mt-6 flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyList;