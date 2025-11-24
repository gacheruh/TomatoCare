'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Hide sidebar on landing page and auth pages if desired, or keep it.
    // For now, let's hide sidebar on landing page (/) and auth pages.
    const isPublicPage = pathname === '/' || pathname.startsWith('/auth');

    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen bg-gray-50">
                    <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                    {!isPublicPage && (
                        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
                    )}

                    <main className={`pt-16 transition-all duration-300 ${!isPublicPage ? 'lg:ml-64' : ''}`}>
                        <div className="container mx-auto p-4 md:p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
