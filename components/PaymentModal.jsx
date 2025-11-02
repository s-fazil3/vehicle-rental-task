import React, { useEffect, useState } from 'react';
import { API } from '../src/api';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function PaymentModal({ open, amount, currency = 'inr', onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      if (!open) return;
      setError('');
      setClientSecret('');
      try {
        const res = await API.post('/payments/intent', { amount, currency });
        setClientSecret(res.data?.clientSecret || '');
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      }
    };
    init();
  }, [open, amount, currency]);

  const handlePay = async () => {
    try {
      setLoading(true);
      setError('');
      if (!stripe || !elements || !clientSecret) return;
      const card = elements.getElement(CardElement);
      const { error: pmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card }
      });
      if (pmError) {
        setError(pmError.message || 'Payment failed');
        return;
      }
      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent);
      } else {
        setError('Payment not completed');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: 20, borderRadius: 8, width: 420, maxWidth: '92vw' }}>
        <h3 style={{ marginTop: 0 }}>Pay ₹{amount}</h3>
        <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6, marginBottom: 12 }}>
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        {error && <div style={{ color: 'crimson', marginBottom: 8 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} disabled={loading}>Cancel</button>
          <button onClick={handlePay} disabled={loading || !clientSecret}>{loading ? 'Processing...' : 'Pay'}</button>
        </div>
      </div>
    </div>
  );
}
