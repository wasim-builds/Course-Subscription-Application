import express from 'express';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import Subscription from '../models/Subscription.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Demo card numbers that always succeed
const VALID_DEMO_CARDS = [
    '4111111111111111', // Visa
    '5555555555554444', // Mastercard
    '378282246310005',  // Amex
];

// Generate unique transaction ID
const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// @route   POST /api/payment/create-order
// @desc    Create a demo payment order
// @access  Private
router.post('/create-order', authMiddleware, async (req, res) => {
    try {
        const { courseId, amount } = req.body;
        const userId = req.userId;

        // Validate input
        if (!courseId || amount === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Course ID and amount are required'
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

        // Validate amount
        if (amount < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount'
            });
        }

        // Create payment order
        const transactionId = generateTransactionId();

        const payment = new Payment({
            userId,
            courseId,
            amount,
            transactionId,
            status: 'pending'
        });

        await payment.save();

        res.status(201).json({
            success: true,
            message: 'Payment order created',
            payment: {
                transactionId: payment.transactionId,
                amount: payment.amount,
                courseId: payment.courseId
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating payment order'
        });
    }
});

// @route   POST /api/payment/verify
// @desc    Verify demo payment and create subscription
// @access  Private
router.post('/verify', authMiddleware, async (req, res) => {
    try {
        const { transactionId, cardNumber, promoCode } = req.body;
        const userId = req.userId;

        // Validate input
        if (!transactionId || !cardNumber) {
            return res.status(400).json({
                success: false,
                message: 'Transaction ID and card number are required'
            });
        }

        // Find payment
        const payment = await Payment.findOne({ transactionId });
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Verify payment belongs to user
        if (payment.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Check if payment is already processed
        if (payment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Payment already ${payment.status}`
            });
        }

        // Validate demo card number
        const isValidCard = VALID_DEMO_CARDS.includes(cardNumber.replace(/\s/g, ''));

        if (!isValidCard) {
            // Mark payment as failed
            payment.status = 'failed';
            await payment.save();

            return res.status(400).json({
                success: false,
                message: 'Payment failed. Invalid card number. Use demo card: 4111111111111111'
            });
        }

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mark payment as successful
        payment.status = 'success';
        payment.cardLast4 = cardNumber.slice(-4);
        await payment.save();

        // Check if user is already subscribed
        const existingSubscription = await Subscription.findOne({
            userId,
            courseId: payment.courseId
        });

        if (existingSubscription) {
            return res.status(400).json({
                success: false,
                message: 'You are already subscribed to this course'
            });
        }

        // Create subscription
        const subscription = new Subscription({
            userId,
            courseId: payment.courseId,
            pricePaid: payment.amount
        });

        await subscription.save();
        await subscription.populate('courseId');

        res.json({
            success: true,
            message: 'Payment successful! Course enrolled.',
            payment: {
                transactionId: payment.transactionId,
                amount: payment.amount,
                status: payment.status
            },
            subscription
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error verifying payment'
        });
    }
});

// @route   GET /api/payment/history
// @desc    Get user's payment history
// @access  Private
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        const payments = await Payment.find({ userId })
            .populate('courseId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching payment history'
        });
    }
});

export default router;
