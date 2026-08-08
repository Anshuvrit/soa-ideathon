import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-3xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-sm text-gray-500">This page doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block text-sm font-semibold text-brand-600 hover:underline">
        Back home
      </Link>
    </div>
  );
}
