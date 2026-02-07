"use client";

import { Github, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Header = () => {
	const currentPath = usePathname();
	const [isSheetOpen, setIsSheetOpen] = useState(false);

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

					{/* Right side - GitHub icon and mobile menu */}
					<div className="flex items-center space-x-4">
						{/* GitHub Icon */}
						<a
							href="https://github.com/hashpeace/animestats"
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-md hover:bg-gray-100 transition-colors"
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
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</div>
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
