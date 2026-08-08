import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { status, sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (status === 'authenticated') return <Navigate to="/profile/setup" replace />;

  async function handleSendOtp(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendOtp(email);
      setInfo(`Code sent to ${email}. It expires in 10 minutes.`);
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, otp);
      navigate('/profile/setup');
    } catch (err) {
      setError(err.message || 'Incorrect code.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
      <p className="mt-1 text-sm text-gray-500">
        {step === 'email' ? 'Enter your email to receive a one-time code.' : 'Enter the 6-digit code we sent you.'}
      </p>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {info && step === 'otp' && <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{info}</p>}

      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? 'Sending code...' : 'Send code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">6-digit code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-lg tracking-[0.5em] focus:border-brand-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify & sign in'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('email');
              setOtp('');
              setError('');
            }}
            className="w-full text-center text-xs text-gray-500 hover:text-brand-600"
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  );
}
