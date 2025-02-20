import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContexType';
import CompanyList from './components/CompanyList';
import Request from './components/Request';

import StudentList from './components/student/StudentList';
import StudentDetail from './components/student/StudentDetail';
import Navbar from './components/Nabvar';
import StudentUpdate from './components/student/StudentUpdate';

function App() {
  return (
    <AuthProvider>
      <Navbar/>
     
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* CompanyList ahora es pública */}
          <Route path="/company" element={<CompanyList onCompaniesLoaded={() => {}} />} />
          {/* Request solo accesible para estudiantes */}
          <Route path="/request" element={<PrivateRoute element={<Request />} requiredRole="student" />} />
          <Route path="/student" element={<StudentList/>} /> 
          <Route path="/student/:id" element={<StudentDetail/>} />
          <Route path="/student/:id/edit" element={<StudentUpdate />} />
          <Route path="/" element={<Login />} />
        </Routes>
 
    </AuthProvider>
  );
}

export default App;
