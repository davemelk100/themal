import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, FileText, Palette } from "lucide-react";
import { content } from "../content";

interface AdminStats {
  totalArticles: number;
  totalDesignWork: number;
  totalStories: number;
  totalTestimonials: number;
}

const Admin: React.FC = () => {
  const stats: AdminStats = {
    totalArticles: content.articles.items.length,
    totalDesignWork: content.work.projects.length,
    totalStories: content.stories.items.length,
    totalTestimonials: content.testimonials.items.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Site
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Articles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalArticles}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <Palette className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Design Work</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalDesignWork}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Stories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalStories}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Testimonials</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalTestimonials}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/archive"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">View Articles</p>
                <p className="text-sm text-gray-600">Browse all articles</p>
              </div>
            </Link>

            <Link
              to="/design-archive"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Palette className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">View Design Work</p>
                <p className="text-sm text-gray-600">
                  Browse all design projects
                </p>
              </div>
            </Link>

            <Link
              to="/writing-gallery"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Writing Gallery</p>
                <p className="text-sm text-gray-600">Manage writing pieces</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Content Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Articles */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Articles
            </h2>
            <div className="space-y-3">
              {content.articles.items.slice(0, 5).map((article, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-600">{article.date}</p>
                  </div>
                  <Link
                    to={`/article/${article.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Design Work */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Design Work
            </h2>
            <div className="space-y-3">
              {content.work.projects.slice(0, 5).map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {project.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {project.categories}
                    </p>
                  </div>
                  {"url" in project && project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
