import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, ...props }) => {
	return (
		<input
			name={name}
			{...props}
			className="w-full px-6 py-2.5 font-bold text-sm border-2 border-black bg-white shadow-[3px_3px_0_0_#000] focus:shadow-none focus:translate-x-[3px] focus:translate-y-[3px] transition-all duration-150 outline-none placeholder:font-bold placeholder:text-gray-400"
		/>
	);
};

export default InputField;
