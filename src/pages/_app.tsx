import "@/styles/globals.css"
import {AppProps} from 'next/app';
import React from 'react';
import Head from 'next/head';

const RusticTodoApp: React.FC<AppProps> = ({Component, pageProps}) => {
	return (
		<>
			<Head>
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
				<link rel="icon" type="image/x-icon" href="/favicon.ico"/>
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
				<link rel="manifest" href="/site.webmanifest"/>
				<title>todoAId</title>
				<meta charSet="utf-8"/>
				<meta name="viewport" content="initial-scale=1.0, width=device-width"/>
				<meta name="description" content="AI Powered Task Manager – from Rustic IT"/>
				<meta name="author" content="Saulo Vargas<saulo@rusticit.com>"/>
			</Head>
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
			<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
			        data-cf-beacon='{"token": "9bb9ced34458459dab8e5c4d6fe97084"}'></script>
		</>

	)
}

export default RusticTodoApp