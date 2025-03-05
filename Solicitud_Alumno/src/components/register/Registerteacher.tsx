import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerTeacher } from '../../service/authServide';
import toast from 'react-hot-toast';

export default function RegisterTeacher() {
  const [dni, setDni] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const data = await registerTeacher(name, email, password, dni, 'teacher');
      console.log('Profesor registrado:', data);
      toast.success('Profesor registrado');
      navigate('/student');
    } catch (error) {
      setError('Error en el registro');
      toast.error('Error en el registro');
      console.error('Error en el registro:', error);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto" src="/logo.png" alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create a teacher account
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
