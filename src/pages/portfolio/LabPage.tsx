import { lazy } from "react";
import { Link } from "react-router-dom";
import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import IconWrapper from "../../components/IconWrapper";
import { content } from "../../content";

const LazyDribbble = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Dribbble }))
);

export default function LabPage() {

  const labProjects = content.currentProjects.projects.filter(
    (project) =>
      project.title !== "Chatbots" &&
      project.title !== "Design Panes" &&
      project.title !== "HealthAware" &&
      project.title !== "AI NUI" &&
      project.title !== "Configurable Multivariate Testing",
  );

  const designProjects = content.work.projects.filter(
    (project: any) => project.title !== "3D Conversion UX Plan"
  );

  return (
    <PortfolioLayout currentPage="design-dev">
      {/* UX/UI Section */}
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <SectionHeader
              title="UX/UI"
              subtitle="Design work and visual explorations"
              className=""
            />
            <a
              href={content.navigation.social.dribbble.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 w-8 h-8 flex items-center justify-center"
              aria-label="Dribbble"
            >
              <IconWrapper
                Icon={LazyDribbble}
                className="h-4 w-4 text-brand-dynamic dark:text-gray-300"
              />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {designProjects.map((project: any, index: number) => {
                const isInternal = project.url?.startsWith("/");
                const cardClass = "group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col shadow-xl hover:shadow-2xl transition-shadow cursor-pointer";
                const cardContent = (
                  <>
                    <div className="relative w-full max-h-64 overflow-hidden bg-transparent">
                      <img
                        src={project.image}
                        alt={project.alt || project.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1 card-hover-secondary">
                      <h3 className="font-semibold text-brand-dynamic group-hover:font-bold transition-all">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-foreground/70 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </>
                );
                return isInternal ? (
                  <Link key={index} to={project.url} className={cardClass}>
                    {cardContent}
                  </Link>
                ) : (
                  <a key={index} href={project.url} target="_blank" rel="noopener noreferrer" className={cardClass}>
                    {cardContent}
                  </a>
                );
              })}
          </div>
        </div>
      </section>

      {/* Lab Section */}
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative lab-section-narrow">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            <div className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent">
              <SectionHeader
                title={content.currentProjects.title}
                subtitle={content.currentProjects.subtitle}
                className="mb-6"
                showUpArrow={false}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {labProjects.map((project, index) => (
                    <a
                      key={index}
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col cursor-pointer shadow-xl"
                    >
                      <div className="relative w-full h-48 sm:h-64 overflow-hidden bg-transparent">
                        {project.image ? (
                          <img
                            src={project.image.endsWith(".svg") ? `${project.image}?v=${Date.now()}` : project.image}
                            alt={project.title}
                            className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${project.image.endsWith(".svg") ? "object-contain object-center" : "object-cover object-top"}`}
                            loading={index === 0 ? "eager" : "lazy"}
                            {...(index === 0 ? { fetchpriority: "high" } : {})}
                            decoding="async"
                            width="512"
                            height="512"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                            <span className="text-gray-400 dark:text-gray-500">
                              {(project as any).title || "Project"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 sm:p-6 flex flex-col gap-2 flex-1 card-hover-secondary">
                        <h3 className="font-semibold text-brand-dynamic group-hover:font-bold transition-all">
                          {project.title}
                        </h3>
                        <p className="text-foreground/70 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </section>
    </PortfolioLayout>
  );
}
