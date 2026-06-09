'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [firstName, setFirstName] = useState<string>('');
    const pathname = usePathname();
    const isLandingPage = pathname === '/';
    const { t } = useLanguage();

    useEffect(() => {
        // Get initial session
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            if (user) fetchProfile(user.id, user);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id, session.user);
            } else {
                setFirstName('');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string, authUser: SupabaseUser) => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', userId)
                .single();

            const fullName = data?.full_name || authUser.user_metadata?.full_name || '';
            const name = fullName ? fullName.split(' ')[0] : '';
            setFirstName(name);
        } catch {
            // Fallback to user_metadata
            const fullName = authUser.user_metadata?.full_name || '';
            setFirstName(fullName ? fullName.split(' ')[0] : '');
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    return (
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0 left-0 h-16 flex items-center px-4 lg:px-6">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="TomatoCare Logo" className="h-9 w-9 object-contain" />
                        <span className="text-xl font-bold text-gray-900 tracking-tight">{t('brand.name')}</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <User className="h-4 w-4 text-green-700" />
                                </div>
                                <span className="font-medium truncate max-w-[150px]">
                                    {firstName || user.email}
                                </span>
                            </div>
                            {isLandingPage ? (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-3 sm:px-4 py-2 rounded-md transition-colors cursor-pointer"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t('nav.goToDashboard')}</span>
                                </Link>
                            ) : (
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md transition-colors cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">{t('nav.signOut')}</span>
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-green-600 hidden sm:block cursor-pointer">
                                {t('nav.login')}
                            </Link>
                            <Link href="/auth/register" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                                {t('nav.getStarted')}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
