import "@/styles/globals.css"
import {AppProps} from 'next/app';
import React from 'react';

const RusticTodoApp: React.FC<AppProps> = ({Component, pageProps}) => {
	return (
		<div className="
		min-h-screen
		bg-gray-100
		text-gray-900
		dark:bg-gray-900
		dark:text-gray-100
		md:m-auto
		sm:px-8
		max-w-screen-sm
		select-none
		transition-all">
			<Component {...pageProps} />
		</div>
	)
}

export default RusticTodoApp