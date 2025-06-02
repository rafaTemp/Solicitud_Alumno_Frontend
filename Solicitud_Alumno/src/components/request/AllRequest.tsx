import React, { useEffect, useState } from "react";
import api from "../../api";
import { FaBuilding, FaUserGraduate, FaCalendarAlt, FaEnvelope } from "react-icons/fa";

const AllRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/requests").then(res => {
      setRequests(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center mt-10">Cargando solicitudes...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">Todas las Solicitudes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800">
              <th className="px-6 py-3 text-left font-semibold"><FaUserGraduate className="inline mr-2" />Alumno</th>
              <th className="px-6 py-3 text-left font-semibold"><FaEnvelope className="inline mr-2" />Email</th>
              <th className="px-6 py-3 text-left font-semibold"><FaBuilding className="inline mr-2" />Empresa</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">No hay solicitudes registradas.</td>
              </tr>
            ) : (
              requests.map((req, idx) => (
                <tr
                  key={req.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-indigo-50"}
                >
                  <td className="px-6 py-4 border-b">{req.student_name}</td>
                  <td className="px-6 py-4 border-b">{req.student_email}</td>
                  <td className="px-6 py-4 border-b">{req.company_name}</td>
                  <td className="px-6 py-4 border-b">
                    {req.created_at ? new Date(req.created_at).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRequests;