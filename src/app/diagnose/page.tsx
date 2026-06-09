'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { UploadCloud, Camera, Loader2, AlertCircle, CheckCircle, X, Scan, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

export default function DiagnosePage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [lang, setLang] = useState<'en' | 'sw'>('en');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pre-warm HuggingFace CNN space on page mount so it's awake by the time
    // the user submits an image (mitigates cold-start latency).
    useEffect(() => {
        fetch('/api/diagnose', { method: 'GET' }).catch(() => {});
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setResult(null); // Reset previous result
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleDiagnose = async () => {
        if (!selectedImage || !file) return;

        setIsAnalyzing(true);
        try {
            // 1. Analyze with AI diagnosis pipeline
            const response = await fetch('/api/diagnose', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: selectedImage }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setResult(data);

            // 2. Only save to Supabase if it's a real diagnosis (not a rejection)
            if (!data.isRejection) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

                    const { error: uploadError } = await supabase.storage
                        .from('scans')
                        .upload(fileName, file);

                    if (uploadError) {
                        console.error('Error uploading image:', uploadError);
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('scans')
                        .getPublicUrl(fileName);

                    // 3. Save Diagnosis to Database
                    const { error: dbError } = await supabase
                        .from('diagnoses')
                        .insert([{
                            user_id: user.id,
                            image_url: publicUrl,
                            disease_name: data.diseaseName,
                            confidence: parseFloat(data.confidence) / 100,
                            symptoms: data.symptoms,
                            treatment: data.treatment,
                            prevention: data.prevention
                        }]);

                    if (dbError) {
                        console.error('Error saving diagnosis:', dbError);
                    }
                }
            }

        } catch (error) {
            console.error('Diagnosis failed:', error);
            alert('Failed to analyze image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setFile(null);
        setResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Plant Diagnosis</h1>
                <p className="text-gray-500">Upload a photo of your affected plant to get an instant AI diagnosis.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Upload Image</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!selectedImage ? (
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const droppedFile = e.dataTransfer.files?.[0];
                                    if (droppedFile && droppedFile.type.startsWith('image/')) {
                                        setFile(droppedFile);
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setSelectedImage(reader.result as string);
                                            setResult(null);
                                        };
                                        reader.readAsDataURL(droppedFile);
                                    }
                                }}
                            >
                                <div className="bg-green-100 p-4 rounded-full mb-4">
                                    <UploadCloud className="h-8 w-8 text-green-600" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 10MB)</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <Button variant="outline" className="mt-4" onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}>
                                    Select File
                                </Button>
                            </div>
                        ) : (
                            <div className="relative rounded-lg overflow-hidden border border-gray-200">
                                <img src={selectedImage} alt="Preview" className="w-full h-auto object-cover max-h-[400px]" />
                                <button
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            size="lg"
                            disabled={!selectedImage || isAnalyzing}
                            onClick={handleDiagnose}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing Plant...
                                </>
                            ) : (
                                <>
                                    <Scan className="mr-2 h-4 w-4" />
                                    Diagnose Disease
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <div className="space-y-6">
                    {result ? (
                        result.isRejection ? (
                            /* ── Not a tomato leaf: amber warning card ── */
                            <Card className="border-amber-300 bg-amber-50/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-amber-800">
                                        <AlertCircle className="h-6 w-6" />
                                        {lang === 'en' ? 'Image Not Recognized' : 'Picha Haijatambuliwa'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-amber-900">
                                        {lang === 'sw' && result.symptoms_sw ? result.symptoms_sw : result.symptoms}
                                    </p>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {lang === 'en' ? 'Tips for Best Results' : 'Vidokezo vya Matokeo Bora'}
                                        </h3>
                                        <p className="text-sm text-gray-700">
                                            {lang === 'sw' && result.prevention_sw ? result.prevention_sw : result.prevention}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            /* ── Valid diagnosis: green success card ── */
                            <>
                                {/* Language toggle */}
                                <div className="flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <Globe className="h-4 w-4" />
                                        {lang === 'en' ? 'Swahili' : 'English'}
                                    </Button>
                                </div>
                                <Card className="border-green-200 bg-green-50/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-green-800">
                                            <CheckCircle className="h-6 w-6" />
                                            {lang === 'en' ? 'Diagnosis Complete' : 'Uchunguzi Umekamilika'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {lang === 'en' ? 'Disease Detected' : 'Ugonjwa Uliogunduliwa'}
                                            </h3>
                                            <p className="text-lg text-green-700 font-bold">{result.diseaseName}</p>
                                            <p className="text-sm text-gray-500">
                                                {lang === 'en' ? 'Confidence' : 'Uhakika'}: {result.confidence}%
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {lang === 'en' ? 'Symptoms' : 'Dalili'}
                                            </h3>
                                            <p className="text-sm text-gray-700">
                                                {lang === 'sw' && result.symptoms_sw ? result.symptoms_sw : result.symptoms}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {lang === 'en' ? 'Recommended Treatment' : 'Matibabu Yanayopendekezwa'}
                                            </h3>
                                            <p className="text-sm text-gray-700">
                                                {lang === 'sw' && result.treatment_sw ? result.treatment_sw : result.treatment}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {lang === 'en' ? 'Prevention' : 'Kinga'}
                                            </h3>
                                            <p className="text-sm text-gray-700">
                                                {lang === 'sw' && result.prevention_sw ? result.prevention_sw : result.prevention}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )
                    ) : (
                        <Card className="h-full flex items-center justify-center min-h-[300px] bg-gray-50 border-dashed">
                            <div className="text-center p-6">
                                <div className="bg-gray-100 p-4 rounded-full inline-flex mb-4">
                                    <Scan className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No Diagnosis Yet</h3>
                                <p className="text-gray-500 max-w-xs mx-auto mt-2">
                                    Upload an image and click "Diagnose" to see the AI analysis results here.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
