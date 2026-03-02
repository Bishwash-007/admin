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
	Users2,
	Settings2,
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
	{ href: '/users', label: 'Users', icon: Users2 },
	{ href: '/reports', label: 'Reports', icon: BarChart2 },
	{ href: '/settings', label: 'Settings', icon: Settings2 },
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
		<nav className="flex flex-col w-60 min-h-screen bg-black text-white shrink-0 px-4">
			{/* Brand */}
			<div className="flex flex-col items-center gap-2 px-6 py-5 border-b-2 border-white/60">
				<Clapperboard size={22} strokeWidth={2.5} />
				<span className="text-3xl font-black tracking-tight">CinemaGhar</span>
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
											? 'bg-white text-black border-white'
											: 'bg-black text-white border-transparent hover:border-white/60 hover:bg-white/10'
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
			<div className="border-t-2 border-white/20 p-4 flex flex-col gap-3">
				{user && (
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-full bg-white shrink-0 flex items-center justify-center text-black text-sm font-black">
							{user.name.charAt(0).toUpperCase()}
							{user.name.split(' ').length > 1
								? user.name.split(' ')[1].charAt(0).toUpperCase()
								: ''}
						</div>
						<div>
							<p className="text-sm font-bold truncate">{user.name}</p>
							<p className="text-xs text-white/50 truncate">{user.email}</p>
						</div>
					</div>
				)}
				<Button
					variant="dark"
					title="Log Out"
					onClick={handleLogout}
					icon={<LogOut size={17} strokeWidth={2.5} />}
				/>
			</div>
		</nav>
	);
};

export default Navbar;
