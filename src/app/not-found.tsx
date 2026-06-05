import Link from 'next/link';
import { Leaf, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            </div>

            {/* Icon */}
            <div className="relative mb-8">
                <div className="bg-green-100 p-6 rounded-full">
                    <Leaf className="h-16 w-16 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    404
                </div>
            </div>

            {/* Text */}
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                Page Not Found
            </h1>
            <p className="text-lg text-gray-500 max-w-md mb-8">
                Oops! It looks like this page has wilted away. The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                    <Button className="bg-green-600 hover:bg-green-700 gap-2 cursor-pointer px-6 py-3 text-base">
                        <Home className="h-5 w-5" />
                        Go to Dashboard
                    </Button>
                </Link>
                <Link href="/">
                    <Button variant="outline" className="gap-2 cursor-pointer px-6 py-3 text-base">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
