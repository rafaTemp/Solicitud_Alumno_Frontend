import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from './AuthContexType';
import { ICompanyData } from '../interfaces/ICompany';

export default function Request() {
  const [companies, setCompanies] = useState<ICompanyData[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [question, setQuestion] = useState('');
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || role !== 'student') {
      navigate('/login');
      return;
    }

    api.get('/company')
      .then(response => {
        setCompanies(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching companies:', error);
      });
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const studentId = localStorage.getItem('studentId');

    if (!studentId) {
      alert('Student ID not found in localStorage');
      return;
    }

    if (!selectedCompany || !question) {
      alert('Please select a company and write a question');
      return;
    }

    try {
      await api.post('/requests', {
        student_id: studentId,
        company_id: selectedCompany,
        question: question,
      });
      alert('Request submitted successfully');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request');
    }
  };

  return (
    <div>
      <h1>Request Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="company">Select a Company:</label>
        <select
          id="company"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
          required
        >
          <option value="">--Select--</option>
          {companies.map(company => (
            <option key={company.NIF} value={company.NIF}>
              {company.name}
            </option>
          ))}
        </select>
        
        <label htmlFor="question">Question:</label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}