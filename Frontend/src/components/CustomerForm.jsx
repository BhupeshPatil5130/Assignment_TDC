import { useState } from 'react';

const CustomerForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(initialData || {
    firstName: '', lastName: '', gender: 'Male', dob: '',
    country: 'India', city: '', height: 170, email: '', phone: '',
    income: 1000000, company: '', designation: '', degree: '', college: '',
    maritalStatus: 'Never Married', religion: 'Hindu', caste: 'Any',
    languages: [], siblings: 0,
    wantKids: 'Maybe', openToRelocate: 'Maybe', openToPets: 'Maybe',
    diet: 'Veg', smoking: 'No', drinking: 'No', manglikStatus: 'No',
    statusTag: 'Active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguagesChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, languages: val.split(',').map(l => l.trim()).filter(Boolean) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputCls = "w-full bg-transparent border border-[#333] hover:border-[#555] focus:border-white focus:bg-[#111] rounded-md px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-all";
  const selectCls = `${inputCls} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[position:right_10px_center] bg-no-repeat pr-10`;
  const labelCls = "block text-[13px] font-medium text-gray-300 mb-1.5";
  const sectionTitleCls = "text-base font-semibold text-white tracking-tight";
  const sectionDescCls = "text-[13px] text-gray-500 mt-1 mb-6";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 flex max-w-2xl w-full">
        <div className="w-full h-full bg-[#050505] border-l border-[#333] shadow-2xl flex flex-col animate-slide-in-right">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-[#222] bg-[#0A0A0A] flex justify-between items-start flex-shrink-0">
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                {initialData ? 'Edit Client Record' : 'New Client Record'}
              </h2>
              <p className="text-[13px] text-gray-400 mt-1.5">
                {initialData ? 'Update the details for this matchmaking profile.' : 'Add a new client to the matchmaking system.'} All fields are required unless stated otherwise.
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 -mr-2 rounded-md hover:bg-white/5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <form id="customerForm" onSubmit={handleSubmit} className="p-8 space-y-12">
              
              {/* Section 1: Identity */}
              <section>
                <div>
                  <h3 className={sectionTitleCls}>Personal Identity</h3>
                  <p className={sectionDescCls}>Basic information and contact details.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className={labelCls}>First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john.doe@example.com" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob ? formData.dob.split('T')[0] : ''} onChange={handleChange} required className={`${inputCls} [color-scheme:dark]`} />
                  </div>
                  <div>
                    <label className={labelCls}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className={selectCls}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Height <span className="text-gray-500 font-normal">(cm)</span></label>
                    <input type="number" name="height" value={formData.height} onChange={handleChange} required placeholder="175" className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Languages <span className="text-gray-500 font-normal">(comma-separated)</span></label>
                    <input name="languages" value={Array.isArray(formData.languages) ? formData.languages.join(', ') : ''} onChange={handleLanguagesChange} placeholder="English, Hindi, Marathi" className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Number of Siblings</label>
                    <input type="number" name="siblings" value={formData.siblings} onChange={handleChange} min="0" placeholder="0" className={inputCls} />
                  </div>
                </div>
              </section>

              <hr className="border-[#222]" />

              {/* Section 2: Background */}
              <section>
                <div>
                  <h3 className={sectionTitleCls}>Background & Career</h3>
                  <p className={sectionDescCls}>Location, profession, and socio-economic details.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label className={labelCls}>City</label>
                    <input name="city" value={formData.city} onChange={handleChange} required placeholder="Mumbai" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Country</label>
                    <input name="country" value={formData.country} onChange={handleChange} required placeholder="India" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Marital Status</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={selectCls}>
                      <option>Never Married</option><option>Divorced</option><option>Widowed</option><option>Awaiting Divorce</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Annual Income <span className="text-gray-500 font-normal">(₹)</span></label>
                    <input type="number" name="income" value={formData.income} onChange={handleChange} required placeholder="1500000" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Religion <span className="text-gray-500 font-normal">(Optional)</span></label>
                    <input name="religion" value={formData.religion} onChange={handleChange} placeholder="Hindu" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Caste <span className="text-gray-500 font-normal">(Optional)</span></label>
                    <input name="caste" value={formData.caste} onChange={handleChange} placeholder="Brahmin" className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Company</label>
                    <input name="company" value={formData.company} onChange={handleChange} placeholder="Google, TCS, etc." className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Designation</label>
                    <input name="designation" value={formData.designation} onChange={handleChange} placeholder="Software Engineer" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Degree</label>
                    <input name="degree" value={formData.degree} onChange={handleChange} placeholder="B.Tech, MBA, etc." className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Institution / College</label>
                    <input name="college" value={formData.college} onChange={handleChange} placeholder="IIT Bombay" className={inputCls} />
                  </div>
                </div>
              </section>

              <hr className="border-[#222]" />

              {/* Section 3: Preferences */}
              <section>
                <div>
                  <h3 className={sectionTitleCls}>Lifestyle & Preferences</h3>
                  <p className={sectionDescCls}>Personal habits and matching criteria.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="sm:col-span-2 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 mb-2">
                    <label className="block text-[13px] font-semibold text-blue-400 mb-1.5">Pipeline Stage</label>
                    <p className="text-xs text-gray-400 mb-3">Set the current status of this client in your matchmaking pipeline.</p>
                    <select name="statusTag" value={formData.statusTag} onChange={handleChange} className={`${selectCls} border-blue-500/30 focus:border-blue-400`}>
                      <option>Active</option><option>On Hold</option><option>Matched</option><option>Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Diet</label>
                    <select name="diet" value={formData.diet} onChange={handleChange} className={selectCls}>
                      <option>Veg</option><option>Non-Veg</option><option>Jain</option><option>Vegan</option><option>Eggetarian</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Manglik Status</label>
                    <select name="manglikStatus" value={formData.manglikStatus} onChange={handleChange} className={selectCls}>
                      <option>Yes</option><option>No</option><option>Not Sure</option><option>Anshik Manglik</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Want Kids</label>
                    <select name="wantKids" value={formData.wantKids} onChange={handleChange} className={selectCls}>
                      <option>Yes</option><option>No</option><option>Maybe</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Open to Relocate</label>
                    <select name="openToRelocate" value={formData.openToRelocate} onChange={handleChange} className={selectCls}>
                      <option>Yes</option><option>No</option><option>Maybe</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Open to Pets</label>
                    <select name="openToPets" value={formData.openToPets} onChange={handleChange} className={selectCls}>
                      <option>Yes</option><option>No</option><option>Maybe</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Drinking</label>
                    <select name="drinking" value={formData.drinking} onChange={handleChange} className={selectCls}>
                      <option>Yes</option><option>No</option><option>Occasionally</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Smoking</label>
                    <select name="smoking" value={formData.smoking} onChange={handleChange} className={selectCls}>
                      <option>Yes</option><option>No</option><option>Occasionally</option>
                    </select>
                  </div>
                </div>
              </section>

            </form>
          </div>
          
          {/* Footer */}
          <div className="px-8 py-5 border-t border-[#222] bg-[#0A0A0A] flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2 bg-transparent border border-[#333] text-gray-300 hover:text-white hover:bg-[#111] rounded-md text-[13px] font-medium transition-all">
              Cancel
            </button>
            <button type="submit" form="customerForm" className="px-5 py-2 bg-white text-black hover:bg-gray-200 rounded-md text-[13px] font-semibold transition-all shadow-sm">
              {initialData ? 'Save Changes' : 'Create Record'}
            </button>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default CustomerForm;
