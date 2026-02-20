import PortfolioLayout from "../../components/PortfolioLayout";
import SectionHeader from "../../components/SectionHeader";
import { content } from "../../content";

export default function PortfolioLanding() {
  return (
    <PortfolioLayout>
      {/* Summary Text */}
      <section className="relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mt-4 sm:mt-6">
            <p className="text-muted-foreground text-left">
              I'm David Melkonian, a technical product and
              experience leader with over a decade of work at
              the intersection of UX, software engineering, and
              digital accessibility. I specialize in designing
              and shipping full-stack web and mobile products
              using Vue, React, Next.js, Python, and FastAPI,
              with a focus on scalable design systems,
              performance, and usability. I've led teams
              of 30+ and established enterprise-wide standards
              for digital experience delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative lab-section-narrow">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            <div
              id="featured-work"
              className="pt-4 px-4 sm:pt-6 sm:px-6 relative bg-transparent"
            >
              <SectionHeader
                title={content.featuredWork.title}
                className="mb-6"
                showUpArrow={false}
              />
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {content.featuredWork.projects.map(
                  (project, index) => (
                    <a
                      key={index}
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-lg bg-white/20 backdrop-blur-lg flex flex-col cursor-pointer shadow-xl overflow-hidden"
                    >
                      <div className="p-6 sm:p-8 flex flex-col gap-2 text-center items-center">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:font-bold transition-all uppercase tracking-wide">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-white">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex flex-row justify-center items-center gap-12 p-2">
                        {project.image && (
                          <div className="flex items-center justify-center">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="max-h-[250px] object-contain group-hover:scale-105 transition-transform duration-300"
                              loading="eager"
                            />
                          </div>
                        )}
                        {(project as any).image2 && (
                          <div className="flex items-center justify-center">
                            <img
                              src={(project as any).image2}
                              alt={`${project.title} secondary`}
                              className="max-h-[250px] object-contain group-hover:scale-105 transition-transform duration-300"
                              loading="eager"
                            />
                          </div>
                        )}
                      </div>
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PortfolioLayout>
  );
}
