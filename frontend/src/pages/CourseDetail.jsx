import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PaymentModal from '../components/PaymentModal';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await api.get(`/courses/${id}`);
            if (response.data.success) {
                setCourse(response.data.course);
            }
        } catch (error) {
            toast.error('Failed to fetch course details');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleApplyPromo = () => {
        if (promoCode.trim().toUpperCase() === 'BFSALE25') {
            const discounted = course.price * 0.5;
            setDiscountedPrice(discounted);
            setPromoApplied(true);
            toast.success('Promo code applied! 50% discount activated 🎉');
        } else {
            toast.error('Invalid promo code');
            setPromoApplied(false);
        }
    };

    const handleSubscribe = async () => {
        // For paid courses, open payment modal
        if (course.price > 0) {
            if (!promoApplied) {
                toast.error('Please apply a valid promo code for paid courses');
                return;
            }
            setShowPaymentModal(true);
            return;
        }

        // For free courses, directly subscribe
        setSubscribing(true);
        try {
            const response = await api.post('/subscribe', {
                courseId: course._id,
            });

            if (response.data.success) {
                toast.success('Successfully enrolled in the course! 🎉');
                setTimeout(() => {
                    navigate('/my-courses');
                }, 1500);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Enrollment failed');
        } finally {
            setSubscribing(false);
        }
    };

    const handlePaymentSuccess = (subscription) => {
        // Navigate to My Courses after successful payment
        setTimeout(() => {
            navigate('/my-courses');
        }, 1500);
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

    if (!course) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-400">Course not found</p>
                </div>
            </>
        );
    }

    const isFree = course.price === 0;

    return (
        <>
            <Navbar />
            <div className="min-h-screen py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Course Header */}
                    <div className="card overflow-hidden mb-8">
                        <div className="relative h-64 md:h-96 bg-gradient-to-br from-dark-700 to-dark-800">
                            {course.image ? (
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-9xl">
                                    📚
                                </div>
                            )}
                        </div>

                        <div className="p-8">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-100">
                                    {course.title}
                                </h1>
                                {isFree ? (
                                    <span className="badge-free text-lg">FREE</span>
                                ) : (
                                    <div className="text-right">
                                        {promoApplied ? (
                                            <>
                                                <div className="text-gray-400 line-through text-sm">
                                                    ₹{course.price}
                                                </div>
                                                <div className="text-2xl font-bold text-green-400">
                                                    ₹{discountedPrice}
                                                </div>
                                                <div className="text-xs text-green-400">50% OFF</div>
                                            </>
                                        ) : (
                                            <div className="text-2xl font-bold text-primary-400">
                                                ₹{course.price}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <p className="text-gray-300 text-lg leading-relaxed">
                                {course.description}
                            </p>
                        </div>
                    </div>

                    {/* Subscription Section */}
                    <div className="card p-8">
                        <h2 className="text-2xl font-bold text-gray-100 mb-6">
                            {isFree ? 'Enroll for Free' : 'Subscribe to This Course'}
                        </h2>

                        {!isFree && (
                            <div className="mb-6">
                                <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 mb-4">
                                    <p className="text-primary-400 font-semibold mb-2">
                                        🎉 Black Friday Special Offer!
                                    </p>
                                    <p className="text-gray-300 text-sm">
                                        Use promo code <span className="font-bold">BFSALE25</span> to get 50% off
                                    </p>
                                </div>

                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Promo Code
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="Enter promo code"
                                        className="input-field flex-1"
                                        disabled={promoApplied}
                                    />
                                    <button
                                        onClick={handleApplyPromo}
                                        disabled={promoApplied || !promoCode}
                                        className="btn-secondary whitespace-nowrap"
                                    >
                                        {promoApplied ? '✓ Applied' : 'Apply Code'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {isFree && (
                            <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                <p className="text-green-400 font-semibold mb-1">
                                    ✨ This course is completely FREE!
                                </p>
                                <p className="text-gray-300 text-sm">
                                    No credit card required. Enroll now and start learning immediately.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleSubscribe}
                            disabled={subscribing || (!isFree && !promoApplied)}
                            className="w-full btn-primary text-lg py-3"
                        >
                            {subscribing ? 'Processing...' : isFree ? 'Enroll Now' : 'Proceed to Payment'}
                        </button>

                        {!isFree && !promoApplied && (
                            <p className="text-sm text-gray-400 mt-3 text-center">
                                Please apply a valid promo code to subscribe
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                course={course}
                finalPrice={discountedPrice || course.price}
                promoCode={promoCode}
                onSuccess={handlePaymentSuccess}
            />
        </>
    );
};

export default CourseDetail;
