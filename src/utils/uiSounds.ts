type UiSound =
    | 'hover'
    | 'click'
    | 'theme-light'
    | 'theme-dark';

let audioContext: AudioContext | null = null;
let audioUnlocked = false;

const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new AudioContext();
    }

    return audioContext;
};

export const unlockUiSounds = async () => {
    const context = getAudioContext();

    if (context.state === 'suspended') {
        try {
            await context.resume();
        } catch {
            return;
        }
    }

    if (context.state === 'running') {
        audioUnlocked = true;
    }
};

const createTone = (
    context: AudioContext,
    frequency: number,
    duration: number,
    volume: number,
    type: OscillatorType = 'sine',
    delay = 0,
) => {
    const oscillator =
        context.createOscillator();

    const gain =
        context.createGain();

    const start =
        context.currentTime + delay;

    const end =
        start + duration;

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        start,
    );

    gain.gain.setValueAtTime(
        0.0001,
        start,
    );

    gain.gain.exponentialRampToValueAtTime(
        volume,
        start + 0.01,
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        end,
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(start);
    oscillator.stop(end);
};

let suppressSectionSoundUntil = 0;

export const playNavigationClickSound = () => {
    /*
     * Clicking navigation will also cause the section
     * observer to detect a section change.
     *
     * Suppress that second sound for a short moment.
     */
    suppressSectionSoundUntil =
        performance.now() + 800;

    void playUiSound('click');
};

export const playSectionChangeSound = () => {
    if (
        performance.now() <
        suppressSectionSoundUntil
    ) {
        return;
    }

    void playUiSound('click');
};

export const playUiSound = async (
    sound: UiSound,
) => {
    const context = getAudioContext();

    if (context.state === 'suspended') {
        try {
            await context.resume();
        } catch {
            return;
        }
    }

    if (context.state !== 'running') {
        return;
    }

    audioUnlocked = true;

    switch (sound) {
        case 'hover':
            createTone(
                context,
                520,
                0.045,
                0.018,
            );
            break;

        case 'click':
            createTone(
                context,
                340,
                0.06,
                0.025,
            );

            createTone(
                context,
                470,
                0.05,
                0.012,
                'sine',
                0.025,
            );
            break;

        case 'theme-light':
            createTone(
                context,
                420,
                0.12,
                0.035,
            );

            createTone(
                context,
                620,
                0.16,
                0.025,
                'sine',
                0.06,
            );
            break;

        case 'theme-dark':
            createTone(
                context,
                520,
                0.12,
                0.03,
            );

            createTone(
                context,
                320,
                0.18,
                0.035,
                'sine',
                0.05,
            );
            break;
    }
};