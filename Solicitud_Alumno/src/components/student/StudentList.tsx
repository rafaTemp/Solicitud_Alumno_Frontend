import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteStudent, getStudents, updateStudent, getStudentById, createStudent } from "../../service/studentService";
import { useAuth } from "../login/AuthContexType";
import { FaEdit, FaSave, FaTrash, FaPlus } from "react-icons/fa";

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
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

  const toggleStudentInfo = async (id: number) => {
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent(null);
    } else {
      try {
        const student = await getStudentById(id);
        setSelectedStudent(student);
      } catch (error) {
        console.error("Error al obtener el estudiante:", error);
      }
    }
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleEditClick = async (id: number) => {
    if (!selectedStudent || selectedStudent.id !== id) {
      await toggleStudentInfo(id);
    }
    setIsEditing(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    setSelectedStudent({ ...selectedStudent, [field]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const newStudent = { ...selectedStudent };
        console.log("Datos que se envían al servidor para crear:", newStudent);
        const savedStudent = await createStudent(newStudent);
        setStudents([...students, savedStudent]);
        window.location.reload(); // Recargar la página después de crear un nuevo estudiante
      } else {
        await updateStudent(selectedStudent.id, selectedStudent);
        setStudents(students.map(student => student.id === selectedStudent.id ? selectedStudent : student));
      }
      setIsEditing(false);
      setIsCreating(false);
      setSelectedStudent(null);
      setErrors({});
    } catch (error: any) {
      console.error("Error al guardar el estudiante:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const handleCreateClick = () => {
    setSelectedStudent({ name: "", email: "", dni: "", group: "1-ASIR", course: "24/25", password: "" });
    setIsCreating(true);
    setIsEditing(true);
    setErrors({});
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Lista de Estudiantes</h2>
      <button onClick={handleCreateClick} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
        <FaPlus className="mr-2" /> Crear Alumno
      </button>
      <ul className="divide-y divide-gray-300">
        {students.map((student) => (
          <li key={student.id} className="p-4">
            <div className="flex justify-between items-center">
              <button onClick={() => toggleStudentInfo(student.id)} className="text-lg font-semibold text-blue-600 hover:underline">
                {student.name}
              </button>
              <div className="flex space-x-4">
                <button onClick={() => handleEditClick(student.id)} className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(student.id)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
                  <FaTrash />
                </button>
              </div>
            </div>
            {selectedStudent && selectedStudent.id === student.id && (
              <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["name", "email", "dni", "password"].map((field) => (
                    <div key={field} className="flex flex-col">
                      <label className="text-gray-700 font-semibold capitalize">{field}:</label>
                      <input
                        type={field === "password" ? "password" : "text"}
                        value={selectedStudent[field] || ""}
                        onChange={(e) => handleEditChange(e, field)}
                        className="border border-gray-300 rounded p-2 mt-1"
                        disabled={!isEditing}
                      />
                      {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
                    </div>
                  ))}
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Grupo:</label>
                    <select
                      value={selectedStudent.group || ""}
                      onChange={(e) => handleEditChange(e, 'group')}
                      className="border border-gray-300 rounded p-2 mt-1"
                      disabled={!isEditing}
                    >
                      <option value="1-ASIR">1-ASIR</option>
                      <option value="2-ASIR">2-ASIR</option>
                      <option value="1-DAW">1-DAW</option>
                      <option value="2-DAW">2-DAW</option>
                      <option value="1-DAM">1-DAM</option>
                      <option value="2-DAM">2-DAM</option>
                    </select>
                    {errors.group && <span className="text-red-500 text-sm">{errors.group}</span>}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-semibold">Curso:</label>
                    <select
                      value={selectedStudent.course || ""}
                      onChange={(e) => handleEditChange(e, 'course')}
                      className="border border-gray-300 rounded p-2 mt-1"
                      disabled={!isEditing}
                    >
                      <option value="24/25">24/25</option>
                      <option value="25/26">25/26</option>
                      <option value="26/27">26/27</option>
                    </select>
                    {errors.course && <span className="text-red-500 text-sm">{errors.course}</span>}
                  </div>
                </div>
                {isEditing && (
                  <button onClick={handleSave} className="mt-6 flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    <FaSave className="mr-2" /> Guardar cambios
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
        {isCreating && (
          <li className="p-4">
            <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["name", "email", "dni", "password"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="text-gray-700 font-semibold capitalize">{field}:</label>
                    <input
                      type={field === "password" ? "password" : "text"}
                      value={selectedStudent[field] || ""}
                      onChange={(e) => handleEditChange(e, field)}
                      className="border border-gray-300 rounded p-2 mt-1"
                    />
                    {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
                  </div>
                ))}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-semibold">Grupo:</label>
                  <select
                    value={selectedStudent.group || ""}
                    onChange={(e) => handleEditChange(e, 'group')}
                    className="border border-gray-300 rounded p-2 mt-1"
                  >
                    <option value="1-ASIR">1-ASIR</option>
                    <option value="2-ASIR">2-ASIR</option>
                    <option value="1-DAW">1-DAW</option>
                    <option value="2-DAW">2-DAW</option>
                    <option value="1-DAM">1-DAM</option>
                    <option value="2-DAM">2-DAM</option>
                  </select>
                  {errors.group && <span className="text-red-500 text-sm">{errors.group}</span>}
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-semibold">Curso:</label>
                  <select
                    value={selectedStudent.course || ""}
                    onChange={(e) => handleEditChange(e, 'course')}
                    className="border border-gray-300 rounded p-2 mt-1"
                  >
                    <option value="24/25">24/25</option>
                    <option value="25/26">25/26</option>
                    <option value="26/27">26/27</option>
                  </select>
                  {errors.course && <span className="text-red-500 text-sm">{errors.course}</span>}
                </div>
              </div>
              <button onClick={handleSave} className="mt-6 flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                <FaSave className="mr-2" /> Guardar cambios
              </button>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default StudentList;