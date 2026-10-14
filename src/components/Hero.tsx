import { ArrowUpRight, Download } from 'lucide-react';

const stack = [
    'React',
    'TypeScript',
    'JavaScript',
    'Next.js',
    'Node.js',
    'Playwright',
];

const Hero = () => {
    return (
        <section
            id="home"
            className="flex min-h-screen flex-col justify-center px-8 lg:px-12 xl:px-16"
        >
            <div className="max-w-xl">
                <p className="mb-4 text-sm text-(--accent)">
                    Frontend Developer
                </p>

                <h1 className="text-4xl font-semibold tracking-tight text-(--foreground) xl:text-5xl">
                    Mateusz Przewoźnik
                </h1>

                <p className="mt-6 max-w-lg leading-7 text-(--muted)">
                    I build modern web applications with a focus on clean interfaces,
                    maintainable code and great user experience.
                </p>

                <div className="mt-8 flex items-center gap-5">
                    <a
                        href="/cv/mateusz-przewoznik-cv.pdf"
                        className="flex items-center gap-2 rounded-md bg-(--accent) px-4 py-2.5 text-sm text-(--accent-foreground) transition-opacity hover:opacity-90"
                    >
                        Download CV
                        <Download size={15} />
                    </a>

                    <a
                        href="#contact"
                        className="flex items-center gap-1.5 text-sm text-(--foreground) transition-colors hover:text-(--accent)"
                    >
                        Contact
                        <ArrowUpRight size={15} />
                    </a>
                </div>
            </div>

            <div className="mt-16">
                <p className="mb-3 text-xs uppercase tracking-widest text-(--muted)">
                    Stack
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {stack.map((technology) => (
                        <span
                            key={technology}
                            className="text-sm text-(--foreground-secondary)"
                        >
                            {technology}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;