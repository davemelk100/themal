import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Music, ArrowLeft, Settings, Upload, Play } from "lucide-react";
import { checkAdminAuth } from "../utils/adminAuth";

const AdminMusic: React.FC = () => {
  const navigate = useNavigate();
  const isAdmin = checkAdminAuth();

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Music Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Admin-only music player and management tools
                </p>
              </div>
            </div>
            <Music className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Music Player Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-600 rounded-full">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100">
                    Music Player
                  </h2>
                  <p className="text-purple-700 dark:text-purple-300">
                    Full-featured MP3 player
                  </p>
                </div>
              </div>
              <p className="text-purple-800 dark:text-purple-200 mb-6">
                Access the complete music player with playlist management,
                volume controls, and track navigation.
              </p>
              <Link
                to="/music-player"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Play className="h-4 w-4" />
                Open Music Player
              </Link>
            </motion.div>

            {/* Upload Management Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-600 rounded-full">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                    File Management
                  </h2>
                  <p className="text-blue-700 dark:text-blue-300">
                    Upload and manage MP3 files
                  </p>
                </div>
              </div>
              <p className="text-blue-800 dark:text-blue-200 mb-6">
                Instructions for adding and managing your music files in the
                player.
              </p>
              <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Place MP3 files in /public/audio/</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Update tracks array in MusicPlayer.tsx</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Ensure proper file permissions</span>
                </div>
              </div>
            </motion.div>

            {/* Settings Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 border border-green-200 dark:border-green-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-600 rounded-full">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-green-900 dark:text-green-100">
                    Player Settings
                  </h2>
                  <p className="text-green-700 dark:text-green-300">
                    Configure player behavior
                  </p>
                </div>
              </div>
              <p className="text-green-800 dark:text-green-200 mb-6">
                Customize autoplay, shuffle, repeat, and other player
                preferences.
              </p>
              <div className="space-y-3 text-sm text-green-700 dark:text-green-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Autoplay on page load</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Shuffle playlist</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Loop current track</span>
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl p-6 border border-orange-200 dark:border-orange-700"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-600 rounded-full">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-orange-900 dark:text-orange-100">
                    Player Stats
                  </h2>
                  <p className="text-orange-700 dark:text-orange-300">
                    Usage statistics
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-orange-800 dark:text-orange-200">
                    Total Tracks:
                  </span>
                  <span className="font-semibold text-orange-900 dark:text-orange-100">
                    3
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-800 dark:text-orange-200">
                    Total Duration:
                  </span>
                  <span className="font-semibold text-orange-900 dark:text-orange-100">
                    4:19
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-800 dark:text-orange-200">
                    Last Played:
                  </span>
                  <span className="font-semibold text-orange-900 dark:text-orange-100">
                    Today
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/music-player"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Launch Player
              </Link>
              <Link
                to="/admin"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Back to Admin
              </Link>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Refresh Stats
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMusic;
