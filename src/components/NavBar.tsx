import classNames from 'classnames';

import { useActiveSection } from '../hooks/useActiveSection';

const navItems = [
    { label: 'about', href: '#about' },
    { label: 'projects', href: '#projects' },
    { label: 'contact', href: '#contact' },
];

const NavBar = () => {
    const activeSection = useActiveSection();

    return (
        <nav className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-8 sm:flex z-10">
            {navItems.map(({ label, href }) => {
                const isActive = href === `#${activeSection}`;

                return (
                    <a
                        key={href}
                        href={href}
                        className={classNames(
                            'relative flex h-full items-center text-sm transition-colors',
                            isActive
                                ? 'text-(--foreground)'
                                : 'text-(--muted) hover:text-(--foreground)',
                        )}
                    >
                        {label}

                        <span
                            className={classNames(
                                'absolute right-0 bottom-2 left-0 h-px bg-(--accent) transition-all duration-300',
                                isActive
                                    ? 'scale-x-100 opacity-100'
                                    : 'scale-x-0 opacity-0',
                            )}
                        />
                    </a>
                );
            })}
        </nav>
    );
};

export default NavBar;