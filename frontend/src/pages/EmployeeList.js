import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Trash2, Calendar, UserPlus, Search, Briefcase, Mail, Hash, Users } from 'lucide-react';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await api.get('employees/');
            setEmployees(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch employees. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const deleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to remove this employee from the directory?")) return;
        try {
            await api.delete(`employees/${id}/`);
            setEmployees(employees.filter(emp => emp.id !== id));
        } catch (err) {
            alert('Failed to delete employee.');
        }
    };

    const filteredEmployees = employees.filter(emp => 
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.emp_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                <span className="text-slate-500 font-medium tracking-wide">Loading directory...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">!</span>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Error Loading Data</h3>
                    <p className="text-red-500/80">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-slide-up pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Team Directory</h2>
                    <p className="text-slate-500">Manage your team members and their attendance records.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search team..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm w-full sm:w-64"
                        />
                    </div>
                    <Link
                        to="/add-employee"
                        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 whitespace-nowrap"
                    >
                        <UserPlus className="-ml-1 mr-2 h-5 w-5" />
                        Add Member
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="relative py-4 pl-3 pr-6 text-right"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <Users className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-lg font-medium text-slate-600">No team members found</p>
                                            <p className="text-sm mt-1">Try adjusting your search query or add a new member.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredEmployees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-slate-50/60 transition-colors duration-150 group">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold shadow-inner ring-1 ring-white">
                                                {employee.full_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{employee.full_name}</div>
                                                <div className="text-xs text-slate-500 md:hidden mt-0.5">{employee.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 hidden md:table-cell">
                                        <div className="flex items-center text-sm text-slate-500 gap-2">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            {employee.email}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 border border-indigo-100/50">
                                            <Briefcase className="w-3.5 h-3.5" />
                                            {employee.department}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-600">
                                        <div className="flex items-center gap-1">
                                            <Hash className="w-3.5 h-3.5 text-slate-400" />
                                            {employee.emp_id}
                                        </div>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <Link 
                                                to={`/employee/${employee.id}/attendance`} 
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1" 
                                                title="View Attendance"
                                            >
                                                <Calendar className="h-5 w-5" />
                                                <span className="hidden xl:inline text-xs font-semibold">Logs</span>
                                            </Link>
                                            <button 
                                                onClick={() => deleteEmployee(employee.id)} 
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1" 
                                                title="Delete Employee"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
