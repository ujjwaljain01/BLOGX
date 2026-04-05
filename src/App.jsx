import { useEffect, useState } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import Particles from './components/Particles';
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice';
import { Header, Footer } from './components';
import { Outlet } from 'react-router-dom';

function App() {
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		authService
			.getCurrentUser()
			.then((userData) => {
				if (userData) {
					dispatch(login(userData));
				} else {
					dispatch(logout());
				}
			})
			.finally(() => setLoading(false));
	}, [dispatch]);

	if (loading) return <div>Loading...</div>;

	return (
		<div className="min-h-screen relative">
			{/* 🔥 Background */}
			<Particles
				particleCount={200}
				particleSpread={10}
				speed={0.1}
				particleColors={['#2563eb', '#2563eb', '#0256eb']}
				moveParticlesOnHover
				particleHoverFactor={1}
				alphaParticles={false}
				particleBaseSize={100}
				sizeRandomness={1}
				cameraDistance={20}
				disableRotation={false}
				className="-z-10"
			/>
			{/* 🔥 Content */}
			<Header />
			<main className="relative z-10">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}

export default App;
