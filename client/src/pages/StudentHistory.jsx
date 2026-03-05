import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Ticket, Bus, ArrowRight, Expand } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const StudentHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/bookings/my');
                setBookings(res.data);
            } catch (error) {
                console.error('Failed to fetch history', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-ride-charcoal">My Passes</h1>
                <p className="text-ride-slate mt-2">View your booking history and digital tickets.</p>
            </div>

            {loading ? (
                <p className="text-ride-slate">Loading history...</p>
            ) : bookings.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
                    <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-ride-charcoal">No passes yet</h3>
                    <p className="text-ride-slate mt-2">You haven't booked any bus passes.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map(b => (
                        <div key={b.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className={`p-4 ${b.status === 'active' ? 'bg-ride-terracotta text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-semibold uppercase">{b.status}</span>
                                    <span className="text-sm">{new Date(b.created_at).toLocaleDateString()}</span>
                                </div>
                                <h3 className="font-bold text-lg">{b.route_name}</h3>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between text-sm mb-4 text-ride-charcoal">
                                    <div>
                                        <p className="text-ride-slate mb-1">Bus</p>
                                        <p className="font-bold flex items-center gap-1"><Bus size={14} /> {b.bus_number}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-ride-slate mb-1">Time</p>
                                        <p className="font-bold flex items-center gap-1">{b.departure_time.substring(0, 5)} <ArrowRight size={14} /> {b.arrival_time.substring(0, 5)}</p>
                                    </div>
                                </div>

                                {expandedId === b.id ? (
                                    <div className="pt-4 border-t border-gray-100 flex flex-col items-center animate-in fade-in duration-300">
                                        <p className="text-xs text-ride-slate mb-2">PASS ID: {b.pass_id}</p>
                                       <QRCodeCanvas value={b.pass_id} size={100} level="M" />
                                        <button onClick={() => setExpandedId(null)} className="mt-4 text-sm text-ride-terracotta font-medium hover:underline">Hide QR</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setExpandedId(b.id)}
                                        className="w-full mt-2 py-3 border border-ride-terracotta text-ride-terracotta rounded-xl font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Expand size={16} /> Show Pass QR
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentHistory;
