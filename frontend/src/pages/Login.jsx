import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if fields are filled
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        // Validate email format
        if (!validateEmail(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login', formData);

            if (response.data.success) {
                login(response.data.token, response.data.user);
                toast.success('Login successful!');
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        toast('Forgot password feature coming soon!', {
            icon: '🔐',
            duration: 3000,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-2">
                        🎓 CourseHub
                    </h1>
                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold rounded-full mb-4 animate-pulse">
                        BLACK FRIDAY SALE - 50% OFF
                    </div>
                    <h2 className="text-2xl font-bold text-gray-100">Welcome Back</h2>
                    <p className="text-gray-400 mt-2">Sign in to access your courses</p>
                </div>

                {/* Login Form */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="john@example.com"
                                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                                title="Please enter a valid email address"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-xs text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="••••••••"
                                title="Password must be at least 6 characters long"
                            />
                            <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-dark-700 rounded-lg border border-dark-600">
                        <p className="text-xs text-gray-400 font-semibold mb-2">Demo Credentials:</p>
                        <p className="text-xs text-gray-300">📧 john@example.com</p>
                        <p className="text-xs text-gray-300">🔑 password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
