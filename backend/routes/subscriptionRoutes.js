import express from 'express';
import Course from '../models/Course.js';
import Subscription from '../models/Subscription.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Valid promo code for Black Friday
const VALID_PROMO_CODE = 'BFSALE25';
const PROMO_DISCOUNT = 0.5; // 50% discount

// @route   POST /api/subscribe
// @desc    Subscribe to a course
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { courseId, promoCode } = req.body;
        const userId = req.userId;

        // Validate input
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user is already subscribed
        const existingSubscription = await Subscription.findOne({
            userId,
            courseId
        });

        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: 'You are already subscribed to this course'
            });
        }

        let pricePaid = course.price;

        // Handle paid courses
        if (course.price > 0) {
            // Promo code is required for paid courses
            if (!promoCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Promo code is required for paid courses'
                });
            }

            // Validate promo code
            if (promoCode !== VALID_PROMO_CODE) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid promo code'
                });
            }

            // Apply discount
            pricePaid = course.price * PROMO_DISCOUNT;
        }
        // For free courses, pricePaid is already 0

        // Create subscription
        const subscription = new Subscription({
            userId,
            courseId,
            pricePaid
        });

        await subscription.save();

        // Populate course details for response
        await subscription.populate('courseId');

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to course',
            subscription
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during subscription'
        });
    }
});

// @route   GET /api/my-courses
// @desc    Get all courses user is subscribed to
// @access  Private
router.get('/my-courses', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        const subscriptions = await Subscription.find({ userId })
            .populate('courseId')
            .sort({ subscribedAt: -1 });

        res.json({
            success: true,
            count: subscriptions.length,
            subscriptions
        });
    } catch (error) {
        console.error('Get my courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching your courses'
        });
    }
});

export default router;
