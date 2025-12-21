import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../../appwrite/auth';
import { logout } from '../../store/authSlice';

function LogoutBtn() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const logoutHandler = async () => {
		try {
			await authService.logout();
			dispatch(logout());
			navigate('/login');
		} catch (error) {
			console.error('Logout failed', error);
		}
	};

	return (
		<button
			onClick={logoutHandler}
			className="
		inline-flex items-center gap-2
		rounded-full border border-indigo-400/30
		bg-transparent px-6 py-2 text-sm font-medium
		text-indigo-200
		transition-all duration-200
		hover:border-red-400/40
		hover:bg-red-500/10
		hover:text-red-300
		focus:outline-none focus:ring-2 focus:ring-red-400/40
	"
		>
			Logout
		</button>
	);
}

export default LogoutBtn;
