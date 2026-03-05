
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { MapPin, Clock, CreditCard, Ticket, CheckCircle2, ChevronRight, BusFront, ShieldAlert, Bus, ArrowRight } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Data State
    const [routes, setRoutes] = useState([]);
    const [fare, setFare] = useState(25);
    const [slots, setSlots] = useState([]);
    const [buses, setBuses] = useState([]); // Mocking buses array temporarily retrieved per route

    // Selection State
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [generatedPassId, setGeneratedPassId] = useState('');

    // Initial Fetch Let's fetch active routes and standard fare
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [routesRes, fareRes, busesRes] = await Promise.all([
                    api.get('/routes'),
                    api.get('/fare'),
                    api.get('/buses') // Simplified, fetching all buses
                ]);
                setRoutes(routesRes.data);
                setFare(fareRes.data.fare);
                setBuses(busesRes.data);
            } catch (err) {
                console.error('Failed to load dashboard data', err);
            }
        };
        fetchInitialData();
    }, []);

    const handleRouteSelect = async (route) => {
        setSelectedRoute(route);
        setLoading(true);
        try {
            const res = await api.get(`/routes/${route.id}/slots`);
            setSlots(res.data);
            setStep(2);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setStep(3);
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Find a bus servicing this city ideally (simplification for UI)
            const assignedBus = buses.find(b => b.city_id === selectedRoute.destination_city_id) || buses[0];

            const payload = {
                route_id: selectedRoute.id,
                bus_id: assignedBus?.id || 1,
                time_slot_id: selectedSlot.id,
                fare: fare
            };

            const res = await api.post('/bookings', payload);
            setGeneratedPassId(res.data.pass_id);
            setStep(4);
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-ride-charcoal">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
                <p className="text-ride-slate mt-2">Book your daily ride from VJEC campus.</p>
            </div>

            {user?.status !== 'active' && (
                <div className="bg-red-50 text-red-700 p-6 rounded-2xl mb-8 flex items-start gap-4 border border-red-200">
                    <ShieldAlert size={24} className="flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-lg mb-1">Account Suspended</h3>
                        <p>Your account is currently {user?.status}. You cannot book new passes. Please contact the administrator.</p>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-ride-terracotta -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>

                {[
                    { icon: <MapPin />, label: 'Route' },
                    { icon: <Clock />, label: 'Time' },
                    { icon: <CreditCard />, label: 'Pay' },
                    { icon: <Ticket />, label: 'Pass' }
                ].map((s, i) => {
                    const isActive = step >= i + 1;
                    const isCurrent = step === i + 1;
                    return (
                        <div key={i} className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-300 ${isActive ? 'bg-ride-terracotta text-white' : 'bg-gray-200 text-gray-400'} ${isCurrent ? 'ring-4 ring-ride-terracotta/20' : ''}`}>
                                {isActive && i < step - 1 ? <CheckCircle2 size={24} /> : React.cloneElement(s.icon, { size: 20 })}
                            </div>
                            <span className={`mt-2 text-sm font-medium ${isActive ? 'text-ride-charcoal' : 'text-gray-400'}`}>{s.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-3xl shadow-sm border border-ride-slate/10 p-6 sm:p-10 min-h-[400px]">
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold text-ride-charcoal mb-6">Where are you heading?</h2>
                        {routes.length === 0 ? (
                            <p className="text-ride-slate">Loading active routes...</p>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {routes.map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => handleRouteSelect(r)}
                                        disabled={user?.status !== 'active' || loading}
                                        className="flex items-center justify-between p-6 rounded-2xl border-2 border-gray-100 hover:border-ride-terracotta bg-gray-50 hover:bg-white text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div>
                                            <h3 className="font-bold text-lg text-ride-charcoal">{r.name}</h3>
                                            <p className="text-sm text-ride-slate mt-1 flex items-center gap-1"><Clock size={14} /> ~{r.duration_minutes} mins travel</p>
                                        </div>
                                        <ChevronRight className="text-gray-400 group-hover:text-ride-terracotta transition-colors" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-ride-charcoal">Select Time Slot</h2>
                            <button onClick={() => setStep(1)} className="text-ride-terracotta text-sm font-medium hover:underline">Change Route</button>
                        </div>

                        <p className="text-ride-slate mb-6 bg-ride-beige inline-block px-4 py-2 rounded-lg">
                            Route: <strong>{selectedRoute?.name}</strong>
                        </p>

                        {slots.length === 0 ? (
                            <p className="text-ride-slate p-8 text-center bg-gray-50 rounded-2xl">No available time slots found for this route.</p>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {slots.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleSlotSelect(s)}
                                        disabled={s.seats_available <= 0}
                                        className={`flex items-center justify-between p-6 rounded-2xl border-2 text-left transition-all group
                      ${s.seats_available > 0 ? 'border-gray-100 hover:border-ride-terracotta bg-gray-50 hover:bg-white' : 'border-red-100 bg-red-50 opacity-60 cursor-not-allowed'}
                    `}
                                    >
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xl font-bold text-ride-charcoal">{s.departure_time.substring(0, 5)}</span>
                                                <ArrowRight size={16} className="text-gray-400" />
                                                <span className="text-xl font-bold text-ride-charcoal">{s.arrival_time.substring(0, 5)}</span>
                                            </div>
                                            <p className={`text-sm font-medium flex items-center gap-1 ${s.seats_available > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                <BusFront size={14} />
                                                {s.seats_available > 0 ? `${s.seats_available} seats open` : 'Bus Full'}
                                            </p>
                                        </div>
                                        {s.seats_available > 0 && <ChevronRight className="text-gray-400 group-hover:text-ride-terracotta transition-colors" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-ride-charcoal">Checkout</h2>
                            <button disabled={loading} onClick={() => setStep(2)} className="text-ride-terracotta text-sm font-medium hover:underline">Change Time</button>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                            <h3 className="font-bold text-ride-charcoal mb-4 border-b border-gray-200 pb-2">Order Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-ride-slate">Route</span> <span className="font-medium text-right max-w-[200px]">{selectedRoute?.name}</span></div>
                                <div className="flex justify-between"><span className="text-ride-slate">Time</span> <span className="font-medium">{selectedSlot?.departure_time.substring(0, 5)}</span></div>
                                <div className="flex justify-between"><span className="text-ride-slate">Student</span> <span className="font-medium">{user?.name}</span></div>
                                <div className="flex justify-between pt-3 border-t border-gray-200 mt-3 text-lg">
                                    <span className="font-bold text-ride-charcoal">Total Amount</span>
                                    <span className="font-bold text-ride-terracotta">₹{fare}</span>
                                </div>
                            </div>
                        </div>

                        {/* Mock Payment Options */}
                        <div className="mb-8">
                            <p className="text-sm text-ride-slate mb-3 font-medium">Payment Method (Mock Environment)</p>
                            <div className="bg-white border-2 border-ride-terracotta rounded-xl p-4 flex items-center justify-between cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-50 p-2 rounded-lg text-ride-terracotta"><CreditCard size={20} /></div>
                                    <span className="font-bold">Campus Wallet</span>
                                </div>
                                <div className="w-5 h-5 rounded-full border-4 border-ride-terracotta"></div>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full bg-ride-charcoal hover:bg-black text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-75"
                        >
                            {loading ? 'Processing...' : `Pay ₹${fare} & Book Pass`}
                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-ride-charcoal mb-2">Booking Confirmed!</h2>
                        <p className="text-ride-slate max-w-md mx-auto mb-8">Your digital pass has been generated. A confirmation email has been sent to {user?.email}.</p>

                        {/* Digital Ticket Ticket Style Box */}
                        <div id="digital-ticket" className="bg-white max-w-sm w-full rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden text-left relative">
                            <div className="bg-ride-terracotta text-white p-6 text-center">
                                <Bus className="mx-auto mb-2 opacity-80" size={28} />
                                <h3 className="font-bold text-xl tracking-wide">RIDEU PASS</h3>
                                <p className="text-white/80 text-sm mt-1">{selectedRoute?.name}</p>
                            </div>

                            <div className="p-6 relative">
                                {/* Ticket cutouts */}
                                <div className="absolute top-0 left-[-15px] w-[30px] h-[30px] bg-gray-50 rounded-full -translate-y-1/2"></div>
                                <div className="absolute top-0 right-[-15px] w-[30px] h-[30px] bg-gray-50 rounded-full -translate-y-1/2"></div>
                                <div className="absolute top-0 left-4 right-4 border-t-2 border-dashed border-gray-200"></div>

                                <div className="pt-2 pb-6 flex justify-between space-x-4 border-b border-gray-100">
                                    <div>
                                        <p className="text-xs text-ride-slate font-medium mb-1">DEPARTURE</p>
                                        <p className="font-bold text-2xl text-ride-charcoal">{selectedSlot?.departure_time.substring(0, 5)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-ride-slate font-medium mb-1">DATE</p>
                                        <p className="font-bold text-lg text-ride-charcoal">{new Date().toLocaleDateString('en-GB')}</p>
                                    </div>
                                </div>

                                <div className="py-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-ride-slate">Passenger</span>
                                        <span className="font-bold">{user?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-ride-slate">Student ID</span>
                                        <span className="font-bold">{user?.student_id}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-ride-slate">Pass ID</span>
                                        <span className="font-bold text-ride-terracotta">{generatedPassId}</span>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-center">
                                    <QRCodeCanvas
  value={generatedPassId}
  size={120}
  level="M"
  fgColor="#1C1A17"
  bgColor="#ffffff"
/>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => { setStep(1); setSelectedRoute(null); setSelectedSlot(null); }} className="bg-gray-100 text-ride-charcoal hover:bg-gray-200 px-6 py-3 rounded-full font-bold transition-colors">
                                Book Another
                            </button>
                            <button onClick={() => { }} className="bg-ride-charcoal hover:bg-black text-white px-6 py-3 rounded-full font-bold transition-colors flex items-center gap-2 shadow-lg">
                                Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
