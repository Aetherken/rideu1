import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, UserCircle, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-ride-slate/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to={user ? (user.role === 'student' ? '/student' : '/admin') : '/'} className="flex items-center gap-2 text-ride-charcoal group">
                            <div className="bg-ride-terracotta text-white p-2 rounded-xl group-hover:scale-110 transition-transform">
                                <Bus size={20} />
                            </div>
                            <span className="font-bold text-xl tracking-tight">RideU</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {user && user.role === 'student' && (
                            <>
                                <Link to="/student" className="text-ride-slate hover:text-ride-terracotta font-medium transition-colors">Book Pass</Link>
                                <Link to="/student/history" className="text-ride-slate hover:text-ride-terracotta font-medium transition-colors">My Passes</Link>
                                <Link to="/student/tracking" className="text-ride-slate hover:text-ride-terracotta font-medium transition-colors">Live Tracking</Link>
                            </>
                        )}
                        {user && (user.role === 'admin' || user.role === 'superadmin') && (
                            <>
                                <Link to="/admin" className="text-ride-slate hover:text-ride-terracotta font-medium transition-colors">Dashboard</Link>
                                <Link to="/admin/students" className="text-ride-slate hover:text-ride-terracotta font-medium transition-colors">Students</Link>
                                <Link to="/admin/buses" className="text-ride-slate hover:text-ride-terracotta font-medium transition-colors">Buses</Link>
                            </>
                        )}

                        {!user ? (
                            <Link to="/login" className="bg-ride-charcoal text-white px-5 py-2 rounded-full font-medium hover:bg-black transition-colors">
                                Log In
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                                <div className="flex items-center gap-2 text-ride-charcoal font-medium">
                                    <UserCircle className="text-ride-slate" size={24} />
                                    <span>{user.name.split(' ')[0]}</span>
                                </div>
                                <button onClick={handleLogout} className="text-ride-slate hover:text-red-500 transition-colors" title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-ride-slate hover:text-ride-charcoal p-2">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-ride-slate/10 py-2 px-4 shadow-lg absolute w-full left-0 top-16">
                    <div className="flex flex-col space-y-4">
                        {user && user.role === 'student' && (
                            <>
                                <Link onClick={() => setIsOpen(false)} to="/student" className="text-ride-charcoal hover:text-ride-terracotta font-medium">Book Pass</Link>
                                <Link onClick={() => setIsOpen(false)} to="/student/history" className="text-ride-charcoal hover:text-ride-terracotta font-medium">My Passes</Link>
                                <Link onClick={() => setIsOpen(false)} to="/student/tracking" className="text-ride-charcoal hover:text-ride-terracotta font-medium">Live Tracking</Link>
                            </>
                        )}
                        {user && (user.role === 'admin' || user.role === 'superadmin') && (
                            <>
                                <Link onClick={() => setIsOpen(false)} to="/admin" className="text-ride-charcoal hover:text-ride-terracotta font-medium">Dashboard</Link>
                                <Link onClick={() => setIsOpen(false)} to="/admin/students" className="text-ride-charcoal hover:text-ride-terracotta font-medium">Students</Link>
                                <Link onClick={() => setIsOpen(false)} to="/admin/buses" className="text-ride-charcoal hover:text-ride-terracotta font-medium">Buses</Link>
                            </>
                        )}

                        {user ? (
                            <button
                                onClick={() => { setIsOpen(false); handleLogout(); }}
                                className="text-left text-red-500 font-medium flex items-center gap-2 pt-2 border-t border-gray-100"
                            >
                                <LogOut size={18} /> Log Out
                            </button>
                        ) : (
                            <Link onClick={() => setIsOpen(false)} to="/login" className="text-ride-terracotta font-medium">Log In / Sign Up</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
