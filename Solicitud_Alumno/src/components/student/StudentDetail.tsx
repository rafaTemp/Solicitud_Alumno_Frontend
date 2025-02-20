import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentById } from "../../service/studentService";

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await getStudentById(Number(id));
        setStudent(data);
      } catch (error) {
        console.error("Error al obtener el estudiante:", error);
      }
    };

    fetchStudent();
  }, [id]);

  if (!student) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Detalles del Estudiante</h2>
      <p><strong>ID:</strong> {student.id}</p>
      <p><strong>Nombre:</strong> {student.name}</p>
      <p><strong>Email:</strong> {student.email}</p>
      {/* Agrega más detalles según sea necesario */}
    </div>
  );
};

export default StudentDetail;