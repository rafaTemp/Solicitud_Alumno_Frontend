

import api from '../api';
import { IStudent } from '../interfaces/IStudent';
import Student from './Student';


import { useEffect, useState } from 'react';

export default function StudentsList() {
  const [students, setStudents] = useState<IStudent[]>([]);

  useEffect(() => {
    api.get<IStudent[]>('/student')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Lista de Alumnos</h1>
      <ul className="divide-y divide-gray-300">
        {students.map(student => (
          <li key={student.dni} className="py-2 flex items-center border-b border-gray-200">
            <Student {...student} />
          </li>
        ))}
      </ul>
    </div>
  );
}