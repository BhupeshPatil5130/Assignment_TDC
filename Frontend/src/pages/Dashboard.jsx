import { useState, useContext, useEffect, useCallback } from 'react';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import CustomerForm from '../components/CustomerForm';

const STATUS_FILTERS = ['All', 'Active', 'On Hold', 'Matched', 'Inactive'];

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await client.get('/customers');
      setCustomers(res.data.data);
    } catch (err) {
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSeed = async () => {
    const toastId = toast.loading('Generating records...');
    try {
      await client.post('/customers/seed');
      toast.success('Records generated successfully', { id: toastId });
      fetchCustomers();
    } catch {
      toast.error('Failed to generate records', { id: toastId });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCreateCustomer = async (formData) => {
    const toastId = toast.loading('Creating record...');
    try {
      await client.post('/customers', formData);
      toast.success('Record created', { id: toastId });
      setIsModalOpen(false);
      fetchCustomers();
    } catch {
      toast.error('Failed to create record', { id: toastId });
    }
  };

  const filtered = customers.filter(c => {
    const matchesSearch = search === '' ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.city?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.statusTag === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.statusTag === 'Active').length,
    matched: customers.filter(c => c.statusTag === 'Matched').length,
    onHold: customers.filter(c => c.statusTag === 'On Hold').length,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/30 selection:text-white">
      
      <div className="border-b border-white/10 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-white flex items-center justify-center rounded-sm">
              <span className="text-black font-bold text-[10px] tracking-tighter">TDC</span>
            </div>
            <span className="text-sm font-medium text-gray-300">Matchmaker OS</span>
            <span className="text-gray-600 px-2">/</span>
            <span className="text-sm text-white">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:inline-block">{user?.name}</span>
            <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-white transition-colors">
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Clients</h1>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={handleSeed}
              className="px-3 py-1.5 bg-[#111] hover:bg-[#1A1A1A] border border-white/10 text-gray-300 rounded text-sm transition-colors w-full sm:w-auto">
              Generate Test Data
            </button>
            <button onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-gray-200 text-black rounded text-sm font-medium transition-colors w-full sm:w-auto flex items-center justify-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              New Client
            </button>
          </div>
        </div>

        <div className="flex gap-4 sm:gap-8 border-b border-white/5 pb-8 mb-8 overflow-x-auto no-scrollbar">
          {[
            { label: 'Total Clients', value: stats.total, color: 'text-white' },
            { label: 'Active Pipeline', value: stats.active, color: 'text-emerald-400' },
            { label: 'Matches Made', value: stats.matched, color: 'text-blue-400' },
            { label: 'On Hold', value: stats.onHold, color: 'text-amber-400' },
          ].map(s => (
            <div key={s.label} className="min-w-[120px]">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-1 whitespace-nowrap">{s.label}</p>
              <p className={`text-2xl font-medium ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input
              type="text"
              placeholder="Search by name or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#111] border border-white/10 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto no-scrollbar p-1 bg-[#111] border border-white/10 rounded-md">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  statusFilter === s
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-[#111] rounded-md border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 border border-white/5 rounded-md bg-[#0A0A0A]">
            <p className="text-sm text-gray-500 mb-4">No records found matching your criteria.</p>
            {customers.length === 0 && (
              <button onClick={handleSeed} className="text-sm text-white hover:underline">
                Generate test records
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(c => {
              const avatarNum = parseInt(c._id.substring(18), 16) % 90;
              const avatarGen = c.gender === 'Female' ? 'women' : 'men';
              const avatarUrl = `https://randomuser.me/api/portraits/${avatarGen}/${avatarNum}.jpg`;
              
              const statusColors = {
                'Active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                'On Hold': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                'Matched': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                'Inactive': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
              };

              return (
                <Link to={`/customer/${c._id}`} key={c._id}>
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-5 hover:bg-[#111] hover:border-white/20 transition-all group flex flex-col h-full cursor-pointer shadow-sm hover:shadow-xl hover:shadow-black/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={avatarUrl} alt={c.firstName} className="w-14 h-14 rounded-full bg-[#111] object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all border border-white/10" loading="lazy" />
                          {c.assignedTo === user?._id && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-[#0A0A0A] flex items-center justify-center" title="My Client">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white tracking-tight">
                            {c.firstName} {c.lastName}
                          </h3>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {c.age} yrs • {c.gender} • {c.city}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-wide uppercase border whitespace-nowrap ${statusColors[c.statusTag] || 'bg-[#111] text-gray-400 border-white/10'}`}>
                        {c.statusTag || 'Active'}
                      </span>
                    </div>

                    <div className="mt-2 space-y-2 flex-grow">
                       
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Profession</span>
                          <span className="text-gray-300 font-medium truncate max-w-[150px] text-right">{c.designation || 'Not specified'}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Income</span>
                          <span className="text-gray-300 font-medium text-right">₹{c.income?.toLocaleString('en-IN') || '—'}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">Religion/Caste</span>
                          <span className="text-gray-300 font-medium truncate max-w-[150px] text-right">
                            {c.religion || '—'} {c.caste && c.caste !== 'Any' ? `(${c.caste})` : ''}
                          </span>
                       </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        <span>{c.maritalStatus}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>View Full Profile</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CustomerForm
          onSubmit={handleCreateCustomer}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
