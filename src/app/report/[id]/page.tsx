'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, Share2, FileText, Syringe, ClipboardCheck, Calendar, Download, Loader2, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface Diagnosis {
    id: string;
    disease_name: string;
    confidence: number;
    created_at: string;
    image_url: string;
    symptoms: string;
    treatment: string;
    prevention: string;
}

export default function ReportPage() {
    const params = useParams();
    const id = params.id as string;
    const [report, setReport] = useState<Diagnosis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchReport();
        }
    }, [id]);

    const fetchReport = async () => {
        try {
            const { data, error } = await supabase
                .from('diagnoses')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setReport(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Report Not Found</h1>
                <p className="text-gray-500 mt-2">The diagnosis report you are looking for does not exist.</p>
                <Link href="/history">
                    <Button className="mt-4 bg-green-600 hover:bg-green-700">Back to History</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/history">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Diagnosis Report</h1>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(report.created_at).toLocaleDateString()} • ID: #{report.id.slice(0, 8)}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={async () => {
                            const shareData = {
                                title: `Diagnosis Report: ${report.disease_name}`,
                                text: `AgriDiagnose Report — ${report.disease_name} (${Math.round(report.confidence * 100)}% confidence). Diagnosed on ${new Date(report.created_at).toLocaleDateString()}.`,
                                url: window.location.href,
                            };
                            try {
                                if (navigator.share) {
                                    await navigator.share(shareData);
                                } else {
                                    await navigator.clipboard.writeText(window.location.href);
                                    alert('Report link copied to clipboard!');
                                }
                            } catch (err) {
                                // User cancelled share or error
                                if ((err as Error).name !== 'AbortError') {
                                    await navigator.clipboard.writeText(window.location.href);
                                    alert('Report link copied to clipboard!');
                                }
                            }
                        }}
                    >
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                            window.print();
                        }}
                    >
                        <Download className="h-4 w-4" />
                        PDF
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Image & Summary */}
                    <Card>
                        <div className="aspect-video w-full bg-gray-100 relative overflow-hidden rounded-t-lg flex items-center justify-center">
                            {report.image_url ? (
                                <img src={report.image_url} alt={report.disease_name} className="object-cover w-full h-full" />
                            ) : (
                                <Scan className="h-16 w-16 text-gray-400" />
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <h2 className="text-white text-2xl font-bold">{report.disease_name}</h2>
                                <p className="text-white/90">
                                    {Math.round(report.confidence * 100)}% Confidence
                                </p>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-blue-600 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Symptoms Observed</h3>
                                    <p className="text-gray-600 mt-1">{report.symptoms}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Treatment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Syringe className="h-5 w-5 text-green-600" />
                                Recommended Treatment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">{report.treatment}</p>
                        </CardContent>
                    </Card>

                    {/* Prevention */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardCheck className="h-5 w-5 text-yellow-600" />
                                Prevention & Future Care
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed">{report.prevention}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Farmer Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 italic">No notes added yet.</p>
                            <Button variant="link" className="px-0 mt-2 text-green-600">Add Notes</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
