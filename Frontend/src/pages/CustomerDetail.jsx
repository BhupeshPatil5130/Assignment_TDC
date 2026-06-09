import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import toast from 'react-hot-toast';
import CustomerForm from '../components/CustomerForm';

const JOURNEY_STAGES = ['Active', 'On Hold', 'Matched', 'Inactive'];
const NOTE_TYPES = [
  { value: 'note', label: 'Note', color: 'bg-white/5 text-gray-300 border-white/10' },
  { value: 'call', label: 'Call', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { value: 'meeting', label: 'Meeting', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { value: 'follow-up', label: 'Follow-up', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
];

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('note');
  const [sendMatchModal, setSendMatchModal] = useState(null);

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      const res = await client.get(`/customers/${id}`);
      setCustomer(res.data.data);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await client.get(`/customers/${id}/notes`);
      setNotes(res.data.data);
    } catch {
      
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
    fetchNotes();
  }, [fetchCustomer, fetchNotes]);

  const avatarNum = customer ? parseInt(customer._id.substring(18), 16) % 90 : 0;
  const avatarGen = customer?.gender === 'Female' ? 'women' : 'men';
  const avatarUrl = `https://randomuser.me/api/portraits/${avatarGen}/${avatarNum}.jpg`;

  const loadMatches = async () => {
    setMatchesLoading(true);
    const toastId = toast.loading('Running algorithmic match analysis...');
    try {
      const res = await client.get(`/customers/${id}/matches`);
      setMatches(res.data.data);
      toast.success('Analysis complete', { id: toastId });
    } catch {
      toast.error('Analysis failed', { id: toastId });
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleSendMatch = async (matchItem) => {
    try {
      const res = await client.post(`/customers/${id}/send-match`, { matchId: matchItem.match._id });
      if (res.data.success) {
        toast.success(res.data.message);
        setSendMatchModal(null);
      }
    } catch {
      toast.error('Failed to send intro');
    }
  };

  const handleUpdateCustomer = async (formData) => {
    const toastId = toast.loading('Saving changes...');
    try {
      const res = await client.put(`/customers/${id}`, formData);
      if (res.data.success) {
        toast.success('Changes saved', { id: toastId });
        setIsEditing(false);
        setCustomer(res.data.data);
      }
    } catch {
      toast.error('Update failed', { id: toastId });
    }
  };

  const handleDeleteCustomer = async () => {
    if (!window.confirm('Delete this record permanently? This cannot be undone.')) return;
    const toastId = toast.loading('Deleting...');
    try {
      await client.delete(`/customers/${id}`);
      toast.success('Record deleted', { id: toastId });
      navigate('/dashboard');
    } catch {
      toast.error('Delete failed', { id: toastId });
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await client.put(`/customers/${id}`, { statusTag: newStatus });
      if (res.data.success) {
        setCustomer(res.data.data);
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch {
      toast.error('Status update failed');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      await client.post(`/customers/${id}/notes`, { content: newNote, type: noteType });
      toast.success('Note saved');
      setNewNote('');
      fetchNotes();
    } catch {
      toast.error('Failed to save note');
    }
  };

  if (loading || !customer) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Loading record...
        </div>
      </div>
    );
  }

  const statusColors = {
    'Active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'On Hold': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Matched': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Inactive': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">

      <div className="border-b border-white/10 bg-[#0A0A0A] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-2">
          <Link to="/dashboard" className="text-gray-500 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <span className="text-gray-600 px-1">/</span>
          <span className="text-sm text-gray-400 font-medium">Clients</span>
          <span className="text-gray-600 px-1">/</span>
          <span className="text-sm text-white font-medium">{customer.firstName} {customer.lastName}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img src={avatarUrl} alt={customer.firstName} className="w-24 h-24 rounded-full object-cover grayscale border border-white/10" />

            <div className="flex-grow w-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight mb-1 text-white">
                    {customer.firstName} {customer.lastName}
                  </h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                    <span>{customer.city}, {customer.country}</span>
                    <span>{customer.age} years</span>
                    <span>{customer.gender}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 bg-[#111] hover:bg-[#1A1A1A] border border-white/10 rounded text-xs font-medium transition-colors">
                    Edit Profile
                  </button>
                  <button onClick={handleDeleteCustomer} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded text-xs font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                <span className="text-xs text-gray-500 font-medium mr-2">Pipeline Stage:</span>
                {JOURNEY_STAGES.map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                      customer.statusTag === s
                        ? statusColors[s]
                        : 'bg-transparent border-white/10 text-gray-500 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-white mb-6 border-b border-white/5 pb-2">Client Identity & Background</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <Row label="Date of Birth" value={customer.dob ? new Date(customer.dob).toLocaleDateString() : 'N/A'} />
                <Row label="Height" value={`${customer.height} cm`} />
                <Row label="Marital Status" value={customer.maritalStatus} />
                <Row label="Religion" value={customer.religion} />
                <Row label="Caste" value={customer.caste} />
                <Row label="Languages" value={customer.languages?.join(', ') || 'N/A'} />
                <Row label="Siblings" value={customer.siblings ?? 'N/A'} />
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-white mb-6 border-b border-white/5 pb-2">Professional & Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <Row label="Annual Income" value={`₹${customer.income?.toLocaleString('en-IN')}`} />
                <Row label="Company" value={customer.company} />
                <Row label="Designation" value={customer.designation} />
                <Row label="Education" value={`${customer.degree} (${customer.college})`} />
                <Row label="Email" value={customer.email} />
                <Row label="Phone" value={customer.phone} />
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-white mb-6 border-b border-white/5 pb-2">Lifestyle Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <Row label="Diet" value={customer.diet} />
                <Row label="Manglik Status" value={customer.manglikStatus} />
                <Row label="Want Kids" value={customer.wantKids} />
                <Row label="Open to Relocate" value={customer.openToRelocate} />
                <Row label="Open to Pets" value={customer.openToPets} />
                <Row label="Smoking" value={customer.smoking} />
                <Row label="Drinking" value={customer.drinking} />
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-2">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Algorithmic Matching
                </h2>
                {!matchesLoading && matches.length === 0 && (
                  <button onClick={loadMatches} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors">
                    Run Analysis
                  </button>
                )}
              </div>

              {matchesLoading && (
                <div className="text-center py-12">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <h3 className="text-sm font-medium text-white mb-1">Computing Vectors...</h3>
                    <p className="text-xs text-gray-500">Evaluating compatibility matrix.</p>
                  </div>
                </div>
              )}

              {!matchesLoading && matches.length > 0 && (
                <div className="space-y-3">
                  {matches.map((item, idx) => {
                    const mAvatarNum = parseInt(item.match._id.substring(18), 16) % 90;
                    const mAvatarGen = item.match.gender === 'Female' ? 'women' : 'men';
                    return (
                      <div key={item.match._id} className="bg-[#111] border border-white/5 rounded-md p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-3 items-center">
                            <img src={`https://randomuser.me/api/portraits/${mAvatarGen}/${mAvatarNum}.jpg`} className="w-8 h-8 rounded object-cover grayscale" />
                            <div>
                              <p className="font-medium text-white text-sm">{item.match.firstName} {item.match.lastName}</p>
                              <p className="text-xs text-gray-500">{item.match.age} yrs · {item.match.city}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded">Score: {item.aiScore}/100</span>
                            {idx === 0 && <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">MATCH</span>}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-white/10 pl-3 py-1 my-3 bg-white/[0.02]">
                          {item.aiIntro}
                        </p>
                        <div className="flex justify-end">
                          <button onClick={() => setSendMatchModal(item)} className="text-xs font-medium text-white hover:text-blue-400 transition-colors">
                            Draft Introduction →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-6 sticky top-20">
              <h2 className="text-sm font-semibold text-white mb-6 border-b border-white/5 pb-2">Client Log</h2>

              <form onSubmit={handleAddNote} className="mb-6">
                <div className="flex gap-1.5 mb-3">
                  {NOTE_TYPES.map(nt => (
                    <button
                      key={nt.value}
                      type="button"
                      onClick={() => setNoteType(nt.value)}
                      className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                        noteType === nt.value ? nt.color : 'bg-transparent border-white/10 text-gray-500'
                      }`}
                    >
                      {nt.label}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <textarea
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Log interaction..."
                    rows={3}
                    className="w-full bg-[#111] border border-white/10 rounded-md p-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!newNote.trim()}
                    className="w-full py-2 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs font-medium transition-colors"
                  >
                    Save Log Entry
                  </button>
                </div>
              </form>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {notes.length === 0 ? (
                  <p className="text-gray-600 text-xs text-center py-4">No logs recorded.</p>
                ) : (
                  notes.map(n => {
                    const typeInfo = NOTE_TYPES.find(t => t.value === n.type) || NOTE_TYPES[0];
                    return (
                      <div key={n._id} className="bg-[#111] border border-white/5 rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium uppercase border ${typeInfo.color}`}>{typeInfo.label}</span>
                          <span className="text-[10px] text-gray-500">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">{n.content}</p>
                        <p className="text-[9px] text-gray-600 mt-2 text-right">— {n.authorName}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <CustomerForm
          initialData={customer}
          onSubmit={handleUpdateCustomer}
          onClose={() => setIsEditing(false)}
        />
      )}

      {sendMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-lg w-full max-w-lg shadow-2xl">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-white">Draft Introduction Email</h3>
              <button onClick={() => setSendMatchModal(null)} className="text-gray-500 hover:text-white text-xl leading-none">&times;</button>
            </div>
            
            <div className="p-6">
              <div className="flex gap-4 items-center mb-6 bg-[#111] p-3 rounded-md border border-white/5">
                <div className="w-10 h-10 rounded bg-white/10 overflow-hidden">
                  <img src={`https://randomuser.me/api/portraits/${sendMatchModal.match.gender === 'Female' ? 'women' : 'men'}/${parseInt(sendMatchModal.match._id.substring(18), 16) % 90}.jpg`} className="w-full h-full object-cover grayscale" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{sendMatchModal.match.firstName} {sendMatchModal.match.lastName}</p>
                  <p className="text-xs text-gray-500">{sendMatchModal.match.age} yrs · {sendMatchModal.match.designation}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-400 mb-2">Automated Draft</label>
                <div className="bg-[#111] border border-white/5 rounded-md p-4 text-sm text-gray-300 leading-relaxed font-mono">
                  {sendMatchModal.aiIntro}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setSendMatchModal(null)} className="px-4 py-2 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded text-xs font-medium">Cancel</button>
                <button onClick={() => handleSendMatch(sendMatchModal)} className="px-4 py-2 bg-white text-black hover:bg-gray-200 rounded text-xs font-medium flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                  Send to Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] text-gray-500 font-medium">{label}</span>
    <span className="text-sm text-gray-200">{value || '—'}</span>
  </div>
);

export default CustomerDetail;
