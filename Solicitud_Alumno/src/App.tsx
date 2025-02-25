
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';
import { AuthProvider } from './components/login/AuthContexType';
import CompanyList from './components/company/CompanyList';
import StudentList from './components/student/StudentList';

import Navbar from './components/navbar/Nabvar';
import PrivateRoute from './components/login/PrivateRoute';
import RequestList from './components/request/RequestList';
import {Toaster} from 'react-hot-toast';
import CreateRequest from './components/request/CreateRequest';
import RegisterTeacher from './components/register/Registerteacher';
import Register from './components/register/RegisterStudent';



function App() {
  return (
    <><Toaster  /><AuthProvider>
      <Navbar />


      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* CompanyList ahora es pública */}
        <Route path="/company" element={<CompanyList onCompaniesLoaded={() => { } } />} />
        <Route path="/request" element={<RequestList />} />
        {/* Request solo accesible para estudiantes */}

        <Route path="/student" element={<StudentList />} />
        <Route path="requests/create" element={<PrivateRoute element={<CreateRequest />} requiredRole="student" />} />
        <Route path="/teacherRegister" element={<RegisterTeacher />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>


    </AuthProvider></>
  );
}

export default App;