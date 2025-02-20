
import Login from './components/login/Login';

import { AuthProvider } from './components/login/AuthContexType';
import CompanyList from './components/company/CompanyList';


import StudentList from './components/student/StudentList';

import Navbar from './components/navbar/Nabvar';

import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <Navbar />
   
        <Routes>
          
          <Route path="/login" element={<Login />} />
          {/* CompanyList ahora es pública */}
          <Route path="/company" element={<CompanyList onCompaniesLoaded={() => {}} />} />
          {/* Request solo accesible para estudiantes */}
         
          <Route path="/student" element={<StudentList/>} /> 

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
 
    </AuthProvider>
  );
}

export default App;
