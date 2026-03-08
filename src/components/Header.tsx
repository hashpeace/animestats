"use client";

import {
	GalleryHorizontal,
	Menu,
	Moon,
	Settings,
	Sun,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import React, { useState } from "react";
import { AUTHORIZED_PATHNAMES } from "@/components/ContainerWrapper";
import { useContainerContext } from "@/contexts/ContainerContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useTitleLanguage } from "@/contexts/TitleLanguageContext";
import type { TitleLanguage } from "@/lib/displayTitle";
import { cn } from "@/lib/utils";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const Header = () => {
	const currentPath = usePathname();
	const [isMobilePopoverOpen, setIsMobilePopoverOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const { useContainer, setUseContainer } = useContainerContext();
	const { theme, setTheme } = useTheme();
	const { titleLanguage, setTitleLanguage } = useTitleLanguage();

	const navigationItems = [
		{ href: "/episodes", label: "Episode Ratings" },
		{ href: "/weekly-rankings", label: "Weekly Rankings" },
		{ href: "/about", label: "About" },
	];

	const isAuthorizedPathname = AUTHORIZED_PATHNAMES.includes(currentPath);

	return (
		<header className="sticky top-0 z-50 w-full bg-background border-b border-gray-200 dark:border-gray-800">
			<div className="container mx-auto px-3 md:px-4 xl:px-0">
				<div className="flex items-center justify-between h-14">
					{/* Left: Logo and navigation */}
					<div className="flex items-center gap-16">
						<Link href="/" className="flex items-center gap-2.5 ">
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

						<nav className="hidden md:flex items-center gap-6">
							{navigationItems.map((item) => {
								const isActive = currentPath === item.href;
								const handleClick = (e: React.MouseEvent) => {
									if (item.href === "/episodes") {
										e.preventDefault();
										window.location.href = "/episodes";
									}
								};
								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={handleClick}
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
						{/* Theme toggle */}
						<button
							onClick={() => {
								const newTheme = theme === "light" ? "dark" : "light";
								setTheme(newTheme);
								posthog.capture("option_panel_event", {
									option: "theme",
									value: newTheme,
								});
							}}
							className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
							aria-label="Toggle theme"
						>
							{theme === "light" ? (
								<Moon className="w-[18px] h-[18px]" />
							) : (
								<Sun className="w-[18px] h-[18px]" />
							)}
						</button>

						<div className="hidden md:block w-px h-4 bg-gray-300 dark:bg-gray-700 mx-0.5" />

						{isAuthorizedPathname && (
							<>
								{/* Page width toggle */}
								<button
									onClick={() => {
										setUseContainer(!useContainer);
										posthog.capture("option_panel_event", {
											option: "use_container",
											value: useContainer ? "false" : "true",
										});
									}}
									className="max-xl:hidden flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
									aria-label="Toggle page width"
								>
									<GalleryHorizontal className="size-4" />
								</button>

								<div className="max-xl:hidden block w-px h-4 bg-gray-300 dark:bg-gray-700 mx-0.5" />
							</>
						)}

						<Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
							<DialogTrigger asChild>
								<button
									type="button"
									className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
									aria-label="Display settings"
								>
									<Settings className="size-4 text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
								</button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle className="flex items-center gap-2">
										<span className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary">
											<span className="text-sm font-bold">A</span>
											<span className="text-sm font-bold ml-0.5">文</span>
										</span>
										Display Language
									</DialogTitle>
								</DialogHeader>
								<div className="space-y-4 pt-2">
									<div className="space-y-2">
										<h3 className="text-sm font-semibold text-foreground">
											Title Language
										</h3>
										<p className="text-xs text-muted-foreground">
											Choose the language format for titles.
										</p>
										<Select
											value={titleLanguage}
											onValueChange={(value: TitleLanguage) => {
												setTitleLanguage(value);
												posthog.capture("option_panel_event", {
													option: "title_language",
													value,
												});
											}}
										>
											<SelectTrigger className="w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="english">English (Attack on Titan)</SelectItem>
												<SelectItem value="romanji">Romanji (Shingeki no Kyojin)</SelectItem>
												<SelectItem value="native">Native (進撃の巨人)</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</DialogContent>
						</Dialog>

						{/* Mobile navigation popover */}
						<Popover open={isMobilePopoverOpen} onOpenChange={setIsMobilePopoverOpen}>
							<PopoverTrigger asChild>
								<button
									className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-colors"
									aria-label="Toggle menu"
								>
									<Menu className="w-5 h-5" />
								</button>
							</PopoverTrigger>
							<PopoverContent
								side="bottom"
								align="end"
								sideOffset={8}
								className="md:hidden w-56 p-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-lg"
							>
								<div className="space-y-1">
									{navigationItems.map((item) => {
										const isActive = currentPath === item.href;
										const handleClick = (e: React.MouseEvent) => {
											setIsMobilePopoverOpen(false);
											if (item.href === "/episodes") {
												e.preventDefault();
												window.location.href = "/episodes";
											}
										};
										return (
											<Link
												key={item.href}
												href={item.href}
												onClick={handleClick}
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
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
