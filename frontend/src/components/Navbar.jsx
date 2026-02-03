import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return (
        <nav className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                                🎓 CourseHub
                            </div>
                            <span className="hidden sm:inline-block px-2 py-1 text-xs font-bold bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full animate-pulse">
                                BLACK FRIDAY
                            </span>
                        </Link>

                        <div className="hidden md:flex space-x-4">
                            <Link
                                to="/"
                                className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                All Courses
                            </Link>
                            <Link
                                to="/my-courses"
                                className="text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                My Courses
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-400">
                            Welcome, <span className="text-primary-400 font-semibold">{user?.name || user?.email}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-dark-700 hover:bg-dark-600 text-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-dark-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
