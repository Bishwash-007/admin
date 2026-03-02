import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, ...props }) => {
	return (
		<div className="relative bg-black p-0.5 transition-all duration-300 hover:p-0">
			<input
				name={name}
				{...props}
				className="block bg-white text-black font-bold py-4 px-8 transition-transform duration-300 transform -translate-x-1.5 -translate-y-1.5 border-2 border-black focus:outline-none"
			/>
		</div>
	);
};

export default InputField;
