'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { History, Search, Filter, Calendar, AlertTriangle, CheckCircle, Loader2, Scan, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/lib/LanguageContext';

interface Diagnosis {
    id: string;
    disease_name: string;
    confidence: number;
    created_at: string;
    image_url: string;
}

type FilterType = 'all' | 'healthy' | 'diseased';

export default function HistoryPage() {
    const [historyItems, setHistoryItems] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showDateMenu, setShowDateMenu] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const { t } = useLanguage();

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

    const filteredItems = useMemo(() => {
        return historyItems.filter(item => {
            // Search filter
            const matchesSearch = item.disease_name.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const isHealthy = item.disease_name.toLowerCase().includes('healthy');
            const matchesFilter =
                filterType === 'all' ||
                (filterType === 'healthy' && isHealthy) ||
                (filterType === 'diseased' && !isHealthy);

            // Date range filter
            const itemDate = new Date(item.created_at);
            const matchesDateFrom = !dateFrom || itemDate >= new Date(dateFrom);
            const matchesDateTo = !dateTo || itemDate <= new Date(dateTo + 'T23:59:59');

            return matchesSearch && matchesFilter && matchesDateFrom && matchesDateTo;
        });
    }, [historyItems, searchTerm, filterType, dateFrom, dateTo]);

    const clearFilters = () => {
        setFilterType('all');
        setDateFrom('');
        setDateTo('');
        setSearchTerm('');
    };

    const hasActiveFilters = filterType !== 'all' || dateFrom || dateTo || searchTerm;

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
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t('history.title')}</h1>
                <p className="text-gray-500">{t('history.subtitle')}</p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder={t('history.searchPlaceholder')}
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter dropdown */}
                <div className="relative">
                    <Button
                        variant="outline"
                        className={`gap-2 cursor-pointer ${filterType !== 'all' ? 'border-green-500 text-green-700 bg-green-50' : ''}`}
                        onClick={() => { setShowFilterMenu(!showFilterMenu); setShowDateMenu(false); }}
                    >
                        <Filter className="h-4 w-4" />
                        {filterType === 'all' ? t('history.filter') : filterType === 'healthy' ? t('history.healthyOnly') : t('history.diseasedOnly')}
                    </Button>
                    {showFilterMenu && (
                        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 py-1">
                            {[
                                { value: 'all' as FilterType, label: t('history.allResults') },
                                { value: 'healthy' as FilterType, label: t('history.healthyOnly') },
                                { value: 'diseased' as FilterType, label: t('history.diseasedOnly') },
                            ].map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => { setFilterType(option.value); setShowFilterMenu(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${filterType === option.value ? 'text-green-700 bg-green-50 font-medium' : 'text-gray-700'}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Date Range dropdown */}
                <div className="relative">
                    <Button
                        variant="outline"
                        className={`gap-2 cursor-pointer ${dateFrom || dateTo ? 'border-green-500 text-green-700 bg-green-50' : ''}`}
                        onClick={() => { setShowDateMenu(!showDateMenu); setShowFilterMenu(false); }}
                    >
                        <Calendar className="h-4 w-4" />
                        {dateFrom || dateTo ? t('history.dateSet') : t('history.dateRange')}
                    </Button>
                    {showDateMenu && (
                        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-72 p-4 space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">{t('history.from')}</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">{t('history.to')}</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 cursor-pointer"
                                    onClick={() => { setDateFrom(''); setDateTo(''); }}
                                >
                                    {t('history.clear')}
                                </Button>
                                <Button
                                    size="sm"
                                    className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                                    onClick={() => setShowDateMenu(false)}
                                >
                                    {t('history.apply')}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Active filters indicator */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-500">{t('history.activeFilters')}</span>
                    {searchTerm && (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">
                            Search: &quot;{searchTerm}&quot;
                            <button onClick={() => setSearchTerm('')} className="hover:text-red-500 cursor-pointer"><X className="h-3 w-3" /></button>
                        </span>
                    )}
                    {filterType !== 'all' && (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium">
                            {filterType === 'healthy' ? 'Healthy' : 'Diseased'}
                            <button onClick={() => setFilterType('all')} className="hover:text-red-500 cursor-pointer"><X className="h-3 w-3" /></button>
                        </span>
                    )}
                    {(dateFrom || dateTo) && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                            {dateFrom || '...'} → {dateTo || '...'}
                            <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="hover:text-red-500 cursor-pointer"><X className="h-3 w-3" /></button>
                        </span>
                    )}
                    <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 underline cursor-pointer">
                        {t('history.clearAll')}
                    </button>
                </div>
            )}

            {/* Results count */}
            <p className="text-sm text-gray-500">
                {t('history.showing')} {filteredItems.length} {t('history.of')} {historyItems.length} {t('history.results')}
            </p>

            {/* History Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                        const isHealthy = item.disease_name.toLowerCase().includes('healthy');
                        const status = isHealthy ? 'Healthy' : 'Action Needed';

                        return (
                            <Link key={item.id} href={`/report/${item.id}`}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                    {/* Card Image */}
                                    <div className="h-40 w-full bg-gray-100 overflow-hidden rounded-t-lg flex items-center justify-center">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.disease_name} className="h-full w-full object-cover" />
                                        ) : (
                                            <Scan className="h-10 w-10 text-gray-400" />
                                        )}
                                    </div>
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold text-gray-900 truncate">{item.disease_name}</h3>
                                            <span className={`inline-flex items-center flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${isHealthy
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {isHealthy ? (
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                ) : (
                                                    <AlertTriangle className="mr-1 h-3 w-3" />
                                                )}
                                                {status === 'Healthy' ? t('history.healthy') : t('history.actionNeeded')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{t('history.confidence')}: {Math.round(item.confidence * 100)}%</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">{t('history.noHistory')}</h3>
                        <p className="text-gray-500 mt-2">
                            {hasActiveFilters ? t('history.adjustFilters') : t('history.historyAppears')}
                        </p>
                        {hasActiveFilters ? (
                            <button onClick={clearFilters} className="mt-4 text-green-600 hover:text-green-700 underline text-sm cursor-pointer">
                                {t('history.clearAllFilters')}
                            </button>
                        ) : (
                            <Link href="/diagnose" className="mt-4 inline-block">
                                <Button className="bg-green-600 hover:bg-green-700 cursor-pointer">
                                    {t('history.startNewScan')}
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
