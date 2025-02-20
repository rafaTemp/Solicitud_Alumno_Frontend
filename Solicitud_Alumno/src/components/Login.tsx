import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from './AuthContexType';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('teacher'); // Por defecto, el rol es 'teacher'
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await api.post('/login', { type: role, email, password });

      if (response.status !== 200) {
        throw new Error('Error en la autenticación');
      }

      const data = response.data;
      console.log('Usuario autenticado:', data);

      // Almacenar el token y el rol en localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('role', role);

      // Llamar a la función login del contexto de autenticación
      login(data.token, role);
  // Redirigir según el rol del usuario
    if (role === 'teacher') {
    navigate('/student'); // Redirige al usuario a la página de listas de estudiantes
  } else {
    navigate('/request'); // Redirige al usuario a la página principal de estudiantes
  } 
    } catch (error) {
      setError('Credenciales incorrectas');
      console.error('Error en la autenticación:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'teacher' | 'student')}
            required
          >
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}