import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const MagicLinkVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyMagicLink } = useAuth();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyLink = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setStatus("error");
        setMessage("Invalid verification link. Please try signing in again.");
        return;
      }

      try {
        await verifyMagicLink(email, token);
        setStatus("success");
        setMessage("Successfully signed in! Redirecting...");

        // Redirect to main page after successful verification
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Failed to verify magic link"
        );
      }
    };

    verifyLink();
  }, [searchParams, verifyMagicLink, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          {status === "verifying" && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Verifying Your Sign In
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we verify your magic link...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                Successfully Signed In!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Your settings are now being loaded and will be automatically
                  saved to your account.
                </p>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Verification Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Try Signing In Again
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Return to Home
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Having trouble? Check your email for the magic link or try signing
            in again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MagicLinkVerification;
