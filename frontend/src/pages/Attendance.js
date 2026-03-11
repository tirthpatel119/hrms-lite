import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, CheckCircle2, XCircle, CalendarDays, User, Presentation, Activity } from 'lucide-react';

const Attendance = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const [empRes, attRes] = await Promise.all([
                    api.get(`employees/${id}/`),
                    api.get(`attendance/?employee_id=${id}`)
                ]);
                setEmployee(empRes.data);
                setAttendanceList(attRes.data);
            } catch (err) {
                console.error("Failed to fetch details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const markAttendance = async (status) => {
        try {
            setSubmitting(true);
            const response = await api.post('attendance/', {
                employee_id: id,
                date: date,
                status: status
            });
            setAttendanceList([...attendanceList, response.data]);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.non_field_errors) {
                alert("Attendance for this date has already been recorded.");
            } else {
                alert("Failed to mark attendance.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
                <span className="text-slate-500 font-medium tracking-wide">Retrieving records...</span>
            </div>
        );
    }
    
    if (!employee) {
        return (
            <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-lg mx-auto mt-12 animate-fade-in">
                <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">Employee Not Found</h3>
                <p className="text-slate-500 mt-2 mb-6">We couldn't locate this employee's records.</p>
                <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 px-4 py-2 bg-indigo-50 rounded-lg">
                    <ArrowLeft className="w-4 h-4" /> Back to Directory
                </Link>
            </div>
        );
    }

    const presentCount = attendanceList.filter(a => a.status === 'Present').length;
    const absentCount = attendanceList.filter(a => a.status === 'Absent').length;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-slide-up pb-10">
            <div className="flex items-center gap-4">
                <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        {employee.full_name}'s Record
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-slate-500 mt-1">
                        <span className="font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 shadow-sm">{employee.department}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">{employee.emp_id}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{employee.email}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Action */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Action Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                            <Presentation className="w-24 h-24" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-indigo-500" />
                            Log Attendance
                        </h3>
                        <div className="space-y-5 relative z-10">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Record Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors shadow-sm"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => markAttendance('Present')}
                                    disabled={submitting}
                                    className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Present
                                </button>
                                <button
                                    onClick={() => markAttendance('Absent')}
                                    disabled={submitting}
                                    className="flex items-center justify-center gap-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Absent
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 shadow-xl shadow-indigo-900/20 border border-slate-800 text-white relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 opacity-10">
                            <Activity className="w-32 h-32" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-300 mb-6 uppercase tracking-wide">Record Summary</h3>
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div>
                                <div className="text-4xl font-bold mb-1 tracking-tight">{attendanceList.length}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Logs</div>
                            </div>
                            <div className="space-y-3 border-l border-slate-700 pl-4 flex flex-col justify-center">
                                <div className="flex items-center justify-between group cursor-default">
                                    <span className="text-sm text-emerald-400 font-medium group-hover:text-emerald-300 transition-colors">Present</span>
                                    <span className="text-sm font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">{presentCount}</span>
                                </div>
                                <div className="flex items-center justify-between group cursor-default">
                                    <span className="text-sm text-rose-400 font-medium group-hover:text-rose-300 transition-colors">Absent</span>
                                    <span className="text-sm font-bold bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-lg border border-rose-500/30">{absentCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: History */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden h-full flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">Attendance History</h3>
                            <span className="text-xs font-semibold bg-white text-slate-500 px-3 py-1 rounded-full shadow-sm border border-slate-200">
                                Most Recent First
                            </span>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto max-h-[500px] custom-scrollbar">
                            {attendanceList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[200px]">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <CalendarDays className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="font-medium text-slate-600 text-lg">No logs recorded yet.</p>
                                    <p className="text-sm mt-1 text-slate-400">Select a date on the left to start recording.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {attendanceList.sort((a,b) => new Date(b.date) - new Date(a.date)).map((record) => (
                                        <div key={record.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-200 bg-white group cursor-default">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                                                    record.status === 'Present' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200/50' : 'bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 border border-rose-200/50'
                                                }`}>
                                                    {record.status === 'Present' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 group-hover:text-indigo-900 transition-colors">
                                                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                    <p className={`text-xs font-semibold uppercase tracking-wider mt-0.5 ${
                                                        record.status === 'Present' ? 'text-emerald-500' : 'text-rose-500'
                                                    }`}>
                                                        Recorded as {record.status}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
