import React from 'react';

interface StatsCardProps {
	title: string;
	value: string | number;
	icon?: React.ReactNode;
	trend?: number; // positive = up, negative = down
	trendLabel?: string;
	accentColor?: string; // tailwind bg class e.g. 'bg-yellow-300'
}

const StatsCard: React.FC<StatsCardProps> = ({
	title,
	value,
	icon,
	trend,
	trendLabel,
	accentColor = 'bg-yellow-300',
}) => {
	const isPositive = trend !== undefined && trend >= 0;

	return (
		<div className="border-2 border-black shadow-[8px_8px_0_0_#000] bg-white p-5 flex flex-col gap-3">
			{/* Header */}
			<div className="flex items-center justify-between">
				<span className="text-xs font-bold uppercase tracking-widest text-gray-500">
					{title}
				</span>
				{icon && (
					<div
						className={`${accentColor} border-2 border-black p-1.5 shadow-[2px_2px_0_0_#000]`}
					>
						{icon}
					</div>
				)}
			</div>

			{/* Value */}
			<p className="text-3xl font-black leading-none">{value}</p>

			{/* Trend */}
			{trend !== undefined && (
				<div className="flex items-center gap-2">
					<span
						className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold border-2 border-black ${
							isPositive ? 'bg-green-300' : 'bg-red-300'
						}`}
					>
						{isPositive ? '▲' : '▼'} {Math.abs(trend)}%
					</span>
					{trendLabel && (
						<span className="text-xs font-bold text-gray-500">
							{trendLabel}
						</span>
					)}
				</div>
			)}
		</div>
	);
};

export default StatsCard;
