import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import Attendance from './pages/Attendance';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/employee/:id/attendance" element={<Attendance />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
