interface ButtonProps {
    children: JSX.Element | string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export const baseButtonStyles = 'bg-purple-500 text-gray-900 hover:bg-purple-600 transition-colors duration-200';

export default function Button({ children, onClick, className, disabled = false }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`${baseButtonStyles} rounded-xl py-2 px-8 ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
