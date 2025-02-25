import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../service/authServide';

export default function Register() {
  const [type] = useState('student'); // Siempre es 'student'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState(''); // Agregado el estado para DNI
  const [group, setGroup] = useState('');
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validación de 'group' y 'course'
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

    try {
      const data = await registerUser(name, email, password, dni, type, group, course); 
      console.log('Usuario registrado:', data);
      navigate('/login');
    } catch (error) {
      setError('Error en el registro');
      console.error('Error en el registro:', error);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src="/logo.png" alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create a student account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
          {/* Agregar campo DNI */}
          <div>
            <label htmlFor="dni" className="block text-sm font-medium text-gray-900">
              DNI
            </label>
            <input
              type="text"
              id="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="group" className="block text-sm font-medium text-gray-900">
              Group
            </label>
            <select
              id="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            >
              <option value="">Select Group</option>
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
              Course
            </label>
            <select
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
              className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 outline-gray-300 focus:outline-indigo-600 sm:text-sm"
            >
              <option value="">Select Course</option>
              <option value="24/25">24/25</option>
              <option value="25/26">25/26</option>
              <option value="26/27">26/27</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
