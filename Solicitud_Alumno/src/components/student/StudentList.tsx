import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStudents } from "../../service/studentService";
import { useAuth } from "../AuthContexType";

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

  return (
    <div className="container mt-5">
      <h2>Lista de Estudiantes</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <Link to={`/student/${student.id}`}>{student.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;