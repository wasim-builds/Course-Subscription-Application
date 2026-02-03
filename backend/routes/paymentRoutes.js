import express from 'express';
import Payment from '../models/Payment.js';
import Course from '../models/Course.js';
import Subscription from '../models/Subscription.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Demo card scenarios
const DEMO_CARDS = {
    // Cards that always succeed
    SUCCESS: [
        '4111111111111111', // Visa - Success
        '5555555555554444', // Mastercard - Success
        '378282246310005',  // Amex - Success
    ],
    // Cards that simulate failures
    DECLINED: '4000000000000002',           // Card declined
    INSUFFICIENT_FUNDS: '4000000000009995', // Insufficient funds
    EXPIRED_CARD: '4000000000000069',       // Expired card
    INCORRECT_CVV: '4000000000000127',      // Incorrect CVV
    PROCESSING_ERROR: '4000000000000119',   // Processing error
    LOST_CARD: '4000000000009987',          // Lost card
};

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

        // Validate demo card number and determine scenario
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        const isSuccessCard = DEMO_CARDS.SUCCESS.includes(cleanCardNumber);
        
        // Check for specific failure scenarios
        let failureMessage = null;
        let failureCode = null;
        
        if (cleanCardNumber === DEMO_CARDS.DECLINED) {
            failureMessage = 'Card declined. Please use a different card.';
            failureCode = 'CARD_DECLINED';
        } else if (cleanCardNumber === DEMO_CARDS.INSUFFICIENT_FUNDS) {
            failureMessage = 'Insufficient funds. Please use a card with adequate balance.';
            failureCode = 'INSUFFICIENT_FUNDS';
        } else if (cleanCardNumber === DEMO_CARDS.EXPIRED_CARD) {
            failureMessage = 'Card has expired. Please use a valid card.';
            failureCode = 'EXPIRED_CARD';
        } else if (cleanCardNumber === DEMO_CARDS.INCORRECT_CVV) {
            failureMessage = 'Incorrect CVV. Please check your card details.';
            failureCode = 'INCORRECT_CVV';
        } else if (cleanCardNumber === DEMO_CARDS.PROCESSING_ERROR) {
            failureMessage = 'Payment processing error. Please try again later.';
            failureCode = 'PROCESSING_ERROR';
        } else if (cleanCardNumber === DEMO_CARDS.LOST_CARD) {
            failureMessage = 'This card has been reported lost. Please use a different card.';
            failureCode = 'LOST_CARD';
        } else if (!isSuccessCard) {
            failureMessage = 'Invalid card number. Use demo card: 4111 1111 1111 1111';
            failureCode = 'INVALID_CARD';
        }

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (failureMessage) {
            // Mark payment as failed
            payment.status = 'failed';
            payment.failureCode = failureCode;
            await payment.save();

            return res.status(400).json({
                success: false,
                message: failureMessage,
                errorCode: failureCode
            });
        }

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
