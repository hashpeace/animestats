"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useContainerContext } from "@/contexts/ContainerContext";

interface ContainerWrapperProps {
	children: ReactNode;
}

export default function ContainerWrapper({ children }: ContainerWrapperProps) {
	const { useContainer } = useContainerContext();
	const pathname = usePathname();
	const authorizedPathnames = ["/episodes", "/onepiece"];
	const isAuthorizedPathname = authorizedPathnames.includes(pathname);

	return (
		<main className={`${!isAuthorizedPathname || useContainer ? "container xl:px-0" : "w-full"} mx-auto px-3 md:px-4 pt-4 pb-16`}>
			{/* <main className={`${useContainer ? "container xl:px-0" : "w-full"} mx-auto px-3 md:px-4 pt-4 pb-16`}> */}
			{children}
		</main>
	);
}
