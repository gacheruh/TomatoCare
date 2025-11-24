'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Bell, Globe, Shield, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState({
        full_name: '',
        email: ''
    });

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
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
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
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                <p className="text-gray-500">Manage your account preferences and app settings.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="h-5 w-5" />
                            Profile Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" value={profile.email} disabled />
                        </div>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleSaveProfile}
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Globe className="h-5 w-5" />
                            Language & Region
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Language</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                <option>English</option>
                                <option>Swahili</option>
                                <option>Sheng</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="email-notifs" className="cursor-pointer">Email Notifications</Label>
                            <input type="checkbox" id="email-notifs" className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="push-notifs" className="cursor-pointer">Push Notifications</Label>
                            <input type="checkbox" id="push-notifs" className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500" defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-red-600">
                            <Shield className="h-5 w-5" />
                            Danger Zone
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Sign Out</p>
                                <p className="text-sm text-gray-500">Log out of your account on this device.</p>
                            </div>
                            <Button
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">Delete Account</p>
                                <p className="text-sm text-gray-500">Permanently remove your data.</p>
                            </div>
                            <Button variant="destructive">Delete Account</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
