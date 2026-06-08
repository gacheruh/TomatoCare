'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Camera, Cpu, Leaf, ArrowRight, ArrowDown, Check, Sparkles, BarChart3, MessageSquare, FileText, Globe, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingV3() {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        {
            icon: Camera,
            title: 'AI Diagnosis',
            desc: 'Upload any plant photo and get an instant disease identification powered by Google Gemini AI.',
            color: 'bg-green-500'
        },
        {
            icon: FileText,
            title: 'Detailed Reports',
            desc: 'Get comprehensive reports with symptoms, treatments (organic & chemical), and prevention tips.',
            color: 'bg-blue-500'
        },
        {
            icon: MessageSquare,
            title: 'AI Assistant',
            desc: 'Chat with our AI agronomist 24/7. Ask questions about pests, soil health, or farming techniques.',
            color: 'bg-purple-500'
        },
        {
            icon: Globe,
            title: 'Kiswahili Support',
            desc: 'Switch the entire app to Kiswahili instantly. Built for East African farmers from the ground up.',
            color: 'bg-orange-500'
        },
        {
            icon: History,
            title: 'Track History',
            desc: 'All your diagnoses saved and searchable. Filter by date, status, and disease type.',
            color: 'bg-teal-500'
        },
        {
            icon: BarChart3,
            title: 'Farm Dashboard',
            desc: 'See your total scans, healthy vs diseased stats, and most common diseases at a glance.',
            color: 'bg-pink-500'
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero — Gradient mesh with centered content */}
            <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
                {/* Mesh gradient overlay */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(34,197,94,0.3),transparent_50%)]" />
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.3),transparent_50%)]" />
                    <div className="absolute bottom-0 left-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(163,230,53,0.1),transparent_40%)]" />
                </div>

                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

                <div className="container px-4 md:px-6 mx-auto relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-10">
                        {/* Pill badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm text-white/90">
                            <Sparkles className="h-4 w-4 text-yellow-400" />
                            AI-Powered Plant Health Platform
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
                            Stop Guessing.
                            <br />
                            <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent">
                                Start Growing.
                            </span>
                        </h1>

                        <p className="text-xl text-green-100/80 max-w-2xl mx-auto leading-relaxed">
                            TomatoCare combines Gemini AI with agricultural science to give every farmer access to
                            instant, expert-level plant disease diagnosis — completely free.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <Link href="/auth/register">
                                <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 font-bold text-lg h-14 px-10 rounded-2xl shadow-2xl shadow-green-900/30 transition-all hover:scale-105">
                                    Get Started — It&apos;s Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/auth/login">
                                <Button variant="ghost" size="lg" className="text-lg h-14 px-8 rounded-2xl text-white/90 hover:bg-white/10 hover:text-white border border-white/20">
                                    I Have an Account
                                </Button>
                            </Link>
                        </div>

                        {/* Scroll indicator */}
                        <div className="pt-8 animate-bounce">
                            <ArrowDown className="h-6 w-6 text-white/40 mx-auto" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Process — Vertical timeline */}
            <section className="py-28 bg-white relative">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-20">
                        <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">The Process</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">From Photo to Treatment in Seconds</h2>
                    </div>

                    <div className="max-w-3xl mx-auto relative">
                        {/* Vertical line */}
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
                                    {/* Circle on timeline */}
                                    <div className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-${item.color}-100 border-4 border-white shadow-lg flex items-center justify-center z-10`}>
                                        <Icon className={`h-7 w-7 text-${item.color}-600`} />
                                    </div>

                                    {/* Content card */}
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
            <section className="py-28 bg-gray-50">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-3">Features</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Everything You Need</h2>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto items-start">
                        {/* Feature list — left side */}
                        <div className="lg:col-span-2 space-y-2">
                            {features.map((feature, i) => {
                                const Icon = feature.icon;
                                const isActive = activeFeature === i;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setActiveFeature(i)}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-white shadow-lg border border-green-200'
                                                : 'hover:bg-white/60'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg ${isActive ? feature.color : 'bg-gray-200'} flex items-center justify-center flex-shrink-0 transition-colors`}>
                                            <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                        </div>
                                        <div>
                                            <p className={`font-semibold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>{feature.title}</p>
                                            {isActive && (
                                                <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Feature preview — right side */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className={`h-3 ${features[activeFeature].color}`} />
                                <div className="p-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className={`w-14 h-14 rounded-2xl ${features[activeFeature].color} flex items-center justify-center`}>
                                            {(() => {
                                                const Icon = features[activeFeature].icon;
                                                return <Icon className="h-7 w-7 text-white" />;
                                            })()}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{features[activeFeature].title}</h3>
                                            <p className="text-sm text-gray-500">Core Feature</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                        {features[activeFeature].desc}
                                    </p>
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

            {/* Social Proof — Numbers bar */}
            <section className="py-16 bg-green-600">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '98%', label: 'Detection Accuracy' },
                            { value: '< 3s', label: 'Average Diagnosis Time' },
                            { value: '50+', label: 'Diseases Covered' },
                            { value: '24/7', label: 'AI Assistant Available' }
                        ].map((stat, i) => (
                            <div key={i}>
                                <p className="text-4xl md:text-5xl font-extrabold text-white">{stat.value}</p>
                                <p className="text-green-100 text-sm mt-2">{stat.label}</p>
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
                            Every day without a diagnosis is a day your crop health declines.
                            Start protecting your harvest now.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/auth/register">
                                <Button size="lg" className="bg-green-600 hover:bg-green-700 font-bold text-lg h-14 px-10 rounded-2xl shadow-lg shadow-green-600/20">
                                    Start Diagnosing Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 py-12">
                <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-600 p-1.5 rounded-lg">
                            <Leaf className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">TomatoCare</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} TomatoCare. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-sm text-gray-500 hover:text-green-600">Privacy Policy</Link>
                        <Link href="#" className="text-sm text-gray-500 hover:text-green-600">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
