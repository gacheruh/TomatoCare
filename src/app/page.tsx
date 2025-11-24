import Link from 'next/link';
import { Camera, Cpu, Leaf, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 to-white pt-20 pb-32 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-gray-900">
                Instant Plant Diagnosis <br />
                <span className="text-green-600">Powered by AI</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Protect your crops with AgriDiagnose. Upload a photo, get an instant diagnosis, and receive expert treatment recommendations in seconds.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-lg h-12 px-8">
                  Start Diagnosing <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-12 px-8">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">How It Works</h2>
            <p className="mt-4 text-gray-500 md:text-lg max-w-2xl mx-auto">
              Diagnosing plant diseases has never been easier. Just three simple steps to save your crops.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="p-4 bg-green-100 rounded-full text-green-600">
                <Camera className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">1. Capture</h3>
              <p className="text-gray-500">
                Take a clear photo of the affected plant leaf using your phone or upload an existing image.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                <Cpu className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">2. Analyze</h3>
              <p className="text-gray-500">
                Our advanced Gemini AI analyzes the image instantly to identify diseases and pests with high accuracy.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
              <div className="p-4 bg-yellow-100 rounded-full text-yellow-600">
                <Leaf className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">3. Treat</h3>
              <p className="text-gray-500">
                Get a detailed diagnosis report with recommended chemical and organic treatments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-16 text-gray-900">
            Trusted by Farmers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "John Doe",
                role: "Maize Farmer",
                quote: "AgriDiagnose saved my maize crop from fall armyworm. The early detection was a game changer."
              },
              {
                name: "Jane Smith",
                role: "Tomato Grower",
                quote: "I use this app every week. It's like having an agronomist in my pocket. Highly recommended!"
              },
              {
                name: "Michael Johnson",
                role: "Smallholder Farmer",
                quote: "Simple to use and very accurate. The treatment advice is practical and easy to follow."
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-yellow-500">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-5 w-5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-1.5 rounded-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AgriDiagnose</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AgriDiagnose. All rights reserved.
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
