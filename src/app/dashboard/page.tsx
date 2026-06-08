'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    Scan,
    History,
    TreeDeciduous,
    BookOpen,
    MessageSquare,
    Settings,
    Activity,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Loader2,
    ArrowRight,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

interface Diagnosis {
    id: string;
    disease_name: string;
    confidence: number;
    created_at: string;
    image_url: string;
}

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [stats, setStats] = useState({
        totalScans: 0,
        healthyPlants: 0,
        diseasesDetected: 0,
        mostCommon: 'N/A'
    });
    const [recentActivity, setRecentActivity] = useState<Diagnosis[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch profile for name
                try {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('id', user.id)
                        .single();

                    const fullName = profile?.full_name || user.user_metadata?.full_name || '';
                    setFirstName(fullName ? fullName.split(' ')[0] : '');
                } catch {
                    const fullName = user.user_metadata?.full_name || '';
                    setFirstName(fullName ? fullName.split(' ')[0] : '');
                }

                // Fetch diagnoses
                const { data: diagnoses, error } = await supabase
                    .from('diagnoses')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (diagnoses) {
                    const total = diagnoses.length;
                    const healthy = diagnoses.filter(d => d.disease_name.toLowerCase().includes('healthy')).length;
                    const diseased = total - healthy;

                    // Find most common disease
                    const diseaseCounts: Record<string, number> = {};
                    diagnoses.forEach(d => {
                        if (!d.disease_name.toLowerCase().includes('healthy')) {
                            diseaseCounts[d.disease_name] = (diseaseCounts[d.disease_name] || 0) + 1;
                        }
                    });
                    const mostCommon = Object.entries(diseaseCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

                    setStats({
                        totalScans: total,
                        healthyPlants: healthy,
                        diseasesDetected: diseased,
                        mostCommon: mostCommon
                    });
                    setRecentActivity(diagnoses.slice(0, 5));
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const statCards = [
        {
            title: t('dashboard.totalScans'),
            value: stats.totalScans.toString(),
            description: t('dashboard.lifetimeScans'),
            icon: Activity,
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            title: t('dashboard.healthyPlants'),
            value: stats.healthyPlants.toString(),
            description: `${stats.totalScans > 0 ? Math.round((stats.healthyPlants / stats.totalScans) * 100) : 0}% ${t('dashboard.ofTotalScans')}`,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-100"
        },
        {
            title: t('dashboard.diseasesDetected'),
            value: stats.diseasesDetected.toString(),
            description: t('dashboard.requiresAttention'),
            icon: AlertTriangle,
            color: "text-red-600",
            bg: "bg-red-100"
        },
        {
            title: t('dashboard.mostCommon'),
            value: stats.mostCommon,
            description: t('dashboard.topDetected'),
            icon: TrendingUp,
            color: "text-yellow-600",
            bg: "bg-yellow-100"
        }
    ];

    const quickActions = [
        { name: t('dashboard.scanPlant'), href: '/diagnose', icon: Scan, color: 'bg-green-600' },
        { name: t('dashboard.farmHistory'), href: '/history', icon: History, color: 'bg-blue-600' },
        { name: t('dashboard.myFarms'), href: '/farms', icon: TreeDeciduous, color: 'bg-yellow-600' },
        { name: t('dashboard.knowledgeHub'), href: '/learn', icon: BookOpen, color: 'bg-purple-600' },
        { name: t('dashboard.assistant'), href: '/assistant', icon: MessageSquare, color: 'bg-pink-600' },
        { name: t('dashboard.settings'), href: '/settings', icon: Settings, color: 'bg-gray-600' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {t('dashboard.welcome')}{firstName ? `, ${firstName}` : ''}! 👋
                    </h1>
                    <p className="text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
                </div>
                <Link href="/diagnose">
                    <Button className="bg-green-600 hover:bg-green-700 rounded-xl gap-2">
                        <Plus className="h-4 w-4" /> {t('dashboard.scanPlant')}
                    </Button>
                </Link>
            </div>

            {/* Analytics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bg}`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('dashboard.quickActions')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Link key={index} href={action.href}>
                                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-3 text-center h-full">
                                        <div className={`p-3 rounded-full ${action.color} text-white`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <span className="font-medium text-sm text-gray-700">{action.name}</span>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Activity Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.recentActivity')}</h2>
                    <Link href="/history" className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 cursor-pointer">
                        View all <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        {recentActivity.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {recentActivity.map((activity, i) => (
                                    <Link key={i} href={`/report/${activity.id}`} className="block">
                                        <div className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                                            <div className="h-12 w-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                {activity.image_url ? (
                                                    <img src={activity.image_url} alt="Scan" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                        <Scan className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {activity.disease_name}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {new Date(activity.created_at).toLocaleDateString()} • {new Date(activity.created_at).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.disease_name.toLowerCase().includes('healthy')
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {activity.disease_name.toLowerCase().includes('healthy') ? t('dashboard.healthy') : t('dashboard.actionNeeded')}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p>{t('dashboard.noActivity')}</p>
                                <Link href="/diagnose" className="text-green-600 hover:underline mt-2 inline-block">
                                    {t('dashboard.startFirstScan')}
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
