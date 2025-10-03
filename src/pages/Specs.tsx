import { motion } from "framer-motion";
import {
  Code,
  Palette,
  Database,
  Globe,
  Smartphone,
  Zap,
  Layers,
  Settings,
  Shield,
} from "lucide-react";

const Specs = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const techCategories = [
    {
      title: "Frontend Framework",
      icon: <Code className="w-6 h-6" />,
      items: [
        {
          name: "React 18",
          description: "Modern React with concurrent features",
        },
        { name: "TypeScript", description: "Type-safe JavaScript development" },
        { name: "Vite", description: "Fast build tool and development server" },
        { name: "React Router DOM", description: "Client-side routing" },
      ],
    },
    {
      title: "Styling & UI",
      icon: <Palette className="w-6 h-6" />,
      items: [
        { name: "Tailwind CSS", description: "Utility-first CSS framework" },
        { name: "Framer Motion", description: "Animation library for React" },
        { name: "Radix UI", description: "Headless UI components" },
        { name: "Lucide React", description: "Beautiful icon library" },
      ],
    },
    {
      title: "Database & Backend",
      icon: <Database className="w-6 h-6" />,
      items: [
        {
          name: "Drizzle ORM",
          description: "TypeScript ORM for database operations",
        },
        { name: "PostgreSQL", description: "Primary database via Neon" },
        { name: "NextAuth.js", description: "Authentication framework" },
        { name: "Netlify Functions", description: "Serverless functions" },
      ],
    },
    {
      title: "Deployment & Hosting",
      icon: <Globe className="w-6 h-6" />,
      items: [
        { name: "Netlify", description: "Static site hosting and deployment" },
        {
          name: "Service Worker",
          description: "Offline functionality and caching",
        },
        { name: "CDN", description: "Global content delivery" },
        { name: "SSL/TLS", description: "Secure HTTPS connections" },
      ],
    },
    {
      title: "Mobile & Responsive",
      icon: <Smartphone className="w-6 h-6" />,
      items: [
        {
          name: "Mobile-First Design",
          description: "Responsive design approach",
        },
        {
          name: "Touch Interactions",
          description: "Mobile-optimized interactions",
        },
        { name: "Progressive Web App", description: "App-like experience" },
        {
          name: "Viewport Optimization",
          description: "Adaptive layouts for all devices",
        },
      ],
    },
    {
      title: "Performance & Optimization",
      icon: <Zap className="w-6 h-6" />,
      items: [
        { name: "Code Splitting", description: "Lazy loading with React.lazy" },
        {
          name: "Image Optimization",
          description: "WebP format with fallbacks",
        },
        {
          name: "Bundle Optimization",
          description: "Tree shaking and minification",
        },
        {
          name: "Caching Strategy",
          description: "Service worker and browser caching",
        },
      ],
    },
    {
      title: "Development Tools",
      icon: <Settings className="w-6 h-6" />,
      items: [
        { name: "ESLint", description: "Code linting and quality" },
        { name: "Prettier", description: "Code formatting" },
        { name: "TypeScript", description: "Static type checking" },
        { name: "Vite Dev Server", description: "Fast development with HMR" },
      ],
    },
    {
      title: "Security & Accessibility",
      icon: <Shield className="w-6 h-6" />,
      items: [
        { name: "WCAG 2.1 AA", description: "Accessibility compliance" },
        { name: "ARIA Labels", description: "Screen reader support" },
        {
          name: "Keyboard Navigation",
          description: "Full keyboard accessibility",
        },
        { name: "Security Headers", description: "Content Security Policy" },
      ],
    },
    {
      title: "Content & Media",
      icon: <Layers className="w-6 h-6" />,
      items: [
        { name: "RSS Feeds", description: "News aggregation system" },
        {
          name: "Audio Player",
          description: "Custom music player with 18 tracks",
        },
        { name: "Video Content", description: "Optimized video delivery" },
        {
          name: "SVG Animations",
          description: "Lightweight vector animations",
        },
      ],
    },
  ];

  const methodologies = [
    {
      title: "Design System",
      description:
        "Component-based design system with consistent typography, colors, and spacing",
    },
    {
      title: "Mobile-First Development",
      description:
        "Responsive design starting from mobile devices and scaling up",
    },
    {
      title: "Progressive Enhancement",
      description:
        "Core functionality works everywhere, enhanced features for modern browsers",
    },
    {
      title: "Performance Budget",
      description:
        "Optimized for fast loading times and smooth user experience",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Application Specs
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A comprehensive overview of the technologies, frameworks, and
              methodologies powering this modern portfolio website.
            </p>
          </motion.div>

          {/* Technology Stack */}
          <motion.section variants={fadeInUp} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {techCategories.map((category, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="text-primary mr-3">{category.icon}</div>
                    <h3 className="text-xl font-semibold">{category.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="border-l-2 border-primary/20 pl-4"
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Methodologies */}
          <motion.section variants={fadeInUp} className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Development Methodologies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {methodologies.map((method, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20"
                >
                  <h3 className="text-xl font-semibold mb-3 text-primary">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {method.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Key Features */}
          <motion.section variants={fadeInUp} className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Dark/Light Mode Toggle",
                "Responsive Design (Mobile-First)",
                "Smooth Animations & Transitions",
                "Music Player with 18 Tracks",
                "News Aggregator with RSS Feeds",
                "Interactive SVG Animations",
                "Article Modal System",
                "Grid/List View Toggle",
                "Service Worker (Offline Support)",
                "SEO Optimized",
                "Accessibility Compliant",
                "Performance Optimized",
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                >
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Performance Metrics */}
          <motion.section variants={fadeInUp} className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Performance Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  metric: "Bundle Size",
                  value: "< 200KB",
                  description: "Optimized JavaScript",
                },
                {
                  metric: "Load Time",
                  value: "< 2s",
                  description: "Fast initial load",
                },
                {
                  metric: "Lighthouse Score",
                  value: "95+",
                  description: "Performance rating",
                },
                {
                  metric: "Accessibility",
                  value: "100%",
                  description: "WCAG 2.1 AA compliant",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="text-center bg-gradient-to-br from-secondary/10 to-primary/10 rounded-xl p-6"
                >
                  <div className="text-3xl font-bold text-primary mb-2">
                    {item.value}
                  </div>
                  <div className="text-lg font-semibold mb-2">
                    {item.metric}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Footer */}
          <motion.div
            variants={fadeInUp}
            className="text-center pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-gray-600 dark:text-gray-400">
              Built with modern web technologies and best practices for optimal
              performance and user experience.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Specs;
