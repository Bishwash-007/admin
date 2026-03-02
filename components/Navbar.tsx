'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
	LayoutDashboard,
	Film,
	Building2,
	BarChart2,
	LogOut,
	Clapperboard,
} from 'lucide-react';
import { useAuthStore, useUiStore } from '@/stores';
import Button from './ui/Button';

interface NavLink {
	href: string;
	label: string;
	icon: React.ComponentType<{ size: number; strokeWidth?: number }>;
}

const NAV_LINKS: NavLink[] = [
	{ href: '/home', label: 'Dashboard', icon: LayoutDashboard },
	{ href: '/movies', label: 'Movies', icon: Film },
	{ href: '/theatres', label: 'Theatres', icon: Building2 },
	{ href: '/bookings', label: 'Bookings', icon: Clapperboard },
	{ href: '/reports', label: 'Reports', icon: BarChart2 },
];

const Navbar = () => {
	const pathname = usePathname();
	const router = useRouter();
	const { user, logout } = useAuthStore();
	const { showToast } = useUiStore();

	const handleLogout = async () => {
		await logout();
		showToast('Logged out successfully', 'success');
		router.push('/login');
	};

	return (
		<nav className="flex flex-col w-60 min-h-screen border-r-2 border-black shrink-0">
			{/* Brand */}
			<div className="flex items-center gap-2 px-6 py-5 border-b-2 border-black">
				<Clapperboard size={22} strokeWidth={2.5} />
				<span className="text-lg font-black tracking-tight">Cinema Admin</span>
			</div>

			{/* Links */}
			<ul className="flex flex-col gap-1 p-3 flex-1">
				{NAV_LINKS.map(({ href, label, icon: Icon }) => {
					const active = pathname === href || pathname.startsWith(href + '/');
					return (
						<li key={href}>
							<Link
								href={href}
								className={`flex items-center gap-3 px-4 py-3 font-bold text-sm border-2 transition-all duration-150
									${
										active
											? 'bg-black text-white border-black'
											: 'bg-white text-black border-transparent hover:border-black hover:shadow-[2px_2px_0_0_#000]'
									}`}
							>
								<Icon size={17} strokeWidth={2.5} />
								{label}
							</Link>
						</li>
					);
				})}
			</ul>

			{/* User + Logout */}
			<div className="border-t-2 border-black p-4 flex flex-col gap-3">
				{user && (
					<div className="px-2">
						<p className="text-xs font-black uppercase tracking-widest text-gray-500">
							Signed in as
						</p>
						<p className="text-sm font-bold truncate">{user.name}</p>
						<p className="text-xs text-gray-500 truncate">{user.email}</p>
					</div>
				)}
				<Button
					title="Log Out"
					onClick={handleLogout}
					icon={<LogOut size={17} strokeWidth={2.5} />}
				/>
			</div>
		</nav>
	);
};

export default Navbar;
