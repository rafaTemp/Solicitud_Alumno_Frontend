import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteStudent, getStudents, updateStudent, getStudentById, createStudent, getStudentRequests } from "../../service/studentService";
import { useAuth } from "../login/AuthContexType";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast  from "react-hot-toast";


const StudentList: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [studentRequests, setStudentRequests] = useState<any[]>([]);
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
  }, [isAuthenticated, role, navigate]);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este estudiante?");
    if (confirmDelete) {
      try {
        await deleteStudent(id);
        setStudents(students.filter(student => student.id !== id));
        toast.success("Estudiante eliminado con éxito", { duration: 2000 });
      } catch (error) {
        console.error("Error al eliminar el estudiante:", error);
        toast.error("Error al eliminar el estudiante", { duration: 2000 });
      }
    }
  };

  const toggleStudentInfo = async (id: number) => {
    if (selectedStudent && selectedStudent.id === id) {
      setSelectedStudent(null);
      setStudentRequests([]);
    } else {
      try {
        const student = await getStudentById(id);
        const requests = await getStudentRequests(id);
        setSelectedStudent(student);
        setStudentRequests(requests);
        console.log("selectedStudent", student);
        console.log("studentRequests", requests);
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
    setIsCreating(false);
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
        window.location.reload();
        toast.success("Estudiante creado con éxito", { duration: 2000 });
      } else {
        await updateStudent(selectedStudent.id, selectedStudent);
        setStudents(students.map(student => student.id === selectedStudent.id ? selectedStudent : student));
        toast.success("Estudiante actualizado con éxito", { duration: 2000 });
      }
      setIsEditing(false);
      setIsCreating(false);
      setSelectedStudent(null);
      setErrors({});
    } catch (error: any) {
      console.error("Error al guardar el estudiante:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      toast.error("Error al guardar el estudiante", { duration: 2000 });
    }
  };

  const handleCreateClick = () => {
    setSelectedStudent({ name: "", email: "", dni: "", group: "1-ASIR", course: "24/25", password: "" });
    setIsCreating(true);
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="container mx-auto mt-8 p-6 bg-white shadow-xl rounded-lg">
      <button onClick={handleCreateClick} className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
        Crear Alumno
      </button>
      <div className="relative flex w-full flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
        <nav className="flex flex-col gap-1 p-1.5">
          {students.map((student) => (
            <div
              key={student.id}
              role="button"
              className="text-slate-800 flex w-full items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
              onClick={() => toggleStudentInfo(student.id)}
            >
              <div>
                <h6 className="text-slate-800 font-medium">{student.name}</h6>
                <p className="text-slate-500 text-sm">{student.email}</p>
              </div>
              <div className="ml-auto flex space-x-4">
                <button onClick={(e) => { e.stopPropagation(); handleEditClick(student.id); }} className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600">
                  <FaEdit />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(student.id); }} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </nav>
      </div>
      {selectedStudent && !isCreating && (
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
              Guardar cambios
            </button>
          )}
          <div className="mt-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Solicitudes del Estudiante</h3>
            <ul className="divide-y divide-gray-300">
              {studentRequests.map((request) => (
                <li key={request.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold ">{request.company.name}</span>
                    <span className="text-gray-600">{request.question}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {isCreating && (
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
            Guardar cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentList;