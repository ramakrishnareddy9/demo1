import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-purple-50 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          Oops! Page not found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
