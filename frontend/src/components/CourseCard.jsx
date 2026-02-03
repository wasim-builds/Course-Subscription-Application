import { Link } from 'react-router-dom';

const CourseCard = ({ course, showSubscriptionInfo = false, subscription = null }) => {
    const isFree = course.price === 0;

    return (
        <Link to={`/courses/${course._id}`} className="block">
            <div className="card h-full hover:transform hover:-translate-y-1">
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-dark-700 to-dark-800">
                    {course.image ? (
                        <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                            📚
                        </div>
                    )}
                    <div className="absolute top-3 right-3">
                        {isFree ? (
                            <span className="badge-free">FREE</span>
                        ) : (
                            <span className="badge-paid">₹{course.price}</span>
                        )}
                    </div>
                </div>

                {/* Course Content */}
                <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-100 mb-2 line-clamp-2">
                        {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                        {course.description}
                    </p>

                    {showSubscriptionInfo && subscription && (
                        <div className="mt-4 pt-4 border-t border-dark-700">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Price Paid:</span>
                                <span className="text-green-400 font-semibold">
                                    {subscription.pricePaid === 0 ? 'FREE' : `₹${subscription.pricePaid}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-gray-400">Subscribed:</span>
                                <span className="text-gray-300">
                                    {new Date(subscription.subscribedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    )}

                    {!showSubscriptionInfo && (
                        <div className="mt-4">
                            <button className="w-full btn-primary text-sm">
                                View Details →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
