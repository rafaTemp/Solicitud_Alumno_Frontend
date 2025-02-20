import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteStudent } from "../../service/studentService";

const StudentDelete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const handleDelete = async () => {
      try {
        await deleteStudent(Number(id));
        navigate("/student");
      } catch (error) {
        console.error("Error al eliminar el estudiante:", error);
      }
    };

    handleDelete();
  }, [id, navigate]);

  return (
    <div className="container mt-5">
      <h2>Eliminando estudiante...</h2>
    </div>
  );
};

export default StudentDelete;