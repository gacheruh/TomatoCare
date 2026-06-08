import Link from 'next/link';
import { Camera, Cpu, Leaf, ArrowRight, CheckCircle, Star, Users, Timer, Shield, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingV2() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero — Split layout with illustration side */}
            <section className="relative overflow-hidden">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[85vh] py-16">
                        {/* Left — Text content */}
                        <div className="space-y-8 max-w-xl">
                            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm font-medium text-green-700">
                                <Leaf className="h-4 w-4" />
                                🇰🇪 Made for Kenyan Farmers
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                Your Crops Deserve
                                <span className="relative inline-block ml-2">
                                    <span className="relative z-10 text-green-600">Expert Care</span>
                                    <span className="absolute bottom-1 left-0 w-full h-3 bg-green-200/60 rounded-sm -z-0" />
                                </span>
                            </h1>

                            <p className="text-lg text-gray-500 leading-relaxed">
                                TomatoCare brings AI-powered plant disease diagnosis to your fingertips.
                                Snap a photo, get an instant diagnosis, and save your harvest — all from your phone.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/auth/register">
                                    <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-lg h-13 px-8 rounded-xl shadow-lg shadow-green-600/20">
                                        Start Free <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/auth/login">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-13 px-8 rounded-xl border-2">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex items-center gap-6 pt-4">
                                <div className="flex -space-x-2">
                                    {['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-pink-500'].map((bg, i) => (
                                        <div key={i} className={`w-9 h-9 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="flex gap-0.5 text-yellow-500">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                                    </div>
                                    <p className="text-sm text-gray-500">Trusted by 1,000+ farmers</p>
                                </div>
                            </div>
                        </div>

                        {/* Right — Visual card mockup */}
                        <div className="relative hidden lg:block">
                            {/* Main card */}
                            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="w-full h-64 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Camera className="h-10 w-10 text-green-600" />
                                        </div>
                                        <p className="text-green-700 font-semibold">Upload Plant Photo</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4">
                                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">Early Blight Detected</p>
                                            <p className="text-xs text-gray-500">95% confidence</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-4">
                                        <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">Treatment Plan Ready</p>
                                            <p className="text-xs text-gray-500">3 recommendations available</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 transform -rotate-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Timer className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Under 3 seconds</p>
                                        <p className="text-xs text-gray-500">Average diagnosis time</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge 2 */}
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 transform rotate-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <Leaf className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">50+ Diseases</p>
                                        <p className="text-xs text-gray-500">Comprehensive coverage</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works — Card-based horizontal */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <p className="text-green-600 font-semibold text-sm uppercase tracking-widest">How it works</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Simple as 1-2-3</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 max-w-5xl mx-auto">
                        {[
                            { step: 1, icon: Camera, title: 'Snap a Photo', desc: 'Use your phone camera to photograph the affected plant leaf. Works with any smartphone.', color: 'green' },
                            { step: 2, icon: Cpu, title: 'AI Analyzes', desc: 'Our Gemini AI processes the image in seconds, identifying diseases with 98% accuracy.', color: 'blue' },
                            { step: 3, icon: Leaf, title: 'Get Treatment', desc: 'Receive a detailed diagnosis report with organic and chemical treatment recommendations.', color: 'yellow' }
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="relative text-center p-8 md:p-10 group">
                                    {/* Connector arrow */}
                                    {i < 2 && (
                                        <div className="hidden md:block absolute top-1/3 right-0 transform translate-x-1/2 z-10">
                                            <ArrowRight className="h-6 w-6 text-gray-300" />
                                        </div>
                                    )}
                                    <div className={`w-20 h-20 rounded-2xl bg-${item.color}-100 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`h-9 w-9 text-${item.color}-600`} />
                                    </div>
                                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-${item.color}-600 text-white text-sm font-bold mb-4`}>
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials — Large quote cards */}
            <section className="py-24 bg-white">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <p className="text-green-600 font-semibold text-sm uppercase tracking-widest">Testimonials</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Loved by Farmers</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { name: 'James Mwangi', location: 'Nakuru, Kenya', role: 'Tomato Farmer', quote: 'I caught early blight on my tomatoes before it spread to the whole greenhouse. TomatoCare literally saved my season.' },
                            { name: 'Grace Wanjiku', location: 'Kiambu, Kenya', role: 'Mixed Farmer', quote: 'The Kiswahili translation makes it so easy to use. My farmhand can now diagnose plants independently.' },
                            { name: 'Peter Otieno', location: 'Kisumu, Kenya', role: 'Smallholder Farmer', quote: 'Better than calling an agronomist. I get the same quality advice in seconds, and it is completely free.' }
                        ].map((t, i) => (
                            <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow relative">
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

            {/* CTA Band */}
            <section className="py-20 bg-green-600">
                <div className="container px-4 md:px-6 mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Protect your harvest today
                    </h2>
                    <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
                        Free to use. No credit card required. Start diagnosing in under 30 seconds.
                    </p>
                    <Link href="/auth/register">
                        <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-bold text-lg h-14 px-10 rounded-xl shadow-lg">
                            Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-12">
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
