import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICompanyData } from '../../interfaces/ICompany';
import { useAuth } from '../login/AuthContexType';
import { createRequest, getCompanies } from '../../service/request';




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

    getCompanies()
      .then(setCompanies)
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
      await createRequest(studentId, selectedCompany, question);
      alert('Request submitted successfully');
      setSelectedCompany('');
      setQuestion('');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Request Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">Select a Company:</label>
          <select
            id="company"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">--Select--</option>
            {companies.map(company => (
              <option key={company.NIF} value={company.NIF}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">Question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}