import "./globals.css";
import localFont from 'next/font/local'

import { Providers } from "./providers";

import type { Metadata } from "next";
import Head from "next/head";

import Header from "@/components/Header";

const MoscowSans = localFont({
    src: [
        {
            path: '../public/fonts/MoscowSans/MoscowSans-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/fonts/MoscowSans/MoscowSans-Medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../public/fonts/MoscowSans/MoscowSans-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../public/fonts/MoscowSans/MoscowSans-Light.woff2',
            weight: '300',
            style: 'normal',
        },
    ],
})

export const metadata: Metadata = {
    title: "Центр мобильности",
    description: "Центр обеспечения мобильности пассажиров",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <Head>
				<meta name="robots" content="noindex, nofollow"/>
            </Head>
            <body className={MoscowSans.className}>
                <Providers>
                    <div className="relative flex flex-col h-screen">
                        <Header />
                        <main className="flex-grow">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
