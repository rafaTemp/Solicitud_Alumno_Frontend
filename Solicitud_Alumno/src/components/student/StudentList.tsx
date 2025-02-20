import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteStudent, getStudents } from "../../service/studentService";
import { useAuth } from "../login/AuthContexType";

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
   const { isAuthenticated, role } = useAuth();
   const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || role !== 'teacher') {
      navigate('/login');
      return;
    }
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
      }
    };

    fetchStudents();
  }, []);
  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id);
      setStudents(students.filter(student => student.id !== id));
    } catch (error) {
      console.error("Error al eliminar el estudiante:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Lista de Estudiantes</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id} className="flex justify-between items-center">
            <Link to={`/student/${student.id}`}>{student.name}</Link>
            <div>
              <Link to={`/student/${student.id}/edit`} className="btn btn-primary mr-2">Editar</Link>
              <button onClick={() => handleDelete(student.id)} className="btn btn-danger">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;