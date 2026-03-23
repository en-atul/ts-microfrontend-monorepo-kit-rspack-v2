import Button from '@repo/ui/Button';
import { useEcomStore } from '@repo/ecommerce-core';
import React, { useState } from 'react';

const UserProfileWidget: React.FC = () => {
	const user = useEcomStore((state) => state.user);
	const login = useEcomStore((state) => state.login);
	const logout = useEcomStore((state) => state.logout);
	const [name, setName] = useState('Atul Learner');
	const [email, setEmail] = useState('atul@example.dev');

	if (user) {
		return (
			<section style={{ border: '1px solid #333', borderRadius: 12, padding: 16 }}>
				<h3>Welcome, {user.name}</h3>
				<p>{user.email}</p>
				<Button onClick={logout} outline>
					Logout
				</Button>
			</section>
		);
	}

	return (
		<section style={{ border: '1px solid #333', borderRadius: 12, padding: 16 }}>
			<div style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
				<label htmlFor="name">Name</label>
				<input id="name" value={name} onChange={(event) => setName(event.target.value)} />
				<label htmlFor="email">Email</label>
				<input id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
				<Button onClick={() => login({ name, email })}>Login</Button>
			</div>
		</section>
	);
};

export default UserProfileWidget;
