import { useEffect, useState } from 'react';
import './App.css';
import { useDispatch } from 'react-redux';
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice';
import { Header, Footer } from './components';
import { Outlet } from 'react-router-dom';

function App() {
	const [loading, setLoading] = useState();
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
	}, []);

	console.log(import.meta.env.VITE_APPWRITE_URL);
	return !loading ? (
		<div className="min-h-screen flex flex-wrap content-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900">
			<div className="w-full block">
				<Header />
				<main>
					<Outlet />
				</main>
				<Footer />
			</div>
		</div>
	) : null;
}

export default App;
