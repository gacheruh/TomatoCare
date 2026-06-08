'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Camera, Cpu, Leaf, ArrowRight, ArrowDown, Check, Sparkles, BarChart3, MessageSquare, FileText, Globe, History, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingV3A() {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        { icon: Camera, title: 'AI Diagnosis', desc: 'Upload any plant photo and get an instant disease identification powered by Google Gemini AI.', color: 'bg-green-500', colorLight: 'bg-green-100', textLight: 'text-green-600' },
        { icon: FileText, title: 'Detailed Reports', desc: 'Get comprehensive reports with symptoms, treatments (organic & chemical), and prevention tips.', color: 'bg-blue-500', colorLight: 'bg-blue-100', textLight: 'text-blue-600' },
        { icon: MessageSquare, title: 'AI Assistant', desc: 'Chat with our AI agronomist 24/7. Ask questions about pests, soil health, or farming techniques.', color: 'bg-purple-500', colorLight: 'bg-purple-100', textLight: 'text-purple-600' },
        { icon: Globe, title: 'Kiswahili Support', desc: 'Switch the entire app to Kiswahili instantly. Built for East African farmers from the ground up.', color: 'bg-orange-500', colorLight: 'bg-orange-100', textLight: 'text-orange-600' },
        { icon: History, title: 'Track History', desc: 'All your diagnoses saved and searchable. Filter by date, status, and disease type.', color: 'bg-teal-500', colorLight: 'bg-teal-100', textLight: 'text-teal-600' },
        { icon: BarChart3, title: 'Farm Dashboard', desc: 'See your total scans, healthy vs diseased stats, and most common diseases at a glance.', color: 'bg-pink-500', colorLight: 'bg-pink-100', textLight: 'text-pink-600' }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero — Light, minimal with soft gradient */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
                {/* Soft organic shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-50 rounded-full blur-3xl opacity-60 -translate-y-1/3 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4" />
                <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-lime-50 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2" />

                <div className="container px-4 md:px-6 mx-auto relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-10">
                        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-5 py-2 text-sm font-medium text-green-700">
                            <Sparkles className="h-4 w-4 text-green-500" />
                            AI-Powered Plant Health Platform
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight">
                            Stop Guessing.
                            <br />
                            <span className="text-green-600">Start Growing.</span>
                        </h1>

                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            TomatoCare combines Gemini AI with agricultural science to give every farmer access to
                            instant, expert-level plant disease diagnosis — completely free.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <Link href="/auth/register">
                                <Button size="lg" className="bg-green-600 hover:bg-green-700 font-bold text-lg h-14 px-10 rounded-2xl shadow-lg shadow-green-600/20 transition-all hover:scale-105">
                                    Get Started — It&apos;s Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/auth/login">
                                <Button variant="outline" size="lg" className="text-lg h-14 px-8 rounded-2xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50">
                                    I Have an Account
                                </Button>
                            </Link>
                        </div>

                        <div className="pt-8 animate-bounce">
                            <ArrowDown className="h-6 w-6 text-gray-300 mx-auto" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Process — Vertical timeline */}
            <section className="py-28 bg-gray-50 relative">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-20">
                        <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">The Process</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">From Photo to Treatment in Seconds</h2>
                    </div>

                    <div className="max-w-3xl mx-auto relative">
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-green-500 via-blue-500 to-yellow-500 transform md:-translate-x-px" />

                        {[
                            { step: '01', title: 'Upload a Photo', desc: 'Take a photo of the affected plant leaf with your phone camera, or upload an existing image. Our system accepts any common image format.', icon: Camera, color: 'green' },
                            { step: '02', title: 'AI Analysis', desc: 'Google Gemini AI analyzes the leaf pattern, discoloration, and markings to identify the specific disease or pest causing damage.', icon: Cpu, color: 'blue' },
                            { step: '03', title: 'Get Your Report', desc: 'Receive a complete diagnosis with disease name, confidence score, symptoms, recommended treatments, and prevention strategies.', icon: Leaf, color: 'yellow' },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            const isEven = i % 2 === 0;
                            return (
                                <div key={i} className={`relative flex items-start mb-16 last:mb-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-${item.color}-100 border-4 border-white shadow-lg flex items-center justify-center z-10`}>
                                        <Icon className={`h-7 w-7 text-${item.color}-600`} />
                                    </div>
                                    <div className={`ml-24 md:ml-0 ${isEven ? 'md:pr-[calc(50%+3rem)] md:text-right' : 'md:pl-[calc(50%+3rem)]'}`}>
                                        <span className={`inline-block text-sm font-mono font-bold text-${item.color}-600 mb-2`}>{item.step}</span>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Interactive Features */}
            <section className="py-28 bg-white">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Everything You Need</h2>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto items-start">
                        {/* Feature list */}
                        <div className="lg:col-span-2 space-y-2">
                            {features.map((feature, i) => {
                                const Icon = feature.icon;
                                const isActive = activeFeature === i;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setActiveFeature(i)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all cursor-pointer ${isActive ? 'bg-gray-50 shadow-md border border-green-200' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg ${isActive ? feature.color : feature.colorLight} flex items-center justify-center flex-shrink-0 transition-colors`}>
                                            <Icon className={`h-5 w-5 ${isActive ? 'text-white' : feature.textLight}`} />
                                        </div>
                                        <div>
                                            <p className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>{feature.title}</p>
                                            {isActive && <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Feature preview — hidden on mobile */}
                        <div className="hidden lg:block lg:col-span-3">
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className={`h-3 ${features[activeFeature].color}`} />
                                <div className="p-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className={`w-14 h-14 rounded-2xl ${features[activeFeature].color} flex items-center justify-center`}>
                                            {(() => { const Icon = features[activeFeature].icon; return <Icon className="h-7 w-7 text-white" />; })()}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{features[activeFeature].title}</h3>
                                            <p className="text-sm text-gray-500">Core Feature</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-lg leading-relaxed mb-8">{features[activeFeature].desc}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Fast & Reliable', 'Easy to Use', 'Free Forever', 'Works Offline'].map((benefit, j) => (
                                            <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                {benefit}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gray-50">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Trusted by Farmers</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { name: 'James Mwangi', location: 'Nakuru, Kenya', role: 'Tomato Farmer', quote: 'I caught early blight on my tomatoes before it spread to the whole greenhouse. TomatoCare literally saved my season.' },
                            { name: 'Grace Wanjiku', location: 'Kiambu, Kenya', role: 'Mixed Farmer', quote: 'The Kiswahili translation makes it so easy to use. My farmhand can now diagnose plants independently.' },
                            { name: 'Peter Otieno', location: 'Kisumu, Kenya', role: 'Smallholder Farmer', quote: 'Better than calling an agronomist. I get the same quality advice in seconds, and it is completely free.' }
                        ].map((t, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow relative">
                                <Quote className="h-8 w-8 text-green-200 mb-4" />
                                <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                                    &ldquo;{t.quote}&rdquo;
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{t.name}</p>
                                        <p className="text-sm text-gray-500">{t.role} • {t.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-28 bg-white">
                <div className="container px-4 md:px-6 mx-auto text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto">
                            <Leaf className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Your crops can&apos;t wait.
                            <br />
                            <span className="text-green-600">Neither should you.</span>
                        </h2>
                        <p className="text-xl text-gray-500 max-w-xl mx-auto">
                            Every day without a diagnosis is a day your crop health declines. Start protecting your harvest now.
                        </p>
                        <Link href="/auth/register">
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 font-bold text-lg h-14 px-10 rounded-2xl shadow-lg shadow-green-600/20">
                                Start Diagnosing Free <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12">
                <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 p-1.5 rounded-lg"><Leaf className="h-5 w-5 text-white" /></div>
                        <span className="text-lg font-bold text-gray-900">TomatoCare</span>
                    </div>
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} TomatoCare. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-sm text-gray-500 hover:text-green-600">Privacy Policy</Link>
                        <Link href="#" className="text-sm text-gray-500 hover:text-green-600">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
