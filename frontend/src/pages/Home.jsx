import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
    const [enrollingCourseId, setEnrollingCourseId] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
        if (user) {
            fetchEnrolledCourses();
        }
    }, [user]);

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            if (response.data.success) {
                setCourses(response.data.courses);
            }
        } catch (error) {
            toast.error('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const response = await api.get('/my-courses');
            if (response.data.success) {
                const enrolledIds = new Set(
                    response.data.subscriptions.map(sub => sub.courseId._id)
                );
                setEnrolledCourseIds(enrolledIds);
            }
        } catch (error) {
            // Silently fail - user might not have any courses
            console.error('Failed to fetch enrolled courses:', error);
        }
    };

    const handleEnroll = async (courseId) => {
        // Check if user is authenticated
        if (!user) {
            toast.error('Please login to enroll in courses');
            navigate('/login');
            return;
        }

        setEnrollingCourseId(courseId);

        try {
            const response = await api.post('/subscribe', { courseId });

            if (response.data.success) {
                const course = courses.find(c => c._id === courseId);
                toast.success(`Successfully enrolled in ${course?.title || 'course'}!`);

                // Update enrolled courses
                setEnrolledCourseIds(prev => new Set([...prev, courseId]));
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to enroll in course';
            toast.error(message);
        } finally {
            setEnrollingCourseId(null);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-primary-600 via-red-600 to-orange-600 py-12 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            🔥 Black Friday Sale is LIVE! 🔥
                        </h1>
                        <p className="text-xl text-white/90 mb-2">
                            Get 50% OFF on all paid courses with code{' '}
                            <span className="font-bold bg-white text-primary-600 px-3 py-1 rounded-lg">
                                BFSALE25
                            </span>
                        </p>
                        <p className="text-white/80">
                            Limited time offer - Upgrade your skills today!
                        </p>
                    </div>
                </div>

                {/* Courses Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Free Courses Section */}
                    <div className="mb-12">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-gray-100">
                                    🎓 Free Courses
                                </h2>
                                <span className="badge-free text-sm">
                                    {courses.filter(c => c.price === 0).length} Available
                                </span>
                            </div>
                            <p className="text-gray-400">
                                Start learning today with our completely free courses - no credit card required!
                            </p>
                        </div>

                        {courses.filter(c => c.price === 0).length === 0 ? (
                            <div className="text-center py-12 bg-dark-800 rounded-lg border border-dark-700">
                                <p className="text-gray-400 text-lg">No free courses available</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses
                                    .filter(c => c.price === 0)
                                    .map((course) => (
                                        <CourseCard
                                            key={course._id}
                                            course={course}
                                            onEnroll={handleEnroll}
                                            isEnrolled={enrolledCourseIds.has(course._id)}
                                            enrolling={enrollingCourseId === course._id}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Premium Courses Section */}
                    <div>
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-gray-100">
                                    💎 Premium Courses
                                </h2>
                                <span className="badge-paid text-sm">
                                    50% OFF with BFSALE25
                                </span>
                            </div>
                            <p className="text-gray-400">
                                Advanced courses with comprehensive content - Get 50% discount with promo code!
                            </p>
                        </div>

                        {courses.filter(c => c.price > 0).length === 0 ? (
                            <div className="text-center py-12 bg-dark-800 rounded-lg border border-dark-700">
                                <p className="text-gray-400 text-lg">No premium courses available</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses
                                    .filter(c => c.price > 0)
                                    .map((course) => (
                                        <CourseCard key={course._id} course={course} />
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
