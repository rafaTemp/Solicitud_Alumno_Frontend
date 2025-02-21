import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createCompany } from "../../service/companyService";
import { ICompany } from "../../interfaces/ICompany";
const CompanyCreate: React.FC = () => {
  const [company, setCompany] = useState<ICompany>({
    id: 0,
    website: "",
    name: "",
    NIF: "",
  });
  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCompany(company);
      history.push("/company");
    } catch (error) {
      console.error("Error al crear la compañía:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Crear Compañía</h2>
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
        <button type="submit" className="btn btn-primary mt-3">Crear</button>
      </form>
    </div>
  );
};

export default CompanyCreate;
