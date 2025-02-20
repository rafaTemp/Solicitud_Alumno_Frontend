import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../login/AuthContexType';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();

  // No mostrar el Navbar en la página de inicio de sesión
  if (location.pathname === '/login') {
    return null;
  }

  const handleLogoClick = () => {
    if (isAuthenticated) {
      if (role === 'student') {
        navigate('/request');
      } else if (role === 'teacher') {
        navigate('/student');
      }
    } else {
      navigate('/login');
    }
  };

  const renderLinks = () => {
    if (!isAuthenticated) {
      // Enlaces para usuarios no autenticados (aunque no se mostrarán porque el Navbar no se renderiza en /login)
      return (
       
          <Link
            to="/login"
           
          >
           
          </Link>
        
      );
    } else if (role === 'student') {
      // Enlaces para estudiantes
      return (
        <>
          <Link
            to="/request"
            className={`${
              location.pathname === '/request' ? 'text-gray-900 border-indigo-500' : 'text-gray-500 hover:text-gray-700 border-transparent'
            } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
          >
            Solicitudes
          </Link>
          <Link
            to="/perfil"
            className={`${
              location.pathname === '/perfil' ? 'text-gray-900 border-indigo-500' : 'text-gray-500 hover:text-gray-700 border-transparent'
            } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
          >
            Perfil
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-transparent"
          >
            Cerrar sesión
          </button>
        </>
      );
    } else if (role === 'teacher') {
      // Enlaces para profesores
      return (
        <>
          <Link
            to="/student"
            className={`${
              location.pathname === '/student' ? 'text-gray-900 border-indigo-500' : 'text-gray-500 hover:text-gray-700 border-transparent'
            } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
          >
            Estudiantes
          </Link>
          <Link
            to="/perfil"
            className={`${
              location.pathname === '/perfil' ? 'text-gray-900 border-indigo-500' : 'text-gray-500 hover:text-gray-700 border-transparent'
            } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
          >
            Perfil
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-transparent"
          >
            Cerrar sesión
          </button>
        </>
      );
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button onClick={handleLogoClick} className="text-xl font-bold text-gray-900">
                Mi Aplicación
              </button>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {renderLinks()}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;