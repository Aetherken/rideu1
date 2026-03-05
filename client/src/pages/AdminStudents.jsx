import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Search, ShieldAlert, CheckCircle2, MoreVertical, Ban } from 'lucide-react';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/admin/students');
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this student?`)) return;

        try {
            if (action === 'suspend') {
                await api.patch(`/admin/students/${id}/status`, { status: 'deactivated' });
            } else if (action === 'activate') {
                await api.patch(`/admin/students/${id}/status`, { status: 'active' });
            } else if (action === 'flag') {
                const reason = prompt("Enter reason for flagging:");
                if (!reason) return;
                await api.post(`/admin/students/${id}/flag`, { action: 'flag', reason });
            }
            fetchStudents();
        } catch (err) {
            alert("Error performing action");
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.student_id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-ride-charcoal">Student Management</h1>
                    <p className="text-ride-slate mt-2">Monitor users, view status, and manage access.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search name or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-ride-terracotta focus:ring-2 focus:ring-ride-terracotta/20 outline-none transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-ride-slate uppercase tracking-wider">
                                <th className="p-4 pl-6">Student Info</th>
                                <th className="p-4">Student ID</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No students found.</td></tr>
                            ) : (
                                filteredStudents.map(student => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-ride-charcoal">{student.name}</div>
                                            <div className="text-sm text-ride-slate text-xs mt-1">Joined {new Date(student.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4 font-mono text-sm text-ride-charcoal">{student.student_id}</td>
                                        <td className="p-4 text-sm">
                                            <div>{student.email}</div>
                                            <div className="text-gray-500">{student.phone}</div>
                                        </td>
                                        <td className="p-4">
                                            {student.status === 'active' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                    <CheckCircle2 size={14} /> Active
                                                </span>
                                            ) : student.status === 'banned' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                    <Ban size={14} /> Banned
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                                    <ShieldAlert size={14} /> Deactivated
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(student.id, 'flag')}
                                                    title="Flag User"
                                                    className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                                                >
                                                    <ShieldAlert size={18} />
                                                </button>
                                                {student.status === 'active' ? (
                                                    <button
                                                        onClick={() => handleAction(student.id, 'suspend')}
                                                        title="Suspend User"
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    >
                                                        <Ban size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAction(student.id, 'activate')}
                                                        title="Activate User"
                                                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminStudents;
