import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { UserPlus, Briefcase, Mail, Hash, AlertCircle } from 'lucide-react';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        emp_id: '',
        full_name: '',
        email: '',
        department: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await api.post('employees/', formData);
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data) {
                const errorMessages = Object.entries(err.response.data)
                    .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
                    .join(' | ');
                setError(errorMessages);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-slide-up">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Onboard New Member</h2>
                <p className="text-slate-500 mt-2">Enter the details of the new team member to add them to the directory.</p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="p-8 sm:p-10">
                    {error && (
                        <div className="mb-8 bg-red-50 rounded-2xl p-4 flex gap-3 text-red-700 items-start border border-red-100 animate-fade-in">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserPlus className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors shadow-sm text-slate-900 bg-slate-50 focus:bg-white"
                                        placeholder="Jane Doe"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Employee ID</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Hash className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="emp_id"
                                        value={formData.emp_id}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors shadow-sm text-slate-900 bg-slate-50 focus:bg-white"
                                        placeholder="EMP-001"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors shadow-sm text-slate-900 bg-slate-50 focus:bg-white"
                                        placeholder="jane.doe@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Department</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors shadow-sm text-slate-900 bg-slate-50 focus:bg-white"
                                        placeholder="Engineering, Design..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-4 mt-8">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:pointer-events-none min-w-[140px]"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                                ) : (
                                    'Complete Onboarding'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;
