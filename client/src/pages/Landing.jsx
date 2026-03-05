import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, CreditCard, Ticket, Clock, ArrowRight } from 'lucide-react';

const Landing = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-ride-beige flex-grow flex items-center pt-16 lg:pt-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-bold text-ride-charcoal leading-tight mb-6 tracking-tight">
                            From Vimal Jyothi <br />
                            <span className="text-ride-terracotta">to the City.</span> One Pass.
                        </h1>
                        <p className="text-xl text-ride-slate mb-10 max-w-2xl mx-auto lg:mx-0 font-light">
                            The easiest way to book daily bus passes for Vimal Jyothi Engineering College students. Skip the queue, ride with ease.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                            <Link to="/login" className="bg-ride-terracotta hover:bg-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                                Book a Pass <ArrowRight size={20} />
                            </Link>
                            <Link to="/#how-it-works" className="bg-white text-ride-charcoal border border-ride-slate/20 hover:border-ride-slate/50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center">
                                Learn More
                            </Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-ride-terracotta/20 to-transparent rounded-full filter blur-3xl opacity-60"></div>
                        <img
                            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80"
                            alt="Bus on the road"
                            className="rounded-3xl shadow-2xl relative z-10 w-full h-[500px] object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="bg-ride-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-ride-charcoal mb-4">How RideU Works</h2>
                        <p className="text-ride-slate max-w-2xl mx-auto">Get your daily bus pass in three simple steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: <Clock size={40} />, title: '1. Pick Route', desc: 'Select your destination city and preferred time slot for the VJEC bus.' },
                            { icon: <CreditCard size={40} />, title: '2. Pay', desc: 'Pay the flat flat seamlessly via Card or UPI instantly.' },
                            { icon: <Ticket size={40} />, title: '3. Ride', desc: 'Get your digital QR pass downloaded straight to your phone. Just scan and board!' }
                        ].map((step, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-ride-slate/10 hover:shadow-md transition-shadow group flex flex-col items-center text-center">
                                <div className="bg-ride-beige-dark text-ride-terracotta p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-ride-charcoal mb-3">{step.title}</h3>
                                <p className="text-ride-slate">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-ride-dark-slate text-ride-beige py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2"><Bus /> RideU</h3>
                        <p className="text-ride-beige/70 max-w-sm">
                            The official bus pass booking portal for Vimal Jyothi Engineering College students.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Help</h4>
                        <ul className="space-y-2 text-ride-beige/80">
                            <li><Link to="/support" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link to="/support" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-white">Legal</h4>
                        <ul className="space-y-2 text-ride-beige/80">
                            <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-sm text-ride-beige/50">
                    © {new Date().getFullYear()} RideU by VJEC. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
