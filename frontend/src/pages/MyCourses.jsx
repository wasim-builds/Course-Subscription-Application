import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import api from '../utils/api';
import toast from 'react-hot-toast';

const MyCourses = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            const response = await api.get('/my-courses');
            if (response.data.success) {
                setSubscriptions(response.data.subscriptions);
            }
        } catch (error) {
            toast.error('Failed to fetch your courses');
        } finally {
            setLoading(false);
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
            <div className="min-h-screen py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">
                            My Courses
                        </h1>
                        <p className="text-gray-400">
                            {subscriptions.length === 0
                                ? 'You haven\'t subscribed to any courses yet'
                                : `You are enrolled in ${subscriptions.length} course${subscriptions.length > 1 ? 's' : ''}`}
                        </p>
                    </div>

                    {subscriptions.length === 0 ? (
                        <div className="card p-12 text-center">
                            <div className="text-6xl mb-4">📚</div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                No courses yet
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Start learning by subscribing to courses
                            </p>
                            <a href="/" className="btn-primary inline-block">
                                Browse Courses
                            </a>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subscriptions.map((subscription) => (
                                <CourseCard
                                    key={subscription._id}
                                    course={subscription.courseId}
                                    showSubscriptionInfo={true}
                                    subscription={subscription}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyCourses;
