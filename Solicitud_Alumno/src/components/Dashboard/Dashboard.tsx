import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import api from "../../api";
import { useAuth } from "../login/AuthContexType";
import { Link } from "react-router-dom";

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const { role } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/stats");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  if (role !== "teacher") {
    return <div className="text-center mt-10 text-red-600">Acceso solo para profesores</div>;
  }

  if (!stats) return <div className="text-center mt-10">Cargando estadísticas...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-800">Panel de Control</h2>

      {/* Tarjetas de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
          <div className="text-4xl font-bold text-indigo-600">{stats.totalStudents ?? stats.studentsPerGroup.reduce((a: number, b: number) => a + b, 0)}</div>
          <div className="text-gray-700 mt-2">Alumnos registrados</div>
          <Link to="/student" className="text-indigo-500 hover:underline text-sm mt-2 block">Ver alumnos</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
          <div className="text-4xl font-bold text-green-600">{stats.totalCompanies ?? "-"}</div>
          <div className="text-gray-700 mt-2">Empresas</div>
          <Link to="/company" className="text-green-500 hover:underline text-sm mt-2 block">Ver empresas</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
          <div className="text-4xl font-bold text-blue-600">{stats.totalRequests ?? "-"}</div>
          <div className="text-gray-700 mt-2">Solicitudes</div>
          <Link to="/requests" className="text-blue-500 hover:underline text-sm mt-2 block">Ver solicitudes</Link>
        </div>
      </div>

      {/* Empresa más solicitada */}
      {stats.mostRequestedCompany && (
        <div className="mb-8 text-center">
          <span className="text-lg font-semibold">Empresa más solicitada: </span>
          <span className="text-indigo-700 font-bold">{stats.mostRequestedCompany}</span>
          <span className="ml-2 text-gray-600">({stats.mostRequestedCompanyCount} solicitudes)</span>
        </div>
      )}

      {/* Gráficas */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow">
          <Bar
            data={{
              labels: stats.groups,
              datasets: [
                {
                  label: "Estudiantes por grupo",
                  data: stats.studentsPerGroup,
                  backgroundColor: "#6366f1",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>
        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow">
          <Pie
            data={{
              labels: ["Con CV", "Sin CV"],
              datasets: [
                {
                  label: "CV Subidos",
                  data: [stats.withCV, stats.withoutCV],
                  backgroundColor: ["#22c55e", "#ef4444"],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;