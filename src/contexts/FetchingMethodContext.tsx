"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { FetchingMethod } from '@/types/All'

interface FetchingMethodContextType {
	fetchingMethod: FetchingMethod
	setFetchingMethod: (value: FetchingMethod) => void
}

const FetchingMethodContext = createContext<FetchingMethodContextType | undefined>(undefined)

export const useFetchingMethodContext = () => {
	const context = useContext(FetchingMethodContext)
	if (context === undefined) {
		throw new Error('useFetchingMethodContext must be used within a FetchingMethodProvider')
	}
	return context
}

interface FetchingMethodProviderProps {
	children: ReactNode
}

export const FetchingMethodProvider: React.FC<FetchingMethodProviderProps> = ({ children }) => {
	const [fetchingMethod, setFetchingMethodState] = useState<FetchingMethod>("jikanOnly")

	// Initialize from localStorage on client side
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('fetchingMethod')
			if (saved === 'jikanOnly' || saved === 'cheerioParser') {
				setFetchingMethodState(saved as FetchingMethod)
			}
		}
	}, [])

	const setFetchingMethod = (value: FetchingMethod) => {
		setFetchingMethodState(value)
		// Save to localStorage
		if (typeof window !== 'undefined') {
			localStorage.setItem('fetchingMethod', value)
		}
	}

	return (
		<FetchingMethodContext.Provider value={{ fetchingMethod, setFetchingMethod }}>
			{children}
		</FetchingMethodContext.Provider>
	)
}
