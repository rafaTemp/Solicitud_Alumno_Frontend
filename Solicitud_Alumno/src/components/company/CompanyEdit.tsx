import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompanyById, updateCompany } from "../../service/companyService";
import { ICompany } from "../../interfaces/ICompany";

const CompanyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<ICompany>({
    id: 0,
    website: "",
    name: "",
    NIF: "",
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanyById(Number(id));
        setCompany(data);
      } catch (error) {
        console.error("Error al obtener la compañía:", error);
      }
    };

    fetchCompany();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompany(Number(id), company);
      navigate("/company");
    } catch (error) {
      console.error("Error al actualizar la compañía:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Editar Compañía</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" className="form-control" name="name" value={company.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Website:</label>
          <input type="text" className="form-control" name="website" value={company.website} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>NIF:</label>
          <input type="text" className="form-control" name="NIF" value={company.NIF} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Actualizar</button>
      </form>
    </div>
  );
};

export default CompanyEdit;
