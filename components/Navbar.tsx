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
	Ticket,
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
	{ href: '/discounts', label: 'Discounts', icon: Ticket },
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
		<nav className="flex flex-col w-60 h-screen shrink-0 bg-white border-r-2 border-black">
			{/* Brand */}
			<div className="flex items-center gap-3 px-5 py-4 border-b-2 border-black bg-black text-white">
				<div className="bg-green-300 border-2 border-white p-1 shadow-[2px_2px_0_0_rgba(255,255,255,0.5)]">
					<Clapperboard size={18} strokeWidth={2.5} className="text-black" />
				</div>
				<span className="text-xl font-black tracking-tight">CinemaGhar</span>
			</div>

			{/* Links */}
			<ul className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
				{NAV_LINKS.map(({ href, label, icon: Icon }) => {
					const active = pathname === href || pathname.startsWith(href + '/');
					return (
						<li key={href}>
							<Link
								href={href}
								className={`flex items-center gap-3 px-4 py-2.5 font-bold text-sm border-2 transition-all duration-150 ${
									active
										? 'bg-black text-white border-black shadow-[3px_3px_0_0_#000] translate-x-0 translate-y-0'
										: 'bg-white text-black border-transparent hover:border-black hover:shadow-[3px_3px_0_0_#000]'
								}`}
							>
								<Icon size={16} strokeWidth={2.5} />
								{label}
							</Link>
						</li>
					);
				})}
			</ul>

			{/* User + Logout */}
			{/* <div className="border-t-2 border-black p-4 flex flex-col gap-3">
				{user && (
					<div className="flex items-center gap-3 p-2 border-2 border-black shadow-[3px_3px_0_0_#000] bg-white">
						<div className="w-8 h-8 shrink-0 flex items-center justify-center bg-yellow-300 border-2 border-black text-black text-xs font-black">
							{user.name.charAt(0).toUpperCase()}
							{user.name.split(' ').length > 1
								? user.name.split(' ')[1].charAt(0).toUpperCase()
								: ''}
						</div>
						<div className="min-w-0">
							<p className="text-sm font-black truncate">{user.name}</p>
							<p className="text-xs font-bold text-gray-500 truncate">
								{user.email}
							</p>
						</div>
					</div>
				)}
				<Button
					variant="dark"
					title="Log Out"
					onClick={handleLogout}
					icon={<LogOut size={16} strokeWidth={2.5} />}
				/>
			</div> */}
		</nav>
	);
};

export default Navbar;
