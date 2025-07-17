import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DesignSystem: React.FC = () => (
  <div className="min-h-screen bg-white">
    {/* Header */}
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mt-0 mb-0">Design System</h1>
            <p className="text-sm text-gray-600 mt-0 mb-0">Component library and design tokens</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </div>
    </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Colors */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <div className="w-full h-20 bg-primary rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium">Primary</p>
                <p className="text-gray-600">Primary</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-secondary rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium">Secondary</p>
                <p className="text-gray-600">Secondary</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-gray-100 rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium">Gray 100</p>
                <p className="text-gray-600">Gray 100</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-gray-200 rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium">Gray 200</p>
                <p className="text-gray-600">Gray 200</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-gray-600 rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium text-white">Gray 600</p>
                <p className="text-gray-300">Gray 600</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-20 bg-gray-900 rounded-lg"></div>
              <div className="text-sm">
                <p className="font-medium text-white">Gray 900</p>
                <p className="text-gray-300">Gray 900</p>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Design System</h1>
              <p className="text-sm text-gray-600">Component library and design tokens</p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">Design System</h2>
              <p className="text-sm text-gray-600">Component library and design tokens</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Design System</h3>
              <p className="text-sm text-gray-600">Component library and design tokens</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Design System</h4>
              <p className="text-sm text-gray-600">Component library and design tokens</p>
            </div>
            <div>
              <p className="text-base text-gray-700 mb-2">Body text - This is a paragraph with regular body text styling.</p>
              <p className="text-sm text-gray-600">Body text - This is a paragraph with regular body text styling.</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Small text - This is smaller text for captions and secondary information.</p>
              <p className="text-sm text-gray-600">Small text - This is smaller text for captions and secondary information.</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Buttons</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                Primary Button
              </button>
              <button className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
                Secondary Button
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Tertiary Button
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                Outline Primary
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Outline Secondary
              </button>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Card</h3>
              <p className="text-gray-600">Basic Card</p>
            </div>
            <div className="bg-gray-100/80 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Background Card</h3>
              <p className="text-gray-700">Background Card</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Card</h3>
              <p className="text-gray-600">Interactive Card</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Test Card</h3>
              <p className="text-gray-600">This card contains a test video that autoplays with sound muted.</p>
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <video 
                  className="w-full h-full object-cover"
                  autoPlay 
                  muted 
                  loop
                  playsInline
                >
                  <source src="https://sample-videos.com/zip/10p4/SampleVideo_1280x720b.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Video: Sample test content</p>
                <p className="text-xs text-gray-400 mt-1">Autoplay • Muted • Loop</p>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Spacing</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="text-sm text-gray-600">16px (w-4 h-4)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded"></div>
              <span className="text-sm text-gray-600">32px (w-8 h-8)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 bg-primary rounded"></div>
              <span className="text-sm text-gray-600">48px (w-12 h-12)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 bg-primary rounded"></div>
              <span className="text-sm text-gray-600">64px (w-16 h-16)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 bg-primary rounded"></div>
              <span className="text-sm text-gray-600">80px (w-20 h-20)</span>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Border Radius</h2>
          <div className="flex flex-wrap gap-6">
            <div className="space-y-2">
              <div className="w-16 bg-primary rounded-none"></div>
              <p className="text-sm text-gray-600">rounded-none</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 bg-primary rounded-sm"></div>
              <p className="text-sm text-gray-600">rounded-sm</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 bg-primary rounded"></div>
              <p className="text-sm text-gray-600">rounded</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 bg-primary rounded-md"></div>
              <p className="text-sm text-gray-600">rounded-md</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 bg-primary rounded-lg"></div>
              <p className="text-sm text-gray-600">rounded-lg</p>
            </div>
            <div className="space-y-2">
              <div className="w-16 bg-primary rounded-full"></div>
              <p className="text-sm text-gray-600">rounded-full</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DesignSystem; 