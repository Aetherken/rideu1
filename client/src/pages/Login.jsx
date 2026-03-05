import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bus, Loader2, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const data = await authLogin(email, password);
                // Navigate based on role
                if (data.user.role === 'student') navigate('/student');
                else navigate('/admin');
            } else {
                // Register API call
                await api.post('/auth/register', {
                    name, student_id: studentId, phone, email, password
                });
                // Auto-login after register
                const data = await authLogin(email, password);
                navigate('/student'); // default to student
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-ride-beige flex flex-col justify-center items-center p-4">
            <Link to="/" className="absolute top-8 left-8 flex items-center text-ride-slate hover:text-ride-charcoal transition-colors font-medium">
                <ArrowLeft size={20} className="mr-2" /> Back to Home
            </Link>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8 sm:p-12">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-ride-beige-dark text-ride-terracotta rounded-2xl mb-4">
                            <Bus size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-ride-charcoal">RideU</h2>
                        <p className="text-ride-slate mt-2">{isLogin ? 'Welcome back, student!' : 'Create your RideU account'}</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-ride-slate mb-1">Full Name</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ride-terracotta focus:ring-2 focus:ring-ride-terracotta/20 outline-none transition-all"
                                        placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-ride-slate mb-1">Student ID</label>
                                    <input type="text" required value={studentId} onChange={(e) => setStudentId(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ride-terracotta focus:ring-2 focus:ring-ride-terracotta/20 outline-none transition-all"
                                        placeholder="VJEC-2023-CS-001" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-ride-slate mb-1">Phone Number</label>
                                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ride-terracotta focus:ring-2 focus:ring-ride-terracotta/20 outline-none transition-all"
                                        placeholder="+91 99999 99999" />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-ride-slate mb-1">Email Address</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ride-terracotta focus:ring-2 focus:ring-ride-terracotta/20 outline-none transition-all"
                                placeholder="student@vjec.ac.in" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-ride-slate mb-1">Password</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-ride-terracotta focus:ring-2 focus:ring-ride-terracotta/20 outline-none transition-all"
                                placeholder="••••••••" />
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full bg-ride-charcoal hover:bg-black text-white py-4 rounded-full font-semibold mt-4 transition-colors flex justify-center items-center disabled:opacity-70">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-ride-slate">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => { setIsLogin(!isLogin); setError(''); }} type="button" className="text-ride-terracotta font-semibold hover:underline">
                            {isLogin ? 'Sign up here' : 'Log in here'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
