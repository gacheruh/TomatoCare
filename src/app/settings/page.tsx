'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, Globe, Shield, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState({
        full_name: '',
        email: ''
    });
    const { t, lang, setLang } = useLanguage();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }
            setUser(user);

            const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileData) {
                setProfile({
                    full_name: profileData.full_name || '',
                    email: user.email || ''
                });
            } else {
                // Fallback if no profile yet
                setProfile({
                    full_name: user.user_metadata?.full_name || '',
                    email: user.email || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: profile.full_name,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            alert(t('settings.profileUpdated'));
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(t('settings.profileFailed'));
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('settings.title')}</h1>
                <p className="text-gray-500">{t('settings.subtitle')}</p>
            </div>

            <div className="space-y-6">
                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="h-5 w-5" />
                            {t('settings.profileInfo')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t('settings.fullName')}</Label>
                            <Input
                                id="name"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t('settings.email')}</Label>
                            <Input id="email" value={profile.email} disabled />
                        </div>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleSaveProfile}
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {t('settings.saveChanges')}
                        </Button>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Globe className="h-5 w-5" />
                            {t('settings.language')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>{t('settings.languageLabel')}</Label>
                            <select
                                value={lang}
                                onChange={(e) => setLang(e.target.value as 'en' | 'sw')}
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 cursor-pointer"
                            >
                                <option value="en">English</option>
                                <option value="sw">Kiswahili</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Bell className="h-5 w-5" />
                            {t('settings.notifications')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-notifs" className="cursor-pointer">{t('settings.emailNotifs')}</Label>
                            <input type="checkbox" id="email-notifs" className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="push-notifs" className="cursor-pointer">{t('settings.pushNotifs')}</Label>
                            <input type="checkbox" id="push-notifs" className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500" defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-red-600">
                            <Shield className="h-5 w-5" />
                            {t('settings.dangerZone')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">{t('nav.signOut')}</p>
                                <p className="text-sm text-gray-500">{t('settings.signOutDesc')}</p>
                            </div>
                            <Button
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                {t('nav.signOut')}
                            </Button>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">{t('settings.deleteAccount')}</p>
                                <p className="text-sm text-gray-500">{t('settings.deleteDesc')}</p>
                            </div>
                            <Button variant="destructive">{t('settings.deleteAccount')}</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
