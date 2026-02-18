"use client";

import { Github, Menu, Settings, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useContainerContext } from "@/contexts/ContainerContext";
import { useFetchingMethodContext } from "@/contexts/FetchingMethodContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const Header = () => {
	const currentPath = usePathname();
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const { useContainer, setUseContainer } = useContainerContext();
	const { fetchingMethod, setFetchingMethod } = useFetchingMethodContext();
	const { theme, setTheme } = useTheme();

	const navigationItems = [
		{ href: "/episodes", label: "Episode Ratings" },
		{ href: "/weekly-rankings", label: "Weekly Rankings" },
		{ href: "/about", label: "About" },
	];

	return (
		<>
			<header
				className="sticky top-0 z-50 w-full bg-background border-b border-gray-200 dark:border-gray-800"
			>
				<div className="container mx-auto px-3 md:px-4 xl:px-0">
					<div className="flex items-center justify-between h-14">
						<div className="flex items-center gap-16">
							{/* Left: Logo */}
							<Link
								href="/"
								className="flex items-center gap-2.5 "
							>
								<Image
									src="/logo.png"
									alt="Anime stats"
									width={28}
									height={28}
								/>
								<span className="text-[15px] font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
									Anime Stats
								</span>
							</Link>

							{/* Center: Desktop nav */}
							<nav className="hidden md:flex items-center gap-6">
								{navigationItems.map((item) => {
									const isActive = currentPath === item.href;
									return (
										<Link
											key={item.href}
											href={item.href}
											className={cn(
												"text-[13px] font-medium transition-colors duration-150",
												isActive
													? "text-gray-900 dark:text-gray-100"
													: "text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
											)}
										>
											{item.label}
										</Link>
									);
								})}
							</nav>
						</div>

						{/* Right: actions */}
						<div className="flex items-center gap-1">
							<button
								onClick={() => setIsSettingsOpen(true)}
								className="hidden md:flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
								aria-label="Settings"
							>
								<Settings className="w-[18px] h-[18px]" />
							</button>

							{/* Mobile toggle */}
							<button
								onClick={() => setIsMobileOpen(!isMobileOpen)}
								className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors"
								aria-label="Toggle menu"
							>
								{isMobileOpen ? (
									<X className="w-5 h-5" />
								) : (
									<Menu className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
				</div>

				{/* Mobile nav dropdown */}
				<div
					className={cn(
						"md:hidden overflow-hidden transition-all duration-300 ease-in-out",
						isMobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
					)}
				>
					<div className="px-4 pb-4 pt-1 space-y-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800">
						{navigationItems.map((item) => {
							const isActive = currentPath === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsMobileOpen(false)}
									className={cn(
										"block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
										isActive
											? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
											: "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200",
									)}
								>
									{item.label}
								</Link>
							);
						})}
						<div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
							<button
								onClick={() => {
									setIsSettingsOpen(true);
									setIsMobileOpen(false);
								}}
								className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
							>
								<Settings className="w-4 h-4" />
								Settings
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Settings Modal */}
			<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Settings</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-8 mt-4">
						<div className="flex flex-col gap-1">
							<Label>Theme</Label>
							<div className="flex items-center gap-3">
								<span className={cn("text-sm", theme === "light" ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400")}>Light</span>
								<Switch
									checked={theme === "dark"}
									onCheckedChange={(checked) => {
										const value = checked ? "dark" : "light";
										setTheme(value);
										posthog.capture("option_panel_event", {
											option: "theme",
											value: value,
										});
									}}
								/>
								<span className={cn("text-sm", theme === "dark" ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400")}>Dark</span>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<Label>Page width</Label>
							<div className="flex items-center gap-3">
								<span className={cn("text-sm", useContainer ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400")}>Normal</span>
								<Switch
									checked={!useContainer}
									onCheckedChange={(checked) => {
										setUseContainer(!checked);
										posthog.capture("option_panel_event", {
											option: "use_container",
											value: !checked ? "true" : "false",
										});
									}}
								/>
								<span className={cn("text-sm", !useContainer ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400")}>Full</span>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<Label>Fetching method</Label>
							<div className="flex items-center gap-3">
								<span className={cn("text-sm", fetchingMethod === "jikanOnly" ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400")}>Simple</span>
								<Switch
									checked={fetchingMethod === "cheerioParser"}
									onCheckedChange={(checked) => {
										const value = checked ? "cheerioParser" : "jikanOnly";
										setFetchingMethod(value);
										posthog.capture("option_panel_event", {
											option: "fetching_method",
											value: value,
										});
									}}
								/>
								<span className={cn("text-sm", fetchingMethod === "cheerioParser" ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400")}>Detailed</span>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default Header;
