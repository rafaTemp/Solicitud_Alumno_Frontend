import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="text-xl font-bold text-gray-900">Mi Aplicación</a>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium">
                Inicio
              </a>
              <a href="/perfil" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                Perfil
              </a>
              <a href="/solicitudes" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                Solicitudes
              </a>
              <a href="/contacto" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                Contacto
              </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="bg-indigo-500 text-white px-3 py-2 rounded-md text-sm font-medium">
              Iniciar Sesión
            </button>
            <button className="ml-4 bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;