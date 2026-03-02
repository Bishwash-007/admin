import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
	icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	title,
	icon,
	type = 'button',
	...rest
}) => {
	return (
		<button
			type={type}
			className="flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-sm border-2 border-black bg-white shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-[3px_3px_0_0_#000] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
			{...rest}
		>
			{icon}
			{title}
		</button>
	);
};

export default Button;
