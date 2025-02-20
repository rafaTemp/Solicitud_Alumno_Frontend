import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContexType';
import CompanyList from './components/CompanyList';
import Request from './components/Request';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* CompanyList ahora es pública */}
          <Route path="/company" element={<CompanyList onCompaniesLoaded={() => {}} />} />
          {/* Request solo accesible para estudiantes */}
          <Route path="/request" element={<PrivateRoute element={<Request />} requiredRole="student" />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
