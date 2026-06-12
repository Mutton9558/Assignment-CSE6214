interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    type: string;
    placeholder: string;
}

export default function Input({ label, type, placeholder, id,  ...props }: InputProps) {
    const safeId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={safeId} className="text-sm font-bold text-black">{label}</label>
            <input
                id={safeId}
                type={type}
                placeholder={placeholder}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                {...props}
            />
        </div>
    )
}