/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.myanimelist.net',
				port: '',
				pathname: '/images/**',
			},
		],
	},
	reactStrictMode: false
};

export default nextConfig;
