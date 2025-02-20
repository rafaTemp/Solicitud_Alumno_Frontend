import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById, updateStudent } from "../../service/studentService";

const EditStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    dni: "",
    name: "",
    email: "",
    CV: "",
    group: "1-ASIR" as "1-ASIR" | "2-ASIR" | "1-DAW" | "2-DAW" | "1-DAM" | "2-DAM",
    course: "24/25" as "24/25" | "25/26" | "26/27" | undefined,
    password: "",
  });

  useEffect(() => {
    if (!isNaN(Number(id))) {
      getStudentById(Number(id)).then((data) => {
        setStudent({
          dni: data.dni || "",
          name: data.name || "",
          email: data.email || "",
          CV: data.CV || "",
          group: data.group || "1-ASIR",
          course: data.course || "24/25",
          password: data.password || "",
        });
      });
    } else {
      console.error("Invalid student ID:", id);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudent({ ...student, CV: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStudent(Number(id), student);
    navigate("/student");
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card w-75">
        <div className="card-body">
          <h2 className="card-title text-center">Editar Estudiante</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre</label>
              <input type="text" className="form-control" id="name" name="name" value={student.name} onChange={handleChange} placeholder="Nombre" />
            </div>
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input type="text" className="form-control" id="dni" name="dni" value={student.dni} onChange={handleChange} placeholder="DNI" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" className="form-control" id="email" name="email" value={student.email} onChange={handleChange} placeholder="Email" />
            </div>
            <div className="form-group">
              <label htmlFor="CV">CV (PDF)</label>
              <input type="file" className="form-control" id="CV" name="CV" accept=".pdf" onChange={handleFileChange} />
            </div>
            <div className="form-group">
              <label htmlFor="group">Grupo</label>
              <select className="form-control" id="group" name="group" value={student.group} onChange={handleChange}>
                <option value="1-ASIR">1-ASIR</option>
                <option value="2-ASIR">2-ASIR</option>
                <option value="1-DAW">1-DAW</option>
                <option value="2-DAW">2-DAW</option>
                <option value="1-DAM">1-DAM</option>
                <option value="2-DAM">2-DAM</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="course">Curso</label>
              <select className="form-control" id="course" name="course" value={student.course} onChange={handleChange}>
                <option value="24/25">24/25</option>
                <option value="25/26">25/26</option>
                <option value="26/27">26/27</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input type="password" className="form-control" id="password" name="password" value={student.password} onChange={handleChange} placeholder="Contraseña" />
            </div>
            <button type="submit" className="btn btn-primary w-100">Actualizar Estudiante</button>
          </form>
          <button onClick={() => navigate(-1)} className="btn btn-secondary mt-3 w-100">Volver</button>
        </div>    
      </div>
    </div>
  );
};

export default EditStudent;