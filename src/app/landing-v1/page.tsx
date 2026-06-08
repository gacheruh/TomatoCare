import Link from 'next/link';
import { Camera, Cpu, Leaf, ArrowRight, Shield, Zap, Globe, ChevronRight, Scan, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingV1() {
    return (
        <div className="flex flex-col min-h-screen bg-[#0a1a0f]">
            {/* Hero Section — Full-screen dark with gradient accents */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Animated grid background */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)`,
                            backgroundSize: '60px 60px'
                        }}
                    />
                </div>

                {/* Glowing orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-lime-300/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="container px-4 md:px-6 mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-sm text-green-400">
                            <Sparkles className="h-4 w-4" />
                            Powered by Gemini AI
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[0.9]">
                            Diagnose.
                            <br />
                            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
                                Protect.
                            </span>
                            <br />
                            Harvest.
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
                            TomatoCare uses cutting-edge AI to instantly identify plant diseases from a single photo.
                            Get expert treatment plans in seconds, not days.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/auth/register">
                                <Button size="lg" className="bg-green-500 hover:bg-green-400 text-black font-bold text-lg h-14 px-10 rounded-full transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/auth/login">
                                <Button variant="outline" size="lg" className="text-lg h-14 px-10 rounded-full border-gray-700 text-gray-300 hover:bg-white/5 hover:border-gray-500">
                                    Sign In
                                </Button>
                            </Link>
                        </div>

                        {/* Stats bar */}
                        <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-800 mt-8 w-full max-w-lg">
                            <div>
                                <p className="text-3xl font-bold text-white">98%</p>
                                <p className="text-sm text-gray-500">Accuracy</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">&lt;3s</p>
                                <p className="text-sm text-gray-500">Diagnosis</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">50+</p>
                                <p className="text-sm text-gray-500">Diseases</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section — Bento Grid */}
            <section className="py-24 bg-[#0d1f12] border-t border-gray-800/50">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why TomatoCare?</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to keep your crops healthy and your yields high.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Scan,
                                title: 'AI-Powered Diagnosis',
                                desc: 'Upload a photo and our Gemini AI model identifies diseases with over 98% accuracy in under 3 seconds.',
                                gradient: 'from-green-500/20 to-emerald-500/5',
                                iconBg: 'bg-green-500/20',
                                iconColor: 'text-green-400'
                            },
                            {
                                icon: Shield,
                                title: 'Treatment Plans',
                                desc: 'Receive actionable chemical and organic treatment recommendations tailored to each specific disease.',
                                gradient: 'from-blue-500/20 to-cyan-500/5',
                                iconBg: 'bg-blue-500/20',
                                iconColor: 'text-blue-400'
                            },
                            {
                                icon: Globe,
                                title: 'Bilingual Support',
                                desc: 'Full English and Kiswahili translations for all pages, making it accessible to farmers across East Africa.',
                                gradient: 'from-purple-500/20 to-pink-500/5',
                                iconBg: 'bg-purple-500/20',
                                iconColor: 'text-purple-400'
                            },
                            {
                                icon: Zap,
                                title: 'Instant Results',
                                desc: 'No waiting for lab results. Get a complete diagnosis report with prevention tips in seconds.',
                                gradient: 'from-yellow-500/20 to-orange-500/5',
                                iconBg: 'bg-yellow-500/20',
                                iconColor: 'text-yellow-400'
                            },
                            {
                                icon: Camera,
                                title: 'Easy to Use',
                                desc: 'Simply snap a photo or upload an image. No technical knowledge required — designed for farmers.',
                                gradient: 'from-red-500/20 to-rose-500/5',
                                iconBg: 'bg-red-500/20',
                                iconColor: 'text-red-400'
                            },
                            {
                                icon: Cpu,
                                title: 'Smart History',
                                desc: 'Track all your diagnoses over time. Filter by date, health status, and search by disease name.',
                                gradient: 'from-teal-500/20 to-cyan-500/5',
                                iconBg: 'bg-teal-500/20',
                                iconColor: 'text-teal-400'
                            }
                        ].map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div key={i} className={`bg-gradient-to-br ${feature.gradient} border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all hover:translate-y-[-2px] group`}>
                                    <div className={`${feature.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-5`}>
                                        <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works — Horizontal timeline */}
            <section className="py-24 bg-[#0a1a0f] border-t border-gray-800/50">
                <div className="container px-4 md:px-6 mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-20">Three Steps to Healthy Crops</h2>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500/50 via-emerald-500/50 to-lime-500/50" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { step: '01', title: 'Capture', desc: 'Take a photo of the affected leaf using your phone camera.', color: 'green' },
                                { step: '02', title: 'Analyze', desc: 'Our AI processes the image and identifies the disease instantly.', color: 'emerald' },
                                { step: '03', title: 'Treat', desc: 'Get a detailed report with organic and chemical treatment options.', color: 'lime' }
                            ].map((item, i) => (
                                <div key={i} className="relative flex flex-col items-center text-center">
                                    <div className={`w-32 h-32 rounded-full bg-${item.color}-500/10 border-2 border-${item.color}-500/30 flex items-center justify-center mb-6 relative z-10`}>
                                        <span className={`text-4xl font-black text-${item.color}-400`}>{item.step}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-b from-[#0d1f12] to-[#0a1a0f] border-t border-gray-800/50">
                <div className="container px-4 md:px-6 mx-auto text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            Ready to protect your crops?
                        </h2>
                        <p className="text-xl text-gray-400">
                            Join thousands of farmers using AI to diagnose and treat plant diseases before it&apos;s too late.
                        </p>
                        <Link href="/auth/register">
                            <Button size="lg" className="bg-green-500 hover:bg-green-400 text-black font-bold text-lg h-14 px-12 rounded-full transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                Start Free Today <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#060e08] border-t border-gray-800 py-10">
                <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-500 p-1.5 rounded-lg">
                            <Leaf className="h-5 w-5 text-black" />
                        </div>
                        <span className="text-lg font-bold text-white">TomatoCare</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} TomatoCare. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="#" className="text-sm text-gray-500 hover:text-green-400">Privacy Policy</Link>
                        <Link href="#" className="text-sm text-gray-500 hover:text-green-400">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
