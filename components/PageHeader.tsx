import React from 'react';

interface PageHeaderProps {
	title: string;
	subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
	return (
		<div className="text-2xl font-bold">
			{title}
			{subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
		</div>
	);
};

export default PageHeader;
