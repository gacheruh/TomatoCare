'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { History, Search, Filter, Calendar, AlertTriangle, CheckCircle, Loader2, Scan } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Diagnosis {
    id: string;
    disease_name: string;
    confidence: number;
    created_at: string;
    image_url: string;
}

export default function HistoryPage() {
    const [historyItems, setHistoryItems] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data, error } = await supabase
                .from('diagnoses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setHistoryItems(data || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = historyItems.filter(item =>
        item.disease_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Diagnosis History</h1>
                <p className="text-gray-500">View and manage your past plant diagnosis reports.</p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search by disease..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
                <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Date Range
                </Button>
            </div>

            {/* History List */}
            <div className="grid gap-4">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                        const isHealthy = item.disease_name.toLowerCase().includes('healthy');
                        const status = isHealthy ? 'Healthy' : 'Action Needed';

                        return (
                            <Link key={item.id} href={`/report/${item.id}`}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <div className="h-24 w-24 sm:h-20 sm:w-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.disease_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <Scan className="h-8 w-8 text-gray-400" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-lg text-gray-900">{item.disease_name}</h3>
                                                <span className="text-sm text-gray-500 hidden sm:block">
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">Confidence: {Math.round(item.confidence * 100)}%</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isHealthy
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {isHealthy ? (
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                    ) : (
                                                        <AlertTriangle className="mr-1 h-3 w-3" />
                                                    )}
                                                    {status}
                                                </span>
                                                <span className="text-xs text-gray-400 sm:hidden">
                                                    • {new Date(item.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No history found</h3>
                        <p className="text-gray-500 mt-2">
                            {searchTerm ? 'Try adjusting your search terms.' : 'Your diagnosis history will appear here.'}
                        </p>
                        {!searchTerm && (
                            <Link href="/diagnose" className="mt-4 inline-block">
                                <Button className="bg-green-600 hover:bg-green-700">
                                    Start New Scan
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
