import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm">
                <span className="text-black font-bold text-sm tracking-tighter">TDC</span>
              </div>
              <span className="font-semibold text-white tracking-tight group-hover:text-gray-300 transition-colors">Matchmaker OS</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#platform" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Platform</a>
            <a href="#contact" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Enterprise</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="hidden sm:inline-flex px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;