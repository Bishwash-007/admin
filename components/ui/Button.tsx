import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
	icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
	title,
	icon,
	onClick,
	type = 'button',
	disabled,
	...rest
}) => {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className="relative bg-black p-0.5 transition-all duration-300 hover:p-0 disabled:opacity-50 disabled:cursor-not-allowed"
			{...rest}
		>
			<span className="block bg-white text-black font-bold py-4 px-8 transition-transform duration-300 transform -translate-x-1.5 -translate-y-1.5 hover:translate-x-0 hover:translate-y-0 border-2 border-black">
				{icon && <span className="mr-2">{icon}</span>}
				{title}
			</span>
		</button>
	);
};

export default Button;
