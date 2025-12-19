import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Re-usable Button component
 * Props:
 * - children
 * - type, variant, bgColor, textColor, className
 * - to (string) -> renders Link when provided
 */
export default function Button({
	children,
	type = 'button',
	variant = 'solid',
	bgColor,
	textColor,
	className = '',
	to,
	onClick,
	...rest
}) {
	const bg = bgColor || 'bg-indigo-600';
	const text = textColor || 'text-white';

	let variantStyles = '';
	switch (variant) {
		case 'solid':
			variantStyles = `${bg} ${text} px-4 py-2 rounded-md hover:opacity-95`;
			break;
		case 'outline':
			variantStyles = `border border-current bg-transparent px-4 py-2 rounded-md ${text} hover:bg-white/5`;
			break;
		case 'text':
			variantStyles = `bg-transparent px-2 py-1 ${text}`;
			break;
		case 'link':
			variantStyles = `bg-transparent px-1 py-1 ${text} underline-offset-2 hover:opacity-90`;
			break;
		case 'unstyled':
			variantStyles = '';
			break;
		default:
			variantStyles = `${bg} ${text} px-4 py-2 rounded-md`;
	}

	const Component = to ? Link : 'button';

	return (
		<Component
			to={to}
			type={to ? undefined : type}
			onClick={onClick}
			className={`inline-flex items-center gap-2 justify-center transition-all duration-150 ${variantStyles} ${className}`.trim()}
			{...rest}
		>
			{children}
		</Component>
	);
}
