'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUiStore } from '@/stores';

const ICONS = {
	success: CheckCircle,
	error: XCircle,
	warning: AlertTriangle,
	info: Info,
};

const DURATION = 3500;

const Toaster = () => {
	const { toast, clearToast } = useUiStore();

	useEffect(() => {
		if (!toast) return;
		const timer = setTimeout(clearToast, DURATION);
		return () => clearTimeout(timer);
	}, [toast, clearToast]);

	if (!toast) return null;

	const Icon = ICONS[toast.type];

	return (
		<div
			role="alert"
			aria-live="assertive"
			className="fixed top-6 right-6 z-9999 flex items-center gap-3 bg-white border-2 border-black px-5 py-4 shadow-[4px_4px_0_0_#000] animate-slide-in min-w-65 max-w-sm"
		>
			{/* type icon */}
			<span className="flex items-center justify-center w-7 h-7 border-2 border-black shrink-0 bg-black text-white">
				<Icon size={15} strokeWidth={2.5} />
			</span>

			{/* message */}
			<p className="flex-1 text-sm font-bold leading-snug">{toast.message}</p>

			{/* close */}
			<button
				onClick={clearToast}
				className="ml-2 hover:opacity-60 transition-opacity"
				aria-label="Dismiss"
			>
				<X size={16} strokeWidth={2.5} />
			</button>
		</div>
	);
};

export default Toaster;
