"use client";

import { Github, Menu, Settings } from "lucide-react";
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
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useContainerContext } from "@/contexts/ContainerContext";
import { useFetchingMethodContext } from "@/contexts/FetchingMethodContext";
import { cn } from "@/lib/utils";

const Header = () => {
	const currentPath = usePathname();
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const { useContainer, setUseContainer } = useContainerContext();
	const { fetchingMethod, setFetchingMethod } = useFetchingMethodContext();

	const navigationItems = [
		{ href: "/episodes", label: "Episode Ratings" },
		{ href: "/weekly-rankings", label: "Weekly Rankings" },
		// { href: "/onepiece", label: "One Piece" },
		{ href: "/about", label: "About" },
	];

	const handleNavLinkClick = () => setIsSheetOpen(false);

	return (
		<header className="bg-white/90 w-full shadow-md">
			<div className="container mx-auto max-md:px-4 py-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-6">
						{/* Logo */}
						<div className="flex items-center">
							<Link href="/" className="flex items-center space-x-2">
								<Image
									src="/logo.png"
									alt="Anime stats"
									width={32}
									height={32}
								/>
								<span className="text-xl font-bold text-gray-900">
									Anime stats
								</span>
							</Link>
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:block">
							<NavigationMenu>
								<NavigationMenuList>
									{navigationItems.map((item) => (
										<NavigationMenuItem key={item.href}>
											<Link href={item.href} legacyBehavior passHref>
												<NavigationMenuLink
													className={cn(
														navigationMenuTriggerStyle(),
														currentPath === item.href &&
														"bg-accent text-accent-foreground",
													)}
												>
													{item.label}
												</NavigationMenuLink>
											</Link>
										</NavigationMenuItem>
									))}
								</NavigationMenuList>
							</NavigationMenu>
						</div>
					</div>

					{/* Right side - Settings, GitHub icon and mobile menu */}
					<div className="flex items-center space-x-4">
						{/* Settings Icon */}
						<button
							onClick={() => setIsSettingsOpen(true)}
							className="p-2 rounded-md hover:bg-gray-100 transition-colors max-md:hidden"
							aria-label="Settings"
						>
							<Settings className="h-5 w-5 text-gray-600" />
						</button>

						{/* GitHub Icon */}
						<a
							href="https://github.com/hashpeace/animestats"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-md hover:bg-gray-100 transition-colors max-md:hidden"
							aria-label="GitHub"
						>
							<Github className="h-5 w-5 text-gray-600" />
						</a>

						{/* Mobile Menu */}
						<div className="md:hidden">
							<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
								<SheetTrigger asChild>
									<button
										className="p-2 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
										aria-label="Toggle menu"
									>
										<Menu className="h-5 w-5 text-gray-600" />
									</button>
								</SheetTrigger>
								<SheetContent side="left" className="w-80 px-2">
									<div className="mt-6">
										{navigationItems.map((item) => (
											<Link
												key={item.href}
												href={item.href}
												onClick={handleNavLinkClick}
												className={cn(
													"block px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 rounded-md",
													currentPath === item.href
														? "bg-accent text-accent-foreground"
														: "text-gray-700",
												)}
											>
												{item.label}
											</Link>
										))}
										{/* Settings Icon */}
										<button
											onClick={() => setIsSettingsOpen(true)}
											className="px-4 py-3 rounded-md hover:bg-gray-100 transition-colors"
											aria-label="Settings"
										>
											<Settings className="h-5 w-5 text-gray-600" />
										</button>

										{/* GitHub Icon */}
										<a
											href="https://github.com/hashpeace/animestats"
											target="_blank"
											rel="noopener noreferrer"
											className="px-4 block py-3 rounded-md hover:bg-gray-100 transition-colors"
											aria-label="GitHub"
										>
											<Github className="h-5 w-5 text-gray-600" />
										</a>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</div>

			{/* Settings Modal */}
			<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Settings</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4 mt-4">
						<div className="flex flex-col">
							<Label htmlFor="container-select">Page width</Label>
							<Select
								value={useContainer ? "true" : "false"}
								onValueChange={(value) => {
									setUseContainer(value === "true");
									posthog.capture("option_panel_event", {
										option: "use_container",
										value: value,
									});
								}}
							>
								<SelectTrigger className="w-full focus:ring-offset-1 focus:ring-2 bg-white">
									<SelectValue placeholder="Select container option" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="true">Normal</SelectItem>
									<SelectItem value="false">Full</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col">
							<Label htmlFor="fetching-method-select">Fetching method</Label>
							<Select
								value={fetchingMethod}
								onValueChange={(value) => {
									setFetchingMethod(value as "jikanOnly" | "cheerioParser");
									posthog.capture("option_panel_event", {
										option: "fetching_method",
										value: value,
									});
								}}
							>
								<SelectTrigger className="w-full focus:ring-offset-1 focus:ring-2 bg-white">
									<SelectValue placeholder="Select fetcher mode" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="jikanOnly">Simple</SelectItem>
									<SelectItem value="cheerioParser">Detailed</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</header>
	);
};

const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a"> & {
		title: string;
		href: string;
		currentPath: string;
	}
>(({ className, title, children, href, currentPath, ...props }, ref) => {
	const isActive = currentPath === href;

	return (
		<NavigationMenuLink asChild>
			<Link
				ref={ref}
				href={href}
				className={cn(
					"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
					isActive && "bg-accent text-accent-foreground",
					className,
				)}
				{...props}
			>
				<div className="text-sm font-semibold leading-none">{title}</div>
				<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
					{children}
				</p>
			</Link>
		</NavigationMenuLink>
	);
});
ListItem.displayName = "ListItem";

export default Header;
