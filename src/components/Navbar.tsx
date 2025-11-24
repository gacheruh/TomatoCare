'use client';

import Link from 'next/link';
import { Menu, X, Leaf } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming we will have this, or I can use standard button for now

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
    return (
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0 left-0 h-16 flex items-center px-4 lg:px-6">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-green-600 p-1.5 rounded-lg">
                            <Leaf className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">AgriDiagnose</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-green-600 hidden sm:block">
                        Log in
                    </Link>
                    <Link href="/auth/register" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
