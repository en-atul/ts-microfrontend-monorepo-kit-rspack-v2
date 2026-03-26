import Button from '@repo/ui/Button';
import { useEcomStore } from '@repo/ecommerce-core';
import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import './index.css';

const UserProfileWidget: React.FC = () => {
	const user = useEcomStore((state) => state.user);
	const login = useEcomStore((state) => state.login);
	const logout = useEcomStore((state) => state.logout);
	const [name, setName] = useState('Atul Learner');
	const [email, setEmail] = useState('atul@example.dev');

	if (user) {
		return (
			<section className="mx-auto max-w-xl py-12 text-center">
				<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-slate-800 bg-slate-900 shadow-xl">
					<User className="h-10 w-10 text-slate-500" />
				</div>
				<h2 className="text-2xl font-bold italic uppercase tracking-tighter text-white">
					{user.name}
				</h2>
				<p className="mb-10 text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
					{user.email}
				</p>
				<div className="flex justify-center">
					<button
						type="button"
						onClick={logout}
						className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 shadow-lg transition-all hover:bg-red-500 hover:text-white active:scale-95"
					>
						<LogOut className="h-4 w-4" />
						Logout
					</button>
				</div>
			</section>
		);
	}

	return (
		<section className="mx-auto max-w-xl">
			<div className="rounded-2xl border border-slate-900 bg-slate-900/50 p-6">
				<h2 className="mb-1 text-xl font-bold text-white">Welcome back</h2>
				<p className="mb-6 text-sm text-slate-500">Sign in to continue to checkout.</p>

				<div className="grid gap-4">
					<div className="grid gap-2">
						<label
							htmlFor="name"
							className="text-xs font-bold uppercase tracking-wider text-slate-500"
						>
							Name
						</label>
						<input
							id="name"
							value={name}
							onChange={(event) => setName(event.target.value)}
							className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none transition-colors focus:border-indigo-500"
							placeholder="Your name"
						/>
					</div>
					<div className="grid gap-2">
						<label
							htmlFor="email"
							className="text-xs font-bold uppercase tracking-wider text-slate-500"
						>
							Email
						</label>
						<input
							id="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none transition-colors focus:border-indigo-500"
							placeholder="you@example.com"
						/>
					</div>

					<Button onClick={() => login({ name, email })}>Login</Button>
				</div>
			</div>
		</section>
	);
};

export default UserProfileWidget;
