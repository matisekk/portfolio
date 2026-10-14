import classNames from 'classnames';

type DividerType = 'vertical' | 'horizontal';

interface DividerProps {
    orientation: DividerType;
    className?: string;
}

const Divider = ({ orientation, className }: DividerProps) => {
    return (
        <div
            className={classNames(
                'bg-(--border)',
                {
                    'h-full w-px': orientation === 'vertical',
                    'h-px': orientation === 'horizontal',
                },
                className,
            )}
        />
    );
};

export default Divider;