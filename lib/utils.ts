export const formatDate = (iso: string): string =>
	new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(new Date(iso));

export const formatDateTime = (iso: string): string =>
	new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(new Date(iso));

export const formatDuration = (minutes: number): string => {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

export const toApiDate = (date: Date): string =>
	date.toISOString().split('T')[0];

export const daysAgo = (n: number): string => {
	const d = new Date();
	d.setDate(d.getDate() - n);
	return d.toISOString();
};

export const formatNPR = (amount: string | number): string =>
	new Intl.NumberFormat('en-NP', {
		style: 'currency',
		currency: 'NPR',
		minimumFractionDigits: 2,
	}).format(Number(amount));

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;

export const capitalise = (str: string): string =>
	str.charAt(0).toUpperCase() + str.slice(1);

export const bookingStatusMeta = (
	status: string,
): { label: string; colour: string } => {
	const map: Record<string, { label: string; colour: string }> = {
		pending: { label: 'Pending', colour: 'text-yellow-600 bg-yellow-50' },
		confirmed: { label: 'Confirmed', colour: 'text-green-600  bg-green-50' },
		cancelled: { label: 'Cancelled', colour: 'text-red-600    bg-red-50' },
		failed: { label: 'Failed', colour: 'text-gray-600   bg-gray-50' },
	};
	return (
		map[status] ?? {
			label: capitalise(status),
			colour: 'text-gray-600 bg-gray-50',
		}
	);
};

export const paymentStatusMeta = (
	status: string,
): { label: string; colour: string } => {
	const map: Record<string, { label: string; colour: string }> = {
		pending: { label: 'Pending', colour: 'text-yellow-600 bg-yellow-50' },
		completed: { label: 'Completed', colour: 'text-green-600  bg-green-50' },
		refunded: { label: 'Refunded', colour: 'text-blue-600   bg-blue-50' },
		failed: { label: 'Failed', colour: 'text-red-600    bg-red-50' },
	};
	return (
		map[status] ?? {
			label: capitalise(status),
			colour: 'text-gray-600 bg-gray-50',
		}
	);
};
