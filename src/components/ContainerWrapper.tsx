"use client"

import { useContainerContext } from "@/contexts/ContainerContext"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface ContainerWrapperProps {
	children: ReactNode
}

export default function ContainerWrapper({ children }: ContainerWrapperProps) {
	const { useContainer } = useContainerContext()
	const pathname = usePathname()
	const authorizedPathnames = ["/episodes", "/onepiece"]
	const isAuthorizedPathname = authorizedPathnames.includes(pathname)

	return (
		<div className={`${!isAuthorizedPathname || useContainer ? "container" : "w-full"} mx-auto`}>
			{/* <div className="md:bg-white/90 md:backdrop-blur-sm md:shadow-xl md:rounded-xl overflow-hidden"> */}
			<div className="md:bg-white/90 md:backdrop-blur-sm md:shadow-xl md:rounded-xl">
				<div className="px-2 sm:px-6 py-8 md:px-8 lg:px-12 min-h-[calc(100vh-105px)]">
					{children}
				</div>
			</div>
		</div>
	)
} 