import {
    Volume2Icon,
    VolumeXIcon,
} from 'lucide-react';

import { useSound } from '../hooks/useSound';

const ToggleSound = () => {
    const {
        soundEnabled,
        toggleSound,
    } = useSound();

    return (
        <button
            data-sound-hover
            type="button"
            onClick={toggleSound}
            aria-label={
                soundEnabled
                    ? 'Disable sounds'
                    : 'Enable sounds'
            }
            aria-pressed={soundEnabled}
            className="
        flex size-8
        cursor-pointer
        items-center justify-center
        rounded-full
        text-(--muted)
        transition-[color,transform]
        duration-200

        hover:scale-105
        hover:text-(--accent)

        active:scale-90
      "
        >
            {soundEnabled ? (
                <Volume2Icon
                    size={16}
                    strokeWidth={1.7}
                />
            ) : (
                <VolumeXIcon
                    size={16}
                    strokeWidth={1.7}
                />
            )}
        </button>
    );
};

export default ToggleSound;