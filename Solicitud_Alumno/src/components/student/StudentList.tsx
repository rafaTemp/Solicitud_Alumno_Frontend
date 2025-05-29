import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteStudent, getStudents, updateStudent, getStudentById, createStudent, getStudentRequests } from "../../service/studentService";
import { useAuth } from "../login/AuthContexType";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../api"; // Asegúrate de tener tu instancia de axios aquí

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [studentRequests, setStudentRequests] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [cvFile, setCvFile] = useState<File | null>(null);
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
        // getStudentById debe devolver { student: {...}, cv_url: "..." }
        const studentRes = await getStudentById(id);
        const student = studentRes.student || studentRes;
        const requests = await getStudentRequests(id);
        setSelectedStudent({
          ...student,
          cv_url: studentRes.cv_url, // añade el enlace al PDF
        });
        setStudentRequests(requests);
        setCvFile(null);
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
    if (field === "CV" && e.target instanceof HTMLInputElement && e.target.files) {
      setCvFile(e.target.files[0]);
    } else {
      setSelectedStudent({ ...selectedStudent, [field]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const newStudent = { ...selectedStudent };
        const savedStudent = await createStudent(newStudent);
        setStudents([...students, savedStudent]);
        window.location.reload();
        toast.success("Estudiante creado con éxito", { duration: 2000 });
      } else {
        // Editar estudiante con FormData (igual que en profile)
        const formData = new FormData();
        formData.append('name', selectedStudent.name ?? '');
        formData.append('email', selectedStudent.email ?? '');
        formData.append('dni', selectedStudent.dni ?? '');
        formData.append('group', selectedStudent.group ?? '');
        formData.append('course', selectedStudent.course ?? '');
        formData.append('password', selectedStudent.password ?? '');
        if (cvFile) {
          formData.append('CV', cvFile);
        }
        formData.append('_method', 'PUT');
        await api.post(`/student/${selectedStudent.id}`, formData);
        toast.success("Estudiante actualizado con éxito", { duration: 2000 });
        setCvFile(null);
        setIsEditing(false);
        setIsCreating(false);
        setSelectedStudent(null);
        setErrors({});
        // Refresca la lista
        const data = await getStudents();
        setStudents(data);
      }
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
    setCvFile(null);
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
            {/* Input para el archivo PDF */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold">Currículum (PDF):</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => handleEditChange(e, "CV")}
                className="border border-gray-300 rounded p-2 mt-1"
                disabled={!isEditing}
              />
              {/* Mostrar enlace al currículum si existe */}
              {selectedStudent.cv_url && (
                <div className="mt-2">
                  <a
                    href={selectedStudent.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Ver currículum PDF
                  </a>
                </div>
              )}
              {errors.CV && <span className="text-red-500 text-sm">{errors.CV}</span>}
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