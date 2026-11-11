import About from "./About/About";

const PageSections = () => {
  return (
    <main
      data-scroll-container
      className="fixed top-16 right-0 bottom-0 left-0 z-10 snap-y snap-mandatory overflow-y-auto overscroll-contain md:left-[40%]"
    >
      <section id="about" className="h-full snap-start snap-always">
        <About />
      </section>

      <section id="projects" className="flex h-full snap-start snap-always items-center">
        Projects
      </section>

      <section id="contact" className="flex h-full snap-start snap-always items-center">
        Contact
      </section>
    </main>
  );
};

export default PageSections;
