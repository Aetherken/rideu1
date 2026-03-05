import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Bus, Plus, Trash2 } from 'lucide-react';

const AdminBuses = () => {
    const [buses, setBuses] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [newBus, setNewBus] = useState({ name: '', number: '', capacity: 40, city_id: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [busesRes, citiesRes] = await Promise.all([
                api.get('/buses'),
                api.get('/cities')
            ]);
            setBuses(busesRes.data);
            setCities(citiesRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this bus?')) return;
        try {
            await api.delete(`/buses/${id}`);
            fetchData();
        } catch (err) {
            alert('Error deleting bus');
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            // In real scenario we would use FormData for image uploads
            await api.post('/buses', newBus);
            setShowForm(false);
            setNewBus({ name: '', number: '', capacity: 40, city_id: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding bus');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-ride-charcoal">Fleet Management</h1>
                    <p className="text-ride-slate mt-2">Manage the VJEC buses.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-ride-charcoal hover:bg-black text-white px-5 py-3 rounded-full font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    {showForm ? 'Cancel' : <><Plus size={20} /> Add Bus</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold mb-4">Add New Bus</h2>
                    <form onSubmit={handleAddSubmit} className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-ride-slate mb-1">Bus Name / Model</label>
                            <input type="text" required value={newBus.name} onChange={e => setNewBus({ ...newBus, name: e.target.value })}
                                className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-ride-terracotta outline-none" placeholder="e.g. VJEC Express" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ride-slate mb-1">License Plate</label>
                            <input type="text" required value={newBus.number} onChange={e => setNewBus({ ...newBus, number: e.target.value })}
                                className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-ride-terracotta outline-none" placeholder="KL-59-1234" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ride-slate mb-1">Capacity</label>
                            <input type="number" required value={newBus.capacity} onChange={e => setNewBus({ ...newBus, capacity: e.target.value })}
                                className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-ride-terracotta outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-ride-slate mb-1">Base City</label>
                            <select required value={newBus.city_id} onChange={e => setNewBus({ ...newBus, city_id: e.target.value })}
                                className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-ride-terracotta outline-none bg-white">
                                <option value="">Select City...</option>
                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2 mt-2">
                            <button type="submit" className="bg-ride-terracotta text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-700 w-full md:w-auto transition-colors">Save Bus</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <p className="text-ride-slate">Loading fleet...</p>
            ) : buses.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm">
                    <Bus size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-ride-charcoal">No buses found</h3>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buses.map(bus => (
                        <div key={bus.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
                                {bus.image_url ? <img src={`http://localhost:5000${bus.image_url}`} alt="bus" className="w-full h-full object-cover rounded-full" /> : <Bus size={40} />}
                            </div>
                            <h3 className="font-bold text-lg text-ride-charcoal">{bus.number}</h3>
                            <p className="text-sm text-ride-slate mt-1">{bus.name} • {bus.city_name}</p>
                            <p className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full mt-3">{bus.capacity} Seats</p>

                            <button
                                onClick={() => handleDelete(bus.id)}
                                className="mt-6 w-full py-2 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium flex justify-center items-center gap-2 transition-colors"
                            >
                                <Trash2 size={16} /> Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminBuses;
