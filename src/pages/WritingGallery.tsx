import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { content } from "../content";
import MobileTrayMenu from "../components/MobileTrayMenu";

interface WritingPiece {
  id: number;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  url?: string;
  isPublished: boolean;
}

const WritingGallery: React.FC = () => {
  // Load saved writing pieces from storage or use defaults
  const getInitialWritingPieces = (): WritingPiece[] => {
    return content.writingGallery.defaultPieces.map((piece, i) => ({
      id: i + 1,
      title: "",
      subtitle: "",
      excerpt: piece.excerpt,
      category: "",
      readTime: "",
      date: "",
      image: "",
      url: "",
      isPublished: true,
    }));
  };

  const [writingPieces] = useState<WritingPiece[]>(getInitialWritingPieces);

  const [storageStatus] = useState<{ available: boolean; message?: string }>({
    available: true,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {content.writingGallery.title}
              </h1>
              {!storageStatus.available && (
                <div className="flex items-center gap-2 mt-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {storageStatus.message ||
                      content.writingGallery.storageNotAvailable}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {content.writingGallery.backToSite}
              </Link>
            </div>
          </div>

          {/* Writing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writingPieces.map((piece, index) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative bg-white dark:bg-gray-700 rounded-lg shadow-md p-6"
              >
                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {piece.excerpt}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center"></div>
        </motion.div>
      </div>
      <MobileTrayMenu />
    </div>
  );
};

export default WritingGallery;
