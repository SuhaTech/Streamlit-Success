import React, { useState } from 'react'; // useEffect hata diya kyunki save nahi karna
import { useAuth } from '../context/AuthContext';
import { 
  LogOut,Plus, Upload, X, 
  Mail,ShieldCheck, Search,FileText, CheckCircle2,GraduationCap,
  BookOpen
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillInput, setSkillInput] = useState('');

  // 1. Fresh Profile Logic: localStorage hata diya gaya hai
  const [profile, setProfile] = useState({
    fullName: user?.name || 'New Student',
    contact: '', 
    email: user?.email || '', 
    altEmail: '',
    college: '', 
    branch: '',
    cgpa: '',
    admissionYear: '',
    github: '', 
    linkedin: '',
    skills: [], 
    resumeName: '' 
  });

  // 2. Fresh Applications: localStorage hata diya gaya hai
  const [myApplications, setMyApplications] = useState([]);

  // Note: localStorage.setItem wala useEffect yahan se hata diya gaya hai taaki data save na ho

  const allJobs = [
    { id: 1, company: 'Google', role: 'Product Designer', loc: 'Remote', pay: '₹60,000', logo: 'G', color: 'bg-rose-500' },
    { id: 2, company: 'Microsoft', role: 'Software Engineer', loc: 'Bangalore', pay: '₹55,000', logo: 'M', color: 'bg-blue-600' },
    { id: 3, company: 'Apple', role: 'iOS Intern', loc: 'Hyderabad', pay: '₹70,000', logo: 'A', color: 'bg-slate-900' }
  ];

  const filteredJobs = allJobs.filter(job => 
    job.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (job) => {
    if(!profile.resumeName) {
      alert("Registration Incomplete: Please upload your Resume in Profile settings first.");
      setShowModal(true);
      return;
    }
    // Agar current session mein apply kiya hai to check karega
    if (myApplications.find(a => a.id === job.id)) {
      alert("Already applied for this role.");
      return;
    }
    
    setMyApplications([{ ...job, status: 'Applied', date: new Date().toLocaleDateString() }, ...myApplications]);
    alert(`Success! Applied to ${job.company}.`);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
      {/* NAVBAR */}
      <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/60 px-10 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white rotate-3 shadow-lg shadow-black/20">
            <ShieldCheck size={22} />
          </div>
          <span className="text-xl font-black tracking-tighter italic">STREAMLINING.</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Search internships..." 
              className="pl-11 pr-5 py-2.5 bg-slate-100 rounded-2xl outline-none text-sm w-48 md:w-72 focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all border border-transparent focus:border-slate-200"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={logout} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
            <LogOut size={20}/>
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-10 grid grid-cols-12 gap-8">
        
        {/* LEFT: ENHANCED ACADEMIC PROFILE */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200/50 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-black rounded-[1.8rem] shadow-2xl shadow-black/20 flex items-center justify-center text-white text-3xl font-bold mb-6 italic">
                {profile.fullName?.[0]?.toUpperCase()}
              </div>
              <h2 className="text-3xl font-black mb-1 tracking-tight">{profile.fullName}</h2>
              <p className="text-slate-400 font-bold text-xs mb-6 uppercase tracking-widest flex items-center gap-2">
                <BookOpen size={14}/> {profile.branch || 'Branch Not Set'}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">CGPA</p>
                   <p className="text-lg font-black text-black">{profile.cgpa || '0.0'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Batch</p>
                   <p className="text-lg font-black text-black">{profile.admissionYear || '----'}</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-6 border-t border-slate-100 text-slate-600 font-bold text-[11px]">
                <div className="flex items-center gap-3"><Mail size={14} className="text-slate-300"/> {profile.email}</div>
                {profile.altEmail && <div className="flex items-center gap-3"><Mail size={14} className="text-slate-300"/> {profile.altEmail}</div>}
                {profile.resumeName && <div className="flex items-center gap-3 text-emerald-600"><FileText size={14}/> CV: {profile.resumeName}</div>}
              </div>

              <button 
                onClick={() => setShowModal(true)}
                className="w-full mt-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all"
              >
                Edit Academic Profile
              </button>
            </div>
          </div>

          <div className="bg-black rounded-[2.5rem] p-10 text-white shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6">Tracker</p>
            <div className="text-7xl font-black tracking-tighter mb-2">{myApplications.length}</div>
            <p className="text-slate-400 font-bold text-xs uppercase">Active Applications</p>
          </div>
        </div>

        {/* RIGHT: JOB LIST */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="px-4">
            <h3 className="text-3xl font-black tracking-tight mb-1">Recommended Roles</h3>
            <p className="text-slate-400 font-medium text-sm italic">Based on your branch: {profile.branch || 'General'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 hover:border-black transition-all group shadow-sm">
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-12 h-12 ${job.color} rounded-2xl flex items-center justify-center text-white text-lg font-black`}>{job.logo}</div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{job.loc}</span>
                    {myApplications.some(a => a.id === job.id) && <CheckCircle2 className="text-emerald-500 mt-1" size={16}/>}
                  </div>
                </div>
                <h4 className="text-xl font-black mb-1">{job.role}</h4>
                <p className="text-slate-400 font-bold text-xs mb-8 uppercase">{job.company} • {job.pay}</p>
                <button 
                  onClick={() => handleApply(job)} 
                  className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    myApplications.some(a => a.id === job.id) 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-slate-50 hover:bg-black hover:text-white'
                  }`}
                >
                  {myApplications.some(a => a.id === job.id) ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* COMPREHENSIVE MODAL: ACADEMIC & CONTACT SETTINGS */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[3rem] relative z-10 shadow-2xl overflow-hidden flex flex-col md:flex-row">
            
            <div className="w-full md:w-1/4 bg-slate-50 p-10 border-r border-slate-100 hidden md:flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white mb-6"><GraduationCap size={24}/></div>
                <h3 className="text-2xl font-black tracking-tight mb-4">Academic Master Profile</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase tracking-wider">Ensure your CGPA and Branch are accurate for recruiter filtering.</p>
              </div>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Portal Version 2.0</div>
            </div>

            <div className="flex-1 p-10 overflow-y-auto bg-white custom-scrollbar">
              <div className="space-y-8">
                <section>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-3 block ml-1 text-center">Master CV (PDF)</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50 hover:bg-slate-100 hover:border-black transition-all cursor-pointer group">
                    <Upload className="w-6 h-6 mb-2 text-slate-400 group-hover:text-black transition-all" />
                    <p className="text-[10px] font-black text-slate-500 uppercase">
                      {profile.resumeName ? profile.resumeName : 'Upload Professional Resume'}
                    </p>
                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => setProfile({...profile, resumeName: e.target.files[0]?.name})}/>
                  </label>
                </section>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" value={profile.fullName} onChange={(e)=>setProfile({...profile, fullName: e.target.value})}/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Email</label>
                    <input type="email" className="w-full p-4 bg-slate-100 rounded-2xl outline-none font-bold text-xs text-slate-400" value={profile.email} readOnly/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alternative Email</label>
                    <input type="email" placeholder="Personal Email ID" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" value={profile.altEmail} onChange={(e)=>setProfile({...profile, altEmail: e.target.value})}/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact No</label>
                    <input type="text" placeholder="+91 00000 00000" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" value={profile.contact} onChange={(e)=>setProfile({...profile, contact: e.target.value})}/>
                  </div>
                </div>

                <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">University / College</label>
                    <input type="text" placeholder="IIT Bombay" className="w-full p-4 bg-white rounded-2xl outline-none font-bold text-xs" value={profile.college} onChange={(e)=>setProfile({...profile, college: e.target.value})}/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current CGPA</label>
                    <input type="text" placeholder="9.5" className="w-full p-4 bg-white rounded-2xl outline-none font-bold text-xs" value={profile.cgpa} onChange={(e)=>setProfile({...profile, cgpa: e.target.value})}/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admission Year</label>
                    <input type="text" placeholder="2021" className="w-full p-4 bg-white rounded-2xl outline-none font-bold text-xs" value={profile.admissionYear} onChange={(e)=>setProfile({...profile, admissionYear: e.target.value})}/>
                  </div>
                  <div className="space-y-1 md:col-span-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Engineering Branch / Course</label>
                    <input type="text" placeholder="Computer Science & Engineering" className="w-full p-4 bg-white rounded-2xl outline-none font-bold text-xs" value={profile.branch} onChange={(e)=>setProfile({...profile, branch: e.target.value})}/>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Technical Skills</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Add a skill" className="flex-1 p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs" value={skillInput} onChange={(e)=>setSkillInput(e.target.value)}/>
                      <button 
                        onClick={()=>{if(skillInput){setProfile({...profile, skills:[...profile.skills, skillInput]}); setSkillInput('')}}}
                        className="bg-black text-white px-6 rounded-2xl hover:scale-105 transition-all"
                      ><Plus size={18}/></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="GitHub URL" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs text-slate-500" value={profile.github} onChange={(e)=>setProfile({...profile, github: e.target.value})}/>
                    <input type="text" placeholder="LinkedIn URL" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-xs text-slate-500" value={profile.linkedin} onChange={(e)=>setProfile({...profile, linkedin: e.target.value})}/>
                  </div>
                </div>

                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full py-5 bg-black text-white rounded-[1.8rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-slate-800 transition-all"
                >
                  Synchronize Profile Data
                </button>
              </div>
            </div>

            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-black transition-colors md:hidden">
              <X size={24}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;