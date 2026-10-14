import { MenuIcon } from 'lucide-react';

import NavBar from './NavBar';
import ToggleTheme from './ToggleTheme';
import Divider from './Divider';

const Header = () => {
    return (
        <header className="fixed top-0 right-0 left-0 z-50 md:left-[40%]">
            <div className="relative flex h-16 w-full items-center px-6 lg:px-8">
                <a
                    href="#home"
                    className="text-lg font-semibold tracking-tight text-(--foreground)"
                >
                    MP<span className="text-(--accent)">.</span>
                </a>

                <NavBar />

                <div className="ml-auto flex items-center gap-4">
                    <button
                        type="button"
                        className="flex items-center justify-center sm:hidden"
                        aria-label="Open menu"
                    >
                        <MenuIcon size={20} />
                    </button>

                    <ToggleTheme />
                </div>
            </div>
            <Divider orientation="horizontal" className="absolute right-5 bottom-2 left-5 z-0" />
        </header>
    );
};

export default Header;