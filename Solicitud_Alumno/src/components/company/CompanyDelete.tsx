import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { deleteCompany } from "../../service/companyService";

const CompanyDelete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    const handleDelete = async () => {
      try {
        await deleteCompany(Number(id));
        history.push("/company");
      } catch (error) {
        console.error("Error al eliminar la compañía:", error);
      }
    };

    handleDelete();
  }, [id, history]);

  return (
    <div className="container mt-5">
      <h2>Eliminando compañia...</h2>
    </div>
  );
};

export default CompanyDelete;