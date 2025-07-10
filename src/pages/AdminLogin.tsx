import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { verifyPassword } from "../utils/passwordHash";
import { checkAdminAuth } from "../utils/adminAuth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    if (checkAdminAuth()) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const isValid = await verifyPassword(password);

      if (isValid) {
        // Store authentication in localStorage
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminAuthTime", Date.now().toString());
        navigate("/admin");
      } else {
        setError("Incorrect password");
        setPassword("");
      }
    } catch (error) {
      setError("Authentication error. Please try again.");
      setPassword("");
    }

    setIsLoading(false);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        <button
          onClick={handleBackClick}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Site
        </button>

        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-8">
          <h1 className="text-4xl sm:text-5xl font-bold dark:text-white mb-6 text-center">
            Admin Access
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-nav font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter admin password"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-nav">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Checking..." : "Access Admin Panel"}
            </button>
          </form>

          <div className="mt-6 text-caption text-gray-500 dark:text-gray-400 text-center">
            This area is restricted to authorized personnel only.
          </div>
        </div>
      </div>
    </div>
  );
}
