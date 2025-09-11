import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-blue-700">404</h1>
      <p className="text-xl mt-4 text-gray-600">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 bg-blue-700 text-white px-6 py-2 hover:bg-blue-600 rounded-full"
      >
        Go Back Home
      </Link>
    </div>
  );
}
