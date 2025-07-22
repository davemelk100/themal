import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

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
    // Default pieces if nothing is saved
    return [
      {
        id: 1,
        title: "",
        subtitle: "",
        excerpt: "AI has made it less scary for when their parents die.",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
      {
        id: 2,
        title: "",
        subtitle: "",
        excerpt:
          "I mean, you came to see Shattered Realm, so now's not the time to whine about your helmet being split in two.",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
      {
        id: 3,
        title: "",
        subtitle: "",
        excerpt:
          "Thick Goth Chick Gets Ozempic and Leaves Harcore Dude Who Held Her Down All Those Years Before She Got Skinny",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
      {
        id: 4,
        title: "",
        subtitle: "",
        excerpt:
          "Chick Loses Weight, Boyfriend Knows This Is Just The First Step, Next Thing You Know She'll Ask To Go Outside",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
      {
        id: 5,
        title: "",
        subtitle: "",
        excerpt:
          "(image of the wild wild country guy bagwan shri rajneesh) SOUNDGARDEN",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
      {
        id: 6,
        title: "",
        subtitle: "",
        excerpt:
          "are moustaches still ironic? seems like people are taking them serious again.",
        category: "",
        readTime: "",
        date: "",
        image: "",
        url: "",
        isPublished: true,
      },
    ];
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
                Writing Gallery
              </h1>
              {!storageStatus.available && (
                <div className="flex items-center gap-2 mt-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    {storageStatus.message || "Storage not available"}
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
                Back to Site
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
    </div>
  );
};

export default WritingGallery;
