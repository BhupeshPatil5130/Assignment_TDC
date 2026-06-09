import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Authentication successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleDemoLogin = async () => {
    const demoEmail = 'demo@matchmaker.in';
    const demoPass = 'password123';
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      await login(demoEmail, demoPass);
      toast.success('Authenticated as Demo User');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] font-sans">
      <div className="w-full max-w-[400px] p-8">
        
        <div className="flex justify-center mb-8">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
            <span className="text-black font-bold text-xs tracking-tighter">TDC</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">Log in to TDC</h2>
          <p className="text-gray-500 text-sm">Enter your credentials to access the OS.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#111] border border-white/10 rounded-md focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 text-white text-sm transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#111] border border-white/10 rounded-md focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 text-white text-sm transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-white text-black hover:bg-gray-200 rounded-md font-medium transition-colors text-sm shadow-sm mt-4"
          >
            Continue
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-[#050505] text-gray-500">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-md font-medium transition-colors text-sm"
        >
          Use Demo Account
        </button>

        <p className="mt-8 text-center text-gray-500 text-xs">
          Don't have an account? <Link to="/register" className="text-white hover:underline font-medium">Request access</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
