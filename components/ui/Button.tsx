import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	title: string;
	icon?: React.ReactNode;
	variant?: 'light' | 'dark';
}

const Button: React.FC<ButtonProps> = ({
	title,
	icon,
	type = 'button',
	variant = 'light',
	...rest
}) => {
	const base =
		'flex items-center justify-center gap-2 px-6 py-2.5 font-bold text-sm border-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed';

	const variants = {
		light:
			'bg-white text-black border-black shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:hover:shadow-[3px_3px_0_0_#000] disabled:hover:translate-x-0 disabled:hover:translate-y-0',
		dark: 'bg-black text-white border-white shadow-[3px_3px_0_0_rgba(255,255,255,0.4)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:hover:shadow-[3px_3px_0_0_rgba(255,255,255,0.4)] disabled:hover:translate-x-0 disabled:hover:translate-y-0',
	};

	return (
		<button type={type} className={`${base} ${variants[variant]}`} {...rest}>
			{icon}
			{title}
		</button>
	);
};

export default Button;
