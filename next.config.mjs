/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.myanimelist.net",
				port: "",
				pathname: "/images/**",
			},
			{
				protocol: "https",
				hostname: "m.media-amazon.com",
				port: "",
				pathname: "/images/**",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
				port: "",
				pathname: "/**",
			},
		],
	},
	reactStrictMode: false,
};

export default nextConfig;
