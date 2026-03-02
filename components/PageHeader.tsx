import React from 'react';

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	action?: React.ReactNode;
}

const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => {
	return (
		<div className="flex items-end justify-between border-b-2 border-black pb-5 mb-8">
			<div>
				<h1 className="text-3xl font-black leading-none tracking-tight">
					{title}
				</h1>
				{subtitle && (
					<p className="text-sm text-gray-500 font-medium mt-1">{subtitle}</p>
				)}
			</div>
			{action && <div className="shrink-0">{action}</div>}
		</div>
	);
};

export default PageHeader;
