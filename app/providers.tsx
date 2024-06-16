"use client";

import * as React from "react";
import { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react'


export interface ProvidersProps {
	children: React.ReactNode;
	session?: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {

	return (
		<SessionProvider session={session}>
				<ChakraProvider>
					{children}
				</ChakraProvider>
		</SessionProvider>
	);
}
