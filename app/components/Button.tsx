import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    buttonText?: ReactNode;
}

export default function Button({ buttonText, className, ...props }: ButtonProps) {
    return (
        <button 
            className={`flex items-center justify-center bg-accent z-50 backdrop-blur-md text-black font-bold p-4 rounded-full hover:bg-blue-600 hover:text-white cursor-pointer transition-colors duration-300 ${className}`}
            {...props}
        >
            {buttonText}
        </button>
    );
}