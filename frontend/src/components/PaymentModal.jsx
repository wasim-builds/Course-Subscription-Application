import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const PaymentModal = ({ isOpen, onClose, course, finalPrice, promoCode, onSuccess }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + '/' + v.slice(2, 4);
        }
        return v;
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        if (formatted.replace(/\s/g, '').length <= 16) {
            setCardNumber(formatted);
        }
    };

    const handleExpiryChange = (e) => {
        const formatted = formatExpiry(e.target.value);
        if (formatted.replace('/', '').length <= 4) {
            setExpiry(formatted);
        }
    };

    const handleCvvChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/gi, '');
        if (value.length <= 4) {
            setCvv(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const cardNumberClean = cardNumber.replace(/\s/g, '');
        if (cardNumberClean.length < 15) {
            toast.error('Invalid card number');
            return;
        }

        if (!expiry.match(/^\d{2}\/\d{2}$/)) {
            toast.error('Invalid expiry date (MM/YY)');
            return;
        }

        if (cvv.length < 3) {
            toast.error('Invalid CVV');
            return;
        }

        setProcessing(true);

        try {
            // Step 1: Create payment order
            const orderResponse = await api.post('/payment/create-order', {
                courseId: course._id,
                amount: finalPrice
            });

            if (!orderResponse.data.success) {
                throw new Error(orderResponse.data.message);
            }

            const { transactionId } = orderResponse.data.payment;

            // Step 2: Verify payment
            const verifyResponse = await api.post('/payment/verify', {
                transactionId,
                cardNumber: cardNumberClean,
                promoCode
            });

            if (verifyResponse.data.success) {
                toast.success('Payment successful! 🎉');
                onSuccess(verifyResponse.data.subscription);
                onClose();
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Payment failed';
            toast.error(message);
        } finally {
            setProcessing(false);
        }
    };

    const useDemoCard = () => {
        setCardNumber('4111 1111 1111 1111');
        setExpiry('12/25');
        setCvv('123');
        toast.success('Demo card details filled!');
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-xl max-w-md w-full p-6 border border-dark-700">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-100">Complete Payment</h2>
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="text-gray-400 hover:text-gray-200 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Course Info */}
                <div className="bg-dark-700 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-200 mb-2">{course.title}</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Amount to pay:</span>
                        <span className="text-2xl font-bold text-green-400">₹{finalPrice}</span>
                    </div>
                </div>

                {/* Demo Card Info */}
                <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-3 mb-4">
                    <p className="text-sm text-primary-400 mb-2">
                        💳 <strong>Demo Payment Mode</strong>
                    </p>
                    <p className="text-xs text-gray-300 mb-2">
                        Use demo card: <code className="bg-dark-700 px-2 py-1 rounded">4111 1111 1111 1111</code>
                    </p>
                    <button
                        type="button"
                        onClick={useDemoCard}
                        className="text-xs text-primary-400 hover:text-primary-300 underline"
                    >
                        Click to auto-fill demo card
                    </button>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Card Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Card Number
                            </label>
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="1234 5678 9012 3456"
                                className="input-field"
                                disabled={processing}
                                required
                            />
                        </div>

                        {/* Expiry and CVV */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    value={expiry}
                                    onChange={handleExpiryChange}
                                    placeholder="MM/YY"
                                    className="input-field"
                                    disabled={processing}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    value={cvv}
                                    onChange={handleCvvChange}
                                    placeholder="123"
                                    className="input-field"
                                    disabled={processing}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full btn-primary mt-6 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                Processing Payment...
                            </span>
                        ) : (
                            `Pay ₹${finalPrice}`
                        )}
                    </button>
                </form>

                {/* Security Note */}
                <p className="text-xs text-gray-500 text-center mt-4">
                    🔒 This is a demo payment. No real charges will be made.
                </p>
            </div>
        </div>
    );
};

export default PaymentModal;
