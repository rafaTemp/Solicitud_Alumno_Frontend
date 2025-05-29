import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../login/AuthContexType';
import toast from 'react-hot-toast';

export default function EditStudentProfile() {
  const { role } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [group, setGroup] = useState('');
  const [course, setCourse] = useState('');
  const [password, setPassword] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar datos actuales del usuario y el enlace al CV
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await api.get('/user');
        const studentRes = await api.get(`/student/${userRes.data.id}`);
        const student = studentRes.data.student || studentRes.data; // según cómo devuelvas el JSON
        setName(student.name || '');
        setEmail(student.email || '');
        setDni(student.dni || '');
        setGroup(student.group || '');
        setCourse(student.course || '');
        setCvUrl(studentRes.data.cv_url || null);
      } catch {
        setError('No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validación de grupo y curso
    const validGroups = ['1-ASIR', '2-ASIR', '1-DAW', '2-DAW', '1-DAM', '2-DAM'];
    const validCourses = ['24/25', '25/26', '26/27'];

    if (!validGroups.includes(group)) {
      setError('Grupo inválido');
      return;
    }
    if (!validCourses.includes(course)) {
      setError('Curso inválido');
      return;
    }
    if (!password) {
      setError('La contraseña es obligatoria para editar el perfil.');
      return;
    }

    try {
      setError('');
      // Obtén el id del usuario desde el backend
      const userRes = await api.get('/user');
      const userId = userRes.data.id;

      // Usar FormData para enviar datos y archivo
      const formData = new FormData();
      formData.append('name', name ?? '');
      formData.append('email', email ?? '');
      formData.append('dni', dni ?? '');
      formData.append('group', group ?? '');
      formData.append('course', course ?? '');
      formData.append('password', password ?? '');
      if (cvFile) {
        formData.append('CV', cvFile);
      }
      formData.append('_method', 'PUT');

      const res = await api.post(`/student/${userId}`, formData);

      // Actualiza el enlace al CV si se subió uno nuevo
      setCvUrl(res.data.cv_url || null);

      toast.success('Perfil actualizado');
      navigate('/profile');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(Object.values(err.response.data.errors).flat().join(' '));
      } else {
        setError('Error al actualizar el perfil');
      }
      toast.error('Error al actualizar el perfil');
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Cargando perfil...</div>;
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src="/logo.png" alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Editar perfil de estudiante
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="dni" className="block text-sm font-medium text-gray-900">
              DNI
            </label>
            <input
              type="text"
              id="dni"
              value={dni}
              onChange={e => setDni(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-900">
              Grupo
            </label>
            <select
              id="group"
              value={group}
              onChange={e => setGroup(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            >
              <option value="">Selecciona grupo</option>
              <option value="1-ASIR">1-ASIR</option>
              <option value="2-ASIR">2-ASIR</option>
              <option value="1-DAW">1-DAW</option>
              <option value="2-DAW">2-DAW</option>
              <option value="1-DAM">1-DAM</option>
              <option value="2-DAM">2-DAM</option>
            </select>
          </div>
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-900">
              Curso
            </label>
            <select
              id="course"
              value={course}
              onChange={e => setCourse(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            >
              <option value="">Selecciona curso</option>
              <option value="24/25">24/25</option>
              <option value="25/26">25/26</option>
              <option value="26/27">26/27</option>
            </select>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="CV" className="block text-sm font-medium text-gray-900">
              Currículum (PDF)
            </label>
            <input
              type="file"
              id="CV"
              accept="application/pdf"
              onChange={e => setCvFile(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-gray-900"
            />
            {/* Mostrar enlace al PDF si existe */}
            {cvUrl && (
              <div className="mt-2">
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Ver currículum actual
                </a>
              </div>
            )}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-green-600"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}