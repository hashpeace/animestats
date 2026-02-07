"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ContainerContextType {
	useContainer: boolean
	setUseContainer: (value: boolean) => void
}

const ContainerContext = createContext<ContainerContextType | undefined>(undefined)

export const useContainerContext = () => {
	const context = useContext(ContainerContext)
	if (context === undefined) {
		throw new Error('useContainer must be used within a ContainerProvider')
	}
	return context
}

interface ContainerProviderProps {
	children: ReactNode
}

export const ContainerProvider: React.FC<ContainerProviderProps> = ({ children }) => {
	const [useContainer, setUseContainerState] = useState(true)

	// Initialize from localStorage on client side
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('useContainer')
			if (saved !== null) {
				setUseContainerState(saved === 'true')
			}
		}
	}, [])

	const setUseContainer = (value: boolean) => {
		setUseContainerState(value)
		// Save to localStorage
		if (typeof window !== 'undefined') {
			localStorage.setItem('useContainer', value.toString())
		}
	}

	return (
		<ContainerContext.Provider value={{ useContainer, setUseContainer }}>
			{children}
		</ContainerContext.Provider>
	)
} 