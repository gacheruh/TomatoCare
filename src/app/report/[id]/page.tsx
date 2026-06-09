'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, Share2, FileText, Syringe, ClipboardCheck, Calendar, Download, Loader2, Scan, Save, X } from 'lucide-react';
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
    symptoms: string;
    treatment: string;
    prevention: string;
}

export default function ReportPage() {
    const params = useParams();
    const id = params.id as string;
    const [report, setReport] = useState<Diagnosis | null>(null);
    const [loading, setLoading] = useState(true);
    const [noteInput, setNoteInput] = useState('');
    const [savedNotes, setSavedNotes] = useState<{ text: string; timestamp: string }[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        if (id) {
            fetchReport();
            // Load stacked notes from localStorage
            const stored = localStorage.getItem(`diagnosis-notes-${id}`);
            if (stored) {
                try {
                    setSavedNotes(JSON.parse(stored));
                } catch {
                    // Migrate old single-string notes to new format
                    if (stored && !stored.startsWith('[')) {
                        setSavedNotes([{ text: stored, timestamp: new Date().toISOString() }]);
                    }
                }
            }
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

    const handleAddNote = () => {
        if (!noteInput.trim()) return;
        const newNote = { text: noteInput.trim(), timestamp: new Date().toISOString() };
        const updated = [newNote, ...savedNotes];
        setSavedNotes(updated);
        localStorage.setItem(`diagnosis-notes-${id}`, JSON.stringify(updated));
        setNoteInput('');
    };

    const handleDeleteNote = (index: number) => {
        const updated = savedNotes.filter((_, i) => i !== index);
        setSavedNotes(updated);
        localStorage.setItem(`diagnosis-notes-${id}`, JSON.stringify(updated));
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
                <h1 className="text-2xl font-bold text-gray-900">{t('report.notFound')}</h1>
                <p className="text-gray-500 mt-2">{t('report.notFoundDesc')}</p>
                <Link href="/history">
                    <Button className="mt-4 bg-green-600 hover:bg-green-700">{t('report.backToHistory')}</Button>
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
                        <h1 className="text-2xl font-bold text-gray-900">{t('report.title')}</h1>
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
                                title: `${t('report.title')}: ${report.disease_name}`,
                                text: `TomatoCare Report — ${report.disease_name} (${Math.round(report.confidence * 100)}% ${t('report.confidence')}). ${new Date(report.created_at).toLocaleDateString()}.`,
                                url: window.location.href,
                            };
                            try {
                                if (navigator.share) {
                                    await navigator.share(shareData);
                                } else {
                                    await navigator.clipboard.writeText(window.location.href);
                                    alert(t('report.linkCopied'));
                                }
                            } catch (err) {
                                if ((err as Error).name !== 'AbortError') {
                                    await navigator.clipboard.writeText(window.location.href);
                                    alert(t('report.linkCopied'));
                                }
                            }
                        }}
                    >
                        <Share2 className="h-4 w-4" />
                        {t('report.share')}
                    </Button>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                            window.print();
                        }}
                    >
                        <Download className="h-4 w-4" />
                        {t('report.pdf')}
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
                                    {Math.round(report.confidence * 100)}% {t('report.confidence')}
                                </p>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-blue-600 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">{t('report.symptoms')}</h3>
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
                                {t('report.treatment')}
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
                                {t('report.prevention')}
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
                            <CardTitle className="text-lg">{t('report.farmerNotes')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Saved notes stack */}
                            {savedNotes.length > 0 && (
                                <div className="space-y-3">
                                    {savedNotes.map((note, index) => (
                                        <div
                                            key={`${note.timestamp}-${index}`}
                                            className="bg-gray-50 rounded-lg p-3 border-0 shadow-sm group relative"
                                        >
                                            <button
                                                onClick={() => handleDeleteNote(index)}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity cursor-pointer"
                                                title="Delete note"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                            <p className="text-sm text-gray-800 whitespace-pre-wrap pr-6">{note.text}</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(note.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Note input */}
                            <div className={`space-y-2 ${savedNotes.length > 0 ? 'pt-4 border-t border-gray-100' : ''}`}>
                                <textarea
                                    value={noteInput}
                                    onChange={(e) => setNoteInput(e.target.value)}
                                    placeholder={t('report.notesPlaceholder')}
                                    className="w-full min-h-[100px] rounded-md border-0 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 resize-y shadow-sm transition-all focus-visible:bg-white"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                            handleAddNote();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleAddNote}
                                    className="w-full bg-green-600 hover:bg-green-700 gap-2"
                                    disabled={!noteInput.trim()}
                                >
                                    <Save className="h-4 w-4" />
                                    {t('report.saveNotes')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
