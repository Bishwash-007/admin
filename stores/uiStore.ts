import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
	message: string;
	type: ToastType;
	id: number;
}

interface UiState {
	isLoading: boolean;
	toast: Toast | null;
	sidebarOpen: boolean;

	setLoading: (loading: boolean) => void;
	showToast: (message: string, type?: ToastType) => void;
	clearToast: () => void;
	toggleSidebar: () => void;
	setSidebarOpen: (open: boolean) => void;
}

let _toastId = 0;

export const useUiStore = create<UiState>((set) => ({
	isLoading: false,
	toast: null,
	sidebarOpen: true,

	setLoading: (isLoading) => set({ isLoading }),

	showToast: (message, type = 'info') => {
		_toastId += 1;
		set({ toast: { message, type, id: _toastId } });
	},

	clearToast: () => set({ toast: null }),

	toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

	setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
