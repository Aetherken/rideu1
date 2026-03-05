import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Bus, Ticket, AlertTriangle, Download } from 'lucide-react';

const mockChartData = [
    { name: 'Mon', passes: 120 },
    { name: 'Tue', passes: 140 },
    { name: 'Wed', passes: 135 },
    { name: 'Thu', passes: 156 },
    { name: 'Fri', passes: 210 },
    { name: 'Sat', passes: 85 },
    { name: 'Sun', passes: 40 },
];

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalStudents: 1240,
        activePasses: 486,
        busesActive: 12,
        issues: 3
    });

    const generateReport = () => {
        // In a real app this would call the API and download CSV
        alert('Booking report downloading... (Mock)');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-ride-charcoal">Admin Overview</h1>
                    <p className="text-ride-slate mt-2">Welcome back, {user?.name}</p>
                </div>
                <button
                    onClick={generateReport}
                    className="bg-ride-terracotta hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Download size={20} /> Export Report
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Total Students', value: stats.totalStudents, icon: <Users size={24} />, color: 'bg-blue-100 text-blue-600' },
                    { label: 'Passes Today', value: stats.activePasses, icon: <Ticket size={24} />, color: 'bg-green-100 text-green-600' },
                    { label: 'Buses Running', value: stats.busesActive, icon: <Bus size={24} />, color: 'bg-orange-100 text-orange-600' },
                    { label: 'Flagged Users', value: stats.issues, icon: <AlertTriangle size={24} />, color: 'bg-red-100 text-red-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-ride-slate font-medium text-sm">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-ride-charcoal">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Pass Trends Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-ride-charcoal mb-6">Passes Booked (Last 7 Days)</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPasses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D95A3B" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D95A3B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="passes" stroke="#D95A3B" strokeWidth={3} fillOpacity={1} fill="url(#colorPasses)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions / Alerts */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h2 className="text-lg font-bold text-ride-charcoal mb-4">Quick Actions</h2>
                    <div className="space-y-4 flex-grow">
                        <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-ride-terracotta hover:bg-orange-50 transition-colors font-medium">
                            Update Base Fare
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-ride-terracotta hover:bg-orange-50 transition-colors font-medium">
                            Send Mass Notification
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-100 hover:border-ride-terracotta hover:bg-orange-50 transition-colors font-medium">
                            Add New Route
                        </button>
                    </div>

                    <h2 className="text-lg font-bold text-ride-charcoal mt-8 mb-4">Recent Alerts</h2>
                    <div className="space-y-3">
                        <div className="flex gap-3 text-sm p-3 bg-red-50 text-red-700 rounded-xl">
                            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                            <p>User <strong>VJEC-021</strong> flagged for fake QR.</p>
                        </div>
                        <div className="flex gap-3 text-sm p-3 bg-yellow-50 text-yellow-700 rounded-xl">
                            <Bus size={18} className="flex-shrink-0 mt-0.5" />
                            <p>Bus KL-59-102 delayed by 15 mins.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
